import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@nird.fr' },
    update: {},
    create: {
      email: 'admin@nird.fr',
      password: adminPassword,
      name: 'Admin NIRD',
      role: 'ADMIN',
    },
  });
  console.log('Created admin user:', admin.email);

  // Create achievements
  const achievements = await Promise.all([
    prisma.achievement.upsert({
      where: { name: 'Premier Pas' },
      update: {},
      create: {
        name: 'Premier Pas',
        description: 'Rejoindre le mouvement NIRD',
        icon: 'rocket',
        points: 50,
      },
    }),
    prisma.achievement.upsert({
      where: { name: 'Explorateur' },
      update: {},
      create: {
        name: 'Explorateur',
        description: 'Compléter 5 défis',
        icon: 'compass',
        points: 100,
      },
    }),
    prisma.achievement.upsert({
      where: { name: 'Champion Linux' },
      update: {},
      create: {
        name: 'Champion Linux',
        description: 'Migrer un poste vers Linux',
        icon: 'terminal',
        points: 200,
      },
    }),
    prisma.achievement.upsert({
      where: { name: 'Résistant Numérique' },
      update: {},
      create: {
        name: 'Résistant Numérique',
        description: 'Adopter 3 logiciels libres',
        icon: 'shield',
        points: 150,
      },
    }),
    prisma.achievement.upsert({
      where: { name: 'Éco-Responsable' },
      update: {},
      create: {
        name: 'Éco-Responsable',
        description: 'Recycler du matériel informatique',
        icon: 'leaf',
        points: 100,
      },
    }),
    prisma.achievement.upsert({
      where: { name: 'Mentor' },
      update: {},
      create: {
        name: 'Mentor',
        description: 'Aider une autre équipe',
        icon: 'users',
        points: 75,
      },
    }),
  ]);
  console.log(`Created ${achievements.length} achievements`);

  // Create teams
  const teams = await Promise.all([
    prisma.team.upsert({
      where: { name: 'Les Gaulois Numériques' },
      update: { color: '#ef4444' },
      create: {
        name: 'Les Gaulois Numériques',
        description: 'Résistants face à l\'empire des Big Tech!',
        color: '#ef4444',
        score: 450,
      },
    }),
    prisma.team.upsert({
      where: { name: 'Libre ou Rien' },
      update: { color: '#3b82f6' },
      create: {
        name: 'Libre ou Rien',
        description: 'Pour un numérique 100% open source',
        color: '#3b82f6',
        score: 380,
      },
    }),
    prisma.team.upsert({
      where: { name: 'Les Éco-Hackers' },
      update: { color: '#22c55e' },
      create: {
        name: 'Les Éco-Hackers',
        description: 'La tech au service de la planète',
        color: '#22c55e',
        score: 320,
      },
    }),
    prisma.team.upsert({
      where: { name: 'Linux Forever' },
      update: { color: '#f59e0b' },
      create: {
        name: 'Linux Forever',
        description: 'Tux est notre mascotte!',
        color: '#f59e0b',
        score: 290,
      },
    }),
    prisma.team.upsert({
      where: { name: 'Digital Rebels' },
      update: { color: '#8b5cf6' },
      create: {
        name: 'Digital Rebels',
        description: 'Rébellion contre l\'obsolescence programmée',
        color: '#8b5cf6',
        score: 250,
      },
    }),
  ]);
  console.log(`Created ${teams.length} teams`);

  // Award some achievements to teams
  const team1 = teams[0];
  const team2 = teams[1];

  await prisma.teamAchievement.upsert({
    where: {
      teamId_achievementId: {
        teamId: team1.id,
        achievementId: achievements[0].id,
      },
    },
    update: {},
    create: {
      teamId: team1.id,
      achievementId: achievements[0].id,
    },
  });

  await prisma.teamAchievement.upsert({
    where: {
      teamId_achievementId: {
        teamId: team1.id,
        achievementId: achievements[2].id,
      },
    },
    update: {},
    create: {
      teamId: team1.id,
      achievementId: achievements[2].id,
    },
  });

  await prisma.teamAchievement.upsert({
    where: {
      teamId_achievementId: {
        teamId: team2.id,
        achievementId: achievements[0].id,
      },
    },
    update: {},
    create: {
      teamId: team2.id,
      achievementId: achievements[0].id,
    },
  });

  console.log('Awarded achievements to teams');

  // Create some activities
  await prisma.activity.createMany({
    data: [
      {
        type: 'POINTS_EARNED',
        description: 'Défi de migration Linux complété',
        points: 100,
        teamId: team1.id,
      },
      {
        type: 'ACHIEVEMENT_UNLOCKED',
        description: 'Déblocage: Champion Linux',
        points: 200,
        teamId: team1.id,
      },
      {
        type: 'POINTS_EARNED',
        description: 'Installation de LibreOffice',
        points: 50,
        teamId: team2.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log('Created activities');
  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
