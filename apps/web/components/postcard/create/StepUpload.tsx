'use client';

import React, { useRef, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { POSTCARD_FILTERS, getFilterCss } from '@/constants/postcard';
import { usePostcardFormStore } from '@/store/usePostcardFormStore';
import type { PostcardFilterType } from '@/types/postcard';

/** 허용 MIME 타입 및 최대 파일 크기 상수 */
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * Step 1: 사진 업로드 & 필터 선택
 * - 파일 유효성 검사 (JPEG/PNG/WEBP, 최대 5MB)
 * - CSS filter를 통한 실시간 필터 미리보기
 * - 3D 입체 효과 토글 스위치
 */
export default function StepUpload() {
  const { imagePreviewUrl, filterType, effect3d, setImageFile, setFilterType, setEffect3d } =
    usePostcardFormStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // 파일 형식 유효성 검사
      if (!(ALLOWED_TYPES as readonly string[]).includes(file.type)) {
        alert('JPEG, PNG, WEBP 형식의 이미지만 업로드 가능합니다.');
        return;
      }

      // 파일 크기 유효성 검사 (5MB 초과 방지)
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
    <section className="mb-10">
      <h2 className="text-[11px] font-medium tracking-[0.25em] text-muted-foreground mb-4 uppercase">
        Step 1 — 사진 &amp; 효과
      </h2>

      {/* 이미지 업로드 영역 */}
      <div
        className="w-full aspect-[3/4] rounded-2xl overflow-hidden bg-muted cursor-pointer relative group mb-4"
        onClick={() => fileRef.current?.click()}
        role="button"
        aria-label="사진 업로드"
        id="postcard-image-upload-area"
      >
        {imagePreviewUrl ? (
          <img
            src={imagePreviewUrl}
            alt="업로드 이미지"
            className="w-full h-full object-cover"
            style={{ filter: getFilterCss(filterType) }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
            <div className="w-12 h-12 rounded-full bg-background shadow-sm flex items-center justify-center">
              <Upload size={20} style={{ color: '#6C5CE7' }} />
            </div>
            <span className="text-xs">탭해서 사진 올리기</span>
          </div>
        )}
        {/* 호버 오버레이 */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-xs bg-black/50 px-3 py-1 rounded-full">
            사진 변경
          </span>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
        id="postcard-file-input"
      />

      {/* 필터 선택 버튼 */}
      <div className="grid grid-cols-4 gap-1.5 mb-3">
        {POSTCARD_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => handleFilterSelect(f.id)}
            id={`postcard-filter-${f.id}`}
            className={`py-2 rounded-xl text-[11px] font-medium transition-all ${
              filterType === f.id
                ? 'bg-primary text-white shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-secondary'
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>

      {/* 3D 입체 효과 토글 */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-muted">
        <div>
          <span className="text-sm text-foreground">3D 입체 효과</span>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            뷰어에서 마우스를 움직여 보세요
          </p>
        </div>
        <button
          onClick={handleEffect3dToggle}
          id="postcard-3d-toggle"
          aria-label="3D 효과 토글"
          className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
            effect3d ? 'bg-primary' : 'bg-border'
          }`}
        >
          <div
            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
              effect3d ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>
    </section>
  );
}
