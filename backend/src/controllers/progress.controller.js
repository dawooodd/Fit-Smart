const progressService = require("../services/progress.service");
const { progressSchema } = require("../validations/progress.validation");

exports.createOrUpdateProgress = async (req, res) => {
  try {
    const data = progressSchema.parse(req.body);

    const progress = await progressService.createOrUpdateProgress(
      req.user.id,
      data
    );

    return res.status(200).json({
      message: "Progress saved successfully",
      progress,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const progress = await progressService.getProgress(req.user.id);

    return res.status(200).json({
      message: "Progress fetched successfully",
      progress,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

exports.getTodayProgress = async (req, res) => {
  try {
    const progress = await progressService.getTodayProgress(req.user.id);

    return res.status(200).json({
      message: "Today progress fetched successfully",
      progress,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

exports.deleteProgress = async (req, res) => {
  try {
    await progressService.deleteProgress(req.params.id, req.user.id);

    return res.status(200).json({
      message: "Progress deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};