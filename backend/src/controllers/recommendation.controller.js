const recommendationService = require('../services/recommendation.service');
const { recommendationQuerySchema } = require('../validations/recommendation.validation');

exports.generateFoodRecommendation = async (req, res) => {
  try {
    const { date } = recommendationQuerySchema.parse({ ...req.query, ...req.body });
    const foodRecommendation = await recommendationService.generateFoodRecommendation(req.user.id, date);
    return res.status(201).json({ message: 'Food recommendation generated successfully', foodRecommendation });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getFoodRecommendations = async (req, res) => {
  try {
    const foodRecommendations = await recommendationService.getFoodRecommendations(req.user.id);
    return res.status(200).json({ message: 'Food recommendations fetched successfully', foodRecommendations });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.generateWorkoutRecommendation = async (req, res) => {
  try {
    const { date } = recommendationQuerySchema.parse({ ...req.query, ...req.body });
    const workoutRecommendation = await recommendationService.generateWorkoutRecommendation(req.user.id, date);
    return res.status(201).json({ message: 'Workout recommendation generated successfully', workoutRecommendation });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getWorkoutRecommendations = async (req, res) => {
  try {
    const workoutRecommendations = await recommendationService.getWorkoutRecommendations(req.user.id);
    return res.status(200).json({ message: 'Workout recommendations fetched successfully', workoutRecommendations });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
