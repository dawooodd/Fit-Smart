const { z } = require('zod');

exports.foodPhotoAnalysisSchema = z.object({
  mealId: z.string().uuid().optional(),
  imageUrl: z.string().url().optional(),
  detectedFoods: z.any().optional(),
  estimatedCalories: z.number().int().min(0).optional(),
  estimatedProtein: z.number().min(0).optional(),
  estimatedCarbs: z.number().min(0).optional(),
  estimatedFat: z.number().min(0).optional(),
  confidenceScore: z.number().min(0).max(100).optional(),
  aiResponse: z.any().optional(),
  status: z.enum(['pending', 'completed', 'failed']).optional(),
});
