import type { Request, Response } from 'express';
import * as authService from '../services/auth.service.js';
import { registerSchema, loginSchema, gameLoginSchema } from '../validators/auth.validator.js';

export async function register(req: Request, res: Response): Promise<void> {
  const input = registerSchema.parse(req.body);
  const result = await authService.register(input);

  res.status(201).json({
    status: 'success',
    data: result,
  });
}

export async function login(req: Request, res: Response): Promise<void> {
  const input = loginSchema.parse(req.body);
  const result = await authService.login(input);

  res.json({
    status: 'success',
    data: result,
  });
}

export async function getCurrentUser(
  req: Request,
  res: Response
): Promise<void> {
  const user = await authService.getCurrentUser(req.user!.userId);

  res.json({
    status: 'success',
    data: { user },
  });
}

// Game login - simplified auth for RPG game (username + team)
export async function gameLogin(req: Request, res: Response): Promise<void> {
  const input = gameLoginSchema.parse(req.body);
  const result = await authService.gameLogin(input);

  res.json({
    status: 'success',
    data: result,
  });
}
