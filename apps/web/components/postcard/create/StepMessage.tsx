'use client';

import React, { useCallback } from 'react';
import { POSTCARD_FONTS, POSTCARD_MESSAGE_MAX_LENGTH, getFontStyle } from '@/constants/postcard';
import { usePostcardFormStore } from '@/store/usePostcardFormStore';
import type { PostcardFontFamily } from '@/types/postcard';

/**
 * Step 2: 문구 입력 & 폰트 선택
 * - 최대 150자 제한 (기획 문서 기준) + 실시간 카운팅
 * - 폰트 5종 선택 시 텍스트 영역 폰트 즉시 반영
 * - 텍스트 영역 선택 폰트로 실시간 미리보기
 */
export default function StepMessage() {
  const { message, fontFamily, setMessage, setFontFamily } = usePostcardFormStore();

  const handleMessageChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      // 150자 초과 방지
      const value = e.target.value.slice(0, POSTCARD_MESSAGE_MAX_LENGTH);
      setMessage(value);
    },
    [setMessage]
  );

  const handleFontSelect = useCallback(
    (id: PostcardFontFamily) => setFontFamily(id),
    [setFontFamily]
  );

  const isNearLimit = message.length >= POSTCARD_MESSAGE_MAX_LENGTH - 10;

  return (
    <section className="mb-10">
      <h2 className="text-[11px] font-medium tracking-[0.25em] text-muted-foreground mb-4 uppercase">
        Step 2 — 문구 &amp; 폰트
      </h2>

      {/* 텍스트 입력 영역 (선택된 폰트 실시간 반영) */}
      <textarea
        value={message}
        onChange={handleMessageChange}
        placeholder="마음을 담은 한 줄을 적어보세요"
        maxLength={POSTCARD_MESSAGE_MAX_LENGTH}
        rows={4}
        id="postcard-message-input"
        className="w-full p-4 rounded-xl bg-muted text-sm resize-none outline-none placeholder:text-muted-foreground/40 mb-1 border-0"
        style={getFontStyle(fontFamily)}
      />

      {/* 글자수 카운터 (한계 근접 시 강조) */}
      <div
        className={`text-right text-[10px] mb-3 ${
          isNearLimit ? 'text-rose-400 font-medium' : 'text-muted-foreground'
        }`}
      >
        {message.length} / {POSTCARD_MESSAGE_MAX_LENGTH}
      </div>

      {/* 폰트 선택 버튼 */}
      <div className="flex gap-2 flex-wrap">
        {POSTCARD_FONTS.map((f) => (
          <button
            key={f.id}
            onClick={() => handleFontSelect(f.id)}
            id={`postcard-font-${f.id}`}
            className={`px-3 py-1.5 rounded-lg text-[11px] transition-all ${
              fontFamily === f.id
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground hover:bg-secondary'
            }`}
            style={f.style}
          >
            {f.name}
          </button>
        ))}
      </div>
    </section>
  );
}
