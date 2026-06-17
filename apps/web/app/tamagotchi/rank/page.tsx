'use client';

import React, { useState } from 'react';
import { MiniCharacter } from '@/components/tamagotchi/pixel-character';

type RankType = 'wins' | 'escapes' | 'happy' | 'titles';

const RANK_DATA: Record<RankType, { name: string; info: string; color: string; score: string; species: string }[]> = {
  wins: [
    { name: '감자몬', info: '용맹무쌍 가문 (3대)', color: '#ffd166', score: '142승', species: 'cutie' },
    { name: '도마뱀냥', info: '바람 가문 (5대)', color: '#74c69d', score: '120승', species: 'unique' },
    { name: '먼지몬', info: '번개 가문 (2대)', color: '#b8c0ff', score: '88승', species: 'weird' },
  ],
  escapes: [
    { name: '겁쟁이호랑이', info: '도망 가문 (1대)', color: '#b8c0ff', score: '34회', species: 'weird' },
    { name: '뚜뚜', info: '평범 가문 (4대)', color: '#f4a261', score: '22회', species: 'normal' },
  ],
  happy: [
    { name: '행복이', info: '사랑 가문 (10대)', color: '#ffd166', score: '100% 달성 15회', species: 'cutie' },
  ],
  titles: [
    { name: '수집가', info: '도감 가문 (3대)', color: '#74c69d', score: '칭호 28개', species: 'unique' },
  ],
};

const TABS = [
  { id: 'wins' as RankType, label: '최강 전사', emoji: '⚔️' },
  { id: 'escapes' as RankType, label: '겁쟁이', emoji: '🏃' },
  { id: 'happy' as RankType, label: '행복왕', emoji: '😊' },
  { id: 'titles' as RankType, label: '칭호왕', emoji: '👑' },
];

export default function RankPage() {
  const [activeTab, setActiveTab] = useState<RankType>('wins');
  const data = RANK_DATA[activeTab];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 16, background: 'linear-gradient(180deg, #ffe9c5 0%, #fdf6ee 45%)' }}>
      {/* Header */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: '#9e7b5f', fontFamily: "'DotGothic16', monospace" }}>✦ 영예의 전당 ✦</div>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#3d2c1e' }}>🏆 명예 랭킹</h1>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: isActive ? '#3d2c1e' : '#fffaf4',
                color: isActive ? 'white' : '#9e7b5f',
                border: '1.5px solid',
                borderColor: isActive ? '#3d2c1e' : 'rgba(180,140,100,0.15)',
                borderRadius: 16,
                padding: '8px 12px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ marginRight: 4 }}>{tab.emoji}</span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Rank List */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.map((item, idx) => {
          const isPodium = idx < 3;
          const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`;

          return (
            <div
              key={item.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: '#fffaf4',
                padding: '14px 16px',
                borderRadius: 20,
                border: '1.5px solid rgba(180,140,100,0.12)',
                boxShadow: '0 2px 10px rgba(180,140,100,0.04)',
              }}
            >
              {/* Medal/Rank indicator */}
              <div
                style={{
                  fontSize: isPodium ? 22 : 14,
                  fontWeight: 800,
                  width: 32,
                  textAlign: 'center',
                  color: '#3d2c1e',
                  fontFamily: 'monospace',
                }}
              >
                {medal}
              </div>

              {/* Character Face */}
              <MiniCharacter species={item.species as any} mood="excited" />

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#3d2c1e' }}>{item.name}</div>
                <div style={{ fontSize: 10, color: '#9e7b5f', marginTop: 1 }}>{item.info}</div>
              </div>

              {/* Score Badge */}
              <div
                style={{
                  background: activeTab === 'escapes' ? '#e8f4fd' : '#fce4ec',
                  color: activeTab === 'escapes' ? '#0077b6' : '#b5445a',
                  borderRadius: 12,
                  padding: '4px 10px',
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {item.score}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
