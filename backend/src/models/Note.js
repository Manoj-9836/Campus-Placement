const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    ownerClerkId: { type: String, required: true, index: true },
    ownerEmail: { type: String, required: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    body: { type: String, required: true, trim: true, maxlength: 20000 },
    kind: { type: String, enum: ["question", "general"], required: true, index: true },
    question: { type: String, trim: true, maxlength: 300 },
  },
  { collection: "notes", timestamps: true, versionKey: false },
);

noteSchema.index({ ownerClerkId: 1, updatedAt: -1 });

module.exports = mongoose.model("Note", noteSchema);
