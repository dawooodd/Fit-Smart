const { z } = require('zod');

exports.foodSchema = z.object({
  name: z.string().min(2).max(100),
  calories: z.number().int().min(0),
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fat: z.number().min(0),
  category: z.string().min(2).max(50),
  description: z.string().optional(),
});

exports.foodQuerySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
});
