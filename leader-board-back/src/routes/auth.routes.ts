import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/game-login', authController.gameLogin); // RPG game login
router.get('/me', authenticate, authController.getCurrentUser);

export default router;
