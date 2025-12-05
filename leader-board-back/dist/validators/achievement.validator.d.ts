import { z } from 'zod';
export declare const createAchievementSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    icon: z.ZodString;
    points: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    points: number;
    icon: string;
}, {
    name: string;
    description: string;
    points: number;
    icon: string;
}>;
export declare const updateAchievementSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
    points: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    points?: number | undefined;
    icon?: string | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    points?: number | undefined;
    icon?: string | undefined;
}>;
export type CreateAchievementInput = z.infer<typeof createAchievementSchema>;
export type UpdateAchievementInput = z.infer<typeof updateAchievementSchema>;
//# sourceMappingURL=achievement.validator.d.ts.map