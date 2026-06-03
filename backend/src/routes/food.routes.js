const express = require('express');
const router = express.Router();

const foodController = require('../controllers/food.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, foodController.getFoods);
router.get('/:id', authMiddleware, foodController.getFoodById);
router.post('/', authMiddleware, foodController.createFood);
router.put('/:id', authMiddleware, foodController.updateFood);
router.delete('/:id', authMiddleware, foodController.deleteFood);

module.exports = router;
