'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PixelCharacter } from '@/components/tamagotchi/pixel-character';

export default function PlazaPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [friends, setFriends] = useState<any[]>([]);
  const [shouts, setShouts] = useState<any[]>([]);
  const [shoutText, setShoutText] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<any | null>(null);
  const [token, setToken] = useState('test_user_guest');

  const loadPlazaData = async (authToken: string) => {
    try {
      const listRes = await fetch('http://localhost:3002/api/tamagotchi/plaza/list');
      const listBody = await listRes.json();
      if (listBody.success) setFriends(listBody.data);

      const shoutsRes = await fetch('http://localhost:3002/api/tamagotchi/plaza/shouts');
      const shoutsBody = await shoutsRes.json();
      if (shoutsBody.success) setShouts(shoutsBody.data);
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
      await loadPlazaData(currentToken);
    };
    init();
  }, []);

  const handlePostShout = async () => {
    if (!shoutText.trim()) return;
    try {
      const res = await fetch('http://localhost:3002/api/tamagotchi/plaza/shout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: shoutText }),
      });
      const body = await res.json();
      if (body.success) {
        setShoutText('');
        await loadPlazaData(token);
      } else {
        alert(body.error || '외치기 등록 실패');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      await loadPlazaData(token);
      return;
    }
    try {
      const res = await fetch(`http://localhost:3002/api/tamagotchi/plaza/search?name=${search}`);
      const body = await res.json();
      if (body.success) {
        setFriends([body.data]);
      } else {
        alert(body.error || '검색 결과를 찾을 수 없습니다.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 16, background: 'linear-gradient(180deg, #d4f0e8 0%, #fdf6ee 45%)' }}>
      <div style={{ marginBottom: 12 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#3d2c1e' }}>🏡 다마고치 광장</h1>
      </div>

      <div style={{ display: 'flex', gap: 8, background: '#fffaf4', border: '1.5px solid rgba(180,140,100,0.18)', borderRadius: 16, padding: '10px 14px', marginBottom: 16 }}>
        <input
          type="text"
          placeholder="이름 정확히 입력 후 엔터"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, flex: 1, color: '#3d2c1e' }}
        />
        <button onClick={handleSearch} style={{ background: 'none', border: 'none' }}>🔍</button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#9e7b5f', marginBottom: 8 }}>✦ 광장 속 친구들</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {friends.map((f) => (
            <div key={f._id} onClick={() => setSelectedFriend(f)} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fffaf4', padding: '12px 14px', borderRadius: 18, border: '1.5px solid rgba(180,140,100,0.12)', cursor: 'pointer' }}>
              <PixelCharacter species={f.species} colorPalette={f.colorPalette} mood="happy" size="sm" hat={f.hat} flower={f.flower} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{f.name}</div>
                <div style={{ fontSize: 11, color: '#9e7b5f' }}>{f.representativeTitle || '초보 여행자'} (Gen {f.generation})</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#9e7b5f', marginBottom: 8 }}>📢 오늘의 외치기</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input type="text" placeholder="오늘의 기분을 외쳐보세요!" value={shoutText} onChange={(e) => setShoutText(e.target.value)} style={{ flex: 1, background: '#fffaf4', border: '1.5px solid rgba(180,140,100,0.18)', borderRadius: 16, padding: '10px 14px', fontSize: 12 }} />
          <button onClick={handlePostShout} style={{ background: '#3d2c1e', color: 'white', border: 'none', padding: '10px 16px', borderRadius: 16, fontSize: 12, fontWeight: 700 }}>등록</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>
          {shouts.map((s) => (
            <div key={s._id} style={{ background: '#fffaf4', borderRadius: 16, padding: 12, border: '1.5px solid rgba(180,140,100,0.1)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                {s.tamagotchiId?.name || '부화중인 다마고치'}
              </div>
              <p style={{ fontSize: 12, color: '#3d2c1e', margin: 0 }}>{s.content}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedFriend && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fdf6ee', borderRadius: 28, padding: 20, width: '100%', maxWidth: 320, border: '3.5px solid #3d2c1e', textAlign: 'center' }}>
            <h3 style={{ fontSize: 18, fontWeight: 800 }}>{selectedFriend.name}</h3>
            <div style={{ fontSize: 11, color: '#9e7b5f', marginBottom: 12 }}>{selectedFriend.representativeTitle || '초보 여행자'}</div>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
              <PixelCharacter species={selectedFriend.species} colorPalette={selectedFriend.colorPalette} mood="excited" size="sm" hat={selectedFriend.hat} flower={selectedFriend.flower} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setSelectedFriend(null)} style={{ flex: 1, background: '#c4a882', color: 'white', border: 'none', padding: 10, borderRadius: 12, fontWeight: 700 }}>닫기</button>
              <button onClick={() => router.push('/tamagotchi/battle')} style={{ flex: 1, background: '#b5445a', color: 'white', border: 'none', padding: 10, borderRadius: 12, fontWeight: 700 }}>⚔️ 대결 신청</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
