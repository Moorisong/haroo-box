'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PixelCharacter } from '@/components/tamagotchi/pixel-character';

const SKILLS = [
  '메롱하는 척 하다가 급소 찌르기',
  '방구 향 꽃가루 뿌리기',
  '욕하면서 꺼드럭대기',
  '귀여운 표정으로 희롱하기',
  '불주먹으로 머리 깨기',
  '곡괭이 들고 들이박기',
];

export default function BattlePage() {
  const router = useRouter();
  const [battleState, setBattleState] = useState<'lobby' | 'pending' | 'result'>('lobby');
  const [selectedSkill, setSelectedSkill] = useState(0);
  const [myTama, setMyTama] = useState<any>(null);
  const [oppTamas, setOppTamas] = useState<any[]>([]);
  const [selectedOpp, setSelectedOpp] = useState<any>(null);
  const [activeMatch, setActiveMatch] = useState<any>(null);
  const [token, setToken] = useState('test_user_guest');

  useEffect(() => {
    const init = async () => {
      const sessionRes = await fetch('/api/auth/session');
      const session = await sessionRes.json();
      const currentToken = session?.user?.kakaoId || 'test_user_guest';
      setToken(currentToken);

      // 1. 내 다마고치 로드
      const myRes = await fetch('http://localhost:3002/api/tamagotchi/me', {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      const myBody = await myRes.json();
      if (myBody.success && myBody.data) {
        setMyTama(myBody.data.tamagotchi);
      }

      // 2. 대결 상대 리스트 로드 (광장 리스트 재사용)
      const listRes = await fetch('http://localhost:3002/api/tamagotchi/plaza/list');
      const listBody = await listRes.json();
      if (listBody.success) {
        setOppTamas(listBody.data);
        if (listBody.data.length > 0) setSelectedOpp(listBody.data[0]);
      }
    };
    init();
  }, []);

  const handleRequestBattle = async () => {
    if (!selectedOpp) return;
    try {
      const res = await fetch('http://localhost:3002/api/tamagotchi/battle/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: selectedOpp._id,
          skillIndex: selectedSkill + 1,
        }),
      });
      const body = await res.json();
      if (body.success) {
        setActiveMatch(body.data);
        setBattleState('pending');
      } else {
        alert(body.error || '대결 신청에 실패했습니다.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 20, background: 'linear-gradient(180deg, #fce4ec 0%, #fdf6ee 50%)' }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#3d2c1e' }}>⚔️ PvP 전투 아레나</h1>
      </div>

      {battleState === 'lobby' && myTama && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#fffaf4', borderRadius: 24, padding: 18, display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>나 ({myTama.name})</div>
              <PixelCharacter species={myTama.species} colorPalette={myTama.colorPalette} mood="excited" size="sm" hat={myTama.hat} />
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#b5445a' }}>VS</span>
            {selectedOpp && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>상대 ({selectedOpp.name})</div>
                <PixelCharacter species={selectedOpp.species} colorPalette={selectedOpp.colorPalette} mood="happy" size="sm" hat={selectedOpp.hat} />
              </div>
            )}
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#9e7b5f', marginBottom: 8 }}>✦ 사용할 스킬 선택</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {SKILLS.map((sk, idx) => (
                <button key={sk} onClick={() => setSelectedSkill(idx)} style={{ background: selectedSkill === idx ? '#f4a261' : '#fffaf4', color: selectedSkill === idx ? 'white' : '#3d2c1e', border: '1.5px solid rgba(180,140,100,0.15)', borderRadius: 16, padding: '12px 10px', fontSize: 11, fontWeight: 700 }}>{sk}</button>
              ))}
            </div>
          </div>

          {oppTamas.length > 0 && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#9e7b5f', marginBottom: 6 }}>✦ 상대방 대결 지목</div>
              <select onChange={(e) => setSelectedOpp(oppTamas.find(o => o._id === e.target.value))} style={{ width: '100%', padding: 12, borderRadius: 12, background: '#fffaf4', border: '1.5px solid rgba(180,140,100,0.2)' }}>
                {oppTamas.map(o => <option key={o._id} value={o._id}>{o.name} ({o.generation}세대)</option>)}
              </select>
            </div>
          )}

          <button onClick={handleRequestBattle} style={{ marginTop: 'auto', background: '#b5445a', color: 'white', border: 'none', padding: '14px', borderRadius: 20, fontSize: 15, fontWeight: 700 }}>대결 신청 보내기 (하루 5회 제한)</button>
        </div>
      )}

      {battleState === 'pending' && activeMatch && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#3d2c1e', borderRadius: 20, padding: 16, color: '#ffe9c5', textAlign: 'center' }}>
            <div style={{ fontSize: 12 }}>전투 중계 대기 상태</div>
            <div style={{ fontSize: 14, marginTop: 8 }}>24시간 내 상대방의 대결 수락을 기다리고 있습니다.</div>
          </div>
          <button onClick={() => setBattleState('lobby')} style={{ background: '#3d2c1e', color: 'white', border: 'none', padding: '14px', borderRadius: 20, fontWeight: 700 }}>대기실 나가기</button>
        </div>
      )}
    </div>
  );
}
