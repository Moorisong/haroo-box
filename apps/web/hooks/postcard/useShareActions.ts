import { useState, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { shareViaKakao, copyToClipboard, buildShareUrl } from '@/utils/kakaoShare';
import { SHARE_MESSAGES } from '@/constants/postcard';
import type { PostcardViewData } from '@/types/postcard';

/**
 * 공유하기 액션(카카오, 복사, 다운로드) 처리 훅
 */
export function useShareActions(postcard: PostcardViewData, previewRef: React.RefObject<HTMLDivElement>) {
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
      const dataUrl = await toPng(previewRef.current, {
        cacheBust: false,
        pixelRatio: 4, // 기존 2배수에서 4배수로 상향하여 화질 극대화 (240px -> 960px)
        fontEmbedCSS: '', // 외부 CSS/폰트 다운로드 시도를 강제 스킵하여 딜레이 제거 및 즉시 캡처
        // fontEmbedCSS를 ''로 지정하면 styleSheetsFilter 및 내부의 모든 네트워크 요청이 생략되므로 SecurityError도 발생하지 않습니다.
      });
      const link = document.createElement('a');
      link.download = `haroo-postcard-${postcard.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Image download error:', error);
      alert(SHARE_MESSAGES.DOWNLOAD_ERROR);
    } finally {
      setDownloading(false);
    }
  }, [postcard.id, downloading, previewRef]);

  return { shareUrl, copied, downloading, handleKakaoShare, handleCopy, handleDownload };
}
