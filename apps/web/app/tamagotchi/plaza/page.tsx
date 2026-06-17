'use client';

import React, { useState } from 'react';
import { MiniCharacter } from '@/components/tamagotchi/pixel-character';

const FRIENDS = [
  { id: 1, name: '초코냥', title: '🛡️ 철벽 가문', species: 'cutie', wins: 45, color: '#f4a261' },
  { id: 2, name: '먼지몬', title: '⚡ 스피드왕', species: 'weird', wins: 88, color: '#b8c0ff' },
  { id: 3, name: '구름이', title: '☁️ 평화주의자', species: 'normal', wins: 12, color: '#ffd166' },
  { id: 4, name: '도마뱀', title: '🦎 외로운 늑대', species: 'unique', wins: 120, color: '#74c69d' },
];

const FEEDS = [
  { id: 1, author: '먼지몬', text: '오늘 장애물 달리기 90초 버텼다! 대결 신청 환영함 💪', likes: 12, time: '5분 전' },
  { id: 2, author: '초코냥', text: '우리 초코냥이 배고프다고 밥달라네요.. 간식 털림 🍪', likes: 24, time: '20분 전' },
];

export default function PlazaPage() {
  const [search, setSearch] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<typeof FRIENDS[0] | null>(null);
  const [shoutText, setShoutText] = useState('');
  const [feeds, setFeeds] = useState(FEEDS);

  const handlePostShout = () => {
    if (!shoutText.trim()) return;
    const newShout = {
      id: feeds.length + 1,
      author: '나 (감자몬)',
      text: shoutText,
      likes: 0,
      time: '방금 전',
    };
    setFeeds([newShout, ...feeds]);
    setShoutText('');
  };

  const filteredFriends = FRIENDS.filter(
    (f) => f.name.includes(search) || f.title.includes(search)
  );

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 16, background: 'linear-gradient(180deg, #d4f0e8 0%, #fdf6ee 45%)' }}>
      {/* Header */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: '#2a6b55', fontFamily: "'DotGothic16', monospace" }}>✦ 다중 접속 광장 ✦</div>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#3d2c1e' }}>🏡 다마고치 광장</h1>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: 8, background: '#fffaf4', border: '1.5px solid rgba(180,140,100,0.18)', borderRadius: 16, padding: '10px 14px', marginBottom: 16 }}>
        <span>🔍</span>
        <input
          type="text"
          placeholder="이름이나 가문명으로 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, flex: 1, color: '#3d2c1e' }}
        />
      </div>

      {/* Friends list */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#9e7b5f', fontFamily: "'DotGothic16', monospace", marginBottom: 8 }}>
          ✦ 광장 속 친구들 ({filteredFriends.length})
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filteredFriends.map((f) => (
            <div
              key={f.id}
              onClick={() => setSelectedFriend(f)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: '#fffaf4',
                padding: '12px 14px',
                borderRadius: 18,
                border: '1.5px solid rgba(180,140,100,0.12)',
                cursor: 'pointer',
              }}
            >
              <MiniCharacter species={f.species as any} mood="happy" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#3d2c1e' }}>{f.name}</div>
                <div style={{ fontSize: 11, color: '#9e7b5f' }}>{f.title}</div>
              </div>
              <div style={{ fontSize: 11, color: '#b5445a', fontWeight: 700 }}>
                ⚔️ {f.wins}승
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Shouts */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#9e7b5f', fontFamily: "'DotGothic16', monospace", marginBottom: 8 }}>
          📢 오늘의 외치기
        </div>

        {/* Input box */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input
            type="text"
            placeholder="오늘의 기분을 외쳐보세요! (최대 30자)"
            value={shoutText}
            onChange={(e) => setShoutText(e.target.value)}
            style={{ flex: 1, background: '#fffaf4', border: '1.5px solid rgba(180,140,100,0.18)', borderRadius: 16, padding: '10px 14px', fontSize: 12, color: '#3d2c1e' }}
          />
          <button
            onClick={handlePostShout}
            style={{ background: '#3d2c1e', color: 'white', border: 'none', padding: '10px 16px', borderRadius: 16, fontSize: 12, fontWeight: 700 }}
          >
            등록
          </button>
        </div>

        {/* Feed List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>
          {feeds.map((feed) => (
            <div key={feed.id} style={{ background: '#fffaf4', borderRadius: 16, padding: 12, border: '1.5px solid rgba(180,140,100,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#3d2c1e' }}>{feed.author}</span>
                <span style={{ fontSize: 10, color: '#c4a882' }}>{feed.time}</span>
              </div>
              <p style={{ fontSize: 12, color: '#3d2c1e', margin: 0 }}>{feed.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Modal */}
      {selectedFriend && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fdf6ee', borderRadius: 28, padding: 20, width: '100%', maxWidth: 320, border: '3.5px solid #3d2c1e', textAlign: 'center' }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#3d2c1e' }}>{selectedFriend.name}</h3>
            <div style={{ fontSize: 11, color: '#9e7b5f', marginBottom: 12 }}>{selectedFriend.title}</div>
            
            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
              <MiniCharacter species={selectedFriend.species as any} mood="excited" />
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button
                onClick={() => setSelectedFriend(null)}
                style={{ flex: 1, background: '#c4a882', color: 'white', border: 'none', padding: 10, borderRadius: 12, fontWeight: 700 }}
              >
                닫기
              </button>
              <button
                style={{ flex: 1, background: '#b5445a', color: 'white', border: 'none', padding: 10, borderRadius: 12, fontWeight: 700 }}
              >
                ⚔️ 대결 신청
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
