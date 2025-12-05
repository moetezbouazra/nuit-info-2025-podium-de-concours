import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Game login - simplified auth for RPG game (username + team)
export const gameLoginSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters').max(20),
  teamId: z.string().min(1, 'Team is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type GameLoginInput = z.infer<typeof gameLoginSchema>;
