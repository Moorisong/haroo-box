import { create } from 'zustand';
import type { PostcardFilterType, PostcardFontFamily, PostcardEffectType } from '@/types/postcard';

/** 하루엽서 제작 폼 상태 (Zustand 스토어) */
interface PostcardFormState {
  imageFile: File | null;
  imagePreviewUrl: string | null;
  imageOffsetY: number; // 0 (top) ~ 100 (bottom), default 50 (center)
  filterType: PostcardFilterType;
  filterIntensity: number; // 0 ~ 100 (%)
  effectType: PostcardEffectType;
  message: string;
  fontFamily: PostcardFontFamily;
  youtubeUrl: string;
  youtubeId: string | null;
}

interface PostcardFormActions {
  setImageFile: (file: File, previewUrl: string) => void;
  setImageOffsetY: (offsetY: number) => void;
  setFilterType: (filter: PostcardFilterType) => void;
  setFilterIntensity: (intensity: number) => void;
  setEffectType: (effect: PostcardEffectType) => void;
  setMessage: (message: string) => void;
  setFontFamily: (font: PostcardFontFamily) => void;
  setYoutubeUrl: (url: string, id: string | null) => void;
  /** 제작 완료 또는 취소 시 상태 완전 초기화 */
  resetForm: () => void;
}

const INITIAL_STATE: PostcardFormState = {
  imageFile: null,
  imagePreviewUrl: null,
  imageOffsetY: 50,
  filterType: 'none',
  filterIntensity: 100,
  effectType: 'none',
  message: '',
  fontFamily: 'font-2',
  youtubeUrl: '',
  youtubeId: null,
};

/**
 * 하루엽서 제작 폼 Zustand 스토어
 * - 제작 도중 취소/뒤로가기 시 resetForm()으로 상태 격리
 * - 이미지 미리보기 URL은 File 객체와 함께 관리
 */
export const usePostcardFormStore = create<PostcardFormState & PostcardFormActions>((set) => ({
  ...INITIAL_STATE,

  setImageFile: (file, previewUrl) =>
    set({ imageFile: file, imagePreviewUrl: previewUrl, imageOffsetY: 50 }),

  setImageOffsetY: (imageOffsetY) => set({ imageOffsetY }),

  setFilterType: (filterType) => set({ filterType }),

  setFilterIntensity: (filterIntensity) => set({ filterIntensity }),

  setEffectType: (effectType) => set({ effectType }),

  setMessage: (message) => set({ message }),

  setFontFamily: (fontFamily) => set({ fontFamily }),

  setYoutubeUrl: (youtubeUrl, youtubeId) => set({ youtubeUrl, youtubeId }),

  resetForm: () => set(INITIAL_STATE),
}));
