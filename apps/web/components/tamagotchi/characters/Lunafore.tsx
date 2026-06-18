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

export function Lunafore({ mood, colorPalette }: CharacterProps) {
  const palette = PALETTES[colorPalette] || PALETTES[0];

  const renderEyes = () => {
    if (mood === 'dead') {
      return (
        <g stroke="#2f3e46" strokeWidth="3.5" strokeLinecap="round">
          <path d="M 32,52 L 40,60 M 40,52 L 32,60" />
          <path d="M 60,52 L 68,60 M 68,52 L 60,60" />
        </g>
      );
    }
    if (mood === 'sleepy') {
      return (
        <g stroke="#2f3e46" strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M 31,56 Q 36,61 41,56" />
          <path d="M 59,56 Q 64,61 69,56" />
        </g>
      );
    }
    // 기괴상 특유의 멍청하고 커다란 비대칭 눈
    return (
      <g>
        <circle cx="34" cy="54" r="8" fill="#ffffff" stroke={palette.border} strokeWidth="1.5" />
        <circle cx="34" cy="54" r="3" fill="#2f3e46" />
        <circle cx="32" cy="52" r="1" fill="#ffffff" />

        <circle cx="66" cy="54" r="5" fill="#ffffff" stroke={palette.border} strokeWidth="1.5" />
        <circle cx="66" cy="54" r="2.2" fill="#2f3e46" />
      </g>
    );
  };

  const renderMouth = () => {
    if (mood === 'dead') {
      return <path d="M 44,70 Q 50,64 56,70" stroke="#2f3e46" strokeWidth="3" fill="none" strokeLinecap="round" />;
    }
    if (mood === 'hungry') {
      return <circle cx="50" cy="68" r="4" fill="#2f3e46" />;
    }
    if (mood === 'excited') {
      // 메롱 표정
      return (
        <g>
          <path d="M 45,66 Q 50,72 55,66" stroke="#2f3e46" strokeWidth="2.5" fill="none" />
          <path d="M 48,68 Q 50,75 52,68 Z" fill="#ff7096" stroke="#2f3e46" strokeWidth="1.2" />
        </g>
      );
    }
    // 멍청한 입 모양 (ㅇ 모양 또는 ㅡ 모양)
    return (
      <circle cx="50" cy="68" r="2.5" fill="#2f3e46" />
    );
  };

  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="weirdBody" cx="50%" cy="45%" r="55%" fx="40%" fy="35%">
          <stop offset="0%" stopColor={palette.bodyLight} />
          <stop offset="65%" stopColor={palette.bodyMid} />
          <stop offset="100%" stopColor={palette.bodyDark} />
        </radialGradient>
        <radialGradient id="blush" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb3c1" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ffb3c1" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 안테나/더듬이 2개 */}
      <g stroke={palette.border} strokeWidth="2.5" fill="none">
        <path d="M 36,36 Q 28,16 30,8" />
        <path d="M 64,36 Q 72,16 70,8" />
      </g>
      {/* 안테나 끝 구슬 */}
      <circle cx="30" cy="8" r="4.5" fill={palette.pointDark} stroke={palette.border} strokeWidth="1.5" />
      <circle cx="70" cy="8" r="4.5" fill={palette.pointDark} stroke={palette.border} strokeWidth="1.5" />

      {/* 둥둥 떠있는 지느러미 날개 */}
      <path d="M 16,50 C 6,45 8,60 18,58 Z" fill={palette.pointLight} stroke={palette.border} strokeWidth="1.5" />
      <path d="M 84,50 C 94,45 92,60 82,58 Z" fill={palette.pointLight} stroke={palette.border} strokeWidth="1.5" />

      {/* 특이한 꼬리 (별사탕 꼬리) */}
      <polygon points="82,72 88,68 85,76 92,78 84,82 82,88 78,81 72,80 78,75" fill={palette.pointLight} stroke={palette.border} strokeWidth="1.5" />

      {/* 지느러미 발 */}
      <path d="M 30,86 C 24,86 28,92 38,90 Z" fill={palette.pointDark} stroke={palette.border} strokeWidth="1.5" />
      <path d="M 70,86 C 76,86 72,92 62,90 Z" fill={palette.pointDark} stroke={palette.border} strokeWidth="1.5" />

      {/* 몸통 (물방울/슬라임 형태) */}
      <path d="M 50,30 C 72,30 80,52 80,68 C 80,84 68,88 50,88 C 32,88 20,84 20,68 C 20,52 28,30 50,30 Z" fill="url(#weirdBody)" stroke={palette.border} strokeWidth="3" />

      {/* 볼터치 */}
      <circle cx="24" cy="67" r="6" fill="url(#blush)" />
      <circle cx="76" cy="67" r="6" fill="url(#blush)" />

      {renderEyes()}
      {renderMouth()}
    </svg>
  );
}
