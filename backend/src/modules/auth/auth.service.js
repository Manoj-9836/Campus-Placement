const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const GoogleUser = require("../../models/GoogleUser");
const RefreshToken = require("../../models/RefreshToken");
const env = require("../../config/env");
const {
  hashToken,
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
  getTokenExpiryDate,
} = require("../../utils/tokens");

const PASSWORD_ROUNDS = 12;

function authResponse(user, accessToken, refreshToken) {
  return {
    user: user.toPublicJSON(),
    tokens: {
      accessToken,
      refreshToken,
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    },
  };
}

async function issueTokens(user) {
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  await RefreshToken.create({
    tokenHash: hashToken(refreshToken),
    userId: user._id,
    expiresAt: getTokenExpiryDate(refreshToken),
  });

  return authResponse(user, accessToken, refreshToken);
}

async function register(input) {
  const existingUser = await User.findOne({ email: input.email }).select("_id");
  if (existingUser) {
    const error = new Error("An account with this email already exists");
    error.statusCode = 409;
    error.code = "EMAIL_ALREADY_REGISTERED";
    throw error;
  }

  const passwordHash = await bcrypt.hash(input.password, PASSWORD_ROUNDS);
  const user = await User.create({ ...input, passwordHash });
  return issueTokens(user);
}

async function login(input) {
  const user = await User.findOne({ email: input.email }).select("+passwordHash");
  const passwordMatches =
    user && user.isActive && user.passwordHash
      ? await bcrypt.compare(input.password, user.passwordHash)
      : false;

  if (!passwordMatches) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  user.lastLoginAt = new Date();
  await user.save();
  return issueTokens(user);
}

async function syncClerkUser({ clerkId, email, name, imageUrl, provider }) {
  const UserModel = provider === "google" ? GoogleUser : User;

  const user = await UserModel.findOneAndUpdate(
    { $or: [{ clerkId }, { email }] },
    {
      $set: {
        clerkId,
        email,
        name: name || "Student",
        ...(imageUrl ? { imageUrl } : {}),
        lastLoginAt: new Date(),
      },
      $setOnInsert: {
        institution: "Not provided",
        role: "student",
        visibility: "public",
        isActive: true,
      },
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
  );

  if (!user) {
    throw new Error("Failed to save user to database");
  }

  return issueTokens(user);
}

async function refresh(refreshToken) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    const error = new Error("Invalid or expired refresh token");
    error.statusCode = 401;
    error.code = "INVALID_REFRESH_TOKEN";
    throw error;
  }

  if (payload.type !== "refresh" || typeof payload.sub !== "string") {
    const error = new Error("Invalid refresh token");
    error.statusCode = 401;
    error.code = "INVALID_REFRESH_TOKEN";
    throw error;
  }

  const storedToken = await RefreshToken.findOne({ tokenHash: hashToken(refreshToken), revokedAt: null });
  if (!storedToken || storedToken.expiresAt <= new Date()) {
    const error = new Error("Refresh token has been revoked or expired");
    error.statusCode = 401;
    error.code = "REFRESH_TOKEN_REVOKED";
    throw error;
  }

  // Try to find user in both collections (Google users and regular users)
  let user = await User.findOne({ _id: payload.sub, isActive: true });
  if (!user) {
    user = await GoogleUser.findOne({ _id: payload.sub, isActive: true });
  }

  if (!user) {
    const error = new Error("User is not available");
    error.statusCode = 401;
    error.code = "UNAUTHORIZED";
    throw error;
  }

  storedToken.revokedAt = new Date();
  await storedToken.save();
  return issueTokens(user);
}

async function logout(refreshToken) {
  await RefreshToken.updateOne({ tokenHash: hashToken(refreshToken), revokedAt: null }, { $set: { revokedAt: new Date() } });
}

async function logoutAll(userId) {
  await RefreshToken.updateMany({ userId, revokedAt: null }, { $set: { revokedAt: new Date() } });
}

module.exports = { register, login, refresh, logout, logoutAll, syncClerkUser };
