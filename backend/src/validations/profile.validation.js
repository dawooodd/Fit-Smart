const { z } = require("zod");

exports.profileSchema = z.object({
  diseaseHistory: z.string().optional(),
  weight: z.number().positive(),
  height: z.number().positive(),
  age: z.number().int().positive(),
  gender: z.enum(["male", "female"]),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very_active"]),
  goal: z.enum(["lose_weight", "maintain_weight", "gain_weight"]),
});