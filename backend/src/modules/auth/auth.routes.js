const express = require("express");
const rateLimit = require("express-rate-limit");
const controller = require("./auth.controller");
const { requireAuth } = require("../../middleware/auth");

const router = express.Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 25,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: { code: "AUTH_RATE_LIMITED", message: "Too many authentication attempts" } },
});

router.post("/register", authLimiter, controller.register);
router.post("/login", authLimiter, controller.login);
router.post("/refresh", authLimiter, controller.refresh);
router.post("/logout", controller.logout);
router.post("/logout-all", requireAuth, controller.logoutAll);
router.get("/me", requireAuth, controller.me);

module.exports = router;
