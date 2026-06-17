import { Router } from 'express';
import authRoutes from './auth.routes';
import htsmRoutes from './htsm.routes';
import uKnowRoutes from './u-know.routes';
import puzzleRoutes from './puzzle.routes';
import tamagotchiRoutes from './tamagotchi.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/htsm', htsmRoutes);
router.use('/u-know', uKnowRoutes);
router.use('/puzzle', puzzleRoutes);
router.use('/tamagotchi', tamagotchiRoutes);

export default router;
