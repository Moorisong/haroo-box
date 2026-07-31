import { useState, useCallback } from 'react';
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

const GOOGLE_FONTS_EMBED_CSS = `@import url('https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Do+Hyeon&family=Gowun+Batang:wght@400;700&family=Gowun+Dodum&family=Noto+Sans+KR:wght@400;700;900&family=Noto+Serif+KR:wght@400;700;900&family=Song+Myung&display=swap');`;

export function useShareActions(postcard: PostcardViewData, previewRef: React.RefObject<HTMLDivElement | null>) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const shareUrl = buildShareUrl(postcard.id);

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
      // 폰트 대기 (1초 타임아웃 보호 장치)
      if (typeof document !== 'undefined' && document.fonts) {
        await Promise.race([
          document.fonts.ready,
          new Promise((resolve) => setTimeout(resolve, 1000)),
        ]);
      }

      // 1. html-to-image 캡처 (유저 선택 서체 Google Fonts Embed 적용)
      const dataUrl = await toPng(previewRef.current, {
        cacheBust: false,
        pixelRatio: 2,
        fontEmbedCSS: GOOGLE_FONTS_EMBED_CSS,
      });
      
      // 2. 동기식 Blob 변환 (fetch 사용 시 무한 펜딩되는 브라우저 버그 차단)
      const blob = dataURItoBlob(dataUrl);

      // 3. ObjectURL 생성 후 앵커 즉시 클릭 다운로드
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
  }, [postcard.id, downloading, previewRef]);

  return {
    shareUrl,
    copied,
    downloading,
    handleKakaoShare,
    handleCopy,
    handleDownload,
  };
}
