import type { Request, Response } from 'express';
import * as achievementService from '../services/achievement.service.js';
import * as teamService from '../services/team.service.js';
import {
  createAchievementSchema,
  updateAchievementSchema,
} from '../validators/achievement.validator.js';
import { awardAchievementSchema } from '../validators/team.validator.js';

export async function getAllAchievements(
  _req: Request,
  res: Response
): Promise<void> {
  const achievements = await achievementService.getAllAchievements();

  res.json({
    status: 'success',
    data: { achievements },
  });
}

export async function getAchievementById(
  req: Request,
  res: Response
): Promise<void> {
  const achievement = await achievementService.getAchievementById(
    req.params.id
  );

  res.json({
    status: 'success',
    data: { achievement },
  });
}

export async function createAchievement(
  req: Request,
  res: Response
): Promise<void> {
  const input = createAchievementSchema.parse(req.body);
  const achievement = await achievementService.createAchievement(input);

  res.status(201).json({
    status: 'success',
    data: { achievement },
  });
}

export async function updateAchievement(
  req: Request,
  res: Response
): Promise<void> {
  const input = updateAchievementSchema.parse(req.body);
  const achievement = await achievementService.updateAchievement(
    req.params.id,
    input
  );

  res.json({
    status: 'success',
    data: { achievement },
  });
}

export async function deleteAchievement(
  req: Request,
  res: Response
): Promise<void> {
  await achievementService.deleteAchievement(req.params.id);

  res.json({
    status: 'success',
    message: 'Achievement deleted successfully',
  });
}

export async function awardAchievementToTeam(
  req: Request,
  res: Response
): Promise<void> {
  const { achievementId } = awardAchievementSchema.parse(req.body);
  const teamAchievement = await achievementService.awardAchievementToTeam(
    req.params.id,
    achievementId
  );

  // Emit socket event for real-time update
  const io = req.app.get('io');
  if (io) {
    const leaderboard = await teamService.getLeaderboard();
    io.emit('leaderboard:update', leaderboard);
    io.emit('achievement:unlocked', {
      teamId: teamAchievement.teamId,
      achievement: teamAchievement.achievement,
    });
  }

  res.status(201).json({
    status: 'success',
    data: { teamAchievement },
  });
}
