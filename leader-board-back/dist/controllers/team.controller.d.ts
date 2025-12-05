import type { Request, Response } from 'express';
export declare function getAllTeams(_req: Request, res: Response): Promise<void>;
export declare function getTeamById(req: Request, res: Response): Promise<void>;
export declare function createTeam(req: Request, res: Response): Promise<void>;
export declare function updateTeam(req: Request, res: Response): Promise<void>;
export declare function deleteTeam(req: Request, res: Response): Promise<void>;
export declare function updateTeamScore(req: Request, res: Response): Promise<void>;
export declare function getLeaderboard(_req: Request, res: Response): Promise<void>;
export declare function joinTeam(req: Request, res: Response): Promise<void>;
export declare function leaveTeam(req: Request, res: Response): Promise<void>;
export declare function updateTeamScoreAsMember(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=team.controller.d.ts.map