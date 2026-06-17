'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { path: '/tamagotchi', emoji: '🏠', label: '홈' },
  { path: '/tamagotchi/plaza', emoji: '🏡', label: '광장' },
  { path: '/tamagotchi/battle', emoji: '⚔️', label: '전투' },
  { path: '/tamagotchi/rank', emoji: '🏆', label: '랭킹' },
  { path: '/tamagotchi/title', emoji: '🐾', label: '도감' },
  { path: '/tamagotchi/family', emoji: '🏰', label: '가문' },
  { path: '/tamagotchi/grave', emoji: '🪦', label: '묘지' },
];

export default function TamagotchiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHatchPage = pathname === '/tamagotchi/hatch';

  return (
    <div
      style={{
        width: '100%',
        minHeight: 'calc(100vh - 64px)', // 기존 Navbar 높이 제외
        display: 'flex',
        justifyContent: 'center', // 가로 정중앙 배치
        background: '#e8d5c0', // 외부 여백의 파스텔톤 다마고치 베이지 색상
        fontFamily: "'Noto Sans KR', sans-serif",
      }}
    >
      {/* 600px 너비 제한을 적용한 모바일웹 본체 */}
      <div
        style={{
          width: '100%',
          maxWidth: 600, // 태블릿/데스크톱 모두 600px로 일관된 제한
          background: '#fdf6ee', // 콘텐츠 영역 연한 아이보리 색상
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100%',
          position: 'relative',
          paddingBottom: isHatchPage ? 0 : 70, // 탭바 높이만큼 하단 패딩 확보
          boxShadow: '0 0 40px rgba(61, 44, 30, 0.08)', // 좌우 분리 입체감을 주는 섀도우
        }}
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>

        {/* 하단 탭 내비게이션 바 (600px 너비에 정렬되도록 고정 설정) */}
        {!isHatchPage && (
          <nav
            style={{
              position: 'fixed',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)', // 화면 중앙 배치
              width: '100%',
              maxWidth: 600, // 탭바 역시 동일하게 600px 제한
              zIndex: 50,
              background: '#fffaf4',
              borderTop: '2px solid rgba(61, 44, 30, 0.12)',
              padding: '8px 4px env(safe-area-inset-bottom, 8px)',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              boxShadow: '0 -4px 16px rgba(61, 44, 30, 0.05)',
            }}
          >
            {TABS.map((tab) => {
              const isActive = pathname === tab.path;
              return (
                <Link
                  key={tab.path}
                  href={tab.path}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    textDecoration: 'none',
                    padding: '4px 6px',
                    borderRadius: 12,
                    flex: 1,
                    transition: 'all 0.2s',
                  }}
                >
                  <span
                    style={{
                      fontSize: 18,
                      transform: isActive ? 'scale(1.15) translateY(-1px)' : 'scale(1)',
                      filter: isActive ? 'none' : 'grayscale(25%) opacity(0.6)',
                      transition: 'transform 0.2s, filter 0.2s',
                    }}
                  >
                    {tab.emoji}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#f4a261' : '#9e7b5f',
                      transition: 'color 0.2s',
                    }}
                  >
                    {tab.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
}
