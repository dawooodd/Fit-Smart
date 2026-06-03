const express = require('express');
const router = express.Router();

const mealController = require('../controllers/meal.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, mealController.getMeals);
router.get('/:id', authMiddleware, mealController.getMealById);
router.post('/', authMiddleware, mealController.createMeal);
router.put('/:id', authMiddleware, mealController.updateMeal);
router.post('/:id/foods', authMiddleware, mealController.addFoodToMeal);
router.delete('/:id/foods/:mealFoodId', authMiddleware, mealController.removeFoodFromMeal);
router.delete('/:id', authMiddleware, mealController.deleteMeal);

module.exports = router;
