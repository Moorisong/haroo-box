'use client';

import { useEffect } from 'react';

type ErrorProps = { error: Error & { digest?: string }; reset: () => void };

export default function ErrorScreen({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Haroo Box application error:', error);
  }, [error]);

  return (
    <main style={{ minHeight: '75vh', display: 'grid', placeItems: 'center', background: '#f8f7f3', color: '#282b31', padding: '48px 20px', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
      <div style={{ maxWidth: 420 }}>
        <div aria-hidden="true" style={{ fontSize: 52, marginBottom: 18 }}>📦</div>
        <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', letterSpacing: '-.05em', margin: '0 0 14px' }}>하루상자, 잠깐 쉬어가는 중!</h1>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#6e706f', margin: '0 0 26px', wordBreak: 'keep-all' }}>페이지를 불러오는 데 잠시 문제가 생겼어요.<br />조금 뒤에 다시 찾아와 주세요.</p>
        <button type="button" onClick={() => window.location.reload()} style={{ background: '#284cb0', color: '#fff', border: 0, borderRadius: 9, padding: '13px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>다시 불러오기 ↻</button>
        {process.env.NODE_ENV === 'development' && <pre style={{ textAlign: 'left', marginTop: 24, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', fontSize: 12 }}>{error.message}</pre>}
      </div>
    </main>
  );
}
