'use client';

import React from 'react';

interface MobileViewProps {
  children: React.ReactNode;
}

export function MobileView({ children }: MobileViewProps) {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '12px 14px',
        gap: 12,
      }}
    >
      <div
        style={{
          fontSize: 10,
          background: '#3d2c1e',
          color: '#ffd166',
          borderRadius: 8,
          padding: '4px 8px',
          fontWeight: 700,
          alignSelf: 'flex-start',
        }}
      >
        📱 모바일 모드 최적화
      </div>
      {children}
    </div>
  );
}
