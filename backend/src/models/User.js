const mongoose = require("mongoose");
const { userFields, toPublicJSON } = require("./user-fields");

const userSchema = new mongoose.Schema(userFields, { timestamps: true, versionKey: false });
userSchema.methods.toPublicJSON = toPublicJSON;

module.exports = mongoose.model("User", userSchema);
