import { Router } from 'express';
import authRoutes from './auth.routes.js';
import teamRoutes from './team.routes.js';
import leaderboardRoutes from './leaderboard.routes.js';
import achievementRoutes from './achievement.routes.js';
const router = Router();
router.use('/auth', authRoutes);
router.use('/teams', teamRoutes);
router.use('/leaderboard', leaderboardRoutes);
router.use('/achievements', achievementRoutes);
// Health check
router.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
export default router;
//# sourceMappingURL=index.js.map