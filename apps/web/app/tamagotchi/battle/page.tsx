'use client';

import React, { useState } from 'react';
import { PixelCharacter } from '@/components/tamagotchi/pixel-character';

const SKILLS = ['🦖 브레스 뿜기', '⚡ 번개 일격', '🌀 회오리바람', '🛡️ 절대방어', '🍕 피자던지기', '🏃 전속력도망'];

export default function BattlePage() {
  const [battleState, setBattleState] = useState<'lobby' | 'pending' | 'result'>('lobby');
  const [selectedSkill, setSelectedSkill] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const [countdown, setCountdown] = useState(600); // 10분

  const handleStartBattle = () => {
    setBattleState('pending');
    setLog(['⚔️ 대결이 매칭되었습니다!', '🤖 상대 다마고치: "별이" (Lv.25)', '⏰ 전투 분석을 시작합니다 (예상 대기 10분)...']);
    
    // 모의 로그 연출
    setTimeout(() => {
      setLog((prev) => [...prev, '🔥 감자몬이 "브레스 뿜기" 스킬을 시전했습니다!']);
    }, 1500);
    setTimeout(() => {
      setLog((prev) => [...prev, '🛡️ 상대 별이가 단단하게 버텨냅니다!']);
    }, 3000);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 20, background: 'linear-gradient(180deg, #fce4ec 0%, #fdf6ee 50%)' }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: '#b5445a', fontFamily: "'DotGothic16', monospace" }}>✦ 경기장 ✦</div>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#3d2c1e' }}>⚔️ PvP 전투 아레나</h1>
      </div>

      {battleState === 'lobby' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* 캐릭터 비교 카드 */}
          <div style={{ background: '#fffaf4', borderRadius: 24, padding: 18, border: '1.5px solid rgba(180,140,100,0.18)', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#3d2c1e' }}>나 (감자몬)</div>
              <PixelCharacter species="cutie" mood="excited" size="sm" />
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#b5445a' }}>VS</span>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#3d2c1e' }}>상대 (별이)</div>
              <PixelCharacter species="weird" mood="happy" size="sm" />
            </div>
          </div>

          {/* 스킬 선택 영역 */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#9e7b5f', fontFamily: "'DotGothic16', monospace", marginBottom: 8 }}>
              ✦ 사용할 시그니처 스킬 선택
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {SKILLS.map((sk, idx) => (
                <button
                  key={sk}
                  onClick={() => setSelectedSkill(idx)}
                  style={{
                    background: selectedSkill === idx ? '#f4a261' : '#fffaf4',
                    color: selectedSkill === idx ? 'white' : '#3d2c1e',
                    border: '1.5px solid',
                    borderColor: selectedSkill === idx ? '#f4a261' : 'rgba(180,140,100,0.15)',
                    borderRadius: 16,
                    padding: '12px 10px',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {sk}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleStartBattle}
            style={{
              marginTop: 'auto',
              background: '#b5445a',
              color: 'white',
              border: 'none',
              padding: '14px',
              borderRadius: 20,
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            대결 신청하기 (하트 1 소모)
          </button>
        </div>
      )}

      {battleState === 'pending' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#3d2c1e', borderRadius: 20, padding: 16, color: '#ffe9c5', textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontFamily: "'DotGothic16', monospace" }}>남은 전투 계산 시간</div>
            <div style={{ fontSize: 28, fontWeight: 800, margin: '6px 0', fontFamily: 'monospace' }}>
              09:56
            </div>
            <div style={{ fontSize: 10, opacity: 0.8 }}>완료 시 자동으로 결과 알림이 발생합니다.</div>
          </div>

          <div style={{ flex: 1, background: '#fffaf4', borderRadius: 20, border: '1.5px solid rgba(180,140,100,0.18)', padding: 16, overflowY: 'auto' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#9e7b5f', fontFamily: "'DotGothic16', monospace", marginBottom: 10 }}>
              📢 실시간 대결 중계 로그
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {log.map((line, idx) => (
                <div key={idx} style={{ fontSize: 12, color: '#3d2c1e', fontFamily: "'DotGothic16', monospace" }}>
                  {line}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setBattleState('result')}
            style={{
              background: '#f4a261',
              color: 'white',
              border: 'none',
              padding: '14px',
              borderRadius: 20,
              fontWeight: 700,
            }}
          >
            결과 미리보기 (테스트용)
          </button>
        </div>
      )}

      {battleState === 'result' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: 64 }}>🏆</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#3d2c1e', margin: '8px 0 4px' }}>VICTORY!</h2>
          <div style={{ fontSize: 12, color: '#9e7b5f', marginBottom: 24 }}>상대 별이와의 전투에서 승리했습니다!</div>

          <div style={{ background: '#fffaf4', borderRadius: 20, padding: '16px 28px', border: '1.5px solid rgba(180,140,100,0.18)', width: '100%', display: 'flex', justifyContent: 'space-around', marginBottom: 32 }}>
            <div>
              <div style={{ fontSize: 11, color: '#9e7b5f' }}>획득 용기</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#74c69d' }}>+12</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#9e7b5f' }}>전투 승리수</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#b5445a' }}>+1</div>
            </div>
          </div>

          <button
            onClick={() => setBattleState('lobby')}
            style={{
              width: '100%',
              background: '#3d2c1e',
              color: 'white',
              border: 'none',
              padding: '14px',
              borderRadius: 20,
              fontWeight: 700,
            }}
          >
            로비로 돌아가기
          </button>
        </div>
      )}
    </div>
  );
}
