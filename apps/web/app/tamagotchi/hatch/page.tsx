'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PixelCharacter, TamagotchiSpecies } from '@/components/tamagotchi/pixel-character';
import { API_BASE_URL } from '@/constants/api';

const SPECIES_LIST = [
  { type: 'cutie' as TamagotchiSpecies, title: '귀염상', desc: '사랑스럽고 동글동글한 애교쟁이' },
  { type: 'weird' as TamagotchiSpecies, title: '기괴상', desc: '알 수 없는 표정을 짓는 개구쟁이' },
  { type: 'normal' as TamagotchiSpecies, title: '평범상', desc: '평화롭고 어디에나 있는 든든한 친구' },
  { type: 'unique' as TamagotchiSpecies, title: '개성상', desc: '나만의 스타일을 확실하게 표현하는 개성파' },
];

export default function HatchPage() {
  const router = useRouter();
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(0); // 0: Welcome Screen 추가
  const [selectedSpecies, setSelectedSpecies] = useState<TamagotchiSpecies>('cutie');
  const [name, setName] = useState('');
  const [crackCount, setCrackCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [hatchedData, setHatchedData] = useState<{ colorPalette: number; hat: string | null } | null>(null);

  const checkNameAndHatch = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const sessionRes = await fetch('/api/auth/session');
      const session = await sessionRes.json();
      const token = session?.user?.kakaoId || 'test_user_guest';

      const res = await fetch(`${API_BASE_URL}/api/tamagotchi/hatch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, species: selectedSpecies }),
      });

      const body = await res.json();
      if (!body.success) {
        setErrorMsg(body.error || '부화 중 오류가 발생했습니다.');
        setStep(2);
      } else {
        setHatchedData({
          colorPalette: body.data.colorPalette,
          hat: body.data.hat,
        });
        setStep(4);
      }
    } catch {
      setErrorMsg('서버와 통신할 수 없습니다.');
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleCrackEgg = () => {
    if (crackCount < 3) {
      setCrackCount((c) => c + 1);
    } else {
      checkNameAndHatch();
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: 'linear-gradient(180deg, #ffe9c5 0%, #fdf6ee 100%)',
        textAlign: 'center',
      }}
    >
      {step === 0 && (
        <div style={{ width: '100%', maxWidth: 360 }}>
          <div style={{ fontSize: 14, color: '#b5445a', fontFamily: "'DotGothic16', monospace", fontWeight: 700, marginBottom: 8 }}>
            ✦ BATTLE TAMAGOTCHI ✦
          </div>
          <h1 style={{ fontSize: 26, color: '#3d2c1e', fontWeight: 900, marginBottom: 16 }}>
            전투 다마고치 아레나
          </h1>
          <p style={{ fontSize: 13, color: '#9e7b5f', lineHeight: 1.6, marginBottom: 32 }}>
            이상하게 생긴 녀석을 잘 먹이고 씻겨 키운 뒤,<br />
            다른 녀석의 뚝배기를 깨부수고 랭킹을 차지해보세요!
          </p>

          <div style={{ margin: '40px 0', display: 'flex', justifyContent: 'center' }}>
            <svg width="100" height="120" viewBox="0 0 100 120">
              <ellipse cx="50" cy="65" rx="38" ry="48" fill="#ffd166" stroke="#f4a261" strokeWidth="4" />
              <path d="M 45,35 Q 50,25 55,35" stroke="#f4a261" strokeWidth="3" fill="none" />
              <path d="M 35,65 Q 50,70 65,65" stroke="#f4a261" strokeWidth="3" fill="none" />
            </svg>
          </div>

          <button
            onClick={() => setStep(1)}
            style={{
              width: '100%',
              background: '#b5445a',
              color: 'white',
              border: 'none',
              padding: '16px',
              borderRadius: 24,
              fontSize: 16,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 8px 16px rgba(181, 68, 90, 0.25)',
            }}
          >
            새로운 알 부화하기
          </button>
        </div>
      )}

      {step === 1 && (
        <div style={{ width: '100%' }}>
          <div style={{ fontSize: 13, color: '#9e7b5f', fontFamily: "'DotGothic16', monospace", marginBottom: 8 }}>
            ✦ STEP 01 / 03 ✦
          </div>
          <h2 style={{ fontSize: 20, color: '#3d2c1e', fontWeight: 800, marginBottom: 12 }}>
            탄생할 다마고치의 종족을 골라주세요
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', margin: '20px 0' }}>
            {SPECIES_LIST.map((sp) => (
              <button
                key={sp.type}
                onClick={() => setSelectedSpecies(sp.type)}
                style={{
                  background: selectedSpecies === sp.type ? '#f4a261' : '#fffaf4',
                  border: '2px solid',
                  borderColor: selectedSpecies === sp.type ? '#f4a261' : 'rgba(180, 140, 100, 0.2)',
                  borderRadius: 20,
                  padding: '14px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 15, color: selectedSpecies === sp.type ? 'white' : '#3d2c1e' }}>
                  {sp.title}
                </div>
                <div style={{ fontSize: 11, color: selectedSpecies === sp.type ? 'rgba(255,255,255,0.85)' : '#9e7b5f', marginTop: 2 }}>
                  {sp.desc}
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep(2)}
            style={{ width: '100%', background: '#3d2c1e', color: 'white', border: 'none', padding: '14px', borderRadius: 20, fontWeight: 700 }}
          >
            선택 완료
          </button>
        </div>
      )}

      {step === 2 && (
        <div style={{ width: '100%' }}>
          <div style={{ fontSize: 13, color: '#9e7b5f', fontFamily: "'DotGothic16', monospace", marginBottom: 8 }}>
            ✦ STEP 02 / 03 ✦
          </div>
          <h2 style={{ fontSize: 20, color: '#3d2c1e', fontWeight: 800, marginBottom: 12 }}>
            다마고치의 이름을 지어주세요
          </h2>
          {errorMsg && <div style={{ color: '#e63946', fontSize: 13, marginBottom: 10 }}>{errorMsg}</div>}
          <div style={{ margin: '36px 0 24px' }}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 감자몬, 뚜비"
              maxLength={10}
              style={{
                width: '100%',
                background: '#fffaf4',
                border: '2px solid rgba(180, 140, 100, 0.3)',
                borderRadius: 20,
                padding: '16px 20px',
                fontSize: 16,
                fontWeight: 700,
                color: '#3d2c1e',
                outline: 'none',
                textAlign: 'center',
              }}
            />
          </div>
          <button
            onClick={() => setStep(3)}
            disabled={!name.trim() || loading}
            style={{
              width: '100%',
              background: name.trim() ? '#3d2c1e' : '#c4a882',
              color: 'white',
              border: 'none',
              padding: '14px',
              borderRadius: 20,
              fontWeight: 700,
            }}
          >
            다음 단계로
          </button>
        </div>
      )}

      {step === 3 && (
        <div style={{ width: '100%' }}>
          <div style={{ fontSize: 13, color: '#9e7b5f', fontFamily: "'DotGothic16', monospace", marginBottom: 8 }}>
            ✦ STEP 03 / 03 ✦
          </div>
          <h2 style={{ fontSize: 20, color: '#3d2c1e', fontWeight: 800, marginBottom: 12 }}>
            알을 톡톡! 두드려서 깨워주세요
          </h2>
          <div style={{ margin: '40px 0', display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={handleCrackEgg}
              disabled={loading}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'transform 0.1s',
                transform: crackCount > 0 ? 'scale(1.1) rotate(5deg)' : 'none',
              }}
            >
              <svg width="120" height="150" viewBox="0 0 100 120">
                <ellipse cx="50" cy="65" rx="42" ry="52" fill="#ffd166" stroke="#f4a261" strokeWidth="4" />
                {crackCount >= 1 && <path d="M 30,55 L 45,65 L 55,55" stroke="#f4a261" strokeWidth="4" fill="none" />}
                {crackCount >= 2 && <path d="M 50,60 L 65,75 L 75,65" stroke="#f4a261" strokeWidth="4" fill="none" />}
                {crackCount >= 3 && <path d="M 40,30 L 50,45 L 60,35" stroke="#f4a261" strokeWidth="4" fill="none" />}
              </svg>
            </button>
          </div>
          <div style={{ fontSize: 12, color: '#9e7b5f', fontFamily: "'DotGothic16', monospace" }}>
            {loading ? '부화 처리 중...' : `터치 횟수: ${crackCount} / 4`}
          </div>
        </div>
      )}

      {step === 4 && (
        <div style={{ width: '100%' }}>
          <h2 style={{ fontSize: 22, color: '#3d2c1e', fontWeight: 800, marginBottom: 4 }}>
            부화에 성공했어요!
          </h2>
          <div style={{ fontSize: 12, color: '#9e7b5f', fontFamily: "'DotGothic16', monospace", marginBottom: 24 }}>
            안녕, 나는 {name}야! 반가워!
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', margin: '30px 0' }}>
            <PixelCharacter
              species={selectedSpecies}
              colorPalette={hatchedData?.colorPalette ?? 0}
              hat={hatchedData?.hat ?? null}
              mood="excited"
              size="lg"
            />
          </div>

          <button
            onClick={() => router.push('/tamagotchi')}
            style={{
              width: '100%',
              background: '#3d2c1e',
              color: 'white',
              border: 'none',
              padding: '14px',
              borderRadius: 20,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            함께 모험 시작하기
          </button>
        </div>
      )}
    </div>
  );
}
