import React from 'react';

/**
 * 하루엽서 8종 감성 이펙트 전용 키프레임 애니메이션 정의
 * PostcardEffectOverlay에서 주입받아 사용합니다.
 */
export default function PostcardEffectStyles() {
  return (
    <style>{`
      @keyframes sunbeamPulse {
        0% { opacity: 0.6; transform: scale(0.98); }
        100% { opacity: 0.95; transform: scale(1.03); }
      }
      @keyframes twinkle {
        0%, 100% { opacity: 0.2; transform: scale(0.8); }
        50% { opacity: 1; transform: scale(1.25); }
      }
      @keyframes snowFall {
        0% { transform: translateY(-20px) translateX(0); opacity: 0; }
        15% { opacity: 0.95; }
        85% { opacity: 0.95; }
        100% { transform: translateY(320px) translateX(18px); opacity: 0; }
      }
      @keyframes fastRainStreak {
        0% { transform: translateY(-40px); opacity: 0; }
        20% { opacity: 0.95; }
        80% { opacity: 0.9; }
        100% { transform: translateY(240px); opacity: 0; }
      }
      @keyframes naturalBeadFlow1 {
        0% { transform: translateY(0); opacity: 0.9; }
        70% { opacity: 0.85; }
        100% { transform: translateY(120px); opacity: 0; }
      }
      @keyframes naturalBeadFlow2 {
        0% { transform: translateY(0); opacity: 0.85; }
        65% { opacity: 0.8; }
        100% { transform: translateY(140px); opacity: 0; }
      }
      @keyframes naturalBeadFlow3 {
        0% { transform: translateY(0); opacity: 0.9; }
        80% { opacity: 0.85; }
        100% { transform: translateY(110px); opacity: 0; }
      }
      @keyframes naturalBeadFlow4 {
        0% { transform: translateY(0); opacity: 0.85; }
        75% { opacity: 0.8; }
        100% { transform: translateY(150px); opacity: 0; }
      }
      @keyframes petalIrregular1 {
        0% { transform: translateY(-10px) translateX(0) rotate(0deg); opacity: 0; }
        20% { opacity: 0.95; transform: translateY(40px) translateX(15px) rotate(45deg); }
        50% { transform: translateY(100px) translateX(-10px) rotate(110deg); }
        80% { transform: translateY(170px) translateX(20px) rotate(200deg); opacity: 0.9; }
        100% { transform: translateY(240px) translateX(5px) rotate(270deg); opacity: 0; }
      }
      @keyframes petalIrregular2 {
        0% { transform: translateY(-10px) translateX(0) rotate(0deg); opacity: 0; }
        25% { opacity: 0.9; transform: translateY(50px) translateX(-20px) rotate(-60deg); }
        60% { transform: translateY(130px) translateX(18px) rotate(-140deg); }
        100% { transform: translateY(240px) translateX(-12px) rotate(-260deg); opacity: 0; }
      }
      @keyframes fireflyFloat {
        0%, 100% { transform: translate(0, 0) scale(0.9); opacity: 0.3; }
        50% { transform: translate(12px, -15px) scale(1.2); opacity: 0.95; }
      }
      @keyframes bubbleFloat {
        0% { transform: translateY(220px) translateX(0) scale(0.6); opacity: 0; }
        20% { opacity: 0.85; transform: translateY(160px) translateX(10px) scale(0.9); }
        60% { transform: translateY(80px) translateX(-12px) scale(1.05); opacity: 0.9; }
        90% { opacity: 0.8; transform: translateY(20px) translateX(8px) scale(1.1); }
        100% { transform: translateY(0px) translateX(0) scale(1.25); opacity: 0; }
      }
      @keyframes shootingStar {
        0% { transform: translateX(0) translateY(0) rotate(-35deg); opacity: 0; }
        15% { opacity: 1; }
        40% { transform: translateX(-240px) translateY(170px) rotate(-35deg); opacity: 0; }
        100% { transform: translateX(-240px) translateY(170px) rotate(-35deg); opacity: 0; }
      }
    `}</style>
  );
}
