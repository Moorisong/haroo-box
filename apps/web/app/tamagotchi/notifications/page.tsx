'use client';

import React, { useState } from 'react';

const ALERTS = [
  { id: 1, type: 'battle', sender: '먼지몬', title: '⚔️ 대결 신청 수신', desc: '먼지몬(Lv.28)이 대결을 신청했습니다.', time: '10분 전' },
  { id: 2, type: 'marriage', sender: '초코냥', title: '💍 청혼 신청 수신', desc: '초코냥(Lv.20)이 세대 계승 결혼을 신청했습니다.', time: '1시간 전' },
];

export default function NotificationsPage() {
  const [alerts, setAlerts] = useState(ALERTS);

  const handleAction = (id: number, type: 'accept' | 'decline') => {
    // 수락/거절 토스트 피드백 등을 가정하고 알림 지우기
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    alert(type === 'accept' ? '신청을 수락했습니다!' : '신청을 거절했습니다.');
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 16, background: 'linear-gradient(180deg, #ffe9c5 0%, #fdf6ee 45%)' }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: '#9e7b5f', fontFamily: "'DotGothic16', monospace" }}>✦ 우편함 ✦</div>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#3d2c1e' }}>🔔 알림 및 신청 목록</h1>
      </div>

      {alerts.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#9e7b5f', gap: 8 }}>
          <span style={{ fontSize: 40 }}>📭</span>
          <div style={{ fontSize: 13, fontWeight: 600 }}>수신된 새 메시지가 없습니다.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {alerts.map((al) => (
            <div
              key={al.id}
              style={{
                background: '#fffaf4',
                borderRadius: 20,
                padding: 14,
                border: '1.5px solid rgba(180,140,100,0.15)',
                boxShadow: '0 2px 10px rgba(180,140,100,0.04)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#3d2c1e' }}>{al.title}</span>
                <span style={{ fontSize: 10, color: '#c4a882' }}>{al.time}</span>
              </div>
              <p style={{ fontSize: 11, color: '#9e7b5f', margin: '0 0 12px 0' }}>
                {al.desc}
              </p>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => handleAction(al.id, 'decline')}
                  style={{
                    flex: 1,
                    background: '#e9ebef',
                    color: '#030213',
                    border: 'none',
                    padding: '8px',
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  거절
                </button>
                <button
                  onClick={() => handleAction(al.id, 'accept')}
                  style={{
                    flex: 1,
                    background: al.type === 'battle' ? '#b5445a' : '#74c69d',
                    color: 'white',
                    border: 'none',
                    padding: '8px',
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  수락
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
