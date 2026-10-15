const mongoose = require("mongoose");
const { userFields, toPublicJSON } = require("./user-fields");

const googleUserSchema = new mongoose.Schema(userFields, {
  collection: "google_users",
  timestamps: true,
  versionKey: false,
});

googleUserSchema.methods.toPublicJSON = toPublicJSON;

module.exports = mongoose.model("GoogleUser", googleUserSchema);
