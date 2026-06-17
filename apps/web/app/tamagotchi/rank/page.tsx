'use client';

import React, { useState, useEffect } from 'react';
import { PixelCharacter } from '@/components/tamagotchi/pixel-character';

type RankType = 'wins' | 'escapes' | 'happy' | 'titles';

const TABS = [
  { id: 'wins' as RankType, label: '최강 전사', dbType: 'battleWins' },
  { id: 'escapes' as RankType, label: '겁쟁이', dbType: 'escapeCount' },
  { id: 'happy' as RankType, label: '행복왕', dbType: 'courageGaugeCount' },
  { id: 'titles' as RankType, label: '칭호왕', dbType: 'titles' },
];

export default function RankPage() {
  const [activeTab, setActiveTab] = useState<RankType>('wins');
  const [rankingList, setRankingList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRankings = async (tabId: RankType) => {
    setLoading(true);
    try {
      const selected = TABS.find((t) => t.id === tabId);
      const dbType = selected ? selected.dbType : 'battleWins';
      const res = await fetch(`http://localhost:3002/api/tamagotchi/rank?type=${dbType}`);
      const body = await res.json();
      if (body.success) {
        setRankingList(body.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings(activeTab);
  }, [activeTab]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 16, background: 'linear-gradient(180deg, #ffe9c5 0%, #fdf6ee 45%)' }}>
      <div style={{ marginBottom: 12 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#3d2c1e' }}>🏆 명예 랭킹</h1>
      </div>

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
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 20 }}>순위를 불러오는 중...</div>
        ) : (
          rankingList.map((item, idx) => {
            const isPodium = item.rank <= 3;
            const medal = item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `${item.rank}`;

            return (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: '#fffaf4',
                  padding: '14px 16px',
                  borderRadius: 20,
                  border: '1.5px solid rgba(180,140,100,0.12)',
                }}
              >
                <div style={{ fontSize: isPodium ? 22 : 14, fontWeight: 800, width: 32, textAlign: 'center' }}>
                  {medal}
                </div>

                <PixelCharacter species={item.species} colorPalette={0} mood="excited" size="sm" hat={item.hat} flower={item.flower} />

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{item.name}</div>
                  <div style={{ fontSize: 10, color: '#9e7b5f' }}>{item.representativeTitle || '초보 모험가'}</div>
                </div>

                <div style={{ background: '#fce4ec', color: '#b5445a', borderRadius: 12, padding: '4px 10px', fontSize: 11, fontWeight: 700 }}>
                  {item.value} {activeTab === 'wins' ? '승' : activeTab === 'escapes' ? '회 도망' : activeTab === 'happy' ? '회 행복달성' : '개 해금'}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
