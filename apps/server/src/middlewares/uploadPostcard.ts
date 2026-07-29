import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { nanoid } from 'nanoid';
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
} from '../types/postcard';

/** 업로드 디렉토리 절대 경로 (CWD 독립적 보장) */
const UPLOAD_DIR = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.resolve(__dirname, '../../uploads/postcards');

// 업로드 디렉토리가 없으면 재귀적으로 생성
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/**
 * Multer DiskStorage 설정
 * - destination: CWD 독립적 절대 경로
 * - filename: nanoid + 타임스탬프로 난독화 파일명 생성 (인젝션/충돌 방지)
 */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.png';
    const uniqueName = `${nanoid(10)}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

/**
 * 파일 형식 유효성 필터
 * - JPEG, PNG, WEBP만 허용 (공통 타입 파일의 상수 배열 참조)
 * - 미지원 포맷은 즉시 에러 반환 (임시 파일 저장 전 차단)
 */
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowed = (ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(file.mimetype);
  if (allowed) {
    cb(null, true);
  } else {
    cb(new Error(`지원하지 않는 이미지 형식입니다. (지원: ${ALLOWED_IMAGE_MIME_TYPES.join(', ')})`));
  }
};

/** 하루엽서 이미지 업로드 multer 인스턴스 */
export const uploadPostcard = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
});

/** 업로드 디렉토리 경로 내보내기 (컨트롤러 및 Cron에서 참조) */
export const getUploadDir = (): string => UPLOAD_DIR;
