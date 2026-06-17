'use client';

import React, { useState, useEffect } from 'react';

const BODY_COLORS = {
  cutie: { main: '#ffd166', border: '#e6b333', dark: '#d4a31a' },    // 귀염상
  weird: { main: '#b8c0ff', border: '#929cf8', dark: '#7d87f0' },    // 기괴상
  normal: { main: '#f4a261', border: '#e28743', dark: '#c86f2d' },   // 평범상
  unique: { main: '#74c69d', border: '#52b788', dark: '#409c70' },   // 개성상
} as const;

export type TamagotchiSpecies = keyof typeof BODY_COLORS;
export type TamagotchiMood = 'happy' | 'hungry' | 'sleepy' | 'excited' | 'dead';
export type TamagotchiHat = 'crown' | 'wizard' | 'explorer';

export interface PixelCharacterProps {
  species?: TamagotchiSpecies;
  mood?: TamagotchiMood;
  size?: 'sm' | 'md' | 'lg';
  flower?: string | null;
  hat?: TamagotchiHat | null;
}

export function PixelCharacter({
  species = 'cutie',
  mood = 'happy',
  size = 'lg',
  flower = null,
  hat = null,
}: PixelCharacterProps) {
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    if (mood === 'dead') return;
    const interval = setInterval(() => {
      setBounce((b) => !b);
    }, 1000);
    return () => clearInterval(interval);
  }, [mood]);

  const sizes = { sm: 64, md: 100, lg: 140 };
  const s = sizes[size];
  const theme = BODY_COLORS[species];

  return (
    <div
      style={{
        width: s,
        height: s,
        transition: 'transform 0.3s ease-in-out',
        transform: bounce ? 'translateY(-6px)' : 'translateY(0px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {/* 그림자 */}
      <div
        style={{
          position: 'absolute',
          bottom: -4,
          left: '50%',
          transform: 'translateX(-50%)',
          width: s * 0.7,
          height: 6,
          background: 'rgba(180, 130, 80, 0.15)',
          borderRadius: '50%',
          filter: 'blur(2px)',
        }}
      />

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ zIndex: 1 }}
      >
        {/* 귀염상 전용 귀 */}
        {species === 'cutie' && (
          <>
            <rect x="25" y="18" width="12" height="16" rx="4" fill={theme.main} stroke={theme.border} strokeWidth="2.5" />
            <rect x="63" y="18" width="12" height="16" rx="4" fill={theme.main} stroke={theme.border} strokeWidth="2.5" />
            <rect x="28" y="21" width="6" height="10" rx="2" fill="#ffb3c1" />
            <rect x="66" y="21" width="6" height="10" rx="2" fill="#ffb3c1" />
          </>
        )}

        {/* 기괴상 전용 더듬이 */}
        {species === 'weird' && (
          <>
            <path d="M 38,22 Q 30,12 32,7" stroke={theme.border} strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 62,22 Q 70,12 68,7" stroke={theme.border} strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="32" cy="7" r="4.5" fill="#ef476f" />
            <circle cx="68" cy="7" r="4.5" fill="#ef476f" />
          </>
        )}

        {/* 본체 몸통 */}
        <rect x="18" y="28" width="64" height="56" rx="24" fill={theme.main} stroke={theme.border} strokeWidth="3" />
        {/* 배 (Tummy) */}
        <rect x="30" y="52" width="40" height="24" rx="12" fill="rgba(255,255,255,0.45)" />

        {/* 상태별 눈 */}
        {mood === 'dead' ? (
          <>
            <path d="M 33,43 L 39,49 M 39,43 L 33,49" stroke={theme.dark} strokeWidth="3" strokeLinecap="round" />
            <path d="M 61,43 L 67,49 M 67,43 L 61,49" stroke={theme.dark} strokeWidth="3" strokeLinecap="round" />
          </>
        ) : mood === 'sleepy' ? (
          <>
            <path d="M 32,46 Q 36,50 40,46" stroke={theme.dark} strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M 60,46 Q 64,50 68,46" stroke={theme.dark} strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </>
        ) : mood === 'excited' ? (
          <>
            <circle cx="36" cy="44" r="7" fill="#ffffff" stroke={theme.border} strokeWidth="1.5" />
            <circle cx="64" cy="44" r="7" fill="#ffffff" stroke={theme.border} strokeWidth="1.5" />
            <circle cx="36" cy="44" r="3" fill="#3d2c1e" />
            <circle cx="64" cy="44" r="3" fill="#3d2c1e" />
          </>
        ) : (
          <>
            <circle cx="36" cy="44" r="5.5" fill="#3d2c1e" />
            <circle cx="64" cy="44" r="5.5" fill="#3d2c1e" />
            <circle cx="38" cy="42" r="1.8" fill="#ffffff" />
            <circle cx="66" cy="42" r="1.8" fill="#ffffff" />
          </>
        )}

        {/* 볼터치 */}
        {mood !== 'dead' && (
          <>
            <ellipse cx="28" cy="50" rx="5" ry="3.5" fill="#ffb3c1" fillOpacity="0.7" />
            <ellipse cx="72" cy="50" rx="5" ry="3.5" fill="#ffb3c1" fillOpacity="0.7" />
          </>
        )}

        {/* 입 */}
        {mood === 'dead' ? (
          <path d="M 44,60 Q 50,56 56,60" stroke="#3d2c1e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        ) : mood === 'hungry' ? (
          <path d="M 44,58 Q 50,54 56,58" stroke="#3d2c1e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        ) : mood === 'excited' ? (
          <path d="M 42,56 Q 50,68 58,56" fill="#b5445a" stroke={theme.border} strokeWidth="2" strokeLinecap="round" />
        ) : (
          <path d="M 44,56 Q 50,62 56,56" stroke="#3d2c1e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        )}

        {/* 발 */}
        <rect x="26" y="80" width="14" height="8" rx="4" fill={theme.main} stroke={theme.border} strokeWidth="2.5" />
        <rect x="60" y="80" width="14" height="8" rx="4" fill={theme.main} stroke={theme.border} strokeWidth="2.5" />

        {/* 1. 왕관 모자 (crown) SVG 렌더링 */}
        {hat === 'crown' && (
          <g transform="translate(30, 4)">
            <path d="M 0,16 L 8,6 L 20,16 L 32,6 L 40,16 L 40,24 L 0,24 Z" fill="#ffe066" stroke="#d4a31a" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="8" cy="5" r="2" fill="#ef476f" />
            <circle cx="20" cy="15" r="2.5" fill="#06d6a0" />
            <circle cx="32" cy="5" r="2" fill="#ef476f" />
          </g>
        )}

        {/* 2. 마법사 모자 (wizard) SVG 렌더링 */}
        {hat === 'wizard' && (
          <g transform="translate(32, 2)">
            <path d="M 18,0 L 0,22 L 36,22 Z" fill="#929cf8" stroke="#7d87f0" strokeWidth="2" strokeLinejoin="round" />
            {/* 별 무늬 */}
            <path d="M 15,9 L 18,6 L 21,9 L 18,12 Z" fill="#ffe066" />
            <ellipse cx="18" cy="22" rx="20" ry="3.5" fill="#929cf8" stroke="#7d87f0" strokeWidth="1.8" />
          </g>
        )}

        {/* 3. 탐험가 모자 (explorer) SVG 렌더링 */}
        {hat === 'explorer' && (
          <g transform="translate(26, 8)">
            <path d="M 6,14 L 6,6 Q 24,0 42,6 L 42,14 Z" fill="#e28743" stroke="#c86f2d" strokeWidth="2" />
            <rect x="6" y="11" width="36" height="3" fill="#ffe9c5" />
            <ellipse cx="24" cy="15" rx="24" ry="4.5" fill="#e28743" stroke="#c86f2d" strokeWidth="1.8" />
          </g>
        )}
      </svg>

      {/* 꽃 장식 액세서리 */}
      {flower && (
        <span
          style={{
            position: 'absolute',
            top: s * 0.18,
            right: s * 0.18,
            fontSize: s * 0.22,
            zIndex: 10,
          }}
        >
          {flower}
        </span>
      )}
    </div>
  );
}

export function MiniCharacter({
  species = 'cutie',
  mood = 'happy',
  accessory = null,
}: {
  species?: TamagotchiSpecies;
  mood?: TamagotchiMood;
  accessory?: string | null;
}) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <PixelCharacter species={species} mood={mood} size="sm" />
      {accessory && (
        <span
          style={{
            position: 'absolute',
            top: -2,
            right: -2,
            fontSize: 14,
            zIndex: 5,
          }}
        >
          {accessory}
        </span>
      )}
    </div>
  );
}
