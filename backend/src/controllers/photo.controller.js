const photoService = require('../services/photo.service');
const { foodPhotoAnalysisSchema } = require('../validations/photo.validation');
const { uuidParamSchema } = require('../validations/common.validation');

function parseJsonFields(body) {
  const parsed = { ...body };
  for (const key of ['detectedFoods', 'aiResponse']) {
    if (typeof parsed[key] === 'string') {
      try { parsed[key] = JSON.parse(parsed[key]); } catch (_) {}
    }
  }
  for (const key of ['estimatedCalories', 'estimatedProtein', 'estimatedCarbs', 'estimatedFat', 'confidenceScore']) {
    if (parsed[key] !== undefined && parsed[key] !== '') parsed[key] = Number(parsed[key]);
  }
  return parsed;
}

exports.createFoodPhotoAnalysis = async (req, res) => {
  try {
    const data = foodPhotoAnalysisSchema.parse(parseJsonFields(req.body));
    const analysis = await photoService.createFoodPhotoAnalysis(req.user.id, data, req.file);
    return res.status(201).json({ message: 'Food photo analysis created successfully', analysis });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getFoodPhotoAnalyses = async (req, res) => {
  try {
    const analyses = await photoService.getFoodPhotoAnalyses(req.user.id);
    return res.status(200).json({ message: 'Food photo analyses fetched successfully', analyses });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getFoodPhotoAnalysisById = async (req, res) => {
  try {
    const { id } = uuidParamSchema.parse(req.params);
    const analysis = await photoService.getFoodPhotoAnalysisById(id, req.user.id);
    return res.status(200).json({ message: 'Food photo analysis fetched successfully', analysis });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

exports.updateFoodPhotoAnalysis = async (req, res) => {
  try {
    const { id } = uuidParamSchema.parse(req.params);
    const data = foodPhotoAnalysisSchema.partial().parse(parseJsonFields(req.body));
    const analysis = await photoService.updateFoodPhotoAnalysis(id, req.user.id, data);
    return res.status(200).json({ message: 'Food photo analysis updated successfully', analysis });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.deleteFoodPhotoAnalysis = async (req, res) => {
  try {
    const { id } = uuidParamSchema.parse(req.params);
    await photoService.deleteFoodPhotoAnalysis(id, req.user.id);
    return res.status(200).json({ message: 'Food photo analysis deleted successfully' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
