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

      {children}
    </div>
  );
}
