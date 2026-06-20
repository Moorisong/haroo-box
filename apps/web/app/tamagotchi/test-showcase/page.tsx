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
  eyeType: number;
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

  // 모든 종족에 대해 5가지 팔레트 * 5가지 눈 모양 = 25종의 테스트 케이스를 생성
  const itemsPerSpecies = useMemo(() => {
    const data: Record<TamagotchiSpecies, ShowcaseItem[]> = {
      cutie: [],
      normal: [],
      unique: [],
      weird: [],
    };

    const speciesKeys: TamagotchiSpecies[] = ['cutie', 'normal', 'unique', 'weird'];

    speciesKeys.forEach((sp) => {
      let i = 0;
      for (let palette = 0; palette < 5; palette++) {
        for (let eye = 0; eye < 5; eye++) {
          const mood = MOODS[i % MOODS.length];
          const hat = i % 3 === 0 ? HATS[(i * 3) % HATS.length] : null;
          const flower = i % 4 === 0 ? FLOWERS[(i * 2) % FLOWERS.length] : null;
          data[sp].push({ colorPalette: palette, eyeType: eye, mood, hat, flower });
          i++;
        }
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
          종족별 외형 조합 쇼케이스 (색상 5종 × 눈모양 5종 = 각 25종)
        </h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {speciesList.map((sp) => (
          <div key={sp.type} style={{ background: '#fff', borderRadius: 20, padding: 20, border: '1.5px solid rgba(180,140,100,0.12)' }}>
            <h2 style={{ fontSize: 16, color: '#b5445a', fontWeight: 800, marginBottom: 16, borderBottom: '2px dashed #fdf6ee', paddingBottom: 8 }}>
              ✨ {sp.name} 조합 예시 (총 {itemsPerSpecies[sp.type].length}개)
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
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
                    eyeType={item.eyeType}
                    mood={item.mood}
                    size="md"
                    hat={item.hat}
                    flower={item.flower}
                  />
                  <div style={{ fontSize: 10, color: '#9e7b5f', marginTop: 8, lineHeight: 1.4 }}>
                    <div style={{ fontWeight: 800, color: '#3d2c1e' }}>조합 {idx + 1}</div>
                    <div>색상: Type {item.colorPalette}</div>
                    <div style={{ color: '#0077b6', fontWeight: 700 }}>눈모양: Type {item.eyeType}</div>
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
