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
      {/* 1. 우상단에서 출발하여 좌측 하단으로 대각선 내리쬐는 햇살 (Top-Right to Bottom-Left) */}
      {effectType === 'sunlight' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* 회전(rotate) 및 크기 비율 오차를 원천 차단하기 위해 요소 전체(inset-0)에 CSS 대각선 그라데이션 적용.
              'to bottom right' 방향의 50% 지점은 정확히 [우상단 ↔ 좌하단]을 잇는 대각선이 됩니다. */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(
                to bottom right,
                transparent 0%,
                transparent 42%,
                rgba(254, 240, 138, 0.1) 47%,
                rgba(255, 251, 235, 0.5) 49.2%,
                rgba(254, 240, 138, 0.9) 50%,
                rgba(255, 251, 235, 0.5) 50.8%,
                rgba(254, 240, 138, 0.1) 53%,
                transparent 58%,
                transparent 100%
              )`,
              // 우상단(광원)은 진하게, 좌하단으로 내려갈수록 빛이 자연스럽게 페이드아웃 되도록 마스킹
              WebkitMaskImage: 'linear-gradient(to bottom left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0) 90%)',
              maskImage: 'linear-gradient(to bottom left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0) 90%)',
              filter: 'blur(6px)',
              mixBlendMode: 'screen',
              animation: 'sunbeamPulse 5s ease-in-out infinite alternate',
            }}
          />
          {/* 우상단 광원 앰비언트 글로우 */}
          <div
            className="absolute -top-12 -right-12 w-52 h-52 rounded-full bg-amber-100/70 blur-2xl pointer-events-none"
            style={{
              mixBlendMode: 'screen',
              animation: 'sunbeamPulse 5s ease-in-out infinite alternate',
            }}
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
          <div className="snowflake absolute w-2.5 h-2.5 bg-white/90 rounded-full blur-[0.5px]" style={{ left: '8%', animation: 'snowFall 4.5s linear infinite -1.2s' }} />
          <div className="snowflake absolute w-3.5 h-3.5 bg-white/80 rounded-full blur-[0.7px]" style={{ left: '25%', animation: 'snowFall 6.0s linear infinite -4.2s' }} />
          <div className="snowflake absolute w-2 h-2 bg-white/95 rounded-full blur-[0.3px]" style={{ left: '42%', animation: 'snowFall 3.8s linear infinite -2.1s' }} />
          <div className="snowflake absolute w-3 h-3 bg-white/85 rounded-full blur-[0.6px]" style={{ left: '60%', animation: 'snowFall 5.2s linear infinite -0.8s' }} />
          <div className="snowflake absolute w-2.5 h-2.5 bg-white/90 rounded-full blur-[0.4px]" style={{ left: '78%', animation: 'snowFall 4.2s linear infinite -3.4s' }} />
          <div className="snowflake absolute w-1.5 h-1.5 bg-white/80 rounded-full blur-[0.3px]" style={{ left: '92%', animation: 'snowFall 5.8s linear infinite -1.9s' }} />
          <div className="snowflake absolute w-3 h-3 bg-white/75 rounded-full blur-[0.8px]" style={{ left: '18%', animation: 'snowFall 5.0s linear infinite -3.6s' }} />
          <div className="snowflake absolute w-2 h-2 bg-white/90 rounded-full blur-[0.4px]" style={{ left: '68%', animation: 'snowFall 4.0s linear infinite -2.7s' }} />
        </div>
      )}

      {/* 4. 창가에 맺혀있는 진짜 물방울 쉐입 빗방울 (Realistic Glass Water Drops) */}
      {effectType === 'raindrop' && (
        <div className="absolute inset-0 bg-slate-900/15 backdrop-blur-[0.3px]">
          {/* 창문에 처음부터 균일하게 배치된 투명 입체 물방울 8개 */}
          <div
            className="absolute top-[10%] left-[12%] w-3.5 h-4.5 bg-gradient-to-b from-white/70 via-white/20 to-black/20 rounded-[50%_50%_40%_40%/60%_60%_40%_40%] border border-white/60 shadow-[inset_0_1.5px_2px_rgba(255,255,255,1),0_2px_4px_rgba(0,0,0,0.3)] backdrop-blur-[0.2px]"
            style={{ animation: 'naturalBeadFlow1 12s linear infinite' }}
          />
          <div
            className="absolute top-[25%] left-[70%] w-4.5 h-5.5 bg-gradient-to-b from-white/80 via-white/25 to-black/25 rounded-[50%_50%_40%_40%/60%_60%_40%_40%] border border-white/70 shadow-[inset_0_2px_3px_rgba(255,255,255,1),0_3px_5px_rgba(0,0,0,0.35)] backdrop-blur-[0.2px]"
            style={{ animation: 'naturalBeadFlow2 15s linear infinite' }}
          />
          <div
            className="absolute top-[40%] left-[24%] w-2.5 h-3.5 bg-gradient-to-b from-white/60 via-white/15 to-black/15 rounded-[50%_50%_40%_40%/60%_60%_40%_40%] border border-white/50 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_1.5px_3px_rgba(0,0,0,0.25)] backdrop-blur-[0.1px]"
            style={{ animation: 'naturalBeadFlow3 10s linear infinite' }}
          />
          <div
            className="absolute top-[60%] left-[85%] w-3.5 h-4.5 bg-gradient-to-b from-white/70 via-white/20 to-black/20 rounded-[50%_50%_40%_40%/60%_60%_40%_40%] border border-white/60 shadow-[inset_0_1.5px_2px_rgba(255,255,255,1),0_2px_4px_rgba(0,0,0,0.3)] backdrop-blur-[0.2px]"
            style={{ animation: 'naturalBeadFlow4 14s linear infinite' }}
          />
          <div
            className="absolute top-[18%] left-[42%] w-3 h-4 bg-gradient-to-b from-white/65 via-white/18 to-black/18 rounded-[50%_50%_40%_40%/60%_60%_40%_40%] border border-white/55 shadow-[inset_0_1.2px_2px_rgba(255,255,255,0.95),0_2px_4px_rgba(0,0,0,0.28)] backdrop-blur-[0.1px]"
            style={{ animation: 'naturalBeadFlow2 13s linear infinite' }}
          />
          <div
            className="absolute top-[52%] left-[60%] w-2.5 h-3.5 bg-gradient-to-b from-white/60 via-white/15 to-black/15 rounded-[50%_50%_40%_40%/60%_60%_40%_40%] border border-white/50 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_1.5px_3px_rgba(0,0,0,0.25)] backdrop-blur-[0.1px]"
            style={{ animation: 'naturalBeadFlow1 11s linear infinite' }}
          />
          <div
            className="absolute top-[32%] left-[50%] w-4 h-5 bg-gradient-to-b from-white/75 via-white/22 to-black/22 rounded-[50%_50%_40%_40%/60%_60%_40%_40%] border border-white/65 shadow-[inset_0_1.8px_2.5px_rgba(255,255,255,1),0_2.5px_5px_rgba(0,0,0,0.32)] backdrop-blur-[0.2px]"
            style={{ animation: 'naturalBeadFlow4 16s linear infinite' }}
          />
          <div
            className="absolute top-[75%] left-[92%] w-2.5 h-3.5 bg-gradient-to-b from-white/60 via-white/15 to-black/15 rounded-[50%_50%_40%_40%/60%_60%_40%_40%] border border-white/50 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_1.5px_3px_rgba(0,0,0,0.25)] backdrop-blur-[0.1px]"
            style={{ animation: 'naturalBeadFlow3 9s linear infinite' }}
          />

          {/* 창가를 타고 수직으로 스쳐 내리는 세로 일자 빗줄기들 (은은하고 자연스러운 속도) */}
          <div
            className="absolute left-[28%] top-0 w-[1.5px] h-16 bg-gradient-to-b from-transparent via-white/85 to-transparent rounded-full shadow-[0_0_4px_rgba(255,255,255,0.8)]"
            style={{ animation: 'fastRainStreak 1.4s linear infinite' }}
          />
          <div
            className="absolute left-[54%] top-0 w-[2px] h-20 bg-gradient-to-b from-transparent via-white/90 to-transparent rounded-full shadow-[0_0_6px_rgba(255,255,255,0.9)]"
            style={{ animation: 'fastRainStreak 1.1s linear infinite 0.3s' }}
          />
          <div
            className="absolute left-[78%] top-0 w-[1.5px] h-14 bg-gradient-to-b from-transparent via-white/75 to-transparent rounded-full"
            style={{ animation: 'fastRainStreak 1.6s linear infinite 0.6s' }}
          />
        </div>
      )}

      {/* 5. 바람타고 불규칙하게 흩날리는 벚꽃잎 (Swaying Petals Drift) */}
      {effectType === 'cherry-blossom' && (
        <div className="absolute inset-0">
          <div
            className="petal absolute w-3.5 h-2.5 bg-pink-200/90 rounded-[60%_40%_70%_30%/50%_60%_40%_50%] shadow-[0_0_4px_rgba(251,207,232,0.6)]"
            style={{ left: '10%', animation: 'petalIrregular1 7s ease-in-out infinite -1.0s' }}
          />
          <div
            className="petal absolute w-4 h-2.5 bg-rose-200/95 rounded-[50%_50%_60%_40%/60%_40%_60%_40%]"
            style={{ left: '45%', animation: 'petalIrregular2 8.5s ease-in-out infinite -4.5s' }}
          />
          <div
            className="petal absolute w-3 h-2 bg-pink-300/85 rounded-[70%_30%_50%_50%/40%_60%_50%_50%]"
            style={{ left: '75%', animation: 'petalIrregular1 6.2s ease-in-out infinite -2.8s' }}
          />
          <div
            className="petal absolute w-3.5 h-2.5 bg-pink-100/90 rounded-[40%_60%_50%_50%/50%_50%_60%_40%]"
            style={{ left: '90%', animation: 'petalIrregular2 7.8s ease-in-out infinite -6.0s' }}
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
    </div>
  );
}


