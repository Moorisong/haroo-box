'use client';

import React from 'react';
import { TamagotchiMood } from '../pixel-character';

interface CharacterProps {
  mood: TamagotchiMood;
  colorPalette: number;
}

// 파스텔 톤 색상 테이블
const PALETTES = [
  { bodyLight: '#ffffff', bodyMid: '#fff9e6', bodyDark: '#ffe599', pointLight: '#fff2cc', pointDark: '#ffd966', border: '#e6b333' }, // 0: 노랑
  { bodyLight: '#ffffff', bodyMid: '#f0f3ff', bodyDark: '#c9d6ff', pointLight: '#d9e2ff', pointDark: '#adc1ff', border: '#7d87f0' }, // 1: 파랑
  { bodyLight: '#ffffff', bodyMid: '#fff5ee', bodyDark: '#ffd8be', pointLight: '#ffe5d9', pointDark: '#fec5bb', border: '#e28743' }, // 2: 오렌지
  { bodyLight: '#ffffff', bodyMid: '#f1fcf4', bodyDark: '#c7eed8', pointLight: '#d8f3dc', pointDark: '#b7e4c7', border: '#52b788' }, // 3: 연두
  { bodyLight: '#ffffff', bodyMid: '#fff0f5', bodyDark: '#ffccd5', pointLight: '#ffe5ec', pointDark: '#ffb3c1', border: '#e07a5f' }, // 4: 핑크
];

export function Poporing({ mood, colorPalette }: CharacterProps) {
  const palette = PALETTES[colorPalette] || PALETTES[0];

  const renderEyes = () => {
    if (mood === 'dead') {
      return (
        <g stroke="#5c3d42" strokeWidth="3.5" strokeLinecap="round">
          <path d="M 32,52 L 40,60 M 40,52 L 32,60" />
          <path d="M 60,52 L 68,60 M 68,52 L 60,60" />
        </g>
      );
    }
    if (mood === 'sleepy') {
      return (
        <g stroke="#5c3d42" strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M 31,56 Q 36,61 41,56" />
          <path d="M 59,56 Q 64,61 69,56" />
        </g>
      );
    }
    return (
      <g>
        <circle cx="36" cy="56" r="6.5" fill="#3a2528" />
        <circle cx="34.5" cy="53.5" r="2.2" fill="#ffffff" />
        <circle cx="38" cy="58" r="1" fill="#ffffff" />
        
        <circle cx="64" cy="56" r="6.5" fill="#3a2528" />
        <circle cx="62.5" cy="53.5" r="2.2" fill="#ffffff" />
        <circle cx="66" cy="58" r="1" fill="#ffffff" />
      </g>
    );
  };

  const renderMouth = () => {
    if (mood === 'dead') {
      return <path d="M 44,70 Q 50,64 56,70" stroke="#5c3d42" strokeWidth="3" fill="none" strokeLinecap="round" />;
    }
    if (mood === 'hungry') {
      return <rect x="44" y="67" width="12" height="4" rx="2" fill="#5c3d42" />;
    }
    if (mood === 'excited') {
      return <path d="M 44,66 Q 50,76 56,66 Z" fill="#f25c74" stroke="#5c3d42" strokeWidth="1.5" />;
    }
    return <path d="M 45,67 Q 48,70 50,67 Q 52,70 55,67" stroke="#5c3d42" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
  };

  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bodyGrad" cx="50%" cy="45%" r="55%" fx="40%" fy="35%">
          <stop offset="0%" stopColor={palette.bodyLight} />
          <stop offset="65%" stopColor={palette.bodyMid} />
          <stop offset="100%" stopColor={palette.bodyDark} />
        </radialGradient>
        <linearGradient id="earGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.pointLight} />
          <stop offset="100%" stopColor={palette.pointDark} />
        </linearGradient>
        <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a7e8a4" />
          <stop offset="100%" stopColor="#70c96d" />
        </linearGradient>
        <radialGradient id="blush" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff9fa9" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ff9fa9" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 꼬리 */}
      <circle cx="78" cy="74" r="10" fill={palette.pointLight} stroke={palette.border} strokeWidth="1.5" />
      <circle cx="81" cy="70" r="7" fill={palette.pointDark} />

      {/* 귀 */}
      <g stroke={palette.border} strokeWidth="2">
        <path d="M 23,38 C 12,38 15,14 27,16 C 35,17 35,32 33,38 Z" fill="url(#bodyGrad)" />
        <path d="M 22,34 C 15,34 17,20 25,21 C 30,22 31,30 29,34 Z" fill="url(#earGrad)" />

        <path d="M 77,38 C 88,38 85,14 73,16 C 65,17 65,32 67,38 Z" fill="url(#bodyGrad)" />
        <path d="M 78,34 C 85,34 83,20 75,21 C 70,22 69,30 71,34 Z" fill="url(#earGrad)" />
      </g>

      {/* 발 */}
      <ellipse cx="32" cy="88" rx="7" ry="5" fill={palette.pointLight} stroke={palette.border} strokeWidth="1.5" />
      <ellipse cx="68" cy="88" rx="7" ry="5" fill={palette.pointLight} stroke={palette.border} strokeWidth="1.5" />

      {/* 몸통 */}
      <rect x="18" y="36" width="64" height="52" rx="28" fill="url(#bodyGrad)" stroke={palette.border} strokeWidth="2.5" />

      {/* 나뭇잎 싹 */}
      <g transform="translate(50, 34) scale(0.9)" stroke="#70c96d" strokeWidth="1.5">
        <path d="M 0,4 Q 0,-6 -3,-10" fill="none" stroke="#70c96d" strokeWidth="2" />
        <path d="M -3,-10 C -12,-12 -12,-4 -3,-4 C -2,-4 -3,-8 -3,-10 Z" fill="url(#leafGrad)" />
        <path d="M -3,-10 C 6,-14 10,-8 2,-4 C 0,-4 -2,-8 -3,-10 Z" fill="url(#leafGrad)" transform="rotate(30, -3, -10)" />
      </g>

      {/* 볼터치 */}
      <circle cx="28" cy="65" r="7" fill="url(#blush)" />
      <circle cx="72" cy="65" r="7" fill="url(#blush)" />

      {/* 앞발 */}
      <circle cx="34" cy="74" r="3.5" fill="#ffffff" stroke={palette.border} strokeWidth="1.2" />
      <circle cx="66" cy="74" r="3.5" fill="#ffffff" stroke={palette.border} strokeWidth="1.2" />

      {renderEyes()}
      {renderMouth()}
    </svg>
  );
}
