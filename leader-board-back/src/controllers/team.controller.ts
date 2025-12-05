import type { Request, Response } from 'express';
import * as teamService from '../services/team.service.js';
import {
  createTeamSchema,
  updateTeamSchema,
  updateScoreSchema,
} from '../validators/team.validator.js';
import { broadcastLeaderboard } from '../services/sse.service.js';

export async function getAllTeams(_req: Request, res: Response): Promise<void> {
  const teams = await teamService.getAllTeams();

  res.json({
    status: 'success',
    data: { teams },
  });
}

export async function getTeamById(req: Request, res: Response): Promise<void> {
  const team = await teamService.getTeamById(req.params.id);

  res.json({
    status: 'success',
    data: { team },
  });
}

export async function createTeam(req: Request, res: Response): Promise<void> {
  const input = createTeamSchema.parse(req.body);
  const team = await teamService.createTeam(input);

  // Broadcast leaderboard update via SSE when new team is created
  console.log('[Controller] New team created, broadcasting leaderboard update');
  broadcastLeaderboard();

  res.status(201).json({
    status: 'success',
    data: { team },
  });
}

export async function updateTeam(req: Request, res: Response): Promise<void> {
  const input = updateTeamSchema.parse(req.body);
  const team = await teamService.updateTeam(req.params.id, input);

  res.json({
    status: 'success',
    data: { team },
  });
}

export async function deleteTeam(req: Request, res: Response): Promise<void> {
  await teamService.deleteTeam(req.params.id);

  // Broadcast leaderboard update via SSE when team is deleted
  console.log('[Controller] Team deleted, broadcasting leaderboard update');
  broadcastLeaderboard();

  res.json({
    status: 'success',
    message: 'Team deleted successfully',
  });
}

export async function updateTeamScore(
  req: Request,
  res: Response
): Promise<void> {
  console.log('[Controller] updateTeamScore called');

  const input = updateScoreSchema.parse(req.body);
  const team = await teamService.updateTeamScore(req.params.id, input);

  console.log(`[Controller] Team ${team.name} score updated to ${team.score}`);
  // Note: Real-time updates are handled by PostgreSQL LISTEN/NOTIFY + SSE

  res.json({
    status: 'success',
    data: { team },
  });
}

export async function getLeaderboard(
  _req: Request,
  res: Response
): Promise<void> {
  const leaderboard = await teamService.getLeaderboard();

  res.json({
    status: 'success',
    data: { leaderboard },
  });
}

export async function joinTeam(req: Request, res: Response): Promise<void> {
  const user = await teamService.addMemberToTeam(
    req.params.id,
    req.user!.userId
  );

  res.json({
    status: 'success',
    data: { user },
  });
}

export async function leaveTeam(req: Request, res: Response): Promise<void> {
  const user = await teamService.removeMemberFromTeam(req.user!.userId);

  res.json({
    status: 'success',
    data: { user },
  });
}

// Member score update (no admin required) - for RPG game
export async function updateTeamScoreAsMember(
  req: Request,
  res: Response
): Promise<void> {
  console.log('[Controller] updateTeamScoreAsMember called');

  const input = updateScoreSchema.parse(req.body);
  const team = await teamService.updateTeamScore(req.params.id, input);

  console.log(`[Controller] Team ${team.name} score updated to ${team.score} by member`);

  res.json({
    status: 'success',
    data: { team },
  });
}
