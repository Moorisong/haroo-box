import { Schema, Document } from 'mongoose';
import { getPostcardConnection } from '../config/database';
import {
  POSTCARD_FILTER_TYPES,
  POSTCARD_EFFECT_TYPES,
  POSTCARD_FONT_FAMILIES,
  POSTCARD_MESSAGE_MAX_LENGTH,
  POSTCARD_TTL_MS,
  type PostcardFilterType,
  type PostcardEffectType,
  type PostcardFontFamily,
} from '../types/postcard';

/** Mongoose Document 확장 인터페이스 (string _id 명시) */
export interface IPostcardDocument extends Document<string> {
  _id: string;
  image_path: string;
  filter_type: PostcardFilterType;
  filter_intensity: number;
  effect_type: PostcardEffectType;
  image_offset_y: number;
  message: string;
  font_family: PostcardFontFamily;
  youtube_id: string | null;
  created_at: Date;
  expires_at: Date;
}

/**
 * 하루엽서 Mongoose 스키마
 * - _id: nanoid 10자리 고유 문자열 (URL 공유용)
 * - expires_at: 생성 시점으로부터 72시간(3일) 뒤 자동 계산
 * - expires_at 인덱스: 만료 엽서 삭제 쿼리 풀스캔 방지
 */
const postcardSchema = new Schema<IPostcardDocument>(
  {
    _id: {
      type: String,
      required: true,
    },
    image_path: {
      type: String,
      required: true,
      trim: true,
    },
    filter_type: {
      type: String,
      required: true,
      // 공통 타입 파일의 Enum 배열을 직접 참조하여 하드코딩 방지
      enum: [...POSTCARD_FILTER_TYPES],
      default: 'none',
    },
    filter_intensity: {
      type: Number,
      required: true,
      default: 100,
      min: 0,
      max: 100,
    },
    effect_type: {
      type: String,
      required: true,
      enum: [...POSTCARD_EFFECT_TYPES],
      default: 'none',
    },
    image_offset_y: {
      type: Number,
      required: true,
      default: 50,
      min: 0,
      max: 100,
    },
    message: {
      type: String,
      required: true,
      // 기획 문서 기준 150자 제한 (타입 파일 상수 참조)
      maxlength: POSTCARD_MESSAGE_MAX_LENGTH,
    },
    font_family: {
      type: String,
      required: true,
      // 공통 타입 파일의 Enum 배열을 직접 참조하여 하드코딩 방지
      enum: [...POSTCARD_FONT_FAMILIES],
      default: 'font-1',
    },
    youtube_id: {
      type: String,
      default: null,
      trim: true,
    },
    created_at: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expires_at: {
      type: Date,
      required: true,
      // 생성 시점 기준 TTL_MS(72h) 후 만료 시각을 함수형 기본값으로 계산
      default: () => new Date(Date.now() + POSTCARD_TTL_MS),
    },
  },
  {
    // 자동 timestamps 비활성화 (created_at을 직접 관리)
    timestamps: false,
    // _id 자동 생성 비활성화 (nanoid를 주입받아 사용)
    _id: false,
  }
);

// 만료 엽서 조회 쿼리의 풀스캔 방지를 위한 오름차순 단일 인덱스
postcardSchema.index({ expires_at: 1 });

/**
 * postcard 전용 DB 커넥션으로 모델 생성
 * 동일 커넥션에서 중복 등록 방지를 위해 모델 존재 여부 확인 후 반환
 */
export const getPostcardModel = () => {
  const conn = getPostcardConnection();
  return conn.models.Postcard || conn.model<IPostcardDocument>('Postcard', postcardSchema);
};
