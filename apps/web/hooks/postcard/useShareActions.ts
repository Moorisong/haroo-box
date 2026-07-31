import { useState, useCallback, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { shareViaKakao, copyToClipboard, buildShareUrl } from '@/utils/kakaoShare';
import { SHARE_MESSAGES } from '@/constants/postcard';
import type { PostcardViewData } from '@/types/postcard';

/** DataURL을 File 객체로 변환 유틸 */
function dataURLtoFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

/** DataURI를 순수 동기식 Blob으로 변환 (fetch 비동기 무한 펜딩 방지) */
function dataURItoBlob(dataURI: string): Blob {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

const fontCssCacheMap = new Map<string, string>();

/** 폰트 ID별 Google Fonts URL 파라미터 매핑 */
const GOOGLE_FONT_PARAMS: Record<string, string> = {
  'font-1': 'family=Noto+Sans+KR:wght@400;700',
  'font-2': 'family=Gowun+Dodum',
  'font-3': 'family=Black+Han+Sans',
  'font-4': 'family=Do+Hyeon',
  'font-5': 'family=Noto+Serif+KR:wght@400;700',
  'font-6': 'family=Gowun+Batang:wght@400;700',
  'font-7': 'family=Song+Myung',
  'font-8': 'family=Gowun+Batang:wght@400;700',
};

/** 유저가 선택한 단 1개의 폰트만 경량화 수신하여 Base64 인라인 (30KB 경량화) */
async function getInlinedFontCssForFamily(fontFamilyId: string): Promise<string> {
  const cacheKey = fontFamilyId || 'font-1';
  if (fontCssCacheMap.has(cacheKey)) return fontCssCacheMap.get(cacheKey)!;

  try {
    const fontParam = GOOGLE_FONT_PARAMS[cacheKey] || GOOGLE_FONT_PARAMS['font-1'];
    const googleCssUrl = `https://fonts.googleapis.com/css2?${fontParam}&display=swap`;

    const cssRes = await fetch(googleCssUrl);
    if (!cssRes.ok) return '';
    let cssText = await cssRes.text();

    const fontUrls = Array.from(cssText.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g));
    await Promise.all(
      fontUrls.map(async (match) => {
        const fontUrl = match[1];
        try {
          const fontRes = await fetch(fontUrl);
          if (fontRes.ok) {
            const buffer = await fontRes.arrayBuffer();
            const bytes = new Uint8Array(buffer);
            let binary = '';
            for (let i = 0; i < bytes.byteLength; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            const base64 = btoa(binary);
            cssText = cssText.replaceAll(fontUrl, `data:font/woff2;base64,${base64}`);
          }
        } catch {
          // 실패 시 유지
        }
      })
    );

    fontCssCacheMap.set(cacheKey, cssText);
    return cssText;
  } catch (e) {
    console.warn('Failed to inline font CSS:', e);
    return '';
  }
}

/** 유저 선택 폰트 즉시 확정 (블로킹 타임아웃 0ms화) */
async function ensureFontLoaded(fontFamily: string) {
  if (typeof document !== 'undefined' && document.fonts) {
    try {
      const cleanFontName = fontFamily.split(',')[0].replace(/['"]/g, '').trim();
      await document.fonts.load(`16px "${cleanFontName}"`);
    } catch {
      // ignore
    }
  }
}

/** 카카오톡/네이버/인스타그램 등 인앱 브라우저 여부 감지 */
export function isKakaoTalkInAppBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /KAKAOTALK|NAVER|Instagram|FB_IAB|FB4A|FB_MD/i.test(ua);
}

export function useShareActions(postcard: PostcardViewData, previewRef: React.RefObject<HTMLDivElement | null>) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [inAppImageUrl, setInAppImageUrl] = useState<string | null>(null);

  const shareUrl = buildShareUrl(postcard.id);

  // 페이지 접속 즉시 유저가 선택한 폰트 1개 백그라운드 프리페치 (클릭 시 지연 0ms)
  useEffect(() => {
    if (postcard?.font_family) {
      getInlinedFontCssForFamily(postcard.font_family);
      ensureFontLoaded(postcard.font_family);
    }
  }, [postcard?.font_family]);

  const handleKakaoShare = useCallback(() => {
    shareViaKakao({
      postcardId: postcard.id,
      message: postcard.message,
      imageUrl: postcard.image_url,
    });
  }, [postcard]);

  const handleCopy = useCallback(async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  }, [shareUrl]);

  const handleDownload = useCallback(async () => {
    if (!previewRef.current || downloading) return;
    setDownloading(true);

    try {
      // 1. 유저가 선택한 폰트 1개만 콕 찝어 즉시 인라인 수신 (30KB 쾌속 반영)
      const fontEmbedCSS = await getInlinedFontCssForFamily(postcard.font_family);

      // 2. html-to-image 캡처 (지연 0ms의 즉시 다운로드)
      const dataUrl = await toPng(previewRef.current, {
        cacheBust: false,
        pixelRatio: 2,
        preferredFontFormat: 'woff2',
        fontEmbedCSS,
      });

      // 3. 카카오톡/인앱 브라우저 대응 (인앱 환경이면 롱프레스 모달 오픈)
      if (isKakaoTalkInAppBrowser()) {
        setInAppImageUrl(dataUrl);

        // 카카오톡 외부 브라우저 강제 전환 시도
        if (/KAKAOTALK/i.test(navigator.userAgent || '')) {
          const targetUrl = window.location.href;
          window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(targetUrl)}`;
        }
      }
      
      // 4. 일반 브라우저 다운로드 앵커 실행
      const blob = dataURItoBlob(dataUrl);
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `haroo-postcard-${postcard.id}.png`;
      link.href = blobUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 메모리 해제
      setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
    } catch (error) {
      console.error('Image download error:', error);
      alert(SHARE_MESSAGES.DOWNLOAD_ERROR);
    } finally {
      setDownloading(false);
    }
  }, [postcard.id, postcard.font_family, downloading, previewRef]);

  const closeInAppModal = useCallback(() => {
    setInAppImageUrl(null);
  }, []);

  return {
    shareUrl,
    copied,
    downloading,
    inAppImageUrl,
    closeInAppModal,
    handleKakaoShare,
    handleCopy,
    handleDownload,
  };
}
