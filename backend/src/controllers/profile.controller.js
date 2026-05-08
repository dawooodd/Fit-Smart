const profileService = require("../services/profile.service");
const { profileSchema } = require("../validations/profile.validation");

exports.createOrUpdateProfile = async (req, res) => {
  try {
    const data = profileSchema.parse(req.body);

    const profile = await profileService.createOrUpdateProfile(
      req.user.id,
      data
    );

    return res.status(200).json({
      message: "Profile saved successfully",
      profile,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const profile = await profileService.getProfile(req.user.id);

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      message: "Profile fetched successfully",
      profile,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};