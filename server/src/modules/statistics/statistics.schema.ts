import { z } from 'zod';

export const statisticsQuerySchema = z.object({
  academicYearId: z.coerce.number().int().positive(),
  timeframe: z.enum(['weekly', 'yearly']),
  weekStart: z.string().optional(),
  weekEnd: z.string().optional(),
});

export type StatisticsQuery = z.infer<typeof statisticsQuerySchema>;
