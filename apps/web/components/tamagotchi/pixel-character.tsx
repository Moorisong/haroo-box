'use client';

import React, { useState, useEffect } from 'react';
import { Poporing } from './characters/Poporing';
import { Leafy } from './characters/Leafy';
import { Starpy } from './characters/Starpy';
import { Lunafore } from './characters/Lunafore';

// 종족별 5종 색상 팔레트 테마 (0 ~ 4)
export type TamagotchiSpecies = 'cutie' | 'weird' | 'normal' | 'unique';
export type TamagotchiMood = 'happy' | 'hungry' | 'sleepy' | 'excited' | 'dead';

export interface PixelCharacterProps {
  species?: TamagotchiSpecies;
  colorPalette?: number;
  mood?: TamagotchiMood;
  size?: 'sm' | 'md' | 'lg';
  flower?: string | null;
  hat?: string | null;
}

export function PixelCharacter({
  species = 'cutie',
  colorPalette = 0,
  mood = 'happy',
  size = 'lg',
  flower = null,
  hat = null,
}: PixelCharacterProps) {
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    if (mood === 'dead') return;
    const interval = setInterval(() => setBounce((b) => !b), 800);
    return () => clearInterval(interval);
  }, [mood]);

  const sizes = { sm: 48, md: 80, lg: 120 };
  const s = sizes[size];

  // 1. 모자 10종 렌더러
  const renderHat = () => {
    if (!hat) return null;
    switch (hat) {
      case 'crown': // 왕관
        return (
          <path d="M 30,22 L 35,12 L 50,22 L 65,12 L 70,22 L 70,30 L 30,30 Z" fill="#ffe066" stroke="#d4a31a" strokeWidth="2" />
        );
      case 'ribbon': // 리본
        return (
          <g fill="#ff70a6" stroke="#ff477e" strokeWidth="1.5">
            <circle cx="42" cy="24" r="7" />
            <circle cx="58" cy="24" r="7" />
            <polygon points="45,24 55,24 50,28" fill="#ff477e" />
          </g>
        );
      case 'sunglasses': // 선글라스
        return (
          <g fill="#212529" stroke="#343a40" strokeWidth="1.5">
            <rect x="28" y="38" width="18" height="10" rx="3" />
            <rect x="54" y="38" width="18" height="10" rx="3" />
            <line x1="46" y1="42" x2="54" y2="42" stroke="#212529" strokeWidth="3" />
          </g>
        );
      case 'helmet': // 전투 헬멧
        return (
          <path d="M 22,34 C 22,18 78,18 78,34 L 78,40 L 22,40 Z" fill="#6c757d" stroke="#495057" strokeWidth="2" />
        );
      case 'cap': // 야구모자
        return (
          <g>
            <path d="M 25,32 C 25,18 75,18 75,32 Z" fill="#023e8a" />
            <path d="M 65,30 L 90,30 L 85,34 L 65,34 Z" fill="#0077b6" />
          </g>
        );
      case 'box': // 종이상자
        return (
          <rect x="26" y="16" width="48" height="20" fill="#b79ced" stroke="#9b5de5" strokeWidth="2" rx="4" />
        );
      case 'pot': // 냄비
        return (
          <g>
            <path d="M 28,32 L 72,32 L 68,20 L 32,20 Z" fill="#adb5bd" stroke="#6c757d" strokeWidth="2" />
            <rect x="46" y="14" width="8" height="6" fill="#495057" />
          </g>
        );
      case 'frog': // 개구리 모자
        return (
          <g>
            <path d="M 24,34 C 24,18 76,18 76,34 Z" fill="#52b788" />
            <circle cx="36" cy="22" r="6" fill="#fff" stroke="#52b788" strokeWidth="2" />
            <circle cx="36" cy="22" r="3" fill="#000" />
            <circle cx="64" cy="22" r="6" fill="#fff" stroke="#52b788" strokeWidth="2" />
            <circle cx="64" cy="22" r="3" fill="#000" />
          </g>
        );
      case 'poop': // 똥 모자
        return (
          <path d="M 50,12 C 55,12 60,18 55,24 C 65,24 68,34 50,34 C 32,34 35,24 45,24 C 40,18 45,12 50,12 Z" fill="#a06cd5" />
        );
      case 'plunger': // 뚫어뻥
        return (
          <g>
            <rect x="48" y="4" width="4" height="20" fill="#e0aaff" />
            <path d="M 38,24 C 38,18 62,18 62,24 Z" fill="#e63946" />
          </g>
        );
      default:
        return null;
    }
  };

  // 2. 꽃 6종 렌더러
  const renderFlower = () => {
    if (!flower) return null;
    let color = '#ffb703';
    if (flower === '민들레') color = '#ffd166';
    else if (flower === '초록 새싹') color = '#06d6a0';
    else if (flower === '장미') color = '#ef476f';
    else if (flower === '해바라기') color = '#ffb703';
    else if (flower === '네잎클로버') color = '#38b000';
    else if (flower === '황금꽃') color = '#ffd700';

    return (
      <g transform="translate(68, 16)">
        <circle cx="8" cy="8" r="6" fill={color} />
        <circle cx="2" cy="8" r="4" fill="#fff" />
        <circle cx="14" cy="8" r="4" fill="#fff" />
        <circle cx="8" cy="2" r="4" fill="#fff" />
        <circle cx="8" cy="14" r="4" fill="#fff" />
      </g>
    );
  };

  const renderCharacterSvg = () => {
    switch (species) {
      case 'cutie':
        return <Poporing mood={mood} colorPalette={colorPalette} />;
      case 'normal':
        return <Leafy mood={mood} colorPalette={colorPalette} />;
      case 'unique':
        return <Starpy mood={mood} colorPalette={colorPalette} />;
      case 'weird':
        return <Lunafore mood={mood} colorPalette={colorPalette} />;
      default:
        return <Poporing mood={mood} colorPalette={colorPalette} />;
    }
  };

  return (
    <div
      style={{
        width: s,
        height: s,
        transition: 'transform 0.15s ease-in-out',
        transform: bounce ? 'translateY(-4px)' : 'translateY(0px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', inset: 0 }}>
        {renderCharacterSvg()}
      </div>
      
      {/* 장착형 아이템 오버레이용 SVG */}
      <svg
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {renderHat()}
        {renderFlower()}
      </svg>
    </div>
  );
}

