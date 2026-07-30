'use client';

import React, { useRef, useCallback, useEffect, useState } from 'react';
import { getFilterCss, getFontStyle } from '@/constants/postcard';
import type { PostcardViewData } from '@/types/postcard';
import PostcardEffectOverlay from '../create/PostcardEffectOverlay';

/** Three.js 3D 조명/카메라 설정 (하드코딩 방지 분리 설정 객체) */
const CARD_3D_CONFIG = {
  maxRotateDeg: 16,
  perspective: 900,
  springStiffness: 320,
  springDamping: 32,
} as const;

interface Postcard3DCanvasProps {
  postcard: PostcardViewData;
  visible: boolean;
}

/**
 * 3D 입체 엽서 캔버스
 * - 데스크톱: 마우스 좌표 기반 rotation 계산
 * - 모바일: deviceorientation API (자이로스코프) 기반 rotation
 *   → 자이로 권한 차단 시 터치 드래그(touchmove)로 fallback
 * - useFrame 스타일의 lerp 감쇄 처리 (CSS transition으로 구현)
 * - Aspect Ratio 자동 갱신 (가로/세로 회전 대응)
 */
export default function Postcard3DCanvas({ postcard, visible }: Postcard3DCanvasProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [gyroAvailable, setGyroAvailable] = useState(false);

  // 자이로스코프 이벤트 핸들러 (모바일)
  const handleDeviceOrientation = useCallback((e: DeviceOrientationEvent) => {
    if (e.gamma === null || e.beta === null) return;
    const maxAngle = CARD_3D_CONFIG.maxRotateDeg;
    // gamma: 좌우 기울기 [-90, 90], beta: 앞뒤 기울기 [-180, 180]
    const ry = Math.max(-maxAngle, Math.min(maxAngle, e.gamma));
    const rx = Math.max(-maxAngle, Math.min(maxAngle, (e.beta - 45) * 0.5));
    setRotateY(ry);
    setRotateX(-rx);
  }, []);

  // 마우스 이동 핸들러 (데스크톱)
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current || gyroAvailable) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setRotateY(x * CARD_3D_CONFIG.maxRotateDeg);
      setRotateX(-y * CARD_3D_CONFIG.maxRotateDeg);
    },
    [gyroAvailable]
  );

  const handleMouseLeave = useCallback(() => {
    if (!gyroAvailable) {
      setRotateX(0);
      setRotateY(0);
    }
  }, [gyroAvailable]);

  // 터치 드래그 fallback 핸들러 (자이로 차단 시)
  const touchStartRef = useRef({ x: 0, y: 0 });

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (gyroAvailable) return;
      const dx = e.touches[0].clientX - touchStartRef.current.x;
      const dy = e.touches[0].clientY - touchStartRef.current.y;
      const maxAngle = CARD_3D_CONFIG.maxRotateDeg;
      setRotateY(Math.max(-maxAngle, Math.min(maxAngle, dx * 0.2)));
      setRotateX(Math.max(-maxAngle, Math.min(maxAngle, -dy * 0.2)));
    },
    [gyroAvailable]
  );

  const handleTouchEnd = useCallback(() => {
    if (!gyroAvailable) {
      setRotateX(0);
      setRotateY(0);
    }
  }, [gyroAvailable]);

  // 자이로 이벤트 등록 시도
  useEffect(() => {
    const tryGyro = () => {
      if (typeof window === 'undefined') return;
      if ('DeviceOrientationEvent' in window) {
        window.addEventListener('deviceorientation', handleDeviceOrientation);
        setGyroAvailable(true);
      }
    };
    tryGyro();
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
      }
    };
  }, [handleDeviceOrientation]);

  if (!visible) return null;

  return (
    <div className="flex-1 flex items-center justify-center px-10">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full max-w-[270px]"
        style={{
          perspective: `${CARD_3D_CONFIG.perspective}px`,
          aspectRatio: '3/4',
        }}
      >
        {/* 3D 기울기 애니메이션 (lerp 감쇄는 CSS transition으로 구현) */}
        <div
          className="w-full h-full rounded-3xl overflow-hidden shadow-2xl"
          style={{
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <div className="w-full relative overflow-hidden" style={{ height: '65%' }}>
            <img
              src={postcard.image_url}
              alt="엽서"
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
              style={{
                filter: getFilterCss(postcard.filter_type, postcard.filter_intensity),
                objectPosition: `center ${postcard.image_offset_y}%`,
              }}
            />
            <PostcardEffectOverlay effectType={postcard.effect_type ?? 'none'} />
          </div>
          <div
            className="bg-white/95 backdrop-blur-sm flex flex-col justify-center px-5 py-4"
            style={{ height: '35%' }}
          >
            <p
              className="text-sm leading-[1.85] whitespace-pre-line text-foreground/80"
              style={getFontStyle(postcard.font_family)}
            >
              {postcard.message}
            </p>
            <div
              className="mt-3 text-[10px] text-muted-foreground/50 tracking-wider"
              style={{ fontFamily: "'Nanum Gothic', sans-serif" }}
            >
              — 하루엽서
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
