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
