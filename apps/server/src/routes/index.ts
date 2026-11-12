import { Router } from 'express';
import authRoutes from './auth.routes';
import htsmRoutes from './htsm.routes';
import puzzleRoutes from './puzzle.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/htsm', htsmRoutes);
router.use('/puzzle', puzzleRoutes);

export default router;
