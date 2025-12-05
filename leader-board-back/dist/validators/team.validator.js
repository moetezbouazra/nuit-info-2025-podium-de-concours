import { z } from 'zod';
export const createTeamSchema = z.object({
    name: z.string().min(2, 'Team name must be at least 2 characters').max(50),
    description: z.string().max(500).optional(),
    avatarUrl: z.string().url().optional().nullable(),
});
export const updateTeamSchema = z.object({
    name: z.string().min(2).max(50).optional(),
    description: z.string().max(500).optional().nullable(),
    avatarUrl: z.string().url().optional().nullable(),
});
export const updateScoreSchema = z.object({
    points: z.number().int(),
    description: z.string().min(1, 'Description is required').max(200),
});
export const awardAchievementSchema = z.object({
    achievementId: z.string().cuid(),
});
//# sourceMappingURL=team.validator.js.map