'use client';

import React, { useState, useEffect } from 'react';

type TitleTab = 'char' | 'family';

const ALL_POSSIBLE_TITLES = [
  { name: '🏆 최강의 전사', desc: '전투 100승 달성' },
  { name: '🥊 싸움 좀 하는 놈', desc: '전투 10승 달성' },
  { name: '💀 불사신', desc: '전투 10연승 달성' },
  { name: '😈 싸움광', desc: '전투 300회 참여' },
  { name: '🦁 겁 없는 녀석', desc: '용기 100 달성' },
  { name: '😭 겁쟁이', desc: '전투 중 첫 도망 성공' },
  { name: '🏳️ 도망의 신', desc: '전투 도망 50회 달성' },
  { name: '😊 세상에서 제일 행복한 놈', desc: '행복도 100 달성 100회' },
  { name: '🧼 목욕혐오자', desc: '목욕 거부 30회 달성' },
  { name: '🏃 욕실 탈옥범', desc: '목욕 거부 후 도망 10회 성공' },
  { name: '💩 냄새나는 전설', desc: '청결도 0 상태에서 전투 승리' },
  { name: '💤 방치의 달인', desc: '행복도·배고픔·청결도 모두 0 달성' },
];

const FAMILY_TITLES_LIST = [
  { name: '🌱 가문의 시작', gen: 1 },
  { name: '🥚 첫 번째 후계자', gen: 2 },
  { name: '🧸 작은 가문', gen: 3 },
  { name: '🏠 터 잡은 집안', gen: 5 },
  { name: '👨‍👩‍👧 대가족', gen: 10 },
  { name: '🏛️ 명문가의 기초', gen: 20 },
  { name: '🏰 명문 가문', gen: 50 },
];

export default function TitlePage() {
  const [activeTab, setActiveTab] = useState<TitleTab>('char');
  const [unlockedTitles, setUnlockedTitles] = useState<string[]>([]);
  const [unlockedFamilyTitles, setUnlockedFamilyTitles] = useState<string[]>([]);
  const [token, setToken] = useState('test_user_guest');

  useEffect(() => {
    const loadTitles = async () => {
      const sessionRes = await fetch('/api/auth/session');
      const session = await sessionRes.json();
      const currentToken = session?.user?.kakaoId || 'test_user_guest';
      setToken(currentToken);

      const tamaRes = await fetch('http://localhost:3002/api/tamagotchi/me', {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      const tamaBody = await tamaRes.json();
      if (tamaBody.success && tamaBody.data) {
        setUnlockedTitles(tamaBody.data.tamagotchi.unlockedTitles || []);
      }

      const familyRes = await fetch('http://localhost:3002/api/tamagotchi/family/info', {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      const familyBody = await familyRes.json();
      if (familyBody.success && familyBody.data) {
        setUnlockedFamilyTitles(familyBody.data.unlockedFamilyTitles || []);
      }
    };
    loadTitles();
  }, []);

  const handleSelectTitle = async (title: string) => {
    try {
      const res = await fetch('http://localhost:3002/api/tamagotchi/title/representative', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });
      const body = await res.json();
      if (body.success) {
        alert(`대표 칭호가 [${title}]로 변경되었습니다!`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 16, background: 'linear-gradient(180deg, #e8f4fd 0%, #fdf6ee 45%)' }}>
      <div style={{ marginBottom: 12 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#3d2c1e' }}>🐾 칭호 도감</h1>
      </div>

      <div style={{ display: 'flex', background: '#fffaf4', border: '1.5px solid rgba(180,140,100,0.18)', borderRadius: 16, padding: 3, marginBottom: 16 }}>
        <button onClick={() => setActiveTab('char')} style={{ flex: 1, background: activeTab === 'char' ? '#3d2c1e' : 'transparent', color: activeTab === 'char' ? 'white' : '#9e7b5f', border: 'none', padding: '8px', borderRadius: 12, fontSize: 12, fontWeight: 700 }}>개체 칭호</button>
        <button onClick={() => setActiveTab('family')} style={{ flex: 1, background: activeTab === 'family' ? '#3d2c1e' : 'transparent', color: activeTab === 'family' ? 'white' : '#9e7b5f', border: 'none', padding: '8px', borderRadius: 12, fontSize: 12, fontWeight: 700 }}>가문 칭호</button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto' }}>
        {activeTab === 'char' ? (
          ALL_POSSIBLE_TITLES.map((t) => {
            const isUnlocked = unlockedTitles.includes(t.name);
            return (
              <div key={t.name} onClick={() => isUnlocked && handleSelectTitle(t.name)} style={{ background: '#fffaf4', borderRadius: 20, padding: '14px 16px', border: '1.5px solid rgba(180,140,100,0.12)', opacity: isUnlocked ? 1 : 0.6, cursor: isUnlocked ? 'pointer' : 'default' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</span>
                  <span style={{ fontSize: 10, background: isUnlocked ? '#d4f0e8' : '#e5e5e5', padding: '2px 8px', borderRadius: 8 }}>{isUnlocked ? '대표장착가능 (클릭)' : '미해금'}</span>
                </div>
                <p style={{ fontSize: 11, color: '#9e7b5f', margin: '6px 0 0 0' }}>{t.desc}</p>
              </div>
            );
          })
        ) : (
          FAMILY_TITLES_LIST.map((f) => {
            const isUnlocked = unlockedFamilyTitles.includes(f.name);
            return (
              <div key={f.name} style={{ background: '#fffaf4', borderRadius: 20, padding: '14px 16px', border: '1.5px solid rgba(180,140,100,0.12)', opacity: isUnlocked ? 1 : 0.6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{f.name}</span>
                  <span style={{ fontSize: 10 }}>{isUnlocked ? '해금됨' : `달성 조건: ${f.gen}대`}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
