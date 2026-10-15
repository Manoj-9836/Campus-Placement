const User = require("../models/User");
const GoogleUser = require("../models/GoogleUser");
const { verifyAccessToken } = require("../utils/tokens");
const { verifyToken, createClerkClient } = require("@clerk/backend");
const env = require("../config/env");

async function requireAuth(req, res, next) {
  try {
    const header = req.get("authorization");
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Bearer token is required" } });
    }

    const token = header.slice("Bearer ".length).trim();
    const payload = verifyAccessToken(token);
    if (payload.type !== "access" || typeof payload.sub !== "string") {
      return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Invalid access token" } });
    }

    // Try to find user in both collections (Google users and regular users)
    let user = await User.findOne({ _id: payload.sub, isActive: true });
    if (!user) {
      user = await GoogleUser.findOne({ _id: payload.sub, isActive: true });
    }

    if (!user) {
      return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "User is not available" } });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Invalid or expired access token" } });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: { code: "FORBIDDEN", message: "Insufficient permissions" } });
    }
    return next();
  };
}

module.exports = { requireAuth, requireRole };

async function requireClerkAuth(req, res, next) {
  try {
    if (!env.CLERK_SECRET_KEY) {
      return res.status(503).json({ error: { code: "CLERK_NOT_CONFIGURED", message: "Clerk backend verification is not configured" } });
    }

    const header = req.get("authorization");
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Bearer token is required" } });
    }

    const token = header.slice("Bearer ".length).trim();
    const payload = await verifyToken(token, { secretKey: env.CLERK_SECRET_KEY });
    const clerkClient = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });
    const user = await clerkClient.users.getUser(payload.sub);
    const email = user.emailAddresses.find((address) => address.id === user.primaryEmailAddressId)?.emailAddress;

    if (!email) {
      return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Clerk account has no email address" } });
    }

    const externalAccounts = user.externalAccounts ?? [];
    const isGoogleUser =
      externalAccounts.some((account) =>
        `${account.provider} ${account.verification?.strategy ?? ""}`.toLowerCase().includes("google"),
      );

    req.clerkUser = {
      clerkId: user.id,
      email: email.toLowerCase(),
      name: user.fullName,
      imageUrl: user.imageUrl,
      provider: isGoogleUser ? "google" : "clerk",
    };

    console.info(`User authenticated via ${req.clerkUser.provider}`);
    return next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Invalid Clerk session" } });
  }
}

module.exports.requireClerkAuth = requireClerkAuth;
