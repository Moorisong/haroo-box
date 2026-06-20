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
