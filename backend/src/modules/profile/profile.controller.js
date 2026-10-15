const { validate, saveProfileSchema } = require("./profile.schemas");
const profileService = require("./profile.service");

async function getProfile(req, res, next) {
  try {
    const { clerkId, email } = req.clerkUser;
    const profile = await profileService.getProfile(clerkId, email);
    return res.status(200).json({ profile });
  } catch (error) {
    return next(error);
  }
}

async function saveProfile(req, res, next) {
  try {
    const { clerkId, email } = req.clerkUser;
    const input = validate(saveProfileSchema, req.body);
    const profile = await profileService.saveProfile(clerkId, email, input);
    return res.status(200).json({ profile });
  } catch (error) {
    return next(error);
  }
}

async function deleteAvatar(req, res, next) {
  try {
    const { clerkId } = req.clerkUser;
    const profile = await profileService.deleteAvatar(clerkId);
    return res.status(200).json({ profile });
  } catch (error) {
    return next(error);
  }
}

module.exports = { getProfile, saveProfile, deleteAvatar };
