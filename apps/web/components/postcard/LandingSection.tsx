'use client';

import React from 'react';
import Link from 'next/link';
import LandingSlider from './LandingSlider';

/**
 * 하루엽서 랜딩 섹션 컴포넌트
 * - 캐치프레이즈 및 예시 엽서 슬라이더
 * - 하단 고정 CTA 버튼 → /postcard/create 이동
 * - 모바일 퍼스트 (max-w-[390px] 기준)
 */
export default function LandingSection() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero 영역 */}
      <div
        className="flex-1 flex flex-col items-center pt-24 pb-36 px-6"
        style={{
          animation: 'fadeInUp 0.9s ease both',
        }}
      >
        {/* 타이틀 및 캐치프레이즈 */}
        <div
          className="text-center mb-12"
          style={{ animation: 'fadeInUp 0.9s ease both' }}
        >
          <div
            className="text-6xl mb-2 leading-none"
            style={{
              fontFamily: "'Gowun Batang', serif",
              color: 'var(--color-primary, #6C5CE7)',
            }}
          >
            하루엽서
          </div>
          <div className="text-[10px] tracking-[0.4em] text-muted-foreground mb-10 uppercase">
            Haru Yeopseo
          </div>
          <p
            className="text-[15px] leading-[1.9] text-foreground/75 max-w-[220px] mx-auto"
            style={{ fontFamily: "'Gowun Batang', serif" }}
          >
            당신의 하루에 어울리는
            <br />
            온도를 전해보세요
          </p>
        </div>

        {/* 예시 엽서 슬라이더 */}
        <div
          className="w-full mb-8"
          style={{ animation: 'fadeInUp 0.8s 0.25s ease both' }}
        >
          <LandingSlider />
        </div>

        {/* TTL 안내 문구 */}
        <p
          className="text-xs text-muted-foreground text-center"
          style={{ animation: 'fadeIn 1s 0.55s ease both' }}
        >
          생성된 엽서는{' '}
          <span className="text-primary font-medium">2일 뒤</span> 자동으로 사라집니다
        </p>
      </div>

      {/* 하단 고정 CTA 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto px-5 py-5 bg-background/80 backdrop-blur-md">
        <Link
          href="/postcard/create"
          className="block w-full py-4 rounded-2xl text-sm font-medium tracking-wide text-white shadow-lg text-center transition-transform active:scale-[0.97] hover:scale-[1.01]"
          style={{
            background: 'linear-gradient(135deg, #BF8B6E 0%, #D4956B 60%, #C78B79 100%)',
          }}
          id="postcard-landing-cta"
        >
          💌 나만의 하루엽서 만들기
        </Link>
      </div>

      {/* 페이드인 애니메이션 키프레임 */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
