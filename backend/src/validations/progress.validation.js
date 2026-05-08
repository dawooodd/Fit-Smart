const { z } = require("zod");

exports.progressSchema = z.object({
  date: z.string(),
  weight: z.number().positive().optional(),
  caloriesConsumed: z.number().int().min(0).optional(),
  caloriesBurned: z.number().int().min(0).optional(),
  waterIntake: z.number().int().min(0).optional(),
  workoutDuration: z.number().int().min(0).optional(),
  sleepDuration: z.number().int().min(0).optional(),
  mood: z.string().optional(),
  notes: z.string().optional(),
});