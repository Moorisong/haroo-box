'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FamilyPage() {
  const router = useRouter();
  const [family, setFamily] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [activeTama, setActiveTama] = useState<any>(null);
  const [familyNameInput, setFamilyNameInput] = useState('');
  const [token, setToken] = useState('test_user_guest');

  const loadFamilyData = async (authToken: string) => {
    try {
      const activeRes = await fetch('http://localhost:3002/api/tamagotchi/me', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const activeBody = await activeRes.json();
      if (activeBody.success) setActiveTama(activeBody.data?.tamagotchi);

      const resInfo = await fetch('http://localhost:3002/api/tamagotchi/family/info', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const bodyInfo = await resInfo.json();
      if (bodyInfo.success) setFamily(bodyInfo.data);

      const historyRes = await fetch('http://localhost:3002/api/tamagotchi/family/history', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const historyBody = await historyRes.json();
      if (historyBody.success) setHistory(historyBody.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const init = async () => {
      const sessionRes = await fetch('/api/auth/session');
      const session = await sessionRes.json();
      const currentToken = session?.user?.kakaoId || 'test_user_guest';
      setToken(currentToken);
      await loadFamilyData(currentToken);
    };
    init();
  }, []);

  const handleCreateFamily = async () => {
    if (!familyNameInput.trim()) return;
    try {
      const res = await fetch('http://localhost:3002/api/tamagotchi/family/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ familyName: familyNameInput }),
      });
      const body = await res.json();
      if (body.success) {
        setFamilyNameInput('');
        await loadFamilyData(token);
      } else {
        alert(body.error || '가문 창립 실패 (나이가 20세 이상인지 확인하세요)');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getAge = (birth: string) => {
    if (!birth) return 0;
    const ms = Date.now() - new Date(birth).getTime();
    return Math.floor(ms / (7 * 24 * 60 * 60 * 1000));
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 16, background: 'linear-gradient(180deg, #fce4ec 0%, #fdf6ee 45%)' }}>
      <div style={{ marginBottom: 12 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#3d2c1e' }}>🏰 가문 가계도</h1>
      </div>

      {family ? (
        <div style={{ background: '#fffaf4', borderRadius: 24, padding: 16, border: '1.5px solid rgba(180,140,100,0.18)', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 800 }}>{family.name} 가문</span>
            <span style={{ fontSize: 11, background: '#fce4ec', color: '#b5445a', borderRadius: 8, padding: '2px 8px' }}>
              현재 {family.generation}대 세대
            </span>
          </div>
          <div style={{ fontSize: 11, color: '#9e7b5f' }}>
            대표 가문 칭호: {family.representativeFamilyTitle || '가문의 시작'}
          </div>
        </div>
      ) : (
        <div style={{ background: '#fffaf4', borderRadius: 24, padding: 16, border: '1.5px solid rgba(180,140,100,0.18)', marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>💍 가문 미창립 상태</div>
          <input type="text" placeholder="창립할 가문 이름" value={familyNameInput} onChange={(e) => setFamilyNameInput(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid #ccc', fontSize: 12, marginRight: 8 }} />
          <button onClick={handleCreateFamily} style={{ background: '#3d2c1e', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 8, fontSize: 12 }}>창립</button>
        </div>
      )}

      {activeTama && activeTama.familyId && (
        <div style={{ background: '#fffaf4', borderRadius: 20, padding: 14, border: '1.5px solid rgba(180,140,100,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700 }}>🥚 후계자 대 계승 (결혼)</div>
            <div style={{ fontSize: 10, color: '#9e7b5f', marginTop: 2 }}>현역 나이: {getAge(activeTama.birthDate)}세 (20세 이상 계승 가능)</div>
          </div>
          <button onClick={() => router.push('/tamagotchi/hatch')} style={{ background: '#b5445a', color: 'white', border: 'none', borderRadius: 12, padding: '8px 14px', fontSize: 11, fontWeight: 700 }}>후계자 맞이</button>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#9e7b5f', marginBottom: 10 }}>✦ 역대 은퇴 조상 타임라인</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
          {history.map((anc) => (
            <div key={anc._id} style={{ display: 'flex', gap: 12, position: 'relative', paddingLeft: 12, borderLeft: '2px solid rgba(180,140,100,0.3)' }}>
              <div style={{ position: 'absolute', left: -5, top: 4, width: 8, height: 8, borderRadius: '50%', background: '#b5445a' }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>
                  {anc.generation}대 조상: {anc.name} (나이 {getAge(anc.birthDate)}세)
                </div>
                <div style={{ fontSize: 10, color: '#9e7b5f', marginTop: 2 }}>
                  칭호: {anc.representativeTitle || '평범한 여행자'} | 상태: {anc.isDead ? `사망 (${anc.deathReason})` : '은퇴 생존 중'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
