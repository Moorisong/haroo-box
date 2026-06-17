'use client';

import React from 'react';

interface SpeechBubbleProps {
  text: string;
}

export function SpeechBubble({ text }: SpeechBubbleProps) {
  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.92)',
        borderRadius: 20,
        padding: '10px 16px',
        fontSize: 13,
        fontWeight: 500,
        color: '#3d2c1e',
        position: 'relative',
        display: 'inline-block',
        maxWidth: '85%',
        boxShadow: '0 4px 16px rgba(180, 140, 100, 0.08)',
        border: '1.5px solid rgba(180, 140, 100, 0.15)',
        lineHeight: 1.4,
        animation: 'bubble-bounce 0.3s ease-out',
        wordBreak: 'keep-all',
      }}
    >
      {text}

      {/* 말풍선 꼬리 */}
      <div
        style={{
          position: 'absolute',
          bottom: -10,
          left: 24,
          width: 0,
          height: 0,
          borderLeft: '8px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: '10px solid rgba(255, 255, 255, 0.92)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -12,
          left: 23,
          width: 0,
          height: 0,
          borderLeft: '9px solid transparent',
          borderRight: '7px solid transparent',
          borderTop: '11px solid rgba(180, 140, 100, 0.15)',
          zIndex: -1,
        }}
      />

      <style jsx global>{`
        @keyframes bubble-bounce {
          0% {
            transform: scale(0.9) translateY(4px);
            opacity: 0.8;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
