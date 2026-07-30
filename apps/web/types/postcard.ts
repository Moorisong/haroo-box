/**
 * 하루엽서 프론트엔드 공통 타입 정의
 * 백엔드 타입과 분리하여 프론트 전용으로 관리
 */

/** 엽서 이미지 필터 8종 타입 */
export type PostcardFilterType =
  | 'none'
  | 'vintage'
  | 'monotone'
  | 'film-grain'
  | 'warm'
  | 'cool'
  | 'dramatic'
  | 'pastel';

/** 엽서 감성 배경 이펙트 8종 타입 + 없음 */
export type PostcardEffectType =
  | 'none'
  | 'sunlight'       // 쏟아지는 햇살 (Warm Sunlight)
  | 'starlight'      // 반짝이는 별빛 (Floating Starlight)
  | 'snowfall'       // 은은한 눈 내림 (Soft Snowfall)
  | 'raindrop'       // 빗방울 물방울 (Glass Raindrops)
  | 'cherry-blossom' // 휘날리는 벚꽃잎 (Falling Petals)
  | 'firefly'        // 숲속 반딧불이 (Forest Fireflies)
  | 'bubble'         // 몽환 비눗방울 (Floating Bubbles)
  | 'shooting-star'; // 밤하늘 유성우 (Shooting Star);

/** 엽서 폰트 패밀리 타입 (고딕 계열 4종 + 명조 계열 4종) */
export type PostcardFontFamily =
  | 'font-1'
  | 'font-2'
  | 'font-3'
  | 'font-4'
  | 'font-5'
  | 'font-6'
  | 'font-7'
  | 'font-8';

/** 엽서 제작 폼 상태 (Zustand 스토어) */
export interface PostcardFormState {
  imageFile: File | null;
  imagePreviewUrl: string | null;
  imageOffsetY: number;
  filterType: PostcardFilterType;
  filterIntensity: number;
  effectType: PostcardEffectType;
  message: string;
  fontFamily: PostcardFontFamily;
  youtubeUrl: string;
  youtubeId: string | null;
}

/** API 응답: 엽서 생성 성공 */
export interface CreatePostcardResponse {
  success: true;
  id: string;
  expires_at: string;
}

/** API 응답: 엽서 조회 성공 */
export interface GetPostcardResponse {
  success: true;
  data: PostcardViewData;
}

/** 뷰어 페이지에서 사용할 엽서 데이터 */
export interface PostcardViewData {
  id: string;
  image_url: string;
  filter_type: PostcardFilterType;
  filter_intensity: number;
  effect_type?: PostcardEffectType;
  image_offset_y: number;
  message: string;
  font_family: PostcardFontFamily;
  youtube_id: string | null;
  created_at: string;
  expires_at: string;
}

/** 만료 응답 (410) */
export interface ExpiredPostcardResponse {
  success: false;
  message: string;
}
