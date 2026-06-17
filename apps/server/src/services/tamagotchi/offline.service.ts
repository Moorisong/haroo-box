import { ITamagotchi } from '../../models/tamagotchi.model';

/**
 * 1시간 경과 시 차감될 스탯 상수
 */
export const STAT_DECREASE = {
  HAPPINESS: 5,
  HUNGER: 4,
  CLEANLINESS: 4,
} as const;

/**
 * 위급 상태(행복도, 배고픔, 청결도 모두 0)의 자동 사망 임계시간 (72시간)
 */
export const CRITICAL_DEATH_LIMIT_MS = 72 * 60 * 60 * 1000;

/**
 * 다마고치 접속 및 조회 시 오프라인 시간 동안 누적 차감될 스탯 계산 및 위급/사망 상태 업데이트
 */
export const processOfflineStats = (tama: ITamagotchi, now: Date = new Date()): boolean => {
  if (tama.isDead || tama.isRetired) {
    return false;
  }

  const elapsedMs = now.getTime() - tama.lastInteractionAt.getTime();
  if (elapsedMs <= 0) {
    return false;
  }

  const elapsedHours = elapsedMs / (1000 * 60 * 60);

  // 스탯 감소 적용
  const happinessLoss = Math.floor(elapsedHours * STAT_DECREASE.HAPPINESS);
  const hungerLoss = Math.floor(elapsedHours * STAT_DECREASE.HUNGER);
  const cleanlinessLoss = Math.floor(elapsedHours * STAT_DECREASE.CLEANLINESS);

  if (happinessLoss > 0) {
    tama.stats.happiness = Math.max(0, tama.stats.happiness - happinessLoss);
  }
  if (hungerLoss > 0) {
    tama.stats.hunger = Math.max(0, tama.stats.hunger - hungerLoss);
  }
  if (cleanlinessLoss > 0) {
    tama.stats.cleanliness = Math.max(0, tama.stats.cleanliness - cleanlinessLoss);
  }

  // 최종 상호작용 시각 갱신
  tama.lastInteractionAt = now;

  // 위급 상태 체크 (셋 다 0인지 확인)
  const isCurrentlyCritical =
    tama.stats.happiness === 0 &&
    tama.stats.hunger === 0 &&
    tama.stats.cleanliness === 0;

  if (isCurrentlyCritical) {
    if (!tama.deathTimerStartAt) {
      // 위급상태 최초 진입
      tama.deathTimerStartAt = now;
    } else {
      // 이미 위급상태인 경우 경과 시간 계산하여 72시간 경과 확인
      const criticalDurationMs = now.getTime() - tama.deathTimerStartAt.getTime();
      if (criticalDurationMs >= CRITICAL_DEATH_LIMIT_MS) {
        tama.isDead = true;
        tama.deathReason = '방치로 인한 굶주림과 청결 부재';
      }
    }
  } else {
    // 위급상태 탈출
    tama.deathTimerStartAt = null;
  }

  return true;
};
