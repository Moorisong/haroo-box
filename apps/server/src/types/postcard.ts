/**
 * 하루엽서 - 공통 타입 및 Enum 정의 파일
 * 스키마 및 컨트롤러에서 공유하는 상수/타입 모음
 */

/** 엽서 이미지 필터 8종 타입 */
export const POSTCARD_FILTER_TYPES = [
  'none',
  'vintage',
  'monotone',
  'film-grain',
  'warm',
  'cool',
  'dramatic',
  'pastel',
] as const;
export type PostcardFilterType = (typeof POSTCARD_FILTER_TYPES)[number];

/** 엽서 감성 이펙트 8종 타입 + 없음 */
export const POSTCARD_EFFECT_TYPES = [
  'none',
  'sunlight',
  'starlight',
  'snowfall',
  'raindrop',
  'cherry-blossom',
  'firefly',
  'bubble',
  'shooting-star',
] as const;
export type PostcardEffectType = (typeof POSTCARD_EFFECT_TYPES)[number];

/** 엽서 폰트 패밀리 타입 (고딕 계열 4종 + 명조 계열 4종) */
export const POSTCARD_FONT_FAMILIES = [
  'font-1',
  'font-2',
  'font-3',
  'font-4',
  'font-5',
  'font-6',
  'font-7',
  'font-8',
] as const;
export type PostcardFontFamily = (typeof POSTCARD_FONT_FAMILIES)[number];

/** 엽서 메시지 최대 길이 */
export const POSTCARD_MESSAGE_MAX_LENGTH = 150;

/** 엽서 TTL (48시간, 2일) ms 단위 */
export const POSTCARD_TTL_MS = 2 * 24 * 60 * 60 * 1000;

/** 유튜브 11자리 ID 검증 정규식 */
export const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

/** 유튜브 공유 링크에서 ID 추출 정규식 */
export const YOUTUBE_URL_REGEX = /(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/;

/** 지원 이미지 MIME 타입 목록 */
export const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

/** 최대 파일 업로드 크기 (5MB) */
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

/** Mongoose Document 인터페이스 (IPostcard) */
export interface IPostcard {
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
