const express = require("express");
const rateLimit = require("express-rate-limit");
const controller = require("./note.controller");
const { requireClerkAuth } = require("../../middleware/auth");

const router = express.Router();
const notesLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 120,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

router.use(notesLimiter, requireClerkAuth);
router.get("/", controller.list);
router.post("/", controller.create);
router.delete("/:noteId", controller.remove);

module.exports = router;
