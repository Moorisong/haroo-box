/**
 * 하루엽서 프론트엔드 공통 상수 정의
 * 필터 목록, 폰트 목록, 예시 카드 데이터를 중앙 관리
 * 하드코딩 금지 원칙 준수: 모든 열거 값은 이 파일에서 참조
 */

import type { PostcardFilterType, PostcardFontFamily, PostcardEffectType } from '@/types/postcard';

// ─── 필터 상수 ────────────────────────────────────────────────────────────────

export interface FilterMeta {
  id: PostcardFilterType;
  name: string;
  /** 기준 CSS filter 생성 함수 (intensity 0~100) */
  getStyle: (intensity: number) => string;
}

/** 8종 다양한 미적 감성 필터 메타데이터 */
export const POSTCARD_FILTERS: FilterMeta[] = [
  { id: 'none', name: '없음', getStyle: () => '' },
  {
    id: 'vintage',
    name: 'Vintage',
    getStyle: (i) => {
      const ratio = i / 100;
      return `sepia(${0.6 * ratio}) contrast(${1 + 0.15 * ratio}) brightness(${1 - 0.08 * ratio}) saturate(${1 - 0.3 * ratio})`;
    },
  },
  {
    id: 'monotone',
    name: 'Monotone',
    getStyle: (i) => {
      const ratio = i / 100;
      return `grayscale(${1 * ratio}) contrast(${1 + 0.2 * ratio})`;
    },
  },
  {
    id: 'film-grain',
    name: 'Film Grain',
    getStyle: (i) => {
      const ratio = i / 100;
      return `contrast(${1 + 0.18 * ratio}) brightness(${1 - 0.05 * ratio}) saturate(${1 + 0.3 * ratio})`;
    },
  },
  {
    id: 'warm',
    name: 'Warm Sunset',
    getStyle: (i) => {
      const ratio = i / 100;
      return `sepia(${0.35 * ratio}) saturate(${1 + 0.4 * ratio}) hue-rotate(-10deg)`;
    },
  },
  {
    id: 'cool',
    name: 'Cool Breeze',
    getStyle: (i) => {
      const ratio = i / 100;
      return `hue-rotate(${15 * ratio}deg) saturate(${1 + 0.2 * ratio}) brightness(${1 + 0.05 * ratio})`;
    },
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    getStyle: (i) => {
      const ratio = i / 100;
      return `contrast(${1 + 0.5 * ratio}) saturate(${1 + 0.3 * ratio}) brightness(${1 - 0.1 * ratio})`;
    },
  },
  {
    id: 'pastel',
    name: 'Soft Pastel',
    getStyle: (i) => {
      const ratio = i / 100;
      return `brightness(${1 + 0.12 * ratio}) saturate(${1 - 0.25 * ratio}) contrast(${1 - 0.1 * ratio})`;
    },
  },
];

/** 필터 ID 및 intensity(0~100) → CSS filter 문자열 반환 */
export const getFilterCss = (id: PostcardFilterType, intensity: number = 100): string => {
  const filter = POSTCARD_FILTERS.find((f) => f.id === id);
  return filter ? filter.getStyle(intensity) : '';
};

// ─── 이펙트 상수 ──────────────────────────────────────────────────────────────

export interface EffectMeta {
  id: PostcardEffectType;
  name: string;
  desc: string;
  icon: string;
}

/** 8종 감성 움직이는 배경 이펙트 메타데이터 */
export const POSTCARD_EFFECTS: EffectMeta[] = [
  { id: 'none', name: '없음', desc: '효과 없음', icon: '✨' },
  { id: 'sunlight', name: '햇살', desc: '따사롭게 쏟아지는 햇살', icon: '☀️' },
  { id: 'starlight', name: '별빛', desc: '밤하늘에 반짝이는 별빛', icon: '✨' },
  { id: 'snowfall', name: '포근한 눈', desc: '은은하게 내리는 눈송이', icon: '❄️' },
  { id: 'raindrop', name: '빗방울', desc: '창가에 맺힌 듯한 물방울', icon: '💧' },
  { id: 'cherry-blossom', name: '벚꽃 흩날림', desc: '봄바람에 날리는 꽃잎', icon: '🌸' },
  { id: 'firefly', name: '반딧불이', desc: '숲속 감성 춤추는 빛무기', icon: '🌿' },
  { id: 'bubble', name: '비눗방울', desc: '몽환적으로 떠오르는 영롱한 비눗방울', icon: '🫧' },
  { id: 'shooting-star', name: '유성우', desc: '밤하늘 가로지르는 별빛 유성우', icon: '🌠' },
];

// ─── 폰트 상수 ────────────────────────────────────────────────────────────────

export interface FontMeta {
  id: PostcardFontFamily;
  name: string;
  /** Google Fonts / 로컬 폰트 패밀리 문자열 */
  fontFamily: string;
  style: React.CSSProperties;
}

/**
 * 8종 대표 폰트 (고딕 계열 4종 + 명조 계열 4종)
 */
export const POSTCARD_FONTS: FontMeta[] = [
  // ── 고딕 계열 4종 ──
  {
    id: 'font-1',
    name: '모던고딕',
    fontFamily: "'Noto Sans KR', sans-serif",
    style: { fontFamily: "'Noto Sans KR', sans-serif" },
  },
  {
    id: 'font-2',
    name: '라운드고딕',
    fontFamily: "'Gowun Dodum', sans-serif",
    style: { fontFamily: "'Gowun Dodum', sans-serif" },
  },
  {
    id: 'font-3',
    name: '임팩트고딕',
    fontFamily: "'Black Han Sans', sans-serif",
    style: { fontFamily: "'Black Han Sans', sans-serif" },
  },
  {
    id: 'font-4',
    name: '캐주얼고딕',
    fontFamily: "'Do Hyeon', sans-serif",
    style: { fontFamily: "'Do Hyeon', sans-serif" },
  },

  // ── 명조 계열 4종 ──
  {
    id: 'font-5',
    name: '클래식명조',
    fontFamily: "'Noto Serif KR', serif",
    style: { fontFamily: "'Noto Serif KR', serif" },
  },
  {
    id: 'font-6',
    name: '감성명조',
    fontFamily: "'Gowun Batang', serif",
    style: { fontFamily: "'Gowun Batang', serif" },
  },
  {
    id: 'font-7',
    name: '레트로명조',
    fontFamily: "'Song Myung', serif",
    style: { fontFamily: "'Song Myung', serif" },
  },
  {
    id: 'font-8',
    name: '시인명조',
    fontFamily: "'Gowun Batang', serif",
    style: { fontFamily: "'Gowun Batang', serif", fontStyle: 'italic', letterSpacing: '0.04em' },
  },
];

/** 폰트 ID → CSSProperties 조회 헬퍼 */
export const getFontStyle = (id: PostcardFontFamily): React.CSSProperties =>
  POSTCARD_FONTS.find((f) => f.id === id)?.style ?? { fontFamily: "'Noto Sans KR', sans-serif" };

// ─── 메시지 제한 ──────────────────────────────────────────────────────────────

/** 기획 문서 기준: 최대 150자 */
export const POSTCARD_MESSAGE_MAX_LENGTH = 150;

// ─── 광고 대기 시간 ───────────────────────────────────────────────────────────

/** 기획 문서 기준: 최소 3초 대기 */
export const AD_GATE_COUNTDOWN_SEC = 3;

// ─── TTL ─────────────────────────────────────────────────────────────────────

/** 2일(48시간) ms */
export const POSTCARD_TTL_MS = 2 * 24 * 60 * 60 * 1000;

// ─── 예시 엽서 슬라이더 데이터 ───────────────────────────────────────────────

export interface ExampleCard {
  imageUrl: string;
  text: string;
  filterType: PostcardFilterType;
  fontFamily: PostcardFontFamily;
  bg: string;
}

/** 랜딩 페이지 슬라이더에 보여줄 예시 엽서 3종 */
export const EXAMPLE_CARDS: ExampleCard[] = [
  {
    imageUrl:
      'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=280&h=340&fit=crop&auto=format',
    text: '봄이 오는 길목에\n잠깐 멈춰서 있었어',
    filterType: 'vintage',
    fontFamily: 'font-2',
    bg: '#F9EAD8',
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=280&h=340&fit=crop&auto=format',
    text: '오늘도 잘 지냈어?\n네가 보고 싶은 날',
    filterType: 'film-grain',
    fontFamily: 'font-5',
    bg: '#E4EDE9',
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=280&h=340&fit=crop&auto=format',
    text: '너와 함께한 저녁은\n늘 충분했어',
    filterType: 'none',
    fontFamily: 'font-4',
    bg: '#E8EAF2',
  },
];

// ─── 유튜브 링크 파싱 ────────────────────────────────────────────────────────

/** 유튜브 공유 링크에서 비디오 ID(11자리) 추출 */
export const extractYoutubeId = (url: string): string | null => {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
};

/** 유튜브 썸네일 URL 생성 */
export const getYoutubeThumbnailUrl = (youtubeId: string): string =>
  `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
