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

export function Starpy({ mood, colorPalette }: CharacterProps) {
  const palette = PALETTES[colorPalette] || PALETTES[0];

  const renderEyes = () => {
    if (mood === 'dead') {
      return (
        <g stroke="#372c38" strokeWidth="3.5" strokeLinecap="round">
          <path d="M 32,52 L 40,60 M 40,52 L 32,60" />
          <path d="M 60,52 L 68,60 M 68,52 L 60,60" />
        </g>
      );
    }
    if (mood === 'sleepy') {
      return (
        <g stroke="#372c38" strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M 31,56 Q 36,61 41,56" />
          <path d="M 59,56 Q 64,61 69,56" />
        </g>
      );
    }
    // 살짝 올라간 도도한 눈빛
    return (
      <g>
        <circle cx="36" cy="56" r="6" fill="#372c38" />
        <path d="M 34,50 Q 38,48 42,52" stroke="#372c38" strokeWidth="2.5" fill="none" />
        <circle cx="34.5" cy="54" r="2" fill="#ffffff" />

        <circle cx="64" cy="56" r="6" fill="#372c38" />
        <path d="M 66,50 Q 62,48 58,52" stroke="#372c38" strokeWidth="2.5" fill="none" />
        <circle cx="62.5" cy="54" r="2" fill="#ffffff" />
      </g>
    );
  };

  const renderMouth = () => {
    if (mood === 'dead') {
      return <path d="M 44,70 Q 50,64 56,70" stroke="#372c38" strokeWidth="3" fill="none" strokeLinecap="round" />;
    }
    if (mood === 'hungry') {
      return <rect x="44" y="67" width="12" height="4" rx="2" fill="#372c38" />;
    }
    if (mood === 'excited') {
      return (
        <g>
          <path d="M 44,66 Q 50,76 56,66 Z" fill="#ff7096" stroke="#372c38" strokeWidth="1.5" />
          {/* 송곳니 */}
          <polygon points="46,66 48,70 50,66" fill="#ffffff" />
          <polygon points="54,66 52,70 50,66" fill="#ffffff" />
        </g>
      );
    }
    // 츤츤대는 뾰로통한 입
    return (
      <path d="M 46,67 Q 50,64 54,67" stroke="#372c38" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    );
  };

  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="uniqueBody" cx="50%" cy="45%" r="55%" fx="40%" fy="35%">
          <stop offset="0%" stopColor={palette.bodyLight} />
          <stop offset="65%" stopColor={palette.bodyMid} />
          <stop offset="100%" stopColor={palette.bodyDark} />
        </radialGradient>
        <linearGradient id="innerEar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.pointLight} />
          <stop offset="100%" stopColor={palette.pointDark} />
        </linearGradient>
        <radialGradient id="blush" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e0aaff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#e0aaff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 뾰족 지그재그 악마/번개 꼬리 */}
      <path d="M 75,70 L 88,62 L 82,74 L 92,72" stroke={palette.border} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <polygon points="90,69 96,73 90,77" fill={palette.pointDark} />

      {/* 뾰족하고 세련된 고양이 귀 */}
      <g stroke={palette.border} strokeWidth="2">
        <path d="M 20,40 L 12,14 Q 24,18 34,34 Z" fill="url(#uniqueBody)" />
        <path d="M 21,36 L 16,20 Q 23,23 29,32 Z" fill="url(#innerEar)" />

        <path d="M 80,40 L 88,14 Q 76,18 66,34 Z" fill="url(#uniqueBody)" />
        <path d="M 79,36 L 84,20 Q 77,23 71,32 Z" fill="url(#innerEar)" />
      </g>

      {/* 뿔 스타일 번개 앞머리 */}
      <g stroke={palette.border} strokeWidth="2" fill={palette.pointDark}>
        <polygon points="44,34 50,22 52,34" />
        <polygon points="56,34 50,22 48,34" />
      </g>

      {/* 세련된 발 */}
      <ellipse cx="32" cy="88" rx="6" ry="5" fill={palette.pointLight} stroke={palette.border} strokeWidth="1.5" />
      <ellipse cx="68" cy="88" rx="6" ry="5" fill={palette.pointLight} stroke={palette.border} strokeWidth="1.5" />

      {/* 몸통 */}
      <rect x="20" y="36" width="60" height="52" rx="20" fill="url(#uniqueBody)" stroke={palette.border} strokeWidth="2.5" />

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
