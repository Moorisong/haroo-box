'use client';

import React from 'react';

interface TabletViewProps {
  children: React.ReactNode;
}

export function TabletView({ children }: TabletViewProps) {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 20px',
        gap: 16,
      }}
    >
      <div
        style={{
          fontSize: 11,
          background: '#3d2c1e',
          color: '#b8c0ff',
          borderRadius: 8,
          padding: '4px 10px',
          fontWeight: 700,
          alignSelf: 'flex-start',
        }}
      >
        📟 태블릿 모드 최적화 (2열 구성)
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: 16,
        }}
      >
        {children}
      </div>
    </div>
  );
}
