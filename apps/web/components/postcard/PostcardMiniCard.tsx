'use client';

import React from 'react';
import { getFilterCss, getFontStyle } from '@/constants/postcard';
import type { ExampleCard } from '@/constants/postcard';

interface PostcardMiniCardProps {
  card: ExampleCard;
  width?: number;
}

/**
 * 랜딩 슬라이더용 미니 엽서 카드 컴포넌트
 * - 필터 CSS 실시간 적용
 * - 폰트 스타일 동적 바인딩
 * - 이미지 로딩 실패 시 배경색 폴백 처리
 */
export default function PostcardMiniCard({
  card,
  width = 130,
}: PostcardMiniCardProps) {
  const height = Math.round(width * (4 / 3));
  const imgHeight = Math.round(height * 0.62);

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-md flex-shrink-0 select-none"
      style={{ width, height, backgroundColor: card.bg }}
    >
      <img
        src={card.imageUrl}
        alt="예시 엽서"
        className="w-full object-cover"
        style={{
          height: imgHeight,
          filter: getFilterCss(card.filterType),
        }}
        // 이미지 로드 실패 시 배경색 fallback 유지 (skeleton 대체)
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
      <div className="px-2.5 pt-2.5">
        <p
          className="text-[10px] leading-relaxed whitespace-pre-line text-foreground/70"
          style={getFontStyle(card.fontFamily)}
        >
          {card.text}
        </p>
      </div>
    </div>
  );
}
