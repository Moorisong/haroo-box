'use client';

import React from 'react';
import Link from 'next/link';

/**
 * 만료된 엽서 안내 컴포넌트
 * - 빈티지 티켓 모티브 디자인
 * - 기획 문서 기준 안내 문구 적용
 */
export default function ExpiredCard() {
  return (
    <div className="min-h-screen bg-[#1a1410] flex items-center justify-center px-6">
      <div className="w-full max-w-[320px]">
        {/* 티켓 모양 카드 */}
        <div
          className="relative rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: '#F9EFE0' }}
        >
          {/* 상단 스탬프 느낌 */}
          <div
            className="absolute top-4 right-4 w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center opacity-30"
            style={{ borderColor: '#8B4513' }}
          >
            <span className="text-xs font-bold" style={{ color: '#8B4513', transform: 'rotate(-15deg)' }}>
              EXPIRED
            </span>
          </div>

          <div className="px-6 pt-8 pb-6">
            <div
              className="text-4xl mb-4 text-center"
              style={{ fontFamily: "'Gowun Batang', serif" }}
            >
              🎫
            </div>
            <h1
              className="text-base leading-[1.8] text-center mb-6"
              style={{ fontFamily: "'Gowun Batang', serif", color: '#5C3317' }}
            >
              앗, 유효기간(3일)이 지나
              <br />
              추억 속으로 사라진 엽서입니다.
            </h1>

            {/* 점선 구분선 (티켓 분리선) */}
            <div className="flex items-center gap-2 my-4">
              <div className="flex-1 border-t border-dashed" style={{ borderColor: '#C8A882' }} />
              <span className="text-[10px]" style={{ color: '#C8A882' }}>✦</span>
              <div className="flex-1 border-t border-dashed" style={{ borderColor: '#C8A882' }} />
            </div>

            <p
              className="text-[11px] text-center mb-6"
              style={{ color: '#A07850', fontFamily: "'Gowun Batang', serif" }}
            >
              하루엽서는 3일간만 열람 가능합니다
            </p>

            <Link
              href="/postcard"
              className="block w-full py-3.5 rounded-xl text-sm font-medium text-white text-center transition-opacity hover:opacity-90"
              style={{
                background: 'linear-gradient(135deg, #BF8B6E 0%, #D4956B 60%, #C78B79 100%)',
              }}
              id="postcard-expired-cta"
            >
              나도 하루엽서 만들러 가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
