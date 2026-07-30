'use client';

import React, { useState } from 'react';
import { POSTCARD_FILTERS, getFilterCss, getFontStyle } from '@/constants/postcard';
import { usePostcardFormStore } from '@/store/usePostcardFormStore';

/**
 * 실시간 엽서 커스텀 프리뷰 컴포넌트
 */
export default function PostcardPreview() {
  const { imagePreviewUrl, filterType, fontFamily, message, youtubeId, effect3d } =
    usePostcardFormStore();

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!effect3d) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x: x * 14, y: -y * 14 });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
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
        className="w-full max-w-[340px] aspect-[3/4] rounded-2xl p-4 bg-card border border-border/80 shadow-xs transition-transform duration-200 ease-out flex flex-col justify-between relative overflow-hidden select-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: effect3d
            ? `perspective(1000px) rotateX(${mousePos.y}deg) rotateY(${mousePos.x}deg)`
            : 'none',
          fontFamily: "'Nanum Gothic', sans-serif",
        }}
      >
        {/* 상단: 이미지 영역 */}
        <div className="w-full h-[62%] rounded-xl overflow-hidden bg-muted relative border border-dashed border-border/60">
          {imagePreviewUrl ? (
            <img
              src={imagePreviewUrl}
              alt="엽서 이미지 미리보기"
              className="w-full h-full object-cover transition-all duration-300"
              style={{ filter: getFilterCss(filterType) }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/60 p-4 text-center bg-muted/30">
              <p className="text-xs font-medium">사진을 업로드하면</p>
              <p className="text-[11px] opacity-75 mt-0.5">엽서가 완성됩니다</p>
            </div>
          )}

          {/* BGM 등록 시 상단 뱃지 표시 */}
          {youtubeId && (
            <div className="absolute top-2.5 right-2.5 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">
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
