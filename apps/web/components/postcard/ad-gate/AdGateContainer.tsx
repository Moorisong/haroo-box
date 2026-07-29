'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { AD_GATE_COUNTDOWN_SEC } from '@/constants/postcard';

/** 카카오 애드핏 유닛 ID (환경변수로 관리) */
const ADFIT_UNIT_ID = process.env.NEXT_PUBLIC_ADFIT_UNIT_ID ?? '';

interface AdGateContainerProps {
  postcardId: string;
}

/**
 * 광고 브릿지 컨테이너
 * - 최소 3초(기획 문서 기준) 대기 타이머 + CTA 비활성화
 * - 카카오 애드핏 스크립트 비동기 로드
 * - 광고 블로커 환경에서도 타이머 만료 후 CTA 정상 활성화
 */
export default function AdGateContainer({ postcardId }: AdGateContainerProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(AD_GATE_COUNTDOWN_SEC);

  // 1초씩 카운트다운
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleContinue = useCallback(() => {
    router.push(`/postcard/share/${postcardId}`);
  }, [router, postcardId]);

  const isReady = countdown <= 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 카카오 애드핏 스크립트 비동기 주입 */}
      {ADFIT_UNIT_ID && (
        <Script
          src="//t1.daumcdn.net/kas/static/ba.min.js"
          strategy="lazyOnload"
        />
      )}

      {/* 헤더 */}
      <div className="fixed top-0 left-0 right-0 z-40 max-w-[390px] mx-auto">
        <div className="h-14 flex items-center justify-center px-5 bg-background/90 backdrop-blur-md border-b border-border">
          <span
            className="text-sm tracking-[0.2em]"
            style={{ fontFamily: "'Gowun Batang', serif", color: '#6C5CE7' }}
          >
            하루엽서
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5 pt-14 gap-6">
        {/* 안내 메시지 */}
        <div
          className="text-center"
          style={{ animation: 'fadeInUp 0.7s ease both' }}
        >
          <div
            className="text-3xl mb-4"
            style={{ fontFamily: "'Gowun Batang', serif" }}
          >
            ✉️
          </div>
          <p
            className="text-sm leading-[1.9] text-muted-foreground"
            style={{ fontFamily: "'Gowun Batang', serif" }}
          >
            잠시만요! 소중한 엽서를 꺼내어 담는 동안,
            <br />
            작은 여유의 광고를 만나보세요.
          </p>
        </div>

        {/* 광고 영역 카드 */}
        <div
          className="w-full max-w-[320px] rounded-2xl border border-border overflow-hidden shadow-md"
          style={{
            backgroundColor: '#F9F6F0',
            animation: 'fadeIn 0.5s 0.3s ease both',
          }}
        >
          {ADFIT_UNIT_ID ? (
            /* 카카오 애드핏 광고 유닛 */
            <ins
              className="kakao_ad_area"
              style={{ display: 'none' }}
              data-ad-unit={ADFIT_UNIT_ID}
              data-ad-width="320"
              data-ad-height="100"
            />
          ) : (
            /* 광고 플레이스홀더 (개발 환경) */
            <div className="h-[100px] flex flex-col items-center justify-center gap-2">
              <div className="text-[10px] tracking-widest text-muted-foreground/40 uppercase">
                Advertisement
              </div>
              <div className="text-[11px] text-muted-foreground/30">카카오 애드핏</div>
            </div>
          )}
        </div>

        {/* 로딩 애니메이션 도트 */}
        <div className="flex gap-1.5 items-center">
          {[0, 200, 400].map((delay, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary/40"
              style={{
                animation: `pulse 1.2s ${delay}ms ease-in-out infinite`,
              }}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1.5">엽서 준비 중…</span>
        </div>
      </div>

      {/* 하단 CTA (3초 전까지 비활성화) */}
      <div className="px-5 py-5">
        <button
          onClick={handleContinue}
          disabled={!isReady}
          id="postcard-adgate-cta"
          className={`w-full py-4 rounded-2xl text-sm font-medium tracking-wide transition-all ${
            isReady
              ? 'text-white shadow-lg'
              : 'bg-muted text-muted-foreground opacity-60 cursor-not-allowed'
          }`}
          style={
            isReady
              ? {
                  background:
                    'linear-gradient(135deg, #BF8B6E 0%, #D4956B 60%, #C78B79 100%)',
                }
              : {}
          }
        >
          {isReady
            ? '💌 엽서 보러가기 (공유·저장 활성화)'
            : `엽서 보러가기 (${countdown}초)`}
        </button>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
