import prisma from '../utils/prisma.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import { ConflictError, UnauthorizedError } from '../utils/errors.js';
export async function register(input) {
    const existingUser = await prisma.user.findUnique({
        where: { email: input.email },
    });
    if (existingUser) {
        throw new ConflictError('Email already registered');
    }
    const hashedPassword = await hashPassword(input.password);
    const user = await prisma.user.create({
        data: {
            email: input.email,
            password: hashedPassword,
            name: input.name,
        },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            teamId: true,
            createdAt: true,
        },
    });
    const token = signToken({
        userId: user.id,
        email: user.email,
        role: user.role,
    });
    return { user, token };
}
export async function login(input) {
    const user = await prisma.user.findUnique({
        where: { email: input.email },
    });
    if (!user) {
        throw new UnauthorizedError('Invalid email or password');
    }
    const isValidPassword = await comparePassword(input.password, user.password);
    if (!isValidPassword) {
        throw new UnauthorizedError('Invalid email or password');
    }
    const token = signToken({
        userId: user.id,
        email: user.email,
        role: user.role,
    });
    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            teamId: user.teamId,
            createdAt: user.createdAt,
        },
        token,
    };
}
export async function getCurrentUser(userId) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            teamId: true,
            team: {
                select: {
                    id: true,
                    name: true,
                    score: true,
                    color: true,
                },
            },
            createdAt: true,
        },
    });
    return user;
}
// Game login - creates/finds user by username and assigns to team
export async function gameLogin(input) {
    // Check if team exists
    const team = await prisma.team.findUnique({
        where: { id: input.teamId },
    });
    if (!team) {
        throw new UnauthorizedError('Team not found');
    }
    // Generate a unique email for game users
    const gameEmail = `${input.username.toLowerCase()}@game.rpg`;
    // Find existing user or create new one
    let user = await prisma.user.findUnique({
        where: { email: gameEmail },
    });
    if (user) {
        // Update team if different
        if (user.teamId !== input.teamId) {
            user = await prisma.user.update({
                where: { id: user.id },
                data: { teamId: input.teamId },
            });
        }
    }
    else {
        // Create new game user
        const hashedPassword = await hashPassword('game-user-' + Date.now());
        user = await prisma.user.create({
            data: {
                email: gameEmail,
                password: hashedPassword,
                name: input.username,
                teamId: input.teamId,
            },
        });
    }
    const token = signToken({
        userId: user.id,
        email: user.email,
        role: user.role,
    });
    return {
        user: {
            id: user.id,
            name: user.name,
            teamId: user.teamId,
            team: {
                id: team.id,
                name: team.name,
                color: team.color,
            },
        },
        token,
    };
}
//# sourceMappingURL=auth.service.js.map