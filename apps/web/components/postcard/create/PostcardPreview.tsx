'use client';

import React, { useState, useRef, useCallback } from 'react';
import { POSTCARD_FILTERS, getFilterCss, getFontStyle, POSTCARD_MESSAGE_MAX_LENGTH } from '@/constants/postcard';
import { usePostcardFormStore } from '@/store/usePostcardFormStore';
import PostcardEffectOverlay from './PostcardEffectOverlay';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
const MAX_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

/**
 * 실시간 엽서 커스텀 프리뷰 컴포넌트
 */
export default function PostcardPreview() {
  const {
    imagePreviewUrl,
    imageOffsetY,
    filterType,
    filterIntensity,
    effectType,
    fontFamily,
    message,
    youtubeId,
    setImageOffsetY,
    setImageFile,
    setMessage,
  } = usePostcardFormStore();

  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef<number>(0);
  const startOffsetYRef = useRef<number>(50);
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const isActualDraggingRef = useRef<boolean>(false);
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
        alert('파일 크기는 20MB 이하만 가능합니다.');
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

  // ── 드래그 상하 위치 조절 핸들러 ──
  const getClientY = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e && e.touches.length > 0) {
      return e.touches[0].clientY;
    }
    return (e as React.MouseEvent).clientY;
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!imagePreviewUrl) return;
    e.stopPropagation();
    setIsDragging(true);
    isActualDraggingRef.current = false;
    startYRef.current = getClientY(e);
    startOffsetYRef.current = imageOffsetY;
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !imgContainerRef.current) return;
    e.stopPropagation();

    const currentY = getClientY(e);
    const diffY = currentY - startYRef.current;
    
    if (Math.abs(diffY) > 5) {
      isActualDraggingRef.current = true;
    }

    const containerHeight = imgContainerRef.current.clientHeight || 200;

    // Y축 이동 비율(%) 계산 (위로 드래그하면 offset이 감소, 아래로 드래그하면 offset 증가)
    const deltaPercent = (diffY / containerHeight) * 100;
    let newOffsetY = startOffsetYRef.current - deltaPercent;
    newOffsetY = Math.max(0, Math.min(100, newOffsetY));

    setImageOffsetY(Math.round(newOffsetY));
  };

  const handleDragEnd = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const handleImageContainerClick = () => {
    if (!isActualDraggingRef.current) {
      fileRef.current?.click();
    }
  };

  const selectedFilterName =
    POSTCARD_FILTERS.find((f) => f.id === filterType)?.name ?? '기본';

  return (
    <div className="w-full flex flex-col items-center">
      {/* 서브 타이틀 헤더 */}
      <div className="w-full flex items-center justify-between mb-3 px-1 pb-2">
        <span className="text-xs font-bold text-foreground">실시간 미리보기</span>
        <span className="text-[11px] text-muted-foreground bg-muted px-2.5 py-0.5 rounded-md border border-border/40">
          {selectedFilterName} 필터
        </span>
      </div>

      {/* 엽서 카드 메인 프레임 */}
      <div
        className="w-full max-w-[340px] min-h-[453px] rounded-2xl p-4 bg-[#F4F4F5] border border-[#E4E4E7] shadow-xs flex flex-col justify-between relative overflow-hidden select-none"
        style={{
          fontFamily: "'Nanum Gothic', sans-serif",
        }}
      >
        {/* 상단: 이미지 영역 (드래그로 위아래 위치 조절 가능) */}
        <div
          ref={imgContainerRef}
          className={`w-full aspect-[4/3] shrink-0 rounded-xl overflow-hidden bg-[#E4E4E7] relative border border-dashed border-[#D4D4D8] cursor-pointer ${
            imagePreviewUrl && isDragging ? 'active:cursor-grabbing' : ''
          }`}
          onClick={handleImageContainerClick}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          {imagePreviewUrl ? (
            <div className="w-full h-full relative group overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreviewUrl}
                alt="엽서 이미지 미리보기"
                className="w-full h-full object-cover select-none pointer-events-none"
                style={{
                  filter: getFilterCss(filterType, filterIntensity),
                  objectPosition: `center ${imageOffsetY}%`,
                }}
              />
              {/* 은은한 8종 감성 이펙트 레이어 */}
              <PostcardEffectOverlay effectType={effectType} />
              <div className="absolute inset-x-0 bottom-2 flex justify-center opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none z-20 gap-1.5 flex-col items-center">
                <span className="bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
                  ↕ 위아래로 드래그해서 위치 맞추기
                </span>
                <span className="bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
                  클릭해서 사진 변경하기
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/60 p-4 text-center bg-muted/30">
              <svg className="w-6 h-6 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs font-bold text-foreground">사진을 업로드해주세요</p>
              <p className="text-[10px] mt-1">클릭하여 이미지 선택 (최대 20MB)</p>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
            id="postcard-file-input"
          />

          {/* BGM 등록 시 상단 뱃지 표시 */}
          {youtubeId && (
            <div className="absolute top-2.5 right-2.5 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded pointer-events-none">
              BGM 포함
            </div>
          )}
        </div>

        {/* 하단: 메시지 본문 영역 */}
        <div className="w-full flex-1 pt-5 pb-1 flex flex-col justify-between">
          <div className="pr-1 pb-4 flex-1 flex flex-col">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, POSTCARD_MESSAGE_MAX_LENGTH))}
              placeholder="마음을 담은 한 줄을 적어보세요"
              maxLength={POSTCARD_MESSAGE_MAX_LENGTH}
              className="w-full flex-1 text-sm leading-[1.85] text-[#27272A] whitespace-pre-wrap break-words bg-transparent outline-none resize-none placeholder:text-muted-foreground/40"
              style={{
                ...getFontStyle(fontFamily),
                minHeight: '120px',
              }}
            />
            <div className="text-right text-[10px] mt-1 text-[#A1A1AA]">
              {message.length} / {POSTCARD_MESSAGE_MAX_LENGTH}
            </div>
          </div>

          <div className="pt-2 mt-auto border-t border-[#E4E4E7] flex items-center justify-between text-[10px] text-[#A1A1AA]">
            <span className="tracking-widest font-medium">HAROO POSTCARD</span>
            <span>2일간 유효</span>
          </div>
        </div>
      </div>
    </div>
  );
}
