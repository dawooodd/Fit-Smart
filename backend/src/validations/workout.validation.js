const { z } = require('zod');

exports.exerciseSchema = z.object({
  name: z.string().min(2).max(100),
  type: z.string().min(2).max(50),
  muscleGroup: z.string().max(100).optional(),
  caloriesPerMin: z.number().min(0).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  description: z.string().optional(),
});

const workoutExerciseInput = z.object({
  exerciseId: z.string().uuid(),
  sets: z.number().int().positive().optional(),
  reps: z.number().int().positive().optional(),
  duration: z.number().int().positive().optional(),
});

exports.workoutSessionSchema = z.object({
  date: z.string(),
  duration: z.number().int().min(0).optional(),
  caloriesBurned: z.number().int().min(0).optional(),
  type: z.string().max(50).optional(),
  notes: z.string().optional(),
  exercises: z.array(workoutExerciseInput).optional().default([]),
});

exports.addWorkoutExerciseSchema = workoutExerciseInput;

exports.workoutQuerySchema = z.object({
  date: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
