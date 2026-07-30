/**
 * 하루엽서 프론트엔드 공통 상수 정의
 * 필터 목록, 폰트 목록, 예시 카드 데이터를 중앙 관리
 * 하드코딩 금지 원칙 준수: 모든 열거 값은 이 파일에서 참조
 */

import type { PostcardFilterType, PostcardFontFamily } from '@/types/postcard';

// ─── 필터 상수 ────────────────────────────────────────────────────────────────

export interface FilterMeta {
  id: PostcardFilterType;
  name: string;
  /** CSS filter 함수 문자열 */
  css: string;
}

/** 기획 문서 기준 3종 필터 + 없음 */
export const POSTCARD_FILTERS: FilterMeta[] = [
  { id: 'none', name: '없음', css: '' },
  { id: 'vintage', name: 'Vintage', css: 'sepia(0.45) contrast(1.1) brightness(0.93) saturate(0.8)' },
  { id: 'monotone', name: 'Monotone', css: 'grayscale(1) contrast(1.1)' },
  { id: 'film-grain', name: 'Film Grain', css: 'contrast(1.08) brightness(0.96) saturate(1.15)' },
];

/** 필터 ID → CSS 문자열 조회 헬퍼 */
export const getFilterCss = (id: PostcardFilterType): string =>
  POSTCARD_FILTERS.find((f) => f.id === id)?.css ?? '';

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
