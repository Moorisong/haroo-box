'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PixelCharacter, TamagotchiSpecies, TamagotchiMood } from '@/components/tamagotchi/pixel-character';
import { StatusBars, StatItem } from '@/components/tamagotchi/status-bars';
import { SpeechBubble } from '@/components/tamagotchi/speech-bubble';
import { DeviceWrapper } from '@/components/tamagotchi/responsive/device-wrapper';
import { MobileView } from '@/components/tamagotchi/responsive/mobile-view';
import { TabletView } from '@/components/tamagotchi/responsive/tablet-view';
import { DesktopView } from '@/components/tamagotchi/responsive/desktop-view';

const FLOWER_DECORATIONS = ['🌸', '🌹', '🌻', '🌿', '🍂'];

export default function TamagotchiPage() {
  const [species] = useState<TamagotchiSpecies>('cutie');
  const [mood, setMood] = useState<TamagotchiMood>('happy');
  const [speech, setSpeech] = useState('헤헤, 주인이랑 노는 게 제일 재밌어! 🌸');
  const [flower, setFlower] = useState<string | null>(null);
  const [stats, setStats] = useState<StatItem[]>([
    { label: '행복도', emoji: '😊', value: 85, color: '#ffb3c1' },
    { label: '배고픔', emoji: '🍞', value: 60, color: '#f4a261' },
    { label: '청결도', emoji: '🛁', value: 75, color: '#90c8f0' },
    { label: '용기', emoji: '🦁', value: 40, color: '#74c69d' },
  ]);

  const updateStats = (delta: Partial<Record<string, number>>, nextMood: TamagotchiMood, actionMsg: string) => {
    setStats((prev) =>
      prev.map((s) => ({ ...s, value: Math.min(100, Math.max(0, s.value + (delta[s.label] || 0))) }))
    );
    setMood(nextMood);
    setSpeech(actionMsg);
    setTimeout(() => setMood('happy'), 1500);
  };

  // 공통 다마고치 방 렌더러
  const renderRoom = () => (
    <div
      style={{
        background: 'linear-gradient(180deg, #d4f0e8 0%, #c9e8ff 60%, #fce4ec 100%)',
        borderRadius: 24,
        padding: '18px 20px 14px',
        border: '1.5px solid rgba(180,140,100,0.18)',
        boxShadow: '0 8px 20px rgba(180,140,100,0.08)',
        minHeight: 250,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{ position: 'absolute', top: 12, right: 16, width: 50, height: 50, background: '#b8e0f7', borderRadius: 8, border: '2px solid white', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.6)' }} />
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.6)' }} />
        <div style={{ position: 'absolute', bottom: 4, left: 4, fontSize: 10 }}>⛅</div>
      </div>
      <div style={{ marginBottom: 16, width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
        <SpeechBubble text={speech} />
      </div>
      <div style={{ marginTop: 'auto', marginBottom: 6 }}>
        <PixelCharacter species={species} mood={mood} size="lg" flower={flower} hat="crown" />
      </div>
    </div>
  );

  // 공통 상호작용 툴바 렌더러
  const renderToolbar = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#9e7b5f', fontFamily: "'DotGothic16', monospace" }}>✦ 상호작용 ✦</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        <button
          onClick={() => updateStats({ 행복도: 8 }, 'excited', '아주 기분이 째져요! 😊')}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 4px', background: '#fffaf4', border: '1.5px solid rgba(180,140,100,0.15)', borderRadius: 16 }}
        >
          <span style={{ fontSize: 20 }}>🤚</span>
          <span style={{ fontSize: 9, color: '#9e7b5f', fontWeight: 600 }}>쓰다듬기</span>
        </button>
        <button
          onClick={() => updateStats({ 행복도: 5, 용기: 3 }, 'excited', '칭찬은 나를 춤추게 해! 👏')}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 4px', background: '#fffaf4', border: '1.5px solid rgba(180,140,100,0.15)', borderRadius: 16 }}
        >
          <span style={{ fontSize: 20 }}>👏</span>
          <span style={{ fontSize: 9, color: '#9e7b5f', fontWeight: 600 }}>박수치기</span>
        </button>
        <button
          onClick={() => updateStats({ 용기: 8 }, 'sleepy', '책을 읽으니 유식해진 기분! 📚')}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 4px', background: '#fffaf4', border: '1.5px solid rgba(180,140,100,0.15)', borderRadius: 16 }}
        >
          <span style={{ fontSize: 20 }}>📚</span>
          <span style={{ fontSize: 9, color: '#9e7b5f', fontWeight: 600 }}>책읽기</span>
        </button>
        <button
          onClick={() => updateStats({ 배고픔: 15 }, 'happy', '냠냠! 너무 달콤하고 맛있어요 🍪')}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 4px', background: '#fffaf4', border: '1.5px solid rgba(180,140,100,0.15)', borderRadius: 16 }}
        >
          <span style={{ fontSize: 20 }}>🍪</span>
          <span style={{ fontSize: 9, color: '#9e7b5f', fontWeight: 600 }}>간식주기</span>
        </button>
      </div>
      <div style={{ marginTop: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#9e7b5f', fontFamily: "'DotGothic16', monospace", marginBottom: 8 }}>✦ 장착 장식 선택 ✦</div>
        <div style={{ display: 'flex', gap: 8, background: '#fffaf4', padding: 10, borderRadius: 16, border: '1.5px solid rgba(180,140,100,0.15)' }}>
          <button onClick={() => setFlower(null)} style={{ padding: '6px 12px', background: flower === null ? '#f4a261' : 'transparent', color: flower === null ? 'white' : '#9e7b5f', borderRadius: 12, fontSize: 11, fontWeight: 700 }}>없음</button>
          {FLOWER_DECORATIONS.map((fl) => (
            <button key={fl} onClick={() => setFlower(fl)} style={{ width: 32, height: 32, fontSize: 18, background: flower === fl ? '#f4a261' : 'transparent', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{fl}</button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px 8px' }}>
        <div>
          <div style={{ fontSize: 11, color: '#9e7b5f', fontFamily: "'DotGothic16', monospace" }}>✦ 나의 파트너 ✦</div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#3d2c1e' }}>감자몬</h1>
        </div>
        <Link href="/tamagotchi/notifications" style={{ background: '#fffaf4', border: '1.5px solid rgba(180,140,100,0.25)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(180,140,100,0.08)', position: 'relative' }}>
          <span>🔔</span>
          <span style={{ position: 'absolute', top: 5, right: 5, width: 8, height: 8, background: '#e05c5c', borderRadius: '50%', border: '1.5px solid white' }} />
        </Link>
      </div>

      <DeviceWrapper
        mobile={
          <MobileView>
            {renderRoom()}
            <StatusBars stats={stats} />
            {renderToolbar()}
          </MobileView>
        }
        tablet={
          <TabletView>
            <div>
              {renderRoom()}
              <div style={{ marginTop: 14 }}>
                <StatusBars stats={stats} />
              </div>
            </div>
            {renderToolbar()}
          </TabletView>
        }
        desktop={
          <DesktopView>
            <div>
              {renderRoom()}
              <div style={{ marginTop: 16 }}>
                <StatusBars stats={stats} />
              </div>
            </div>
            <div style={{ background: '#fffaf4', borderRadius: 24, padding: 24, border: '1.5px solid rgba(180,140,100,0.18)', boxShadow: '0 8px 20px rgba(180,140,100,0.04)' }}>
              {renderToolbar()}
            </div>
          </DesktopView>
        }
      />
    </div>
  );
}
