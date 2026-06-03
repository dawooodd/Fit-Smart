const express = require('express');
const router = express.Router();

const recommendationController = require('../controllers/recommendation.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.get('/foods', authMiddleware, recommendationController.getFoodRecommendations);
router.post('/foods/generate', authMiddleware, recommendationController.generateFoodRecommendation);
router.get('/workouts', authMiddleware, recommendationController.getWorkoutRecommendations);
router.post('/workouts/generate', authMiddleware, recommendationController.generateWorkoutRecommendation);

module.exports = router;
