'use client';

import React from 'react';

interface LandscapeViewProps {
  children: React.ReactNode;
}

export function LandscapeView({ children }: LandscapeViewProps) {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '12px 16px',
        gap: 12,
      }}
    >
      <div
        style={{
          fontSize: 10,
          background: '#3d2c1e',
          color: '#f4a261',
          borderRadius: 8,
          padding: '3px 8px',
          fontWeight: 700,
          alignSelf: 'flex-start',
        }}
      >
        🔄 가로모드(Landscape) 레이아웃 최적화
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 1fr',
          gap: 14,
        }}
      >
        {children}
      </div>
    </div>
  );
}
