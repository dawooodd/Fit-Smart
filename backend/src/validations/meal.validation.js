const { z } = require('zod');

const mealFoodInput = z.object({
  foodId: z.string().uuid(),
  quantity: z.number().positive(),
});

exports.mealSchema = z.object({
  date: z.string(),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  notes: z.string().optional(),
  foods: z.array(mealFoodInput).optional().default([]),
});

exports.addMealFoodSchema = mealFoodInput;

exports.mealQuerySchema = z.object({
  date: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
