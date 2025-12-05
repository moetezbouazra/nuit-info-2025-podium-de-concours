import { Router } from 'express';
import * as teamController from '../controllers/team.controller.js';
import * as achievementController from '../controllers/achievement.controller.js';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware.js';
const router = Router();
// Public routes
router.get('/', teamController.getAllTeams);
router.get('/:id', teamController.getTeamById);
// Protected routes
router.post('/', authenticate, requireAdmin, teamController.createTeam);
router.put('/:id', authenticate, requireAdmin, teamController.updateTeam);
router.delete('/:id', authenticate, requireAdmin, teamController.deleteTeam);
router.post('/:id/score', authenticate, requireAdmin, teamController.updateTeamScore);
router.post('/:id/achievements', authenticate, requireAdmin, achievementController.awardAchievementToTeam);
// User routes
router.post('/:id/join', authenticate, teamController.joinTeam);
router.post('/leave', authenticate, teamController.leaveTeam);
// Member score update (no admin required) - for RPG game
router.post('/:id/member-score', authenticate, teamController.updateTeamScoreAsMember);
export default router;
//# sourceMappingURL=team.routes.js.map