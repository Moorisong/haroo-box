'use client';

import React from 'react';
import type { PostcardEffectType } from '@/types/postcard';

interface PostcardEffectOverlayProps {
  effectType: PostcardEffectType;
}

/**
 * 8종 감성 고도화 움직이는 배경 이펙트 오버레이 컴포넌트
 * - 햇살: 우상단에서 대각선 한줄기로 쏟아지는 감성 아침 햇살 (God Rays)
 * - 포근한 눈: 위에서 소복소복 은은하게 흔들리며 내리는 포근한 눈송이 모션 (Soft Falling Snow)
 * - 별빛: 밤하늘에 은은하게 보석처럼 피어났다 지는 몽환 별빛
 * - 빗방울: 창가 수직으로 맺혀 지나는 빗물 애니메이션
 * - 벚꽃: 살랑살랑 흔들리며 대각선으로 하강하는 핑크 꽃잎
 * - 반딧불이: 숲속 잔잔하게 부유하는 라이트 노드
 * - 안개: 바닥에서 아련하게 밀려오는 차분한 몽환 레이어
 * - 오로라: 은은한 보랏빛 커튼 노을 파동
 */
export default function PostcardEffectOverlay({ effectType }: PostcardEffectOverlayProps) {
  if (!effectType || effectType === 'none') return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-inherit z-10 select-none">
      {/* 1. 쏟아지는 대각선 햇살 한줄기 (Sunlight God Rays) */}
      {effectType === 'sunlight' && (
        <div className="absolute inset-0">
          {/* 대각선으로 쏟아지는 강렬하면서 은은한 빛줄기 */}
          <div
            className="absolute -top-20 -right-20 w-[160%] h-[160%] origin-top-right rotate-[-35deg] pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(254,243,199,0.3) 30%, rgba(253,230,138,0.45) 50%, rgba(254,243,199,0.3) 70%, transparent 100%)',
              filter: 'blur(16px)',
              mixBlendMode: 'screen',
              animation: 'sunbeamPulse 5s ease-in-out infinite alternate',
            }}
          />
          <div
            className="absolute top-0 right-0 w-36 h-36 bg-amber-100/50 rounded-full blur-2xl animate-pulse"
            style={{ animationDuration: '3.5s' }}
          />
        </div>
      )}

      {/* 2. 반짝이는 별빛 (Starlight) */}
      {effectType === 'starlight' && (
        <div className="absolute inset-0">
          <div className="star-node absolute top-5 left-[20%] w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_#fff]" style={{ animation: 'twinkle 2.2s ease-in-out infinite' }} />
          <div className="star-node absolute top-14 right-[15%] w-2 h-2 bg-amber-100 rounded-full shadow-[0_0_10px_#fff]" style={{ animation: 'twinkle 3.1s ease-in-out infinite 0.5s' }} />
          <div className="star-node absolute top-1/3 left-[10%] w-1 h-1 bg-white rounded-full shadow-[0_0_6px_#fff]" style={{ animation: 'twinkle 2.7s ease-in-out infinite 1.2s' }} />
          <div className="star-node absolute top-1/2 right-[30%] w-1.5 h-1.5 bg-amber-50 rounded-full shadow-[0_0_8px_#fff]" style={{ animation: 'twinkle 3.5s ease-in-out infinite 0.3s' }} />
          <div className="star-node absolute bottom-1/4 left-[35%] w-2 h-2 bg-white rounded-full shadow-[0_0_10px_#fff]" style={{ animation: 'twinkle 2.9s ease-in-out infinite 0.8s' }} />
          <div className="star-node absolute bottom-10 right-[10%] w-1.5 h-1.5 bg-amber-100 rounded-full shadow-[0_0_8px_#fff]" style={{ animation: 'twinkle 3.3s ease-in-out infinite 1.5s' }} />
        </div>
      )}

      {/* 3. 소복소복 은은하게 내리는 포근한 눈 (Soft Falling Snow) */}
      {effectType === 'snowfall' && (
        <div className="absolute inset-0">
          <div className="snowflake absolute w-2.5 h-2.5 bg-white/90 rounded-full blur-[0.5px]" style={{ left: '10%', animation: 'snowFall 4.5s linear infinite' }} />
          <div className="snowflake absolute w-3.5 h-3.5 bg-white/80 rounded-full blur-[0.7px]" style={{ left: '30%', animation: 'snowFall 6s linear infinite 1.5s' }} />
          <div className="snowflake absolute w-2 h-2 bg-white/95 rounded-full blur-[0.3px]" style={{ left: '55%', animation: 'snowFall 3.8s linear infinite 0.5s' }} />
          <div className="snowflake absolute w-3 h-3 bg-white/85 rounded-full blur-[0.6px]" style={{ left: '75%', animation: 'snowFall 5.2s linear infinite 2s' }} />
          <div className="snowflake absolute w-2 h-2 bg-white/90 rounded-full blur-[0.4px]" style={{ left: '90%', animation: 'snowFall 4.2s linear infinite 1s' }} />
        </div>
      )}

      {/* 4. 창가에 붙어 주르륵 흘러내리는 빗방울 (Window Raindrops Trickle) */}
      {effectType === 'raindrop' && (
        <div className="absolute inset-0 bg-slate-900/15 backdrop-blur-[0.5px]">
          {/* 창문에 맺힌 잔여 물방울 맺힘 노드들 */}
          <div className="absolute top-6 left-[18%] w-2 h-2.5 bg-white/70 rounded-full blur-[0.4px] shadow-[0_1px_3px_rgba(255,255,255,0.6)]" />
          <div className="absolute top-1/3 left-[72%] w-2.5 h-3 bg-white/75 rounded-full blur-[0.4px] shadow-[0_1px_3px_rgba(255,255,255,0.6)]" />
          <div className="absolute top-1/2 left-[35%] w-1.5 h-2 bg-white/60 rounded-full blur-[0.3px]" />
          <div className="absolute bottom-1/4 left-[82%] w-2 h-2.5 bg-white/65 rounded-full blur-[0.4px]" />

          {/* 주르륵 속도를 가감하며 실감나게 내려오는 빗방울 궤적들 */}
          <div
            className="absolute left-[28%] top-0 w-2 h-4 bg-gradient-to-b from-white/90 via-white/50 to-transparent rounded-full shadow-[0_2px_6px_rgba(255,255,255,0.8)]"
            style={{ animation: 'raindropTrickle 3.8s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
          />
          <div
            className="absolute left-[58%] top-0 w-2.5 h-5 bg-gradient-to-b from-white/95 via-white/60 to-transparent rounded-full shadow-[0_2px_6px_rgba(255,255,255,0.9)]"
            style={{ animation: 'raindropTrickle 2.9s cubic-bezier(0.4, 0, 0.6, 1) infinite 1.2s' }}
          />
          <div
            className="absolute left-[85%] top-0 w-1.5 h-3.5 bg-gradient-to-b from-white/80 via-white/40 to-transparent rounded-full"
            style={{ animation: 'raindropTrickle 4.5s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.5s' }}
          />
        </div>
      )}

      {/* 5. 바람타고 불규칙하게 흩날리는 벚꽃잎 (Swaying Petals Drift) */}
      {effectType === 'cherry-blossom' && (
        <div className="absolute inset-0">
          <div
            className="petal absolute w-3.5 h-2.5 bg-pink-200/90 rounded-[60%_40%_70%_30%/50%_60%_40%_50%] shadow-[0_0_4px_rgba(251,207,232,0.6)]"
            style={{ left: '10%', animation: 'petalIrregular1 7s ease-in-out infinite' }}
          />
          <div
            className="petal absolute w-4 h-2.5 bg-rose-200/95 rounded-[50%_50%_60%_40%/60%_40%_60%_40%]"
            style={{ left: '45%', animation: 'petalIrregular2 8.5s ease-in-out infinite 1.5s' }}
          />
          <div
            className="petal absolute w-3 h-2 bg-pink-300/85 rounded-[70%_30%_50%_50%/40%_60%_50%_50%]"
            style={{ left: '75%', animation: 'petalIrregular1 6.2s ease-in-out infinite 0.8s' }}
          />
          <div
            className="petal absolute w-3.5 h-2.5 bg-pink-100/90 rounded-[40%_60%_50%_50%/50%_50%_60%_40%]"
            style={{ left: '90%', animation: 'petalIrregular2 7.8s ease-in-out infinite 2.5s' }}
          />
        </div>
      )}

      {/* 6. 숲속 반딧불이 (Forest Fireflies) */}
      {effectType === 'firefly' && (
        <div className="absolute inset-0">
          <div className="firefly-node absolute w-2.5 h-2.5 bg-lime-300/80 rounded-full shadow-[0_0_12px_#bef264]" style={{ top: '25%', left: '20%', animation: 'fireflyFloat 4s ease-in-out infinite' }} />
          <div className="firefly-node absolute w-2 h-2 bg-yellow-200/90 rounded-full shadow-[0_0_10px_#fef08a]" style={{ top: '60%', left: '75%', animation: 'fireflyFloat 5.2s ease-in-out infinite 1.2s' }} />
          <div className="firefly-node absolute w-2.5 h-2.5 bg-emerald-200/80 rounded-full shadow-[0_0_12px_#a7f3d0]" style={{ top: '75%', left: '30%', animation: 'fireflyFloat 4.6s ease-in-out infinite 0.7s' }} />
        </div>
      )}

      {/* 7. 몽환적으로 떠오르는 영롱한 비눗방울 (Floating Bubbles) */}
      {effectType === 'bubble' && (
        <div className="absolute inset-0">
          <div
            className="bubble absolute w-6 h-6 rounded-full border border-white/60 bg-gradient-to-tr from-cyan-300/25 via-pink-200/20 to-amber-100/30 backdrop-blur-[0.5px] shadow-[0_0_8px_rgba(255,255,255,0.7)]"
            style={{ left: '15%', animation: 'bubbleFloat 6s ease-in-out infinite' }}
          />
          <div
            className="bubble absolute w-8 h-8 rounded-full border border-white/70 bg-gradient-to-tr from-pink-300/30 via-purple-200/25 to-blue-100/30 backdrop-blur-[0.5px] shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            style={{ left: '48%', animation: 'bubbleFloat 7.5s ease-in-out infinite 1.8s' }}
          />
          <div
            className="bubble absolute w-5 h-5 rounded-full border border-white/60 bg-gradient-to-tr from-teal-200/30 via-yellow-100/20 to-pink-200/30 backdrop-blur-[0.5px] shadow-[0_0_6px_rgba(255,255,255,0.6)]"
            style={{ left: '78%', animation: 'bubbleFloat 5.2s ease-in-out infinite 0.7s' }}
          />
        </div>
      )}

      {/* 8. 밤하늘 가로지르는 별빛 유성우 (Shooting Star Streak) */}
      {effectType === 'shooting-star' && (
        <div className="absolute inset-0">
          <div
            className="shooting-star absolute w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-100 to-white rounded-full shadow-[0_0_8px_#fff]"
            style={{ top: '15%', right: '-10%', animation: 'shootingStar 4s linear infinite' }}
          />
          <div
            className="shooting-star absolute w-20 h-0.5 bg-gradient-to-r from-transparent via-cyan-100 to-white rounded-full shadow-[0_0_6px_#fff]"
            style={{ top: '45%', right: '-10%', animation: 'shootingStar 5.5s linear infinite 2.2s' }}
          />
        </div>
      )}

      {/* 애니메이션 스타일 정의 */}
      <style>{`
        @keyframes sunbeamPulse {
          0% { opacity: 0.55; transform: rotate(-35deg) scale(0.98); }
          100% { opacity: 0.95; transform: rotate(-35deg) scale(1.05); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.25); }
        }
        @keyframes snowFall {
          0% { transform: translateY(-10px) translateX(0); opacity: 0; }
          20% { opacity: 0.9; }
          80% { opacity: 0.9; }
          100% { transform: translateY(240px) translateX(15px); opacity: 0; }
        }
        @keyframes raindropTrickle {
          0% { transform: translateY(-20px) scaleY(1); opacity: 0; }
          15% { opacity: 0.9; transform: translateY(10px) scaleY(1.3); }
          45% { transform: translateY(80px) scaleY(0.9); opacity: 0.95; }
          70% { transform: translateY(140px) scaleY(1.4); opacity: 0.85; }
          100% { transform: translateY(240px) scaleY(1); opacity: 0; }
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
    </div>
  );
}


