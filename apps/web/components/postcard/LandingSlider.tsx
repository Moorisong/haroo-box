'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { EXAMPLE_CARDS } from '@/constants/postcard';
import PostcardMiniCard from './PostcardMiniCard';

/**
 * 랜딩 페이지 예시 엽서 슬라이더
 * - 3초마다 자동 전환 (터치/클릭으로 수동 전환도 가능)
 * - spring 애니메이션으로 카드 전환
 * - 스켈레톤 폴백: 이미지 로드 실패 시 배경색 유지
 */
export default function LandingSlider() {
  const [active, setActive] = useState(0);
  const total = EXAMPLE_CARDS.length;

  // 3초마다 자동 슬라이드 전환
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % total);
    }, 3000);
    return () => clearInterval(timer);
  }, [total]);

  const handleCardClick = useCallback((index: number) => {
    setActive(index);
  }, []);

  return (
    <div className="w-full">
      {/* 카드 슬라이더 영역 */}
      <div className="relative h-[220px] flex items-center justify-center overflow-hidden">
        {EXAMPLE_CARDS.map((card, i) => {
          const offset = i - active;
          // 원형 슬라이더: 오프셋 범위를 [-1, 1]로 정규화
          const norm =
            offset < -1
              ? total + offset
              : offset > 1
              ? offset - total
              : offset;
          const isActive = norm === 0;
          const translateX = norm * 148;
          const scale = isActive ? 1 : 0.8;
          const opacity = Math.abs(norm) > 1 ? 0 : isActive ? 1 : 0.55;
          const zIndex = isActive ? 10 : 1;

          return (
            <div
              key={i}
              className="absolute cursor-pointer"
              style={{
                transform: `translateX(${translateX}px) scale(${scale})`,
                opacity,
                zIndex,
                transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease',
              }}
              onClick={() => handleCardClick(i)}
            >
              <PostcardMiniCard card={card} width={130} />
            </div>
          );
        })}
      </div>

      {/* 페이지네이션 도트 */}
      <div className="flex justify-center gap-1.5 mt-3">
        {EXAMPLE_CARDS.map((_, i) => (
          <button
            key={i}
            onClick={() => handleCardClick(i)}
            aria-label={`예시 엽서 ${i + 1}번`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? 'w-4 bg-primary' : 'w-1.5 bg-muted-foreground/25'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
