import type { RegisterInput, LoginInput } from '../validators/auth.validator.js';
export declare function register(input: RegisterInput): Promise<{
    user: {
        name: string;
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        teamId: string | null;
        createdAt: Date;
    };
    token: string;
}>;
export declare function login(input: LoginInput): Promise<{
    user: {
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        teamId: string | null;
        createdAt: Date;
    };
    token: string;
}>;
export declare function getCurrentUser(userId: string): Promise<{
    name: string;
    id: string;
    email: string;
    role: import("@prisma/client").$Enums.Role;
    teamId: string | null;
    createdAt: Date;
    team: {
        name: string;
        id: string;
        color: string;
        score: number;
    } | null;
} | null>;
export declare function gameLogin(input: {
    username: string;
    teamId: string;
}): Promise<{
    user: {
        id: string;
        name: string;
        teamId: string | null;
        team: {
            id: string;
            name: string;
            color: string;
        };
    };
    token: string;
}>;
//# sourceMappingURL=auth.service.d.ts.map