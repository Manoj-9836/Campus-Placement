const UserData = require("../../models/UserData");

async function getProfile(clerkId, email) {
  const profile = await UserData.findOne({ clerkId });

  if (!profile) {
    // Return minimal profile structure if not found
    return {
      clerkId,
      email,
      fullName: "Student",
      rollNumber: "",
      avatar: "",
      phone: "",
      location: "",
      institution: "",
      department: "",
      degree: "",
      currentYear: "",
      currentSemester: "",
      graduationYear: "",
      country: "",
      about: "",
      cgpa: "",
      tenth: "",
      twelfth: "",
      backlogs: "",
      gap: "",
      gender: "",
      programmingLanguages: [],
      technicalSkills: [],
      targetRoles: [],
      jobSeeking: "",
      resumeUrl: "",
      portfolioUrl: "",
      githubUrl: "",
      linkedinUrl: "",
      projects: [],
      visibility: "public",
      visibilityConfigured: true,
    };
  }

  return profile;
}

async function saveProfile(clerkId, email, profileData) {
  // Validate base64 avatar size if present
  if (profileData.avatar) {
    const sizeInMB = Buffer.byteLength(profileData.avatar, "utf8") / (1024 * 1024);
    if (sizeInMB > 2) {
      const error = new Error("Avatar image must be smaller than 2MB");
      error.statusCode = 400;
      error.code = "FILE_TOO_LARGE";
      throw error;
    }
  }

  const profile = await UserData.findOneAndUpdate(
    { clerkId },
    {
      $set: {
        clerkId,
        email,
        ...profileData,
      },
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  if (!profile) {
    throw new Error("Failed to save profile to database");
  }

  return profile;
}

async function deleteAvatar(clerkId) {
  const profile = await UserData.findOneAndUpdate(
    { clerkId },
    { $set: { avatar: "" } },
    { new: true }
  );

  if (!profile) {
    const error = new Error("Profile not found");
    error.statusCode = 404;
    error.code = "PROFILE_NOT_FOUND";
    throw error;
  }

  return profile;
}

module.exports = { getProfile, saveProfile, deleteAvatar };
