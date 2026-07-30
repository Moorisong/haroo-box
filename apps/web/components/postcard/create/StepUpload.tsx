'use client';

import React, { useRef, useCallback } from 'react';
import { POSTCARD_FILTERS, getFilterCss } from '@/constants/postcard';
import { usePostcardFormStore } from '@/store/usePostcardFormStore';
import type { PostcardFilterType } from '@/types/postcard';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * Step 1: 사진 업로드 & 필터 선택 (명확한 구분선 반영)
 */
export default function StepUpload() {
  const { imagePreviewUrl, filterType, effect3d, setImageFile, setFilterType, setEffect3d } =
    usePostcardFormStore();
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

  const handleEffect3dToggle = useCallback(
    () => setEffect3d(!effect3d),
    [effect3d, setEffect3d]
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
        className="w-full h-32 rounded-xl border border-dashed border-border/80 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer relative group flex flex-col items-center justify-center overflow-hidden"
        onClick={() => fileRef.current?.click()}
        role="button"
        aria-label="사진 업로드"
        id="postcard-image-upload-area"
      >
        {imagePreviewUrl ? (
          <div className="w-full h-full relative">
            <img
              src={imagePreviewUrl}
              alt="업로드 이미지"
              className="w-full h-full object-cover"
              style={{ filter: getFilterCss(filterType) }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
              사진 변경하기
            </div>
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

      {/* 필터 선택 영역 */}
      <div>
        <label className="text-xs font-semibold text-foreground block mb-2">
          필터 선택
        </label>
        <div className="grid grid-cols-4 gap-2">
          {POSTCARD_FILTERS.map((f) => {
            const isSelected = filterType === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => handleFilterSelect(f.id)}
                id={`postcard-filter-${f.id}`}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all text-center border flex items-center justify-center cursor-pointer select-none ${
                  isSelected
                    ? '!bg-blue-500/10 !text-blue-600 border-blue-500 shadow-xs scale-[1.02]'
                    : 'bg-muted/30 text-muted-foreground border-border/80 hover:bg-muted/70 hover:text-foreground hover:border-border'
                }`}
              >
                <span>{f.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3D 입체 효과 토글 */}
      <div
        onClick={handleEffect3dToggle}
        className="flex items-center justify-between p-3.5 rounded-xl bg-muted/20 border border-border/70 hover:bg-muted/40 transition-all cursor-pointer select-none"
      >
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground block">
              3D 입체 카드 효과
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                effect3d ? 'bg-blue-500/15 text-blue-600 font-bold' : 'bg-muted-foreground/15 text-muted-foreground'
              }`}
            >
              {effect3d ? '켜짐' : '꺼짐'}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground block">
            마우스/터치 반응 입체 포커스 효과 적용
          </span>
        </div>
        <button
          type="button"
          id="postcard-3d-toggle"
          aria-label="3D 효과 토글"
          className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 cursor-pointer ${
            effect3d ? 'bg-blue-500' : 'bg-muted-foreground/30'
          }`}
        >
          <div
            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
              effect3d ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>
    </section>
  );
}
