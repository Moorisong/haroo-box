'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PixelCharacter, TamagotchiSpecies } from '@/components/tamagotchi/pixel-character';

const SPECIES_LIST = [
  { type: 'cutie' as TamagotchiSpecies, title: '귀염상', emoji: '🐱', desc: '사랑스럽고 동글동글한 애교쟁이' },
  { type: 'weird' as TamagotchiSpecies, title: '기괴상', emoji: '👽', desc: '알 수 없는 표정을 짓는 개구쟁이' },
  { type: 'normal' as TamagotchiSpecies, title: '평범상', emoji: '🐹', desc: '평화롭고 어디에나 있는 든든한 친구' },
  { type: 'unique' as TamagotchiSpecies, title: '개성상', emoji: '🦎', desc: '나만의 스타일을 확실하게 표현하는 개성파' },
];

export default function HatchPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedSpecies, setSelectedSpecies] = useState<TamagotchiSpecies>('cutie');
  const [name, setName] = useState('');
  const [crackCount, setCrackCount] = useState(0);

  const handleNextStep = () => {
    if (step === 2 && !name.trim()) return;
    setStep((s) => (s + 1) as any);
  };

  const handleCrackEgg = () => {
    if (crackCount < 3) {
      setCrackCount((c) => c + 1);
    } else {
      setStep(4);
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
                  alignItems: 'center',
                  gap: 12,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(180, 140, 100, 0.04)',
                }}
              >
                <span style={{ fontSize: 28 }}>{sp.emoji}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: selectedSpecies === sp.type ? 'white' : '#3d2c1e' }}>
                    {sp.title}
                  </div>
                  <div style={{ fontSize: 11, color: selectedSpecies === sp.type ? 'rgba(255,255,255,0.85)' : '#9e7b5f', marginTop: 2 }}>
                    {sp.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={handleNextStep}
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
            onClick={handleNextStep}
            disabled={!name.trim()}
            style={{
              width: '100%',
              background: name.trim() ? '#3d2c1e' : '#c4a882',
              color: 'white',
              border: 'none',
              padding: '14px',
              borderRadius: 20,
              fontWeight: 700,
              cursor: name.trim() ? 'pointer' : 'not-allowed',
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
          <div style={{ position: 'relative', margin: '40px 0', height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button
              onClick={handleCrackEgg}
              style={{
                fontSize: crackCount === 0 ? 90 : crackCount === 1 ? 95 : crackCount === 2 ? 100 : 105,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'transform 0.1s',
                transform: crackCount > 0 ? 'rotate(10deg)' : 'none',
              }}
            >
              {crackCount === 0 ? '🥚' : crackCount === 1 ? '🐣' : crackCount === 2 ? '🐥' : '💥'}
            </button>
          </div>
          <div style={{ fontSize: 12, color: '#9e7b5f', fontFamily: "'DotGothic16', monospace" }}>
            터치 횟수: {crackCount} / 4
          </div>
        </div>
      )}

      {step === 4 && (
        <div style={{ width: '100%' }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 22, color: '#3d2c1e', fontWeight: 800, marginBottom: 4 }}>
            부화에 성공했어요!
          </h2>
          <div style={{ fontSize: 12, color: '#9e7b5f', fontFamily: "'DotGothic16', monospace", marginBottom: 24 }}>
            안녕, 나는 {name}야! 반가워!
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', margin: '30px 0' }}>
            <PixelCharacter species={selectedSpecies} mood="excited" size="lg" />
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
