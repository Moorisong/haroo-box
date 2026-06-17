'use client';

import React from 'react';
import Link from 'next/link';

const ANCESTORS = [
  { generation: 2, name: '초코냥', age: 72, job: '⚡ 전설의 전사', deathReason: '자연사' },
  { generation: 1, name: '구름이', age: 65, job: '🛡️ 용감한 방패', deathReason: '산책 중 낙뢰 사고사' },
];

export default function FamilyPage() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 16, background: 'linear-gradient(180deg, #fce4ec 0%, #fdf6ee 45%)' }}>
      {/* Header */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: '#b5445a', fontFamily: "'DotGothic16', monospace" }}>✦ 세대 계승 ✦</div>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#3d2c1e' }}>🏰 가문 가계도</h1>
      </div>

      {/* 가문 카드 정보 */}
      <div
        style={{
          background: '#fffaf4',
          borderRadius: 24,
          padding: 16,
          border: '1.5px solid rgba(180,140,100,0.18)',
          boxShadow: '0 4px 12px rgba(180,140,100,0.04)',
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#3d2c1e' }}>용맹무쌍 가문</span>
          <span style={{ fontSize: 11, background: '#fce4ec', color: '#b5445a', borderRadius: 8, padding: '2px 8px', fontWeight: 700 }}>
            현재 3대 세대
          </span>
        </div>
        <div style={{ fontSize: 11, color: '#9e7b5f', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div>창립일: 2026.06.17</div>
          <div>대표 가문 칭호: 👑 명가 (해금 완료)</div>
        </div>
      </div>

      {/* 계승 액션 */}
      <div
        style={{
          background: '#fffaf4',
          borderRadius: 20,
          padding: 14,
          border: '1.5px solid rgba(180,140,100,0.12)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 18,
        }}
      >
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#3d2c1e' }}>💍 후계자 계승 및 자연사 준비</div>
          <div style={{ fontSize: 10, color: '#9e7b5f', marginTop: 2 }}>다마고치 나이가 20세 이상이면 계승 가능</div>
        </div>
        <Link
          href="/tamagotchi/hatch"
          style={{
            background: '#b5445a',
            color: 'white',
            border: 'none',
            borderRadius: 12,
            padding: '8px 14px',
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          🥚 후계자 맞이
        </Link>
      </div>

      {/* 조상 히스토리 타임라인 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#9e7b5f', fontFamily: "'DotGothic16', monospace", marginBottom: 10 }}>
          ✦ 역대 은퇴 조상 타임라인
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
          {ANCESTORS.map((anc) => (
            <div
              key={anc.generation}
              style={{
                display: 'flex',
                gap: 12,
                position: 'relative',
                paddingLeft: 12,
                borderLeft: '2px solid rgba(180,140,100,0.3)',
              }}
            >
              {/* timeline dot */}
              <div
                style={{
                  position: 'absolute',
                  left: -5,
                  top: 4,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#b5445a',
                }}
              />

              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#3d2c1e' }}>
                  {anc.generation}대 조상: {anc.name} (향년 {anc.age}세)
                </div>
                <div style={{ fontSize: 10, color: '#9e7b5f', marginTop: 2 }}>
                  직업/칭호: {anc.job} | 사인: {anc.deathReason}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
