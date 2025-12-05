import { z } from 'zod';
export declare const createTeamSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    avatarUrl: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description?: string | undefined;
    avatarUrl?: string | null | undefined;
}, {
    name: string;
    description?: string | undefined;
    avatarUrl?: string | null | undefined;
}>;
export declare const updateTeamSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    avatarUrl: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | null | undefined;
    avatarUrl?: string | null | undefined;
}, {
    name?: string | undefined;
    description?: string | null | undefined;
    avatarUrl?: string | null | undefined;
}>;
export declare const updateScoreSchema: z.ZodObject<{
    points: z.ZodNumber;
    description: z.ZodString;
}, "strip", z.ZodTypeAny, {
    description: string;
    points: number;
}, {
    description: string;
    points: number;
}>;
export declare const awardAchievementSchema: z.ZodObject<{
    achievementId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    achievementId: string;
}, {
    achievementId: string;
}>;
export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;
export type UpdateScoreInput = z.infer<typeof updateScoreSchema>;
export type AwardAchievementInput = z.infer<typeof awardAchievementSchema>;
//# sourceMappingURL=team.validator.d.ts.map