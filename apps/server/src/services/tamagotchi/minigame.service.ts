import { ITamagotchi } from '../../models/tamagotchi.model';
import { checkAndUnlockTitles } from './title.service';

export const FLOWER_ITEMS = [
  '민들레',
  '초록 새싹',
  '장미',
  '해바라기',
  '네잎클로버',
  '황금꽃',
] as const;

/**
 * 산책 실행 결과 반환 및 스탯 차등 보상 적용
 */
export const executeWalk = (
  tama: ITamagotchi,
  now: Date = new Date()
): { type: 'flower' | 'bug' | 'encounter' | 'finish'; msg: string; flower: string | null } => {
  const rand = Math.random();
  tama.lastInteractionAt = now;

  // 1. 꽃 발견 (5%)
  if (rand < 0.05) {
    const randomFlower = FLOWER_ITEMS[Math.floor(Math.random() * FLOWER_ITEMS.length)];
    tama.stats.courage = Math.min(100, tama.stats.courage + 3);
    tama.stats.cleanliness = Math.max(0, tama.stats.cleanliness - 2);
    tama.stats.happiness = Math.min(100, tama.stats.happiness + 5);
    
    // 발견한 꽃은 즉시 장착
    tama.flower = randomFlower;

    checkAndUnlockTitles(tama);
    return {
      type: 'flower',
      msg: `산책 중 향기로운 꽃길에서 [${randomFlower}] 장식을 발견해 머리에 꽂았습니다! (용기 +3, 청결도 -2, 행복도 +5)`,
      flower: randomFlower,
    };
  }

  // 2. 벌레 발견 (30%)
  if (rand < 0.35) {
    tama.stats.courage = Math.min(100, tama.stats.courage + 1);
    tama.stats.cleanliness = Math.max(0, tama.stats.cleanliness - 3);
    
    checkAndUnlockTitles(tama);
    return {
      type: 'bug',
      msg: '기어가는 왕벌레를 용감하게 툭툭 건드렸습니다! (용기 +1, 청결도 -3)',
      flower: null,
    };
  }

  // 3. 다른 다마고치 발견 (39%)
  if (rand < 0.74) {
    tama.stats.courage = Math.min(100, tama.stats.courage + 5);
    tama.stats.cleanliness = Math.max(0, tama.stats.cleanliness - 2);

    checkAndUnlockTitles(tama);
    return {
      type: 'encounter',
      msg: '골목 모퉁이에서 으르렁거리는 다른 다마고치와 눈싸움을 벌였습니다! (용기 +5, 청결도 -2)',
      flower: null,
    };
  }

  // 4. 일반 완주 (26%)
  tama.stats.happiness = Math.min(100, tama.stats.happiness + 3);
  tama.stats.cleanliness = Math.max(0, tama.stats.cleanliness - 2);

  checkAndUnlockTitles(tama);
  return {
    type: 'finish',
    msg: '가볍게 동네 한 바퀴를 돌며 상쾌한 산바람을 쐬었습니다. (행복도 +3, 청결도 -2)',
    flower: null,
  };
};

/**
 * 목욕 시도 및 거부/탈출 미니게임 트리거 여부 확인
 */
export const checkBathTrigger = (
  tama: ITamagotchi
): { triggerMinigame: boolean } => {
  // 탈출(거부) 조건: 용기와 청결도가 모두 10 이하일 때 50% 확률
  if (tama.stats.courage <= 10 && tama.stats.cleanliness <= 10) {
    const isEscaped = Math.random() < 0.5;
    if (isEscaped) {
      tama.bathRefuseCount += 1;
      checkAndUnlockTitles(tama);
      return { triggerMinigame: true };
    }
  }
  return { triggerMinigame: false };
};

/**
 * 목욕 미니게임 성공/실패 시의 보상 처리
 */
export const resolveBathMinigame = (
  tama: ITamagotchi,
  success: boolean,
  now: Date = new Date()
): { msg: string } => {
  tama.lastInteractionAt = now;
  if (success) {
    tama.stats.cleanliness = Math.min(100, tama.stats.cleanliness + 30);
    tama.stats.happiness = Math.min(100, tama.stats.happiness + 2);
    tama.bathEscapeCount += 1; // 탈주극에서 잡았으므로 카운트
    checkAndUnlockTitles(tama);
    return { msg: '으악! 깨끗해졌어! 결국 비누 거품으로 구석구석 목욕을 마쳤습니다. (청결도 +30, 행복도 +2)' };
  } else {
    tama.stats.happiness = Math.min(100, tama.stats.happiness + 1);
    checkAndUnlockTitles(tama);
    return { msg: '헤헤 잡아봐~ 재빠른 움직임으로 주인의 손을 피해 도망쳐 버렸습니다. (행복도 +1)' };
  }
};

/**
 * 목욕 일반 실행 (미니게임 없이 통과한 경우)
 */
export const executeNormalBath = (tama: ITamagotchi, now: Date = new Date()): { msg: string } => {
  tama.stats.cleanliness = Math.min(100, tama.stats.cleanliness + 30);
  tama.stats.happiness = Math.min(100, tama.stats.happiness + 2);
  tama.lastInteractionAt = now;
  checkAndUnlockTitles(tama);
  return { msg: '뜨끈한 온수 욕조 안에서 오리 장난감을 띄우고 목욕을 마쳤습니다. (청결도 +30, 행복도 +2)' };
};

/**
 * 장애물 달리기 완주 시간에 따른 스탯 보상
 */
export const resolveRunnerGame = (
  tama: ITamagotchi,
  seconds: number,
  now: Date = new Date()
): { msg: string } => {
  tama.lastInteractionAt = now;
  const clampedSec = Math.min(100, Math.max(0, seconds));

  if (clampedSec < 30) {
    tama.stats.cleanliness = Math.max(0, tama.stats.cleanliness - 2);
    tama.stats.happiness = Math.min(100, tama.stats.happiness + 1);
    checkAndUnlockTitles(tama);
    return { msg: `초반 돌부리에 걸려 엎어졌습니다. (${clampedSec}초 버팀) (청결도 -2, 행복도 +1)` };
  }

  if (clampedSec < 60) {
    tama.stats.cleanliness = Math.max(0, tama.stats.cleanliness - 3);
    tama.stats.courage = Math.min(100, tama.stats.courage + 2);
    tama.stats.happiness = Math.min(100, tama.stats.happiness + 2);
    checkAndUnlockTitles(tama);
    return { msg: `중반부 번개 장애물에 부딪혔습니다. (${clampedSec}초 버팀) (청결도 -3, 용기 +2, 행복도 +2)` };
  }

  if (clampedSec < 100) {
    tama.stats.cleanliness = Math.max(0, tama.stats.cleanliness - 3);
    tama.stats.courage = Math.min(100, tama.stats.courage + 3);
    tama.stats.happiness = Math.min(100, tama.stats.happiness + 3);
    checkAndUnlockTitles(tama);
    return { msg: `결승선을 눈앞에 두고 지쳐 쓰러졌습니다. (${clampedSec}초 버팀) (청결도 -3, 용기 +3, 행복도 +3)` };
  }

  // 100초 완주
  tama.stats.courage = Math.min(100, tama.stats.courage + 8);
  tama.stats.happiness = Math.min(100, tama.stats.happiness + 8);
  checkAndUnlockTitles(tama);
  return { msg: '우와! 무수한 톱니바퀴와 벼랑을 뚫고 결승선을 완벽히 통과했습니다! (용기 +8, 행복도 +8)' };
};
