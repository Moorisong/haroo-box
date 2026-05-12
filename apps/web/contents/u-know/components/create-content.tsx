'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  UKNOW_ROUTES,
  UKNOW_LIMITS,
  QUESTION_PLACEHOLDERS,
  ANSWER_PLACEHOLDERS,
  TTL_NOTICE,
} from '../constants';
import ReactionOverlay from './reaction-overlay';

export default function CreateContent() {
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [myAnswer, setMyAnswer] = useState('');
  const [showReaction, setShowReaction] = useState(false);

  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  useEffect(() => {
    setPlaceholderIdx(Math.floor(Math.random() * QUESTION_PLACEHOLDERS.length));
  }, []);

  const isValid = question.trim().length > 0 && myAnswer.trim().length > 0;

  const handleSubmit = () => {
    if (!isValid) return;

    setShowReaction(true);
    setTimeout(() => {
      const testId = Math.random().toString(36).substring(7);
      router.push(
        `${UKNOW_ROUTES.SHARE(testId)}?q=${encodeURIComponent(question)}&a=${encodeURIComponent(myAnswer)}`
      );
    }, 1500);
  };

  return (
    <div className="uknow-form-page">
      <header style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 className="uknow-title" style={{ fontSize: 'var(--font-size-2xl)' }}>
          질문 만들기
        </h1>
        <p className="uknow-subtitle">
          친구가 뭐라고 답할지 맞춰봐 ㅋㅋ
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
        <div className="uknow-card uknow-card--tilted-left">
          <label className="uknow-label" htmlFor="question-input">
            질문 던지기 👊
          </label>
          <textarea
            id="question-input"
            className="uknow-textarea"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={QUESTION_PLACEHOLDERS[placeholderIdx]}
            maxLength={UKNOW_LIMITS.MAX_QUESTION_LENGTH}
          />
          <div className="uknow-char-count">
            {question.length}/{UKNOW_LIMITS.MAX_QUESTION_LENGTH}
          </div>
        </div>

        <div className="uknow-card uknow-card--tilted-right">
          <label className="uknow-label" htmlFor="answer-input">
            친구 답변 예상하기 🔮
          </label>
          <textarea
            id="answer-input"
            className="uknow-textarea"
            value={myAnswer}
            onChange={(e) => setMyAnswer(e.target.value)}
            placeholder={ANSWER_PLACEHOLDERS[placeholderIdx]}
            maxLength={UKNOW_LIMITS.MAX_ANSWER_LENGTH}
          />
          <div className="uknow-char-count">
            {myAnswer.length}/{UKNOW_LIMITS.MAX_ANSWER_LENGTH}
          </div>
        </div>

        <button
          className="uknow-btn uknow-btn--secondary uknow-card--tilted-left"
          onClick={handleSubmit}
          disabled={!isValid}
        >
          카톡으로 던지기
        </button>

        <p className="uknow-ttl-notice">{TTL_NOTICE}</p>
      </div>

      {showReaction && (
        <ReactionOverlay text={'ㅋㅋㅋㅋㅋ\n개웃기겠다'} />
      )}
    </div>
  );
}
