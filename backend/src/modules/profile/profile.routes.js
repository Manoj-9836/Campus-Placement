const express = require("express");
const controller = require("./profile.controller");
const { requireClerkAuth } = require("../../middleware/auth");

const router = express.Router();

router.get("/", requireClerkAuth, controller.getProfile);
router.post("/", requireClerkAuth, controller.saveProfile);
router.delete("/avatar", requireClerkAuth, controller.deleteAvatar);

module.exports = router;
