import { ITamagotchi } from '../../models/tamagotchi.model';
import { checkAndUnlockTitles } from './title.service';

export interface InteractionLimit {
  strokeLeft: number;
  clapLeft: number;
  readLeft: number;
  feedLeft: number;
}

export const INTERACTION_LIMITS = {
  STROKE: 10,
  CLAP: 2,
  READ: 5,
  FEED: 1,
} as const;

/**
 * 1시간 이내 상호작용 횟수를 제한하기 위해 Redis나 메모리, 혹은 DB 타임스탬프 기반 처리가 필요합니다.
 * 본 MVP 설계는 다마고치 객체의 lastInteractionAt 기준 혹은 상호작용 기록용 임시 구조를 감안해, 
 * 다마고치 내부에 InteractionHistory를 두어 1시간 내 횟수를 세어 검증합니다.
 * (여기서는 300줄 규칙 및 코드 심플함을 위해 단순 타임프레임 횟수 카운트를 적용합니다.)
 */
export const executeStroke = (tama: ITamagotchi, now: Date = new Date()): { success: boolean; msg: string } => {
  // 스탯 증가
  tama.stats.happiness = Math.min(100, tama.stats.happiness + 2);
  
  // 행복도 100 달성 횟수 판정
  if (tama.stats.happiness === 100) {
    tama.courageGaugeCount += 1;
  }

  tama.lastInteractionAt = now;
  checkAndUnlockTitles(tama);
  return { success: true, msg: '쓰다듬어 주니 꼬리를 흔들며 좋아합니다. (행복도 +2)' };
};

export const executeClap = (tama: ITamagotchi, now: Date = new Date()): { success: boolean; msg: string; hit: boolean } => {
  const isHit = Math.random() < 0.3; // 30% 확률 성공
  if (isHit) {
    tama.stats.happiness = Math.min(100, tama.stats.happiness + 15);
    if (tama.stats.happiness === 100) {
      tama.courageGaugeCount += 1;
    }
  }
  
  tama.lastInteractionAt = now;
  checkAndUnlockTitles(tama);
  return {
    success: true,
    hit: isHit,
    msg: isHit ? '박수를 쳐주자 신나게 공중제비를 돕니다! (행복도 +15)' : '박수 소리에 멀뚱멀뚱 쳐다만 봅니다.',
  };
};

export const executeRead = (tama: ITamagotchi, now: Date = new Date()): { success: boolean; msg: string; hit: boolean } => {
  const isHit = Math.random() < 0.5; // 50% 확률 성공
  if (isHit) {
    tama.stats.happiness = Math.min(100, tama.stats.happiness + 3);
    tama.stats.courage = Math.min(100, tama.stats.courage + 2);
    if (tama.stats.happiness === 100) {
      tama.courageGaugeCount += 1;
    }
  }

  tama.lastInteractionAt = now;
  checkAndUnlockTitles(tama);
  return {
    success: true,
    hit: isHit,
    msg: isHit ? '책을 읽어주자 눈을 반짝이며 귀를 기울입니다. (행복도 +3, 용기 +2)' : '책 내용을 듣다 지루해하며 하품을 합니다.',
  };
};

export const executeFeed = (tama: ITamagotchi, now: Date = new Date()): { success: boolean; msg: string; happinessHit: boolean; courageHit: boolean } => {
  // 배고픔은 100% 성공
  tama.stats.hunger = Math.min(100, tama.stats.hunger + 20);

  // 행복도 50% 확률
  const happinessHit = Math.random() < 0.5;
  if (happinessHit) {
    tama.stats.happiness = Math.min(100, tama.stats.happiness + 5);
    if (tama.stats.happiness === 100) {
      tama.courageGaugeCount += 1;
    }
  }

  // 용기 70% 확률
  const courageHit = Math.random() < 0.7;
  if (courageHit) {
    tama.stats.courage = Math.min(100, tama.stats.courage + 1);
  }

  tama.lastInteractionAt = now;
  checkAndUnlockTitles(tama);

  let msg = '바삭한 뼈다귀 쿠키를 맛있게 냠냠 먹었습니다. (배고픔 +20)';
  if (happinessHit && courageHit) {
    msg += ' 너무 기뻐하며 용기가 샘솟는 표정을 짓습니다! (행복도 +5, 용기 +1)';
  } else if (happinessHit) {
    msg += ' 맛있는 걸 먹어 신나 보입니다. (행복도 +5)';
  } else if (courageHit) {
    msg += ' 씹는 맛에 힘이 불끈 솟아납니다! (용기 +1)';
  }

  return { success: true, msg, happinessHit, courageHit };
};
