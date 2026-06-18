'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PixelCharacter, TamagotchiMood } from '@/components/tamagotchi/pixel-character';
import { StatusBars, StatItem } from '@/components/tamagotchi/status-bars';
import { SpeechBubble } from '@/components/tamagotchi/speech-bubble';
import { DeviceWrapper } from '@/components/tamagotchi/responsive/device-wrapper';
import { MobileView } from '@/components/tamagotchi/responsive/mobile-view';
import { TabletView } from '@/components/tamagotchi/responsive/tablet-view';
import { DesktopView } from '@/components/tamagotchi/responsive/desktop-view';
import { LandscapeView } from '@/components/tamagotchi/responsive/landscape-view';
import { API_BASE_URL } from '@/constants/api';

export default function TamagotchiPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('test_user_guest');
  const [tamaData, setTamaData] = useState<any>(null);
  const [speech, setSpeech] = useState('헤헤, 주인이랑 노는 게 제일 재밌어!');
  const [mood, setMood] = useState<TamagotchiMood>('happy');

  const fetchMyTama = async (authToken: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/tamagotchi/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const body = await res.json();
      if (body.success && body.data) {
        setTamaData(body.data.tamagotchi);
        // 배고픔 수치에 따른 말풍선 세팅
        const hunger = body.data.tamagotchi.stats.hunger;
        if (hunger >= 70) setSpeech('오늘도 기분 좋아! 산책 가고 싶어!');
        else if (hunger >= 40) setSpeech('음... 심심한데?');
        else if (hunger >= 20) setSpeech('간식 먹고 싶어... 배가 조금 고픈데...');
        else setSpeech('간식 줘... 진짜 배고파... 쓰러질 것 같아...');
      } else {
        router.push('/tamagotchi/hatch');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initSession = async () => {
      const sessionRes = await fetch('/api/auth/session');
      const session = await sessionRes.json();
      const currentToken = session?.user?.kakaoId;
      if (!currentToken) {
        router.push('/');
        return;
      }
      setToken(currentToken);
      await fetchMyTama(currentToken);
    };
    initSession();
  }, []);

  const handleInteract = async (action: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/tamagotchi/interact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });
      const body = await res.json();
      if (body.success) {
        setTamaData(body.data);
        setSpeech(body.message);
        setMood('excited');
        setTimeout(() => setMood('happy'), 1500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getStatsArray = (): StatItem[] => {
    if (!tamaData) return [];
    return [
      { label: '행복도', emoji: '😊', value: tamaData.stats.happiness, color: '#ffb3c1' },
      { label: '배고픔', emoji: '🍪', value: tamaData.stats.hunger, color: '#f4a261' },
      { label: '청결도', emoji: '🛁', value: tamaData.stats.cleanliness, color: '#90c8f0' },
      { label: '용기', emoji: '🦁', value: tamaData.stats.courage, color: '#74c69d' },
    ];
  };

  if (loading || !tamaData) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#9e7b5f' }}>다마고치를 불러오는 중...</div>;
  }

  const renderRoom = () => (
    <div style={{ background: 'linear-gradient(180deg, #d4f0e8 0%, #c9e8ff 60%, #fce4ec 100%)', borderRadius: 24, padding: '18px 20px 14px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 250 }}>
      <div style={{ marginBottom: 16, width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
        <SpeechBubble text={speech} />
      </div>
      <div style={{ marginTop: 'auto', marginBottom: 6 }}>
        <PixelCharacter species={tamaData.species} colorPalette={tamaData.colorPalette} mood={mood} size="lg" flower={tamaData.flower} hat={tamaData.hat} />
      </div>
    </div>
  );

  const renderToolbar = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#9e7b5f', fontFamily: "'DotGothic16', monospace" }}>✦ 상호작용 ✦</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        <button onClick={() => handleInteract('stroke')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 4px', background: '#fffaf4', border: '1.5px solid rgba(180,140,100,0.15)', borderRadius: 16 }}>
          <span style={{ fontSize: 18 }}>🤚</span><span style={{ fontSize: 9, color: '#9e7b5f', fontWeight: 600 }}>쓰다듬기</span>
        </button>
        <button onClick={() => handleInteract('clap')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 4px', background: '#fffaf4', border: '1.5px solid rgba(180,140,100,0.15)', borderRadius: 16 }}>
          <span style={{ fontSize: 18 }}>👏</span><span style={{ fontSize: 9, color: '#9e7b5f', fontWeight: 600 }}>박수치기</span>
        </button>
        <button onClick={() => handleInteract('read')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 4px', background: '#fffaf4', border: '1.5px solid rgba(180,140,100,0.15)', borderRadius: 16 }}>
          <span style={{ fontSize: 18 }}>📚</span><span style={{ fontSize: 9, color: '#9e7b5f', fontWeight: 600 }}>책읽기</span>
        </button>
        <button onClick={() => handleInteract('feed')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 4px', background: '#fffaf4', border: '1.5px solid rgba(180,140,100,0.15)', borderRadius: 16 }}>
          <span style={{ fontSize: 18 }}>🍪</span><span style={{ fontSize: 9, color: '#9e7b5f', fontWeight: 600 }}>간식주기</span>
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 6 }}>
        <Link href="/tamagotchi/plaza" style={{ textAlign: 'center', padding: '10px', background: '#3d2c1e', color: '#fff', borderRadius: 12, fontSize: 12, fontWeight: 700 }}>🏡 광장 가기</Link>
        <Link href="/tamagotchi/battle" style={{ textAlign: 'center', padding: '10px', background: '#e63946', color: '#fff', borderRadius: 12, fontSize: 12, fontWeight: 700 }}>⚔️ PvP 대결</Link>
      </div>
    </div>
  );

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px 8px' }}>
        <div>
          <div style={{ fontSize: 11, color: '#9e7b5f', fontFamily: "'DotGothic16', monospace" }}>
            {tamaData.representativeTitle || '평범한 여행자'}
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#3d2c1e' }}>{tamaData.name} (Gen {tamaData.generation})</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {token === '4708331286' && (
            <Link
              href="/tamagotchi/test-showcase"
              style={{
                background: '#fffaf4',
                border: '1.5px solid #f4a261',
                borderRadius: 12,
                padding: '8px 12px',
                fontSize: 12,
                fontWeight: 700,
                color: '#e28743',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              🎨 외형 테스트
            </Link>
          )}
          <Link href="/tamagotchi/notifications" style={{ background: '#fffaf4', border: '1.5px solid rgba(180,140,100,0.25)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span>🔔</span>
          </Link>
        </div>
      </div>

      <DeviceWrapper
        mobile={<MobileView>{renderRoom()}<StatusBars stats={getStatsArray()} />{renderToolbar()}</MobileView>}
        tablet={<TabletView><div>{renderRoom()}<div style={{ marginTop: 14 }}><StatusBars stats={getStatsArray()} /></div></div>{renderToolbar()}</TabletView>}
        desktop={<DesktopView><div>{renderRoom()}<div style={{ marginTop: 16 }}><StatusBars stats={getStatsArray()} /></div></div><div style={{ background: '#fffaf4', borderRadius: 24, padding: 24, border: '1.5px solid rgba(180,140,100,0.18)' }}>{renderToolbar()}</div></DesktopView>}
        landscape={<LandscapeView><div>{renderRoom()}<div style={{ marginTop: 12 }}><StatusBars stats={getStatsArray()} /></div></div><div style={{ background: '#fffaf4', borderRadius: 20, padding: 16 }}>{renderToolbar()}</div></LandscapeView>}
      />
    </div>
  );
}
