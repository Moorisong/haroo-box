'use client';

import React from 'react';
import { Play, Pause } from 'lucide-react';
import { getYoutubeThumbnailUrl } from '@/constants/postcard';

interface AudioPlayerBarProps {
  youtubeId: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

/**
 * 유튜브 백그라운드 오디오 미니 플레이어 바
 * - 썸네일, 파형 애니메이션, Play/Pause 버튼
 * - 재생 중일 때 파형 애니메이션 활성화
 */
export default function AudioPlayerBar({
  youtubeId,
  isPlaying,
  onTogglePlay,
}: AudioPlayerBarProps) {
  return (
    <div className="mx-5 mb-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-lg flex items-center gap-3">
      {/* 썸네일 */}
      <img
        src={getYoutubeThumbnailUrl(youtubeId)}
        alt="음악"
        className="w-10 h-10 rounded-xl object-cover flex-shrink-0 bg-white/10"
      />

      {/* 파형 애니메이션 */}
      <div className="flex-1 flex items-end gap-[2px] h-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 rounded-full bg-[#A29BFE]"
            style={{
              height: '100%',
              transform: isPlaying ? undefined : 'scaleY(0.25)',
              transformOrigin: 'bottom',
              animation: isPlaying
                ? `waveBar ${0.4 + (i % 5) * 0.08}s ${(i * 0.04) % 0.4}s ease-in-out infinite alternate`
                : 'none',
              transition: 'transform 0.3s ease',
            }}
          />
        ))}
      </div>

      {/* Play / Pause 버튼 */}
      <button
        onClick={onTogglePlay}
        aria-label={isPlaying ? '일시정지' : '재생'}
        className="w-8 h-8 rounded-full bg-[#6C5CE7] flex items-center justify-center flex-shrink-0 shadow-md transition-transform active:scale-90"
        id="postcard-audio-toggle"
      >
        {isPlaying ? (
          <Pause size={13} className="text-white" />
        ) : (
          <Play size={13} className="text-white ml-0.5" />
        )}
      </button>

      <style>{`
        @keyframes waveBar {
          from { transform: scaleY(0.3); }
          to { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
