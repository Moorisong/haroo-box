'use client';

import { useRouter } from 'next/navigation';
import { UKNOW_ROUTES } from '../constants';

export default function HomeContent() {
  const router = useRouter();

  return (
    <main className="uknow-page">
      <div style={{ textAlign: 'center', maxWidth: '400px', width: '100%' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 className="uknow-title" style={{ marginBottom: '16px' }}>
            너<br />친구<br />진짜<br />잘 앎?
          </h1>
          <span className="uknow-badge uknow-badge--accent">U-KNOW</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          <div className="uknow-card uknow-card--tilted-right">
            <p style={{ fontWeight: 900, fontSize: 'var(--font-size-lg)' }}>
              &quot;친구가 뭐라고 답할 것 같아?&quot;
            </p>
          </div>
          <div className="uknow-card uknow-card--tilted-left">
            <p style={{ fontWeight: 900, fontSize: 'var(--font-size-lg)' }}>
              이거 단톡에 던지면<br />개웃김 ㅋㅋㅋㅋ
            </p>
          </div>
        </div>

        <button
          className="uknow-btn uknow-btn--primary uknow-card--tilted-left"
          onClick={() => router.push(UKNOW_ROUTES.CREATE)}
        >
          <span>친구 긁으러 가기</span>
        </button>
        <p style={{ marginTop: '8px', fontWeight: 900, fontSize: 'var(--font-size-sm)', opacity: 0.6 }}>
          ㄱㄱ
        </p>

        <p className="uknow-subtitle" style={{ marginTop: '24px' }}>
          👇 눌러봐
        </p>
      </div>

      <span className="uknow-emoji" style={{ top: 40, left: 40, transform: 'rotate(-12deg)' }}>😏</span>
      <span className="uknow-emoji" style={{ bottom: 80, right: 40, transform: 'rotate(12deg)' }}>🤔</span>
    </main>
  );
}
