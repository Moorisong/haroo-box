'use client';

import React from 'react';

export interface StatItem {
  label: string;
  emoji: string;
  value: number;
  color: string;
}

interface StatusBarsProps {
  stats: StatItem[];
}

export function StatusBars({ stats }: StatusBarsProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 10,
        width: '100%',
      }}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          style={{
            background: '#fffaf4',
            borderRadius: 18,
            padding: '12px 14px',
            boxShadow: '0 2px 8px rgba(180, 140, 100, 0.06)',
            border: '1.5px solid rgba(180, 140, 100, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: '#3d2c1e',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span>{stat.emoji}</span>
              <span>{stat.label}</span>
            </span>
            <span
              style={{
                fontSize: 11,
                color: '#9e7b5f',
                fontFamily: 'monospace',
                fontWeight: 700,
              }}
            >
              {stat.value}%
            </span>
          </div>

          {/* 게이지 바 배경 */}
          <div
            style={{
              background: '#f5e6d3',
              borderRadius: 99,
              height: 8,
              overflow: 'hidden',
              width: '100%',
              position: 'relative',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${stat.value}%`,
                background: stat.color,
                borderRadius: 99,
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
