import prisma from '../utils/prisma.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';
import type {
  CreateTeamInput,
  UpdateTeamInput,
  UpdateScoreInput,
} from '../validators/team.validator.js';

export async function getAllTeams() {
  return prisma.team.findMany({
    orderBy: { score: 'desc' },
    include: {
      _count: {
        select: { members: true },
      },
      achievements: {
        include: {
          achievement: true,
        },
      },
    },
  });
}

export async function getTeamById(id: string) {
  const team = await prisma.team.findUnique({
    where: { id },
    include: {
      members: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      achievements: {
        include: {
          achievement: true,
        },
      },
      activities: {
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
    },
  });

  if (!team) {
    throw new NotFoundError('Team not found');
  }

  return team;
}

export async function createTeam(input: CreateTeamInput) {
  const existingTeam = await prisma.team.findUnique({
    where: { name: input.name },
  });

  if (existingTeam) {
    throw new ConflictError('Team name already exists');
  }

  return prisma.team.create({
    data: input,
    include: {
      _count: {
        select: { members: true },
      },
    },
  });
}

export async function updateTeam(id: string, input: UpdateTeamInput) {
  const team = await prisma.team.findUnique({
    where: { id },
  });

  if (!team) {
    throw new NotFoundError('Team not found');
  }

  if (input.name && input.name !== team.name) {
    const existingTeam = await prisma.team.findUnique({
      where: { name: input.name },
    });

    if (existingTeam) {
      throw new ConflictError('Team name already exists');
    }
  }

  return prisma.team.update({
    where: { id },
    data: input,
    include: {
      _count: {
        select: { members: true },
      },
      achievements: {
        include: {
          achievement: true,
        },
      },
    },
  });
}

export async function deleteTeam(id: string) {
  const team = await prisma.team.findUnique({
    where: { id },
  });

  if (!team) {
    throw new NotFoundError('Team not found');
  }

  await prisma.team.delete({
    where: { id },
  });

  return { success: true };
}

export async function updateTeamScore(id: string, input: UpdateScoreInput) {
  const team = await prisma.team.findUnique({
    where: { id },
  });

  if (!team) {
    throw new NotFoundError('Team not found');
  }

  const updatedTeam = await prisma.$transaction(async (tx) => {
    // Create activity record
    await tx.activity.create({
      data: {
        type: 'POINTS_EARNED',
        description: input.description,
        points: input.points,
        teamId: id,
      },
    });

    // Update team score
    return tx.team.update({
      where: { id },
      data: {
        score: { increment: input.points },
      },
      include: {
        _count: {
          select: { members: true },
        },
        achievements: {
          include: {
            achievement: true,
          },
        },
      },
    });
  });

  return updatedTeam;
}

export async function addMemberToTeam(teamId: string, userId: string) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
  });

  if (!team) {
    throw new NotFoundError('Team not found');
  }

  return prisma.user.update({
    where: { id: userId },
    data: { teamId },
    select: {
      id: true,
      name: true,
      email: true,
      teamId: true,
    },
  });
}

export async function removeMemberFromTeam(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { teamId: null },
    select: {
      id: true,
      name: true,
      email: true,
      teamId: true,
    },
  });
}

export async function getLeaderboard() {
  const teams = await prisma.team.findMany({
    orderBy: { score: 'desc' },
    select: {
      id: true,
      name: true,
      description: true,
      avatarUrl: true,
      score: true,
      createdAt: true,
      _count: {
        select: { members: true },
      },
      achievements: {
        include: {
          achievement: true,
        },
      },
    },
  });

  return teams.map((team, index) => ({
    ...team,
    rank: index + 1,
    memberCount: team._count.members,
  }));
}
