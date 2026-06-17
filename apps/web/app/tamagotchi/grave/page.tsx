'use client';

import React, { useState } from 'react';

const DEPARTED = [
  { id: 1, name: '구름몬', age: 78, generation: 1, text: '주인아.. 맛있는 밥을 줘서 너무 고마웠어.. 흙흙 😭', isAccident: false },
  { id: 2, name: '감자몬 1세', age: 24, generation: 2, text: '전투는 이겼지만 배고픔을 견디지 못했다.. 꼬르륵 🦴', isAccident: true },
];

export default function GravePage() {
  const [selectedDeparted, setSelectedDeparted] = useState<typeof DEPARTED[0] | null>(null);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 16, background: 'linear-gradient(180deg, #d4f0e8 0%, #fdf6ee 50%)' }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: '#2a6b55', fontFamily: "'DotGothic16', monospace" }}>✦ 가문 묘역 ✦</div>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#3d2c1e' }}>🪦 가문 묘지</h1>
      </div>

      <div style={{ fontSize: 12, color: '#9e7b5f', marginBottom: 20, lineHeight: 1.4 }}>
        이곳은 하늘나라로 떠난 자랑스러운 우리 조상들이 잠든 곳입니다. 묘비를 누르면 생전 남기신 유언을 볼 수 있습니다.
      </div>

      {/* Grave Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {DEPARTED.map((dep) => (
          <button
            key={dep.id}
            onClick={() => setSelectedDeparted(dep)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: 48, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>🪦</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#3d2c1e', marginTop: 4 }}>
              {dep.name}
            </div>
            <div style={{ fontSize: 9, color: '#9e7b5f' }}>
              {dep.generation}대 조상
            </div>
          </button>
        ))}
      </div>

      {/* Grave Detail Modal */}
      {selectedDeparted && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            style={{
              background: '#fdf6ee',
              borderRadius: 24,
              padding: 20,
              width: '100%',
              maxWidth: 320,
              border: '3.5px solid #3d2c1e',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 8 }}>🕯️</div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#3d2c1e', marginBottom: 2 }}>
              {selectedDeparted.name}의 묘비
            </h3>
            <div style={{ fontSize: 11, color: '#9e7b5f', marginBottom: 14 }}>
              향년 {selectedDeparted.age}세 ({selectedDeparted.generation}대 세대)
            </div>

            <div
              style={{
                background: '#fffaf4',
                padding: 14,
                borderRadius: 16,
                border: '1.5px solid rgba(180,140,100,0.15)',
                fontSize: 12,
                color: '#3d2c1e',
                lineHeight: 1.5,
                marginBottom: 16,
                minHeight: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              "{selectedDeparted.text}"
            </div>

            <button
              onClick={() => setSelectedDeparted(null)}
              style={{
                width: '100%',
                background: '#3d2c1e',
                color: 'white',
                border: 'none',
                padding: '10px',
                borderRadius: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              추모 마치기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
