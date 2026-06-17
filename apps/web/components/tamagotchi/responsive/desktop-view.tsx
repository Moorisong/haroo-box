'use client';

import React from 'react';

interface DesktopViewProps {
  children: React.ReactNode;
}

export function DesktopView({ children }: DesktopViewProps) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 32px',
        gap: 20,
      }}
    >
      <div
        style={{
          fontSize: 11,
          background: '#3d2c1e',
          color: '#74c69d',
          borderRadius: 8,
          padding: '5px 12px',
          fontWeight: 700,
          alignSelf: 'flex-start',
          letterSpacing: 1,
        }}
      >
        🖥️ 데스크톱 대시보드 모드 (와이드 레이아웃)
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr',
          gap: 24,
        }}
      >
        {children}
      </div>
    </div>
  );
}
