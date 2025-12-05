import { Router } from 'express';
import * as teamController from '../controllers/team.controller.js';
const router = Router();
router.get('/', teamController.getLeaderboard);
export default router;
//# sourceMappingURL=leaderboard.routes.js.map