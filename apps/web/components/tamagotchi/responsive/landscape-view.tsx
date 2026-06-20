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
