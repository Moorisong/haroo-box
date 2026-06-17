'use client';

import React, { useState, useEffect } from 'react';

export default function NotificationsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('test_user_guest');

  const loadAlerts = async (authToken: string) => {
    try {
      const res = await fetch('http://localhost:3002/api/tamagotchi/notifications/list', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const body = await res.json();
      if (body.success) {
        // 나에게 신청된(receiverId가 나인) pending 알림만 표시
        const myIdRes = await fetch('http://localhost:3002/api/tamagotchi/me', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const myBody = await myIdRes.json();
        const myTamaId = myBody.data?.tamagotchi?._id;

        const filtered = (body.data || []).filter(
          (m: any) => m.status === 'pending' && m.receiverId?._id === myTamaId
        );
        setAlerts(filtered);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const sessionRes = await fetch('/api/auth/session');
      const session = await sessionRes.json();
      const currentToken = session?.user?.kakaoId || 'test_user_guest';
      setToken(currentToken);
      await loadAlerts(currentToken);
    };
    init();
  }, []);

  const handleAccept = async (matchId: string) => {
    const skillIndexInput = prompt('대결에 사용할 스킬 인덱스(1~6)를 입력해주세요:\n1. 급소 찌르기\n2. 방구 뿌리기\n3. 꺼드럭대기\n4. 희롱하기\n5. 머리 깨기\n6. 들이박기');
    const skillIndex = Number(skillIndexInput);
    if (isNaN(skillIndex) || skillIndex < 1 || skillIndex > 6) {
      alert('1에서 6 사이의 올바른 숫자를 입력해야 합니다.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3002/api/tamagotchi/battle/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ matchId, skillIndex }),
      });
      const body = await res.json();
      if (body.success) {
        alert(body.message || '전투를 수락했습니다!');
        await loadAlerts(token);
      } else {
        alert(body.error || '수락 실패');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 16, background: 'linear-gradient(180deg, #ffe9c5 0%, #fdf6ee 45%)' }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#3d2c1e' }}>🔔 알림 및 신청 목록</h1>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 20 }}>우편함을 여는 중...</div>
      ) : alerts.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9e7b5f' }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>수신된 새 대결 메시지가 없습니다.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {alerts.map((al) => (
            <div key={al._id} style={{ background: '#fffaf4', borderRadius: 20, padding: 14, border: '1.5px solid rgba(180,140,100,0.15)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 800 }}>⚔️ 대결 신청 수신</span>
              </div>
              <p style={{ fontSize: 11, color: '#9e7b5f', margin: '0 0 12px 0' }}>
                {al.requesterId?.name || '상대 다마고치'}가 대결을 신청했습니다!
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => handleAccept(al._id)} style={{ flex: 1, background: '#b5445a', color: 'white', border: 'none', padding: '8px', borderRadius: 12, fontSize: 11, fontWeight: 700 }}>대결 수락하기</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
