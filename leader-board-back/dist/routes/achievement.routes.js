import { Router } from 'express';
import * as achievementController from '../controllers/achievement.controller.js';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware.js';
const router = Router();
// Public routes
router.get('/', achievementController.getAllAchievements);
router.get('/:id', achievementController.getAchievementById);
// Admin routes
router.post('/', authenticate, requireAdmin, achievementController.createAchievement);
router.put('/:id', authenticate, requireAdmin, achievementController.updateAchievement);
router.delete('/:id', authenticate, requireAdmin, achievementController.deleteAchievement);
export default router;
//# sourceMappingURL=achievement.routes.js.map