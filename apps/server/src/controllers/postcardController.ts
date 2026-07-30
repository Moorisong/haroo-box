import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';
import { getPostcardModel } from '../models/postcard.model';
import { getUploadDir } from '../middlewares/uploadPostcard';
import {
  POSTCARD_FILTER_TYPES,
  POSTCARD_EFFECT_TYPES,
  POSTCARD_FONT_FAMILIES,
  YOUTUBE_URL_REGEX,
  type PostcardFilterType,
  type PostcardEffectType,
  type PostcardFontFamily,
} from '../types/postcard';

/** 서버 공개 URL (환경변수, 기본값은 로컬) */
const SERVER_PUBLIC_URL = process.env.SERVER_PUBLIC_URL ?? 'http://localhost:3000';

/**
 * 엽서 생성 컨트롤러
 * POST /api/postcards
 * - multipart/form-data 수신 (image 파일 + 메타데이터)
 * - 유효성 검증 후 DB 저장 및 201 응답
 */
export const createPostcard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ success: false, message: '이미지 파일이 필요합니다.' });
      return;
    }

    const { filter_type, effect_type, message, font_family, youtube_url } = req.body as {
      filter_type?: string;
      effect_type?: string;
      message?: string;
      font_family?: string;
      youtube_url?: string;
    };

    // 필수 필드 유효성 검증
    if (!message || message.trim().length === 0) {
      fs.promises.unlink(file.path).catch(() => null);
      res.status(400).json({ success: false, message: '문구(message)는 필수입니다.' });
      return;
    }

    // filter_type Enum 검증
    const resolvedFilter = (POSTCARD_FILTER_TYPES as readonly string[]).includes(filter_type ?? '')
      ? (filter_type as PostcardFilterType)
      : 'none';

    // effect_type Enum 검증
    const resolvedEffect = (POSTCARD_EFFECT_TYPES as readonly string[]).includes(effect_type ?? '')
      ? (effect_type as PostcardEffectType)
      : 'none';

    // font_family Enum 검증
    const resolvedFont = (POSTCARD_FONT_FAMILIES as readonly string[]).includes(font_family ?? '')
      ? (font_family as PostcardFontFamily)
      : 'font-1';

    // 유튜브 링크에서 ID 추출
    let youtube_id: string | null = null;
    if (youtube_url && youtube_url.trim().length > 0) {
      const match = youtube_url.match(YOUTUBE_URL_REGEX);
      youtube_id = match ? match[1] : null;
    }

    // 물리 파일 저장 상대 경로 (DB 정형화 저장: uploads/postcards/파일명)
    const image_path = `uploads/postcards/${file.filename}`;

    const PostcardModel = getPostcardModel();
    const postcardId = nanoid(10);

    const postcard = new PostcardModel({
      _id: postcardId,
      image_path,
      filter_type: resolvedFilter,
      effect_type: resolvedEffect,
      message: message.trim(),
      font_family: resolvedFont,
      youtube_id,
    });

    await postcard.save();

    console.log(`[Postcard] 엽서 생성 성공: ${postcardId}`);

    res.status(201).json({
      success: true,
      id: postcardId,
      expires_at: postcard.expires_at.toISOString(),
    });
  } catch (err: any) {
    console.error('[Postcard Error] 엽서 생성 중 에러 발생:', err);
    // 저장 실패 시 업로드된 파일 삭제 (고아 파일 방지)
    if (req.file) {
      fs.promises.unlink(req.file.path).catch(() => null);
    }
    res.status(500).json({
      success: false,
      message: err?.message || '엽서 생성 중 서버 에러가 발생했습니다.',
    });
  }
};

/**
 * 엽서 단일 조회 컨트롤러
 * GET /api/postcards/:id
 * - 만료 여부 확인 후 410 Gone 또는 200 OK 반환
 * - 존재하지 않는 ID는 404 반환
 */
export const getPostcard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const PostcardModel = getPostcardModel();

    const postcard = await PostcardModel.findById(id);

    if (!postcard) {
      res.status(404).json({ success: false, message: '엽서를 찾을 수 없습니다.' });
      return;
    }

    // 만료 여부 검사 (DB 레코드가 살아있어도 expires_at 기준으로 410 반환)
    if (postcard.expires_at < new Date()) {
      res.status(410).json({ success: false, message: '만료된 엽서입니다. (2일 경과)' });
      return;
    }

    const cleanRelativePath = postcard.image_path.replace(/\\/g, '/').replace(/^\/+/, '');
    const imageUrl = `${SERVER_PUBLIC_URL}/${cleanRelativePath}`;

    res.status(200).json({
      success: true,
      data: {
        id: postcard._id,
        image_url: imageUrl,
        filter_type: postcard.filter_type,
        effect_type: postcard.effect_type ?? 'none',
        message: postcard.message,
        font_family: postcard.font_family,
        youtube_id: postcard.youtube_id,
        created_at: postcard.created_at.toISOString(),
        expires_at: postcard.expires_at.toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
};
