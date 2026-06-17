'use client';

import React, { useState, useEffect } from 'react';

export default function GravePage() {
  const [departed, setDeparted] = useState<any[]>([]);
  const [selectedDeparted, setSelectedDeparted] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGraves = async () => {
      try {
        const sessionRes = await fetch('/api/auth/session');
        const session = await sessionRes.json();
        const currentToken = session?.user?.kakaoId || 'test_user_guest';

        const res = await fetch('http://localhost:3002/api/tamagotchi/family/grave', {
          headers: { Authorization: `Bearer ${currentToken}` },
        });
        const body = await res.json();
        if (body.success) {
          setDeparted(body.data || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadGraves();
  }, []);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 16, background: 'linear-gradient(180deg, #d4f0e8 0%, #fdf6ee 50%)' }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#3d2c1e' }}>🪦 가문 묘지</h1>
      </div>

      <div style={{ fontSize: 12, color: '#9e7b5f', marginBottom: 20, lineHeight: 1.4 }}>
        이곳은 하늘나라로 떠난 자랑스러운 우리 조상들이 잠든 곳입니다. 묘비를 누르면 생전의 유언 및 사망 원인을 볼 수 있습니다.
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 20 }}>묘지를 정리하는 중...</div>
      ) : departed.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#9e7b5f', fontSize: 13 }}>아직 이곳에 잠든 조상이 없습니다.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {departed.map((dep) => (
            <button key={dep._id} onClick={() => setSelectedDeparted(dep)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer' }}>
              {/* 이모지 없이 직접 구현된 비석 SVG */}
              <svg width="48" height="60" viewBox="0 0 40 50">
                <path d="M 6,48 L 6,18 C 6,8 34,8 34,18 L 34,48 Z" fill="#6c757d" stroke="#495057" strokeWidth="2.5" />
                <line x1="20" y1="18" x2="20" y2="34" stroke="#f8f9fa" strokeWidth="3" />
                <line x1="14" y1="24" x2="26" y2="24" stroke="#f8f9fa" strokeWidth="3" />
              </svg>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#3d2c1e', marginTop: 4 }}>{dep.name}</div>
              <div style={{ fontSize: 9, color: '#9e7b5f' }}>{dep.generation}대 조상</div>
            </button>
          ))}
        </div>
      )}

      {selectedDeparted && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fdf6ee', borderRadius: 24, padding: 20, width: '100%', maxWidth: 320, border: '3.5px solid #3d2c1e', textAlign: 'center' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#3d2c1e', marginBottom: 2 }}>{selectedDeparted.name}의 묘비</h3>
            <div style={{ fontSize: 11, color: '#9e7b5f', marginBottom: 14 }}>
              ({selectedDeparted.generation}대 조상)
            </div>

            <div style={{ background: '#fffaf4', padding: 14, borderRadius: 16, border: '1.5px solid rgba(180,140,100,0.15)', fontSize: 12, color: '#3d2c1e', lineHeight: 1.5, marginBottom: 16, minHeight: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div>"주인아.. 맛있는 밥을 줘서 너무 고마웠어.."</div>
              <div style={{ fontSize: 10, color: '#e63946', marginTop: 8 }}>사망 원인: {selectedDeparted.deathReason}</div>
            </div>

            <button onClick={() => setSelectedDeparted(null)} style={{ width: '100%', background: '#3d2c1e', color: 'white', border: 'none', padding: '10px', borderRadius: 12, fontWeight: 700 }}>추모 마치기</button>
          </div>
        </div>
      )}
    </div>
  );
}
