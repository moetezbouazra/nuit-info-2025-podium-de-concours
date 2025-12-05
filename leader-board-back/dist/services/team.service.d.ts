import type { CreateTeamInput, UpdateTeamInput, UpdateScoreInput } from '../validators/team.validator.js';
export declare function getAllTeams(): Promise<({
    achievements: ({
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
    })[];
    _count: {
        members: number;
    };
} & {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    avatarUrl: string | null;
    color: string;
    score: number;
})[]>;
export declare function getTeamById(id: string): Promise<{
    members: {
        name: string;
        id: string;
        email: string;
    }[];
    achievements: ({
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
    })[];
    activities: {
        id: string;
        teamId: string;
        createdAt: Date;
        description: string;
        type: string;
        points: number;
    }[];
} & {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    avatarUrl: string | null;
    color: string;
    score: number;
}>;
export declare function createTeam(input: CreateTeamInput): Promise<{
    _count: {
        members: number;
    };
} & {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    avatarUrl: string | null;
    color: string;
    score: number;
}>;
export declare function updateTeam(id: string, input: UpdateTeamInput): Promise<{
    achievements: ({
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
    })[];
    _count: {
        members: number;
    };
} & {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    avatarUrl: string | null;
    color: string;
    score: number;
}>;
export declare function deleteTeam(id: string): Promise<{
    success: boolean;
}>;
export declare function updateTeamScore(id: string, input: UpdateScoreInput): Promise<{
    achievements: ({
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
    })[];
    _count: {
        members: number;
    };
} & {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    avatarUrl: string | null;
    color: string;
    score: number;
}>;
export declare function addMemberToTeam(teamId: string, userId: string): Promise<{
    name: string;
    id: string;
    email: string;
    teamId: string | null;
}>;
export declare function removeMemberFromTeam(userId: string): Promise<{
    name: string;
    id: string;
    email: string;
    teamId: string | null;
}>;
export declare function getLeaderboard(): Promise<{
    rank: number;
    memberCount: number;
    name: string;
    id: string;
    createdAt: Date;
    description: string | null;
    avatarUrl: string | null;
    score: number;
    achievements: ({
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
    })[];
    _count: {
        members: number;
    };
}[]>;
//# sourceMappingURL=team.service.d.ts.map