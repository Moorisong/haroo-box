'use client';

/**
 * 카카오톡 공유 유틸리티
 * - window.Kakao SDK를 활용한 엽서 링크 공유
 * - 중복 초기화 방지 처리 포함
 */

const KAKAO_API_KEY = process.env.NEXT_PUBLIC_KAKAO_API_KEY ?? '';
const POSTCARD_BASE_URL =
  process.env.NEXT_PUBLIC_POSTCARD_BASE_URL ?? 'https://box.haroo.site';

interface KakaoShareOptions {
  objectType: string;
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  };
  buttons: Array<{
    title: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  }>;
}

/** 카카오 SDK 타입 (window.Kakao 접근용) */
type KakaoSDK = {
  isInitialized: () => boolean;
  init: (key: string) => void;
  Share: {
    sendDefault: (options: KakaoShareOptions) => void;
  };
};

/** 카카오 SDK 초기화 (중복 호출 방지) */
const initKakao = (): boolean => {
  if (typeof window === 'undefined' || !window.Kakao) return false;
  const kakao = window.Kakao as unknown as KakaoSDK;
  if (!kakao.isInitialized()) {
    kakao.init(KAKAO_API_KEY);
  }
  return true;
};

export interface KakaoShareParams {
  postcardId: string;
  message: string;
  imageUrl: string;
}

/**
 * 카카오톡으로 엽서 공유
 * - 썸네일, 메시지 요약, 뷰어 링크 포함
 * - SDK 로드 실패 시 false 반환
 */
export const shareViaKakao = (params: KakaoShareParams): boolean => {
  if (!initKakao()) return false;

  const baseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL ?? POSTCARD_BASE_URL;

  const kakao = window.Kakao as unknown as KakaoSDK;
  const viewUrl = `${baseUrl}/postcard/view/${params.postcardId}`;
  const summary = params.message.length > 30
    ? `${params.message.slice(0, 30)}…`
    : params.message;

  kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: '🌸 하루엽서가 도착했어요',
      description: summary,
      imageUrl: params.imageUrl,
      link: {
        mobileWebUrl: viewUrl,
        webUrl: viewUrl,
      },
    },
    buttons: [
      {
        title: '엽서 열어보기',
        link: {
          mobileWebUrl: viewUrl,
          webUrl: viewUrl,
        },
      },
    ],
  });

  return true;
};

/** 클립보드에 링크 복사 (Clipboard API + textarea fallback) */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // 인앱 브라우저 등 Clipboard API 차단 환경 대비 fallback
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch {
      return false;
    }
  }
};

/** 엽서 공유 URL 생성 (로컬/테스트/운영 환경 자동 동기화) */
export const buildShareUrl = (postcardId: string): string => {
  const baseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL ?? POSTCARD_BASE_URL;

  return `${baseUrl}/postcard/view/${postcardId}`;
};
