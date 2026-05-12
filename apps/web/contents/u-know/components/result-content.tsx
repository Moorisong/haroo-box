'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { UKNOW_ROUTES, RESULT_REACTIONS } from '../constants';

interface ResultContentProps {
  token: string;
}

const MOCK_QUESTION = '내가 새벽 4시에 전화하면?';
const MOCK_PREDICTION = '분명 욕할 듯 ㅋㅋㅋ';
const MOCK_ACTUAL = '받을 거 같은데? 급하면';

export default function ResultContent({ token }: ResultContentProps) {
  const router = useRouter();
  const [flipped, setFlipped] = useState(false);
  const [showReaction, setShowReaction] = useState(false);

  const reaction = useMemo(
    () => RESULT_REACTIONS[Math.floor(Math.random() * RESULT_REACTIONS.length)],
    []
  );

  const handleFlip = () => {
    if (flipped) return;
    setFlipped(true);
    setTimeout(() => setShowReaction(true), 800);
  };

  const handleShareKakao = () => {
    alert('카카오톡 공유 기능!');
  };

  return (
    <main className="uknow-page">
      <div style={{ maxWidth: '400px', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <header style={{ textAlign: 'center' }}>
          <h1 className="uknow-title" style={{ fontSize: 'var(--font-size-2xl)' }}>
            결과 공개! 🎊
          </h1>
          <p className="uknow-subtitle">친구 진짜 잘 알았나?</p>
        </header>

        {/* 질문 */}
        <div className="uknow-card uknow-card--tilted-left">
          <div className="uknow-question-box">
            <p style={{ fontWeight: 900, fontSize: 'var(--font-size-sm)', color: '#666', marginBottom: '8px' }}>
              질문
            </p>
            <p style={{ fontWeight: 900, fontSize: 'var(--font-size-xl)' }}>
              {MOCK_QUESTION}
            </p>
          </div>
        </div>

        {/* 예상 답변 */}
        <div className="uknow-prediction-box">
          <p style={{ fontWeight: 900, fontSize: 'var(--font-size-sm)', color: '#666', marginBottom: '12px' }}>
            내 예상 답변
          </p>
          <p style={{ fontWeight: 900, fontSize: 'var(--font-size-xl)' }}>
            {MOCK_PREDICTION}
          </p>
        </div>

        {/* 뒤집기 안내 */}
        <p style={{ textAlign: 'center', fontSize: 'var(--font-size-xl)', fontWeight: 900 }}>
          {!flipped ? '👇 클릭해서 뒤집기 👇' : 'VS'}
        </p>

        {/* 카드 뒤집기 */}
        <div className="uknow-flip-card" onClick={handleFlip}>
          {!flipped ? (
            <div className="uknow-flip-card__back">
              <div className="uknow-flip-card__mystery">???</div>
              <p style={{ textAlign: 'center', fontWeight: 900, fontSize: 'var(--font-size-sm)', color: '#666', marginTop: '16px' }}>
                친구 실제 답변
              </p>
            </div>
          ) : (
            <div className="uknow-flip-card__front">
              <p style={{ fontWeight: 900, fontSize: 'var(--font-size-sm)', color: '#666', marginBottom: '12px' }}>
                친구 실제 답변
              </p>
              <p style={{ fontWeight: 900, fontSize: 'var(--font-size-xl)' }}>
                {MOCK_ACTUAL}
              </p>
            </div>
          )}
        </div>

        {/* 리액션 */}
        {showReaction && (
          <div className="uknow-reaction-card" style={{ transform: 'rotate(2deg)' }}>
            <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: 900 }}>
              {reaction}
            </p>
          </div>
        )}

        {/* 하단 버튼 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '16px' }}>
          <button
            className="uknow-btn uknow-btn--primary uknow-card--tilted-left"
            onClick={() => router.push(UKNOW_ROUTES.HOME)}
          >
            🔄 나도 만들기
          </button>
          <button
            className="uknow-btn uknow-btn--kakao uknow-card--tilted-right"
            onClick={handleShareKakao}
          >
            📤 결과 공유하기
          </button>
        </div>
      </div>
    </main>
  );
}
