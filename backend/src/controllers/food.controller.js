const foodService = require('../services/food.service');
const { foodSchema, foodQuerySchema } = require('../validations/food.validation');
const { uuidParamSchema } = require('../validations/common.validation');

exports.createFood = async (req, res) => {
  try {
    const data = foodSchema.parse(req.body);
    const food = await foodService.createFood(data);
    return res.status(201).json({ message: 'Food created successfully', food });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getFoods = async (req, res) => {
  try {
    const query = foodQuerySchema.parse(req.query);
    const foods = await foodService.getFoods(query);
    return res.status(200).json({ message: 'Foods fetched successfully', foods });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getFoodById = async (req, res) => {
  try {
    const { id } = uuidParamSchema.parse(req.params);
    const food = await foodService.getFoodById(id);
    return res.status(200).json({ message: 'Food fetched successfully', food });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

exports.updateFood = async (req, res) => {
  try {
    const { id } = uuidParamSchema.parse(req.params);
    const data = foodSchema.partial().parse(req.body);
    const food = await foodService.updateFood(id, data);
    return res.status(200).json({ message: 'Food updated successfully', food });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.deleteFood = async (req, res) => {
  try {
    const { id } = uuidParamSchema.parse(req.params);
    await foodService.deleteFood(id);
    return res.status(200).json({ message: 'Food deleted successfully' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
