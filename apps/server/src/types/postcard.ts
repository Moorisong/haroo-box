/**
 * 하루엽서 - 공통 타입 및 Enum 정의 파일
 * 스키마 및 컨트롤러에서 공유하는 상수/타입 모음
 */

/** 엽서 이미지 필터 타입 */
export const POSTCARD_FILTER_TYPES = ['vintage', 'monotone', 'film-grain', 'none'] as const;
export type PostcardFilterType = (typeof POSTCARD_FILTER_TYPES)[number];

/** 엽서 폰트 패밀리 타입 */
export const POSTCARD_FONT_FAMILIES = ['font-1', 'font-2', 'font-3', 'font-4', 'font-5'] as const;
export type PostcardFontFamily = (typeof POSTCARD_FONT_FAMILIES)[number];

/** 엽서 메시지 최대 길이 */
export const POSTCARD_MESSAGE_MAX_LENGTH = 150;

/** 엽서 TTL (72시간, 3일) ms 단위 */
export const POSTCARD_TTL_MS = 3 * 24 * 60 * 60 * 1000;

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
  message: string;
  font_family: PostcardFontFamily;
  youtube_id: string | null;
  created_at: Date;
  expires_at: Date;
}
