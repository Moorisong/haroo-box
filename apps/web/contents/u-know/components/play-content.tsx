'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UKNOW_ROUTES, UKNOW_LIMITS } from '../constants';
import ReactionOverlay from './reaction-overlay';

interface PlayContentProps {
  token: string;
}

const MOCK_QUESTION = '내가 새벽 4시에 전화하면?';

export default function PlayContent({ token }: PlayContentProps) {
  const router = useRouter();
  const [friendAnswer, setFriendAnswer] = useState('');
  const [responderName, setResponderName] = useState('');
  const [showReaction, setShowReaction] = useState(false);

  const isValid = friendAnswer.trim().length > 0 && responderName.trim().length > 0;

  const handleSubmit = () => {
    if (!isValid) return;

    setShowReaction(true);
    setTimeout(() => {
      router.push(UKNOW_ROUTES.RESULT(token));
    }, 1500);
  };

  return (
    <div className="uknow-form-page">
      <header style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 className="uknow-title" style={{ fontSize: 'var(--font-size-2xl)' }}>
          친구가 보낸<br />질문이야 🎯
        </h1>
        <span className="uknow-badge uknow-badge--accent">
          뭐라고 답해야 웃기지?
        </span>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
        <div className="uknow-card uknow-card--tilted-left">
          <div className="uknow-question-box" style={{ marginBottom: '16px' }}>
            <p style={{ fontWeight: 900, fontSize: 'var(--font-size-sm)', color: '#666', marginBottom: '8px' }}>
              질문
            </p>
            <p style={{ fontWeight: 900, fontSize: 'var(--font-size-xl)' }}>
              {MOCK_QUESTION}
            </p>
          </div>

          <label className="uknow-label" htmlFor="name-input">
            이름 ✍️
          </label>
          <input
            id="name-input"
            className="uknow-input"
            type="text"
            value={responderName}
            onChange={(e) => setResponderName(e.target.value)}
            placeholder="이름 입력"
            maxLength={UKNOW_LIMITS.MAX_NAME_LENGTH}
            style={{ marginBottom: '16px' }}
          />

          <label className="uknow-label" htmlFor="friend-answer-input">
            네 답변은? 💬
          </label>
          <textarea
            id="friend-answer-input"
            className="uknow-textarea"
            value={friendAnswer}
            onChange={(e) => setFriendAnswer(e.target.value)}
            placeholder="솔직하게 답해봐 ㅋㅋ"
            maxLength={UKNOW_LIMITS.MAX_ANSWER_LENGTH}
          />
          <div className="uknow-char-count">
            {friendAnswer.length}/{UKNOW_LIMITS.MAX_ANSWER_LENGTH}
          </div>
        </div>

        <button
          className="uknow-btn uknow-btn--primary uknow-card--tilted-right"
          onClick={handleSubmit}
          disabled={!isValid}
        >
          답변 완료!
        </button>

        <div className="uknow-hint-box">
          💡 친구가 내 답변 예상했을까?<br />
          궁금하면 답변 고고
        </div>
      </div>

      {showReaction && (
        <ReactionOverlay text={'보내는 중...\n두근두근 😎'} />
      )}
    </div>
  );
}
