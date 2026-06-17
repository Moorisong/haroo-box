import { ITamagotchi } from '../../models/tamagotchi.model';
import { checkAndUnlockTitles } from './title.service';

export const SKILLS_LIST = [
  '메롱하는 척 하다가 급소 찌르기',
  '방구 향 꽃가루 뿌리기',
  '욕하면서 꺼드럭대기',
  '귀여운 표정으로 희롱하기',
  '불주먹으로 머리 깨기',
  '곡괭이 들고 들이박기',
] as const;

/**
 * 1. 전투력 계산 공식
 * 전투력 = 행복도 + 배고픔 + 청결도 + (용기 * 1.5)
 */
export const calculateBattlePower = (tama: ITamagotchi): number => {
  return (
    tama.stats.happiness +
    tama.stats.hunger +
    tama.stats.cleanliness +
    tama.stats.courage * 1.5
  );
};

/**
 * 2. 전투 전 용기 +10 버프 (30% 확률) 판단
 */
export const rollSkillBuff = (): { activated: boolean; bonus: number } => {
  const isActivated = Math.random() < 0.3;
  return { activated: isActivated, bonus: isActivated ? 10 : 0 };
};

/**
 * 3. 도망 이벤트 발생 조건 검사
 * - 두 다마고치 전투력 차이가 80 이상
 * - 내 다마고치의 용기가 20 이하
 */
export const checkEscapeTrigger = (
  myPower: number,
  oppPower: number,
  myCourage: number
): boolean => {
  const powerDiff = oppPower - myPower; // 상대가 나보다 압도적으로 강함
  return powerDiff >= 80 && myCourage <= 20;
};

/**
 * 4. 전투력 차이에 따른 승리 확률 판정
 * - 차이 0 ~ 30: 50% vs 50%
 * - 차이 31 ~ 80: 높은 쪽 70% / 낮은 쪽 30%
 * - 차이 81 이상: 높은 쪽 90% / 낮은 쪽 10%
 */
export const determineWinner = (
  powerA: number,
  powerB: number
): { winner: 'A' | 'B'; probA: number } => {
  const diff = Math.abs(powerA - powerB);
  let probA = 0.5;

  if (diff <= 30) {
    probA = 0.5;
  } else if (diff <= 80) {
    probA = powerA > powerB ? 0.7 : 0.3;
  } else {
    probA = powerA > powerB ? 0.9 : 0.1;
  }

  const rand = Math.random();
  const winner = rand < probA ? 'A' : 'B';
  return { winner, probA };
};

/**
 * 5. 전투 결과에 따른 스탯 반영
 */
export const applyBattleResults = (
  winner: ITamagotchi,
  loser: ITamagotchi,
  now: Date = new Date()
) => {
  // 승자 스탯 보상
  winner.stats.courage = Math.min(100, winner.stats.courage + 15);
  winner.stats.happiness = Math.min(100, winner.stats.happiness + 10);
  winner.stats.hunger = Math.max(0, winner.stats.hunger - 10);
  winner.stats.cleanliness = Math.max(0, winner.stats.cleanliness - 15);
  winner.battleWins += 1;
  winner.battleCount += 1;
  winner.lastInteractionAt = now;

  // 패자 스탯 차감
  loser.stats.courage = Math.max(0, loser.stats.courage - 5);
  loser.stats.happiness = Math.max(0, loser.stats.happiness - 5);
  loser.stats.hunger = Math.max(0, loser.stats.hunger - 10);
  loser.stats.cleanliness = Math.max(0, loser.stats.cleanliness - 10);
  loser.battleCount += 1;
  loser.lastInteractionAt = now;

  checkAndUnlockTitles(winner);
  checkAndUnlockTitles(loser);
};
