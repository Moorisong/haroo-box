'use client';

import React, { useRef, useCallback } from 'react';
import { POSTCARD_FILTERS, getFilterCss } from '@/constants/postcard';
import { usePostcardFormStore } from '@/store/usePostcardFormStore';
import type { PostcardFilterType } from '@/types/postcard';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * Step 1: 사진 업로드 & 필터 선택
 */
export default function StepUpload() {
  const {
    imagePreviewUrl,
    imageOffsetY,
    filterType,
    filterIntensity,
    setImageFile,
    setImageOffsetY,
    setFilterType,
    setFilterIntensity,
  } = usePostcardFormStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!(ALLOWED_TYPES as readonly string[]).includes(file.type)) {
        alert('JPEG, PNG, WEBP 형식의 이미지만 업로드 가능합니다.');
        return;
      }

      if (file.size > MAX_SIZE_BYTES) {
        alert('파일 크기는 5MB 이하만 가능합니다.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        const previewUrl = ev.target?.result as string;
        setImageFile(file, previewUrl);
      };
      reader.readAsDataURL(file);
    },
    [setImageFile]
  );

  const handleFilterSelect = useCallback(
    (id: PostcardFilterType) => setFilterType(id),
    [setFilterType]
  );

  return (
    <section
      className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4"
      style={{ fontFamily: "'Nanum Gothic', sans-serif" }}
    >
      {/* Step 헤더 */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
          1
        </div>
        <h2 className="text-sm font-bold text-foreground">사진 및 필터 효과</h2>
      </div>

      {/* 사진 업로드 박스 */}
      <div
        className={`w-full py-4 rounded-xl border border-dashed transition-all cursor-pointer relative group flex flex-col items-center justify-center overflow-hidden ${
          imagePreviewUrl
            ? 'border-blue-500/50 bg-blue-500/5 hover:bg-blue-500/10'
            : 'border-border/80 bg-muted/20 hover:bg-muted/40'
        }`}
        onClick={() => fileRef.current?.click()}
        role="button"
        aria-label="사진 업로드"
        id="postcard-image-upload-area"
      >
        {imagePreviewUrl ? (
          <div className="flex flex-col items-center justify-center gap-1.5 p-3 text-center">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>사진 업로드 완료</span>
            </div>
            <span className="text-[11px] text-muted-foreground underline decoration-muted-foreground/40 underline-offset-2 group-hover:text-foreground">
              다른 사진으로 변경하기
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-1 text-muted-foreground p-4 text-center">
            <span className="text-xs font-medium text-foreground">
              클릭하여 사진 업로드
            </span>
            <span className="text-[10px] text-muted-foreground">
              JPG, PNG, WEBP (최대 5MB)
            </span>
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
        id="postcard-file-input"
      />

      {/* 필터 선택 영역 (8종 필터 + 강도 조절 프로그레스 바) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-foreground block">
            필터 선택
          </label>
          {filterType !== 'none' && (
            <span className="text-[11px] text-blue-600 font-bold">
              강도: {filterIntensity}%
            </span>
          )}
        </div>

        {/* 8종 필터 그리드 */}
        <div className="grid grid-cols-4 gap-2">
          {POSTCARD_FILTERS.map((f) => {
            const isSelected = filterType === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => handleFilterSelect(f.id)}
                id={`postcard-filter-${f.id}`}
                className={`py-2 px-1.5 rounded-xl text-xs font-bold transition-all text-center border flex items-center justify-center cursor-pointer select-none truncate ${
                  isSelected
                    ? '!bg-blue-500/10 !text-blue-600 border-blue-500 shadow-xs scale-[1.02]'
                    : 'bg-muted/30 text-muted-foreground border-border/80 hover:bg-muted/70 hover:text-foreground'
                }`}
              >
                <span>{f.name}</span>
              </button>
            );
          })}
        </div>

        {/* 필터 강도 조절 프로그레스 바 슬라이더 (필터가 선택된 경우 표시) */}
        {filterType !== 'none' && (
          <div className="p-3 rounded-xl bg-muted/20 border border-border/60 space-y-1.5 animate-fadeIn">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">필터 적용 강도</span>
              <span className="text-[11px] font-bold text-blue-600">{filterIntensity}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={filterIntensity}
              onChange={(e) => setFilterIntensity(Number(e.target.value))}
              className="w-full h-1.5 bg-muted-foreground/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>은은하게 (0%)</span>
              <span>선명하게 (100%)</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
