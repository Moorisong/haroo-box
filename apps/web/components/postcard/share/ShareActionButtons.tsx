import React from 'react';
import { Copy, Download } from 'lucide-react';
import { SHARE_MESSAGES } from '@/constants/postcard';

interface ShareActionButtonsProps {
  copied: boolean;
  downloading: boolean;
  onKakaoShare: () => void;
  onCopy: () => void;
  onDownload: () => void;
}

export default function ShareActionButtons({
  copied,
  downloading,
  onKakaoShare,
  onCopy,
  onDownload,
}: ShareActionButtonsProps) {
  return (
    <div
      className="flex flex-col gap-2.5 w-full max-w-[280px] mx-auto"
      style={{ animation: 'fadeInUp 0.6s 0.3s ease both' }}
    >
      {/* 카카오톡 공유 */}
      <button
        onClick={onKakaoShare}
        id="postcard-share-kakao"
        className="w-full py-4 rounded-2xl text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.98]"
        style={{ background: '#FAE100', color: '#3A1D1D' }}
      >
        <span className="text-base">💬</span>
        {SHARE_MESSAGES.KAKAO_SHARE}
      </button>

      {/* 링크 복사 */}
      <button
        onClick={onCopy}
        id="postcard-share-copy"
        className="w-full py-4 rounded-2xl text-sm font-medium flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-sm"
        style={{ background: '#6C5CE7', color: '#FFFFFF' }}
      >
        <Copy size={15} />
        {copied ? SHARE_MESSAGES.COPY_SUCCESS : SHARE_MESSAGES.COPY_DEFAULT}
      </button>

      {/* 이미지 다운로드 */}
      <button
        onClick={onDownload}
        disabled={downloading}
        id="postcard-share-download"
        className="w-full py-4 rounded-2xl text-sm font-medium flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-60"
        style={{ background: '#F8FAFC', color: '#64748B', border: '1px solid #E2E8F0' }}
      >
        <Download size={15} />
        {downloading ? SHARE_MESSAGES.DOWNLOADING : SHARE_MESSAGES.DOWNLOAD_DEFAULT}
      </button>
    </div>
  );
}
