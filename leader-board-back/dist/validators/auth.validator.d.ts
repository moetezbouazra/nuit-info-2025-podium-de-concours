import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
}, {
    name: string;
    email: string;
    password: string;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const gameLoginSchema: z.ZodObject<{
    username: z.ZodString;
    teamId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    teamId: string;
    username: string;
}, {
    teamId: string;
    username: string;
}>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type GameLoginInput = z.infer<typeof gameLoginSchema>;
//# sourceMappingURL=auth.validator.d.ts.map