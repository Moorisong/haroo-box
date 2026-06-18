'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PixelCharacter, TamagotchiSpecies, TamagotchiMood } from '@/components/tamagotchi/pixel-character';

// 조합용 더미 데이터
const HATS = ['crown', 'ribbon', 'sunglasses', 'helmet', 'cap', 'box', 'pot', 'frog', 'poop', 'plunger', null];
const FLOWERS = ['민들레', '초록 새싹', '장미', '해바라기', '네잎클로버', '황금꽃', null];
const MOODS: TamagotchiMood[] = ['happy', 'sleepy', 'excited', 'hungry'];

interface ShowcaseItem {
  colorPalette: number;
  mood: TamagotchiMood;
  hat: string | null;
  flower: string | null;
}

export default function TestShowcasePage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const sessionRes = await fetch('/api/auth/session');
        const session = await sessionRes.json();
        const kakaoId = session?.user?.kakaoId;
        const adminId = process.env.NEXT_PUBLIC_ADMIN_KAKAO_ID || '4708331286';
        if (!kakaoId || kakaoId !== adminId) {
          router.push('/tamagotchi');
        } else {
          setAuthorized(true);
        }
      } catch {
        router.push('/tamagotchi');
      }
    };
    checkAuth();
  }, [router]);

  const speciesList: { type: TamagotchiSpecies; name: string }[] = [
    { type: 'cutie', name: '귀염상 (포포링)' },
    { type: 'normal', name: '평범상 (곰돌이)' },
    { type: 'unique', name: '개성상 (고양이)' },
    { type: 'weird', name: '기괴상 (슬라임)' },
  ];

  // 각 종족별로 10개의 고정된 랜덤 조합 생성 (렌더링 안정성을 위해 useMemo 사용)
  const itemsPerSpecies = useMemo(() => {
    const data: Record<TamagotchiSpecies, ShowcaseItem[]> = {
      cutie: [],
      normal: [],
      unique: [],
      weird: [],
    };

    const speciesKeys: TamagotchiSpecies[] = ['cutie', 'normal', 'unique', 'weird'];

    speciesKeys.forEach((sp) => {
      for (let i = 0; i < 10; i++) {
        // i 값과 수식을 조합해 고정 난수 시드처럼 활용하여 빌드 에러 방지
        const colorPalette = (i * 2 + sp.length) % 5;
        const mood = MOODS[(i + 1) % MOODS.length];
        const hat = HATS[(i * 3) % HATS.length];
        const flower = FLOWERS[(i * 2) % FLOWERS.length];
        data[sp].push({ colorPalette, mood, hat, flower });
      }
    });

    return data;
  }, []);

  if (authorized !== true) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#fdf6ee', color: '#9e7b5f' }}>
        권한을 확인하는 중입니다...
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 20px', background: '#fdf6ee', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Link
          href="/tamagotchi"
          style={{
            textDecoration: 'none',
            color: '#3d2c1e',
            fontWeight: 800,
            fontSize: 14,
            padding: '8px 14px',
            background: '#fffaf4',
            border: '1.5px solid rgba(180,140,100,0.2)',
            borderRadius: 12,
          }}
        >
          ← 돌아가기
        </Link>
        <h1 style={{ fontSize: 20, color: '#3d2c1e', fontWeight: 900, margin: 0 }}>
          종족별 외형 조합 쇼케이스 (각 10종)
        </h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {speciesList.map((sp) => (
          <div key={sp.type} style={{ background: '#fff', borderRadius: 20, padding: 20, border: '1.5px solid rgba(180,140,100,0.12)' }}>
            <h2 style={{ fontSize: 16, color: '#b5445a', fontWeight: 800, marginBottom: 16, borderBottom: '2px dashed #fdf6ee', paddingBottom: 8 }}>
              ✨ {sp.name} 조합 예시
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                gap: 12,
              }}
            >
              {itemsPerSpecies[sp.type].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: '#fffaf4',
                    border: '1px solid rgba(180,140,100,0.1)',
                    borderRadius: 16,
                    padding: '12px 8px',
                    textAlign: 'center',
                  }}
                >
                  <PixelCharacter
                    species={sp.type}
                    colorPalette={item.colorPalette}
                    mood={item.mood}
                    size="md"
                    hat={item.hat}
                    flower={item.flower}
                  />
                  <div style={{ fontSize: 9, color: '#9e7b5f', marginTop: 8, lineHeight: 1.3 }}>
                    <div style={{ fontWeight: 700, color: '#3d2c1e' }}>조합 {idx + 1}</div>
                    <div>팔레트: {item.colorPalette}</div>
                    <div>기분: {item.mood}</div>
                    {item.hat && <div style={{ color: '#b5445a' }}>모자: {item.hat}</div>}
                    {item.flower && <div style={{ color: '#2a9d8f' }}>꽃: {item.flower}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
