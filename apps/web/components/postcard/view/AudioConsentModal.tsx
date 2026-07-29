'use client';

import React from 'react';
import { Music } from 'lucide-react';
import { getYoutubeThumbnailUrl } from '@/constants/postcard';

interface AudioConsentModalProps {
  youtubeId: string | null;
  onWithMusic: () => void;
  onWithoutMusic: () => void;
}

/**
 * 오디오 권한 승인 모달
 * - 모바일 브라우저 자동재생 정책 우회를 위한 사용자 제스처 유도
 * - 기획 문서 기준: 🎧 음악과 함께 / 🤫 조용히 볼래요
 * - 하단 시트 형태 (bottom sheet) 애니메이션
 */
export default function AudioConsentModal({
  youtubeId,
  onWithMusic,
  onWithoutMusic,
}: AudioConsentModalProps) {
  return (
    <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-md flex items-end justify-center">
      <div
        className="w-full max-w-[390px] bg-[#1E202B] border-t border-white/15 rounded-t-3xl px-6 pt-5 pb-10 shadow-2xl"
        style={{ animation: 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) both' }}
      >
        {/* 드래그 핸들 */}
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />

        {/* 음악 썸네일 또는 빈 영역 */}
        {youtubeId ? (
          <div className="relative rounded-2xl overflow-hidden mb-6 border border-white/10 shadow-lg">
            <img
              src={getYoutubeThumbnailUrl(youtubeId)}
              alt="음악 썸네일"
              className="w-full h-36 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2 text-white/90 text-xs">
              <Music size={14} className="text-[#A29BFE]" />
              <span className="truncate">배경음악이 포함되어 있습니다</span>
            </div>
          </div>
        ) : (
          <div className="w-full h-24 rounded-2xl bg-white/5 border border-white/10 mb-6 flex items-center justify-center">
            <Music size={28} className="text-white/30" />
          </div>
        )}

        <p
          className="text-lg text-white font-medium text-center leading-relaxed mb-6 tracking-wide"
          style={{ fontFamily: "'Nanum Gothic', sans-serif" }}
        >
          상대방이 음악과 함께
          <br />
          엽서를 보냈습니다 🌸
        </p>

        <div className="flex flex-col gap-3">
          {/* 음악과 함께 열기 */}
          <button
            onClick={onWithMusic}
            id="postcard-view-with-music"
            className="w-full py-4 rounded-2xl text-sm font-semibold text-white shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #7C5CE7 0%, #6C5CE7 50%, #5A4AD1 100%)',
              boxShadow: '0 8px 20px -4px rgba(108, 92, 231, 0.5)',
            }}
          >
            🎧 음악과 함께 엽서 열기
          </button>

          {/* 조용히 보기 */}
          <button
            onClick={onWithoutMusic}
            id="postcard-view-without-music"
            className="w-full py-3.5 rounded-2xl text-sm font-medium text-white/70 bg-white/8 border border-white/10 hover:bg-white/12 transition-transform active:scale-[0.98]"
          >
            🤫 조용히 엽서만 볼래요
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(60px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
