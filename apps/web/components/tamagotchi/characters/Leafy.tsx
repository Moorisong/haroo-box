'use client';

import React from 'react';
import { TamagotchiMood } from '../pixel-character';

interface CharacterProps {
  mood: TamagotchiMood;
  colorPalette: number;
}

const PALETTES = [
  { bodyLight: '#ffffff', bodyMid: '#fff9e6', bodyDark: '#ffe599', pointLight: '#fff2cc', pointDark: '#ffd966', border: '#e6b333' }, // 0: 노랑
  { bodyLight: '#ffffff', bodyMid: '#f0f3ff', bodyDark: '#c9d6ff', pointLight: '#d9e2ff', pointDark: '#adc1ff', border: '#7d87f0' }, // 1: 파랑
  { bodyLight: '#ffffff', bodyMid: '#fff5ee', bodyDark: '#ffd8be', pointLight: '#ffe5d9', pointDark: '#fec5bb', border: '#e28743' }, // 2: 오렌지
  { bodyLight: '#ffffff', bodyMid: '#f1fcf4', bodyDark: '#c7eed8', pointLight: '#d8f3dc', pointDark: '#b7e4c7', border: '#52b788' }, // 3: 연두
  { bodyLight: '#ffffff', bodyMid: '#fff0f5', bodyDark: '#ffccd5', pointLight: '#ffe5ec', pointDark: '#ffb3c1', border: '#e07a5f' }, // 4: 핑크
];

export function Leafy({ mood, colorPalette }: CharacterProps) {
  const palette = PALETTES[colorPalette] || PALETTES[0];

  const renderEyes = () => {
    if (mood === 'dead') {
      return (
        <g stroke="#4e3b30" strokeWidth="3.5" strokeLinecap="round">
          <path d="M 32,52 L 40,60 M 40,52 L 32,60" />
          <path d="M 60,52 L 68,60 M 68,52 L 60,60" />
        </g>
      );
    }
    if (mood === 'sleepy') {
      return (
        <g stroke="#4e3b30" strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M 31,56 Q 36,61 41,56" />
          <path d="M 59,56 Q 64,61 69,56" />
        </g>
      );
    }
    return (
      <g fill="#4e3b30">
        <circle cx="36" cy="56" r="5" />
        <circle cx="64" cy="56" r="5" />
      </g>
    );
  };

  const renderMouth = () => {
    if (mood === 'dead') {
      return <path d="M 45,72 Q 50,66 55,72" stroke="#4e3b30" strokeWidth="3" fill="none" strokeLinecap="round" />;
    }
    if (mood === 'hungry') {
      return <rect x="44" y="68" width="12" height="4" rx="2" fill="#4e3b30" />;
    }
    if (mood === 'excited') {
      return <path d="M 44,68 Q 50,78 56,68 Z" fill="#ff7096" stroke="#4e3b30" strokeWidth="1.5" />;
    }
    // 평범한 곰돌이 입
    return (
      <path d="M 46,69 C 48,71 50,71 50,69 C 50,71 52,71 54,69" stroke="#4e3b30" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    );
  };

  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="normalBody" cx="50%" cy="45%" r="55%" fx="40%" fy="35%">
          <stop offset="0%" stopColor={palette.bodyLight} />
          <stop offset="65%" stopColor={palette.bodyMid} />
          <stop offset="100%" stopColor={palette.bodyDark} />
        </radialGradient>
        <radialGradient id="blush" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb3c1" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffb3c1" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 곰돌이 귀 */}
      <g stroke={palette.border} strokeWidth="2.5">
        <circle cx="26" cy="36" r="11" fill="url(#normalBody)" />
        <circle cx="26" cy="36" r="6" fill={palette.pointLight} />
        
        <circle cx="74" cy="36" r="11" fill="url(#normalBody)" />
        <circle cx="74" cy="36" r="6" fill={palette.pointLight} />
      </g>

      {/* 곰돌이 둥글납작 꼬리 */}
      <circle cx="82" cy="74" r="8" fill="url(#normalBody)" stroke={palette.border} strokeWidth="2" />

      {/* 통통한 발 */}
      <ellipse cx="30" cy="88" rx="8" ry="6" fill={palette.pointLight} stroke={palette.border} strokeWidth="2" />
      <ellipse cx="70" cy="88" rx="8" ry="6" fill={palette.pointLight} stroke={palette.border} strokeWidth="2" />

      {/* 몸통 (곰돌이 뚱뚱한 몸통) */}
      <rect x="20" y="38" width="60" height="50" rx="22" fill="url(#normalBody)" stroke={palette.border} strokeWidth="3" />

      {/* 볼터치 */}
      <circle cx="26" cy="65" r="7" fill="url(#blush)" />
      <circle cx="74" cy="65" r="7" fill="url(#blush)" />

      {/* 앙증맞은 손 */}
      <circle cx="32" cy="74" r="4" fill="url(#normalBody)" stroke={palette.border} strokeWidth="1.5" />
      <circle cx="68" cy="74" r="4" fill="url(#normalBody)" stroke={palette.border} strokeWidth="1.5" />

      {/* 곰돌이 주둥이 영역 */}
      <ellipse cx="50" cy="69" rx="10" ry="7" fill="#ffffff" stroke={palette.border} strokeWidth="1" />
      <ellipse cx="50" cy="64" rx="3.5" ry="2.5" fill="#4e3b30" />

      {renderEyes()}
      {renderMouth()}
    </svg>
  );
}
