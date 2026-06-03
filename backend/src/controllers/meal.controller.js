const mealService = require('../services/meal.service');
const { mealSchema, addMealFoodSchema, mealQuerySchema } = require('../validations/meal.validation');
const { uuidParamSchema } = require('../validations/common.validation');

exports.createMeal = async (req, res) => {
  try {
    const data = mealSchema.parse(req.body);
    const meal = await mealService.createMeal(req.user.id, data);
    return res.status(201).json({ message: 'Meal created successfully', meal });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getMeals = async (req, res) => {
  try {
    const query = mealQuerySchema.parse(req.query);
    const meals = await mealService.getMeals(req.user.id, query);
    return res.status(200).json({ message: 'Meals fetched successfully', meals });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getMealById = async (req, res) => {
  try {
    const { id } = uuidParamSchema.parse(req.params);
    const meal = await mealService.getMealById(id, req.user.id);
    return res.status(200).json({ message: 'Meal fetched successfully', meal });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

exports.updateMeal = async (req, res) => {
  try {
    const { id } = uuidParamSchema.parse(req.params);
    const data = mealSchema.parse(req.body);
    const meal = await mealService.updateMeal(id, req.user.id, data);
    return res.status(200).json({ message: 'Meal updated successfully', meal });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.addFoodToMeal = async (req, res) => {
  try {
    const { id } = uuidParamSchema.parse(req.params);
    const data = addMealFoodSchema.parse(req.body);
    const mealFood = await mealService.addFoodToMeal(id, req.user.id, data);
    return res.status(201).json({ message: 'Food added to meal successfully', mealFood });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.removeFoodFromMeal = async (req, res) => {
  try {
    const { id } = uuidParamSchema.parse(req.params);
    const { mealFoodId } = req.params;
    await mealService.removeFoodFromMeal(id, mealFoodId, req.user.id);
    return res.status(200).json({ message: 'Food removed from meal successfully' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.deleteMeal = async (req, res) => {
  try {
    const { id } = uuidParamSchema.parse(req.params);
    await mealService.deleteMeal(id, req.user.id);
    return res.status(200).json({ message: 'Meal deleted successfully' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
