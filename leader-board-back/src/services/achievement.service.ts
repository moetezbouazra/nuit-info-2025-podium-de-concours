import prisma from '../utils/prisma.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';
import type {
  CreateAchievementInput,
  UpdateAchievementInput,
} from '../validators/achievement.validator.js';

export async function getAllAchievements() {
  return prisma.achievement.findMany({
    orderBy: { points: 'desc' },
  });
}

export async function getAchievementById(id: string) {
  const achievement = await prisma.achievement.findUnique({
    where: { id },
    include: {
      teams: {
        include: {
          team: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!achievement) {
    throw new NotFoundError('Achievement not found');
  }

  return achievement;
}

export async function createAchievement(input: CreateAchievementInput) {
  const existingAchievement = await prisma.achievement.findUnique({
    where: { name: input.name },
  });

  if (existingAchievement) {
    throw new ConflictError('Achievement name already exists');
  }

  return prisma.achievement.create({
    data: input,
  });
}

export async function updateAchievement(
  id: string,
  input: UpdateAchievementInput
) {
  const achievement = await prisma.achievement.findUnique({
    where: { id },
  });

  if (!achievement) {
    throw new NotFoundError('Achievement not found');
  }

  if (input.name && input.name !== achievement.name) {
    const existingAchievement = await prisma.achievement.findUnique({
      where: { name: input.name },
    });

    if (existingAchievement) {
      throw new ConflictError('Achievement name already exists');
    }
  }

  return prisma.achievement.update({
    where: { id },
    data: input,
  });
}

export async function deleteAchievement(id: string) {
  const achievement = await prisma.achievement.findUnique({
    where: { id },
  });

  if (!achievement) {
    throw new NotFoundError('Achievement not found');
  }

  await prisma.achievement.delete({
    where: { id },
  });

  return { success: true };
}

export async function awardAchievementToTeam(
  teamId: string,
  achievementId: string
) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
  });

  if (!team) {
    throw new NotFoundError('Team not found');
  }

  const achievement = await prisma.achievement.findUnique({
    where: { id: achievementId },
  });

  if (!achievement) {
    throw new NotFoundError('Achievement not found');
  }

  const existingAward = await prisma.teamAchievement.findUnique({
    where: {
      teamId_achievementId: {
        teamId,
        achievementId,
      },
    },
  });

  if (existingAward) {
    throw new ConflictError('Team already has this achievement');
  }

  const result = await prisma.$transaction(async (tx) => {
    // Award achievement
    const teamAchievement = await tx.teamAchievement.create({
      data: {
        teamId,
        achievementId,
      },
      include: {
        achievement: true,
        team: true,
      },
    });

    // Add points to team
    await tx.team.update({
      where: { id: teamId },
      data: {
        score: { increment: achievement.points },
      },
    });

    // Create activity
    await tx.activity.create({
      data: {
        type: 'ACHIEVEMENT_UNLOCKED',
        description: `Unlocked achievement: ${achievement.name}`,
        points: achievement.points,
        teamId,
      },
    });

    return teamAchievement;
  });

  return result;
}
