'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  UKNOW_ROUTES,
  UKNOW_LIMITS,
  EXAMPLE_QUESTIONS,
  TTL_NOTICE,
} from '../constants';
import ReactionOverlay from './reaction-overlay';

export default function CreateContent() {
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [myAnswer, setMyAnswer] = useState('');
  const [showReaction, setShowReaction] = useState(false);

  const isValid = question.trim().length > 0 && myAnswer.trim().length > 0;

  const handleSubmit = () => {
    if (!isValid) return;

    setShowReaction(true);
    setTimeout(() => {
      const testId = Math.random().toString(36).substring(7);
      router.push(
        `${UKNOW_ROUTES.SHARE(testId)}?q=${encodeURIComponent(question)}&a=${encodeURIComponent(myAnswer)}`
      );
    }, 750);
  };

  return (
    <div className="uknow-form-page">
      <header style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 className="uknow-title" style={{ fontSize: 'var(--font-size-2xl)' }}>
          너잘알 👀
        </h1>
        <p className="uknow-subtitle">
          친구에게 질문을 던지고, 답변을 예상해봐!
        </p>

        <div className="uknow-steps">
          <div className="uknow-step">
            <span className="uknow-step__icon">✍️</span>
            <span className="uknow-step__text">질문 만들기</span>
          </div>
          <span className="uknow-step__arrow">→</span>
          <div className="uknow-step">
            <span className="uknow-step__icon">📤</span>
            <span className="uknow-step__text">친구에게 공유</span>
          </div>
          <span className="uknow-step__arrow">→</span>
          <div className="uknow-step">
            <span className="uknow-step__icon">🔍</span>
            <span className="uknow-step__text">답변 비교</span>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
        <div className="uknow-card uknow-card--tilted-left">
          <label className="uknow-label" htmlFor="question-input">
            질문 던지기 👊
          </label>

          <div className="uknow-example-select-wrap">
            <select
              id="example-question-select"
              className="uknow-select"
              value=""
              onChange={(e) => {
                if (e.target.value) setQuestion(e.target.value);
              }}
            >
              <option value="" disabled>
                💡 예시 질문 골라보기
              </option>
              {EXAMPLE_QUESTIONS.map((q, i) => (
                <option key={i} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>

          <textarea
            id="question-input"
            className="uknow-textarea"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="질문을 입력해봐 ✍️"
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
            placeholder="친구가 뭐라고 할 것 같아? 🤔"
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
