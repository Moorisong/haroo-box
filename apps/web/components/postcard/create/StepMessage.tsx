'use client';

import React, { useCallback } from 'react';
import { POSTCARD_FONTS, POSTCARD_MESSAGE_MAX_LENGTH, getFontStyle } from '@/constants/postcard';
import { usePostcardFormStore } from '@/store/usePostcardFormStore';
import type { PostcardFontFamily } from '@/types/postcard';

/**
 * Step 2: 문구 입력 & 폰트 선택 (명확한 구분선 반영)
 */
export default function StepMessage() {
  const { message, fontFamily, setMessage, setFontFamily } = usePostcardFormStore();

  const handleMessageChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
    <section
      className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4"
      style={{ fontFamily: "'Nanum Gothic', sans-serif" }}
    >
      {/* Step 헤더 */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
          2
        </div>
        <h2 className="text-sm font-bold text-foreground">문구 및 서체</h2>
      </div>

      {/* 텍스트 입력 영역 */}
      <div>
        <div className="relative">
          <textarea
            value={message}
            onChange={handleMessageChange}
            placeholder="마음을 담은 한 줄을 적어보세요"
            maxLength={POSTCARD_MESSAGE_MAX_LENGTH}
            rows={4}
            id="postcard-message-input"
            className="w-full p-3.5 rounded-xl bg-muted/20 text-sm resize-none outline-none border border-border focus:border-primary transition-colors placeholder:text-muted-foreground/50"
            style={getFontStyle(fontFamily)}
          />
          <div
            className={`text-right text-[11px] mt-1 font-medium ${
              isNearLimit ? 'text-rose-500' : 'text-muted-foreground'
            }`}
          >
            {message.length} / {POSTCARD_MESSAGE_MAX_LENGTH}자
          </div>
        </div>
      </div>

      {/* 폰트 선택 영역 */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-foreground block">
          서체 선택
        </label>

        {/* 고딕 계열 4종 */}
        <div>
          <span className="text-[11px] font-medium text-muted-foreground block mb-1.5">
            고딕 계열
          </span>
          <div className="grid grid-cols-4 gap-2">
            {POSTCARD_FONTS.slice(0, 4).map((f) => {
              const isSelected = fontFamily === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => handleFontSelect(f.id)}
                  id={`postcard-font-${f.id}`}
                  className={`py-2 px-1.5 rounded-xl text-xs transition-all border text-center cursor-pointer select-none truncate ${
                    isSelected
                      ? '!bg-blue-500/10 !text-blue-600 border-blue-500 font-bold shadow-xs scale-[1.02]'
                      : 'bg-muted/30 text-muted-foreground border-border/80 hover:bg-muted/70 hover:text-foreground'
                  }`}
                  style={f.style}
                >
                  {f.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* 명조 계열 4종 */}
        <div>
          <span className="text-[11px] font-medium text-muted-foreground block mb-1.5">
            명조 계열
          </span>
          <div className="grid grid-cols-4 gap-2">
            {POSTCARD_FONTS.slice(4, 8).map((f) => {
              const isSelected = fontFamily === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => handleFontSelect(f.id)}
                  id={`postcard-font-${f.id}`}
                  className={`py-2 px-1.5 rounded-xl text-xs transition-all border text-center cursor-pointer select-none truncate ${
                    isSelected
                      ? '!bg-blue-500/10 !text-blue-600 border-blue-500 font-bold shadow-xs scale-[1.02]'
                      : 'bg-muted/30 text-muted-foreground border-border/80 hover:bg-muted/70 hover:text-foreground'
                  }`}
                  style={f.style}
                >
                  {f.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
