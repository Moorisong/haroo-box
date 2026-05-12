'use client';

interface ReactionOverlayProps {
  text: string;
}

/**
 * 병맛 리액션 오버레이 (제출 시 표시)
 */
export default function ReactionOverlay({ text }: ReactionOverlayProps) {
  return (
    <div className="uknow-overlay">
      <div className="uknow-overlay__card">
        <p className="uknow-overlay__text">
          {text.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i < text.split('\n').length - 1 && <br />}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
