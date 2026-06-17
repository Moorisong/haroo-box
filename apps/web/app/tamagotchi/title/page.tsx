'use client';

import React, { useState } from 'react';

type TitleTab = 'char' | 'family';

const CHAR_TITLES = [
  { name: '🐣 갓 태어난 알', desc: '부화에 성공한 어린 다마고치', unlocked: true, progress: 100 },
  { name: '🏆 용감한 전사', desc: 'PvP 아레나에서 10회 이상 승리', unlocked: true, progress: 100 },
  { name: '🏃 신속한 도망자', desc: '전투 중 도망치기 5회 성공', unlocked: false, progress: 60 },
  { name: '🍪 간식 수집가', desc: '간식 주기 누적 50회 달성', unlocked: false, progress: 20 },
];

const FAMILY_TITLES = [
  { name: '🏰 명문 가문', desc: '세대 계승을 통해 5대 이상 이어가기', unlocked: false, progress: 40 },
  { name: '👑 황실 가문', desc: '가문 총 전투 500승 달성', unlocked: false, progress: 10 },
];

export default function TitlePage() {
  const [activeTab, setActiveTab] = useState<TitleTab>('char');
  const list = activeTab === 'char' ? CHAR_TITLES : FAMILY_TITLES;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 16, background: 'linear-gradient(180deg, #e8f4fd 0%, #fdf6ee 45%)' }}>
      {/* Header */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: '#9e7b5f', fontFamily: "'DotGothic16', monospace" }}>✦ 칭호 컬렉션 ✦</div>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#3d2c1e' }}>🐾 칭호 도감</h1>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', background: '#fffaf4', border: '1.5px solid rgba(180,140,100,0.18)', borderRadius: 16, padding: 3, marginBottom: 16 }}>
        <button
          onClick={() => setActiveTab('char')}
          style={{
            flex: 1,
            background: activeTab === 'char' ? '#3d2c1e' : 'transparent',
            color: activeTab === 'char' ? 'white' : '#9e7b5f',
            border: 'none',
            padding: '8px',
            borderRadius: 12,
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          개체 칭호
        </button>
        <button
          onClick={() => setActiveTab('family')}
          style={{
            flex: 1,
            background: activeTab === 'family' ? '#3d2c1e' : 'transparent',
            color: activeTab === 'family' ? 'white' : '#9e7b5f',
            border: 'none',
            padding: '8px',
            borderRadius: 12,
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          가문 칭호
        </button>
      </div>

      {/* Title List */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto' }}>
        {list.map((item) => (
          <div
            key={item.name}
            style={{
              background: '#fffaf4',
              borderRadius: 20,
              padding: '14px 16px',
              border: '1.5px solid rgba(180,140,100,0.12)',
              boxShadow: '0 2px 10px rgba(180,140,100,0.04)',
              opacity: item.unlocked ? 1 : 0.75,
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: item.unlocked ? '#3d2c1e' : '#9e7b5f' }}>
                {item.unlocked ? item.name : '🔒 미해금 칭호'}
              </span>
              {item.unlocked && (
                <span style={{ fontSize: 10, background: '#d4f0e8', color: '#2a6b55', padding: '2px 8px', borderRadius: 8, fontWeight: 700 }}>
                  해금됨
                </span>
              )}
            </div>

            <p style={{ fontSize: 11, color: '#9e7b5f', margin: '0 0 10px 0', lineHeight: 1.4 }}>
              {item.desc}
            </p>

            {/* Progress Bar */}
            {!item.unlocked && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#c4a882', marginBottom: 4 }}>
                  <span>해금 진행률</span>
                  <span>{item.progress}%</span>
                </div>
                <div style={{ background: '#f5e6d3', height: 6, borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ background: '#f4a261', width: `${item.progress}%`, height: '100%' }} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
