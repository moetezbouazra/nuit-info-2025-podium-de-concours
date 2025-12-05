import { z } from 'zod';

export const createAchievementSchema = z.object({
  name: z.string().min(2, 'Achievement name must be at least 2 characters').max(50),
  description: z.string().min(5, 'Description must be at least 5 characters').max(200),
  icon: z.string().min(1, 'Icon is required'),
  points: z.number().int().min(0, 'Points must be non-negative'),
});

export const updateAchievementSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  description: z.string().min(5).max(200).optional(),
  icon: z.string().min(1).optional(),
  points: z.number().int().min(0).optional(),
});

export type CreateAchievementInput = z.infer<typeof createAchievementSchema>;
export type UpdateAchievementInput = z.infer<typeof updateAchievementSchema>;
