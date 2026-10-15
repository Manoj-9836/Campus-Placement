const userFields = {
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, select: false },
  clerkId: { type: String, unique: true, sparse: true, index: true },
  imageUrl: { type: String, trim: true },
  institution: { type: String, required: true, trim: true, maxlength: 200, default: "Not provided" },
  graduationYear: { type: Number, min: 2000, max: 2100 },
  role: { type: String, enum: ["student", "admin", "placement_team"], default: "student", index: true },
  visibility: { type: String, enum: ["public", "private"], default: "public" },
  isActive: { type: Boolean, default: true, index: true },
  lastLoginAt: { type: Date },
};

function toPublicJSON() {
  return {
    id: this.id,
    name: this.name,
    email: this.email,
    institution: this.institution,
    graduationYear: this.graduationYear,
    role: this.role,
    visibility: this.visibility,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
}

module.exports = { userFields, toPublicJSON };
