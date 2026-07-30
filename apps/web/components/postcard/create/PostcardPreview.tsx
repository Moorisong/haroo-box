'use client';

import React, { useState } from 'react';
import { POSTCARD_FILTERS, getFilterCss, getFontStyle } from '@/constants/postcard';
import { usePostcardFormStore } from '@/store/usePostcardFormStore';
import PostcardEffectOverlay from './PostcardEffectOverlay';

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
  } = usePostcardFormStore();

  const [isDragging, setIsDragging] = useState(false);
  const startYRef = React.useRef<number>(0);
  const startOffsetYRef = React.useRef<number>(50);
  const imgContainerRef = React.useRef<HTMLDivElement>(null);

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
    startYRef.current = getClientY(e);
    startOffsetYRef.current = imageOffsetY;
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !imgContainerRef.current) return;
    e.stopPropagation();

    const currentY = getClientY(e);
    const diffY = currentY - startYRef.current;
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
        className="w-full max-w-[340px] aspect-[3/4] rounded-2xl p-4 bg-card border border-border/80 shadow-xs flex flex-col justify-between relative overflow-hidden select-none"
        style={{
          fontFamily: "'Nanum Gothic', sans-serif",
        }}
      >
        {/* 상단: 이미지 영역 (드래그로 위아래 위치 조절 가능) */}
        <div
          ref={imgContainerRef}
          className={`w-full h-[62%] rounded-xl overflow-hidden bg-muted relative border border-dashed border-border/60 ${
            imagePreviewUrl ? 'cursor-grab active:cursor-grabbing' : ''
          }`}
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
              <div className="absolute inset-x-0 bottom-2 flex justify-center opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                <span className="bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
                  ↕ 위아래로 드래그해서 위치 맞추기
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/60 p-4 text-center bg-muted/30">
              <p className="text-xs font-medium">사진을 업로드하면</p>
              <p className="text-[11px] opacity-75 mt-0.5">엽서가 완성됩니다</p>
            </div>
          )}

          {/* BGM 등록 시 상단 뱃지 표시 */}
          {youtubeId && (
            <div className="absolute top-2.5 right-2.5 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded pointer-events-none">
              BGM 포함
            </div>
          )}
        </div>

        {/* 하단: 메시지 본문 영역 */}
        <div className="w-full h-[35%] pt-3 flex flex-col justify-between">
          <div className="overflow-y-auto max-h-[85px] pr-1 scrollbar-thin">
            <p
              className="text-sm leading-relaxed text-foreground whitespace-pre-wrap break-words"
              style={getFontStyle(fontFamily)}
            >
              {message.trim() || '마음을 담은 한 줄을 적어보세요'}
            </p>
          </div>

          <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground">
            <span className="tracking-widest font-medium">HAROO POSTCARD</span>
            <span>2일간 유효</span>
          </div>
        </div>
      </div>
    </div>
  );
}
