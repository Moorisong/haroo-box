'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { UKNOW_ROUTES } from '../constants';

interface ShareContentProps {
  token: string;
  question?: string;
  myAnswer?: string;
}

export default function ShareContent({ token, question: questionProp, myAnswer: myAnswerProp }: ShareContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);

  // props로 안 넘어온 경우 query string에서 읽기
  const question = questionProp ?? searchParams.get('q') ?? undefined;
  const myAnswer = myAnswerProp ?? searchParams.get('a') ?? undefined;

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${UKNOW_ROUTES.PLAY(token)}`
    : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard API unavailable */
    }
  };

  const handleKakaoShare = () => {
    alert('카카오톡 공유 기능은 실제 앱에서 구현됩니다!');
  };

  return (
    <main className="uknow-page">
      <div style={{ maxWidth: '400px', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <header style={{ textAlign: 'center' }}>
          <h1 className="uknow-title" style={{ fontSize: 'var(--font-size-2xl)' }}>
            준비 완료! 🎉
          </h1>
          <p className="uknow-subtitle">이제 친구한테 던져봐</p>
        </header>

        <div className="uknow-card uknow-card--tilted-left" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {question && (
            <div className="uknow-question-box">
              <p style={{ fontWeight: 900, fontSize: 'var(--font-size-sm)', color: '#666', marginBottom: '8px' }}>
                내가 만든 질문
              </p>
              <p style={{ fontWeight: 900, fontSize: 'var(--font-size-lg)' }}>
                {question}
              </p>
            </div>
          )}
          {myAnswer && (
            <div className="uknow-prediction-box" style={{ transform: 'none' }}>
              <p style={{ fontWeight: 900, fontSize: 'var(--font-size-sm)', color: '#666', marginBottom: '8px' }}>
                친구가 이렇게 답할 것 같음
              </p>
              <p style={{ fontWeight: 900, fontSize: 'var(--font-size-lg)' }}>
                {myAnswer}
              </p>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            className="uknow-btn uknow-btn--kakao uknow-card--tilted-left"
            onClick={handleKakaoShare}
          >
            💬 카톡 단톡방에 투척
          </button>

          <button
            className="uknow-btn uknow-btn--outline uknow-card--tilted-right"
            onClick={handleCopy}
          >
            {copied ? '복사 완료! ✅' : '📋 링크 복사'}
          </button>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => router.push(UKNOW_ROUTES.RESULT(token))}
            style={{
              background: 'none',
              border: 'none',
              color: '#666',
              textDecoration: 'underline',
              fontWeight: 900,
              cursor: 'pointer',
              fontSize: 'var(--font-size-sm)',
            }}
          >
            결과 미리보기 (테스트용)
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: 'var(--font-size-4xl)' }}>👆</p>
      </div>
    </main>
  );
}
