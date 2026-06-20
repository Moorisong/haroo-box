'use client';

import React from 'react';
import { TamagotchiMood } from '../pixel-character';

interface CharacterProps {
  mood: TamagotchiMood;
  colorPalette: number;
  eyeType: number;
}

const PALETTES = [
  { bodyLight: '#ffffff', bodyMid: '#fff9e6', bodyDark: '#ffe599', pointLight: '#fff2cc', pointDark: '#ffd966', border: '#e6b333' }, // 0: 노랑
  { bodyLight: '#ffffff', bodyMid: '#f0f3ff', bodyDark: '#c9d6ff', pointLight: '#d9e2ff', pointDark: '#adc1ff', border: '#7d87f0' }, // 1: 파랑
  { bodyLight: '#ffffff', bodyMid: '#fff5ee', bodyDark: '#ffd8be', pointLight: '#ffe5d9', pointDark: '#fec5bb', border: '#e28743' }, // 2: 오렌지
  { bodyLight: '#ffffff', bodyMid: '#f1fcf4', bodyDark: '#c7eed8', pointLight: '#d8f3dc', pointDark: '#b7e4c7', border: '#52b788' }, // 3: 연두
  { bodyLight: '#ffffff', bodyMid: '#fff0f5', bodyDark: '#ffccd5', pointLight: '#ffe5ec', pointDark: '#ffb3c1', border: '#e07a5f' }, // 4: 핑크
];

export function Starpy({ mood, colorPalette, eyeType }: CharacterProps) {
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

    switch (eyeType % 5) {
      case 1: // 1. 반쯤 감은 거만한 눈 (Tsurime - 귀엽게)
        return (
          <g stroke="#372c38" strokeWidth="2.5" strokeLinecap="round">
            <path d="M 30,53 L 42,53" />
            <path d="M 30,53 Q 36,48 42,53" fill="none" />
            <circle cx="36" cy="51.5" r="2" fill="#372c38" stroke="none" />
            
            <path d="M 70,53 L 58,53" />
            <path d="M 70,53 Q 64,48 58,53" fill="none" />
            <circle cx="64" cy="51.5" r="2" fill="#372c38" stroke="none" />
          </g>
        );
      case 2: // 2. 별 모양 눈 (이름에 어울리는 큐티 스타일)
        return (
          <g fill="#372c38">
            <polygon points="36,51 38,54 41,54 39,56.5 40,60 36,58 32,60 33,56.5 31,54 34,54" />
            <polygon points="64,51 66,54 69,54 67,56.5 68,60 64,58 60,60 61,56.5 59,54 62,54" />
          </g>
        );
      case 3: // 3. 앙칼진 타원형 고양이 눈
        return (
          <g fill="#372c38">
            <ellipse cx="36" cy="54" rx="3.5" ry="6" transform="rotate(20 36 54)" />
            <circle cx="35" cy="52" r="1.2" fill="#ffffff" />
            
            <ellipse cx="64" cy="54" rx="3.5" ry="6" transform="rotate(-20 64 54)" />
            <circle cx="63" cy="52" r="1.2" fill="#ffffff" />
          </g>
        );
      case 4: // 4. 윙크하는 장난꾸러기 눈 (> o)
        return (
          <g stroke="#372c38" strokeWidth="2.5" fill="none" strokeLinecap="round">
            <path d="M 32,52 L 40,56 M 32,56 L 40,52" />
            <circle cx="64" cy="54" r="4.5" fill="#372c38" stroke="none" />
            <circle cx="62.5" cy="52.5" r="1.5" fill="#ffffff" stroke="none" />
          </g>
        );
      case 0: // 0. 기본: 귀여운 세로 동공
      default:
        return (
          <g>
            <path d="M 28,54 Q 36,48 42,56 Q 34,58 28,54 Z" fill="#ffffff" stroke="#372c38" strokeWidth="1.5" strokeLinejoin="round" />
            <ellipse cx="36" cy="53" rx="1.5" ry="3.5" fill="#372c38" />
            
            <path d="M 72,54 Q 64,48 58,56 Q 66,58 72,54 Z" fill="#ffffff" stroke="#372c38" strokeWidth="1.5" strokeLinejoin="round" />
            <ellipse cx="64" cy="53" rx="1.5" ry="3.5" fill="#372c38" />
          </g>
        );
    }
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
