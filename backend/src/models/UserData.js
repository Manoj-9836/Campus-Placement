const mongoose = require("mongoose");

const userDataSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    fullName: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    rollNumber: {
      type: String,
      trim: true,
      minlength: 3,
    },
    avatar: {
      type: String, // Base64 encoded image
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    institution: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    degree: {
      type: String,
      trim: true,
      enum: ["B.Tech", "B.E.", "M.Tech", "MCA", "Other", ""],
    },
    currentYear: {
      type: String,
      trim: true,
      enum: ["1st Year", "2nd Year", "3rd Year", "4th Year", ""],
    },
    currentSemester: {
      type: String,
      trim: true,
    },
    graduationYear: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    about: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    cgpa: {
      type: String,
      trim: true,
    },
    tenth: {
      type: String,
      trim: true,
    },
    twelfth: {
      type: String,
      trim: true,
    },
    backlogs: {
      type: String,
      trim: true,
    },
    gap: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
    },
    programmingLanguages: [String],
    technicalSkills: [String],
    targetRoles: [String],
    jobSeeking: {
      type: String,
      trim: true,
      enum: ["Actively seeking", "Open to opportunities", "Not looking right now", ""],
    },
    resumeUrl: {
      type: String,
      trim: true,
    },
    portfolioUrl: {
      type: String,
      trim: true,
    },
    githubUrl: {
      type: String,
      trim: true,
    },
    linkedinUrl: {
      type: String,
      trim: true,
    },
    handle: {
      type: String,
      trim: true,
    },
    preferredLanguage: {
      type: String,
      trim: true,
    },
    dsaProficiency: {
      type: String,
      trim: true,
    },
    preferredDomains: {
      type: String,
      trim: true,
    },
    preferredLocations: {
      type: String,
      trim: true,
    },
    workMode: {
      type: String,
      trim: true,
    },
    projects: [
      {
        id: String,
        title: String,
        description: String,
        technologies: String,
      },
    ],
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    visibilityConfigured: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("UserData", userDataSchema);
