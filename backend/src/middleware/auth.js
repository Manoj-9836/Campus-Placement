const User = require("../models/User");
const { verifyAccessToken } = require("../utils/tokens");

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

    const user = await User.findOne({ _id: payload.sub, isActive: true });
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
