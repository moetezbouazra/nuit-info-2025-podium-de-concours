import type { CreateAchievementInput, UpdateAchievementInput } from '../validators/achievement.validator.js';
export declare function getAllAchievements(): Promise<{
    name: string;
    id: string;
    createdAt: Date;
    description: string;
    points: number;
    icon: string;
}[]>;
export declare function getAchievementById(id: string): Promise<{
    teams: ({
        team: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        teamId: string;
        achievementId: string;
        awardedAt: Date;
    })[];
} & {
    name: string;
    id: string;
    createdAt: Date;
    description: string;
    points: number;
    icon: string;
}>;
export declare function createAchievement(input: CreateAchievementInput): Promise<{
    name: string;
    id: string;
    createdAt: Date;
    description: string;
    points: number;
    icon: string;
}>;
export declare function updateAchievement(id: string, input: UpdateAchievementInput): Promise<{
    name: string;
    id: string;
    createdAt: Date;
    description: string;
    points: number;
    icon: string;
}>;
export declare function deleteAchievement(id: string): Promise<{
    success: boolean;
}>;
export declare function awardAchievementToTeam(teamId: string, achievementId: string): Promise<{
    team: {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        avatarUrl: string | null;
        color: string;
        score: number;
    };
    achievement: {
        name: string;
        id: string;
        createdAt: Date;
        description: string;
        points: number;
        icon: string;
    };
} & {
    id: string;
    teamId: string;
    achievementId: string;
    awardedAt: Date;
}>;
//# sourceMappingURL=achievement.service.d.ts.map