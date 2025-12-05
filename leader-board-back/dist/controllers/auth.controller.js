import * as authService from '../services/auth.service.js';
import { registerSchema, loginSchema, gameLoginSchema } from '../validators/auth.validator.js';
export async function register(req, res) {
    const input = registerSchema.parse(req.body);
    const result = await authService.register(input);
    res.status(201).json({
        status: 'success',
        data: result,
    });
}
export async function login(req, res) {
    const input = loginSchema.parse(req.body);
    const result = await authService.login(input);
    res.json({
        status: 'success',
        data: result,
    });
}
export async function getCurrentUser(req, res) {
    const user = await authService.getCurrentUser(req.user.userId);
    res.json({
        status: 'success',
        data: { user },
    });
}
// Game login - simplified auth for RPG game (username + team)
export async function gameLogin(req, res) {
    const input = gameLoginSchema.parse(req.body);
    const result = await authService.gameLogin(input);
    res.json({
        status: 'success',
        data: result,
    });
}
//# sourceMappingURL=auth.controller.js.map