'use client';

import React, { useCallback } from 'react';
import { X } from 'lucide-react';
import { extractYoutubeId, getYoutubeThumbnailUrl } from '@/constants/postcard';
import { usePostcardFormStore } from '@/store/usePostcardFormStore';

const YOUTUBE_LINK_PATTERN = /(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/;

/**
 * Step 3: BGM 등록 (명확한 구분선 반영)
 */
export default function StepMusic() {
  const { youtubeUrl, youtubeId, setYoutubeUrl } = usePostcardFormStore();

  const isInvalidUrl =
    youtubeUrl.trim().length > 0 && !YOUTUBE_LINK_PATTERN.test(youtubeUrl);

  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const url = e.target.value;
      const id = url.trim().length > 0 ? extractYoutubeId(url) : null;
      setYoutubeUrl(url, id);
    },
    [setYoutubeUrl]
  );

  const handleClear = useCallback(() => {
    setYoutubeUrl('', null);
  }, [setYoutubeUrl]);

  return (
    <section
      className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4"
      style={{ fontFamily: "'Nanum Gothic', sans-serif" }}
    >
      {/* Step 헤더 */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
          3
        </div>
        <h2 className="text-sm font-bold text-foreground">
          배경음악 선택 <span className="text-[11px] font-normal text-muted-foreground">(선택)</span>
        </h2>
      </div>

      {/* 유튜브 링크 입력창 */}
      <div>
        <input
          type="text"
          value={youtubeUrl}
          onChange={handleUrlChange}
          placeholder="https://youtu.be/... (유튜브 동영상 링크)"
          id="postcard-bgm-input"
          className={`w-full px-4 py-3 rounded-xl bg-muted/20 text-sm outline-none border transition-colors placeholder:text-muted-foreground/50 ${
            isInvalidUrl
              ? 'border-rose-400 focus:border-rose-500'
              : 'border-border focus:border-primary'
          }`}
        />

        {isInvalidUrl && (
          <p className="text-[11px] text-rose-500 mt-1.5 px-1 font-medium">
            올바른 YouTube URL 링크 형식으로 입력해 주세요.
          </p>
        )}
      </div>

      {/* 썸네일 미리보기 카드 */}
      {youtubeId && (
        <div className="flex gap-3 p-3 rounded-xl bg-muted/30 border border-border/60 items-center">
          <img
            src={getYoutubeThumbnailUrl(youtubeId)}
            alt="BGM 썸네일"
            className="w-16 h-12 rounded-lg object-cover flex-shrink-0 bg-black/10 border border-black/5"
          />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-foreground">연동된 배경음악</div>
            <div className="text-[10px] text-muted-foreground mt-0.5 truncate">
              {youtubeUrl}
            </div>
          </div>
          <button
            onClick={handleClear}
            aria-label="음악 제거"
            className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={15} />
          </button>
        </div>
      )}
    </section>
  );
}
