import { Router } from 'express';
import { uploadPostcard } from '../middlewares/uploadPostcard';
import { createPostcard, getPostcard } from '../controllers/postcardController';

const router = Router();

/**
 * POST /api/postcards & POST /api/postcards/
 * 엽서 생성 - multipart/form-data (image 파일 포함)
 */
router.post(
  '/',
  uploadPostcard.single('image'),
  createPostcard
);

/**
 * GET /api/postcards/:id & GET /api/postcards/:id/
 * 엽서 단일 조회 - 만료 시 410 Gone 반환
 */
router.get('/:id', getPostcard);

export default router;
