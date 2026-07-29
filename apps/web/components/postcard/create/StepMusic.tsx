'use client';

import React, { useCallback } from 'react';
import { Music, X } from 'lucide-react';
import { extractYoutubeId, getYoutubeThumbnailUrl } from '@/constants/postcard';
import { usePostcardFormStore } from '@/store/usePostcardFormStore';

/** 유튜브 링크 유효성 패턴 */
const YOUTUBE_LINK_PATTERN = /(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/;

/**
 * Step 3: BGM 등록 (선택)
 * - 유튜브 공유 링크 정규식 파싱 후 youtube_id 추출
 * - 올바른 링크 입력 시 썸네일 카드 즉시 렌더링
 * - 잘못된 형식의 링크 입력 시 에러 메시지 노출
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
    <section className="mb-10">
      <h2 className="text-[11px] font-medium tracking-[0.25em] text-muted-foreground mb-4 uppercase">
        Step 3 — 배경음악 (선택)
      </h2>

      {/* 유튜브 링크 입력 */}
      <div className="relative mb-1">
        <Music
          size={15}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          value={youtubeUrl}
          onChange={handleUrlChange}
          placeholder="YouTube 링크를 붙여넣어 주세요"
          id="postcard-bgm-input"
          className={`w-full pl-10 pr-4 py-3.5 rounded-xl bg-muted text-sm outline-none border-0 placeholder:text-muted-foreground/40 ${
            isInvalidUrl ? 'ring-1 ring-rose-400' : ''
          }`}
        />
      </div>

      {/* 잘못된 유튜브 링크 에러 메시지 */}
      {isInvalidUrl && (
        <p className="text-[11px] text-rose-400 mb-3 px-1">
          유효한 YouTube 링크를 입력해 주세요.
        </p>
      )}

      {/* 썸네일 미리보기 카드 (유효한 ID가 추출된 경우) */}
      {youtubeId && (
        <div
          className="flex gap-3 p-3 rounded-xl bg-card border border-border items-center mt-3"
          style={{ animation: 'fadeInUp 0.3s ease both' }}
        >
          <img
            src={getYoutubeThumbnailUrl(youtubeId)}
            alt="BGM 썸네일"
            className="w-16 h-11 rounded-lg object-cover flex-shrink-0 bg-muted"
          />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-foreground">선택된 음악</div>
            <div className="text-[10px] text-muted-foreground mt-0.5 truncate">
              {youtubeUrl}
            </div>
          </div>
          <button
            onClick={handleClear}
            aria-label="음악 제거"
            className="p-1.5 rounded-full hover:bg-muted transition-colors"
          >
            <X size={13} className="text-muted-foreground" />
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
