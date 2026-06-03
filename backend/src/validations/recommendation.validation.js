const { z } = require('zod');

exports.recommendationQuerySchema = z.object({
  date: z.string().optional(),
});
