import { ITamagotchi } from '../../models/tamagotchi.model';

export const TITLES_LIST = {
  WARRIOR: '🏆 최강의 전사',
  FIGHTER: '🥊 싸움 좀 하는 놈',
  IMMORTAL: '💀 불사신',
  BATTLE_MANIAC: '😈 싸움광',
  BRAVE: '🦁 겁 없는 녀석',
  COWARD: '😭 겁쟁이',
  ESCAPE_GOD: '🏳️ 도망의 신',
  HAPPY: '😊 세상에서 제일 행복한 놈',
  BATH_HATER: '🧼 목욕혐오자',
  BATH_ESCAPER: '🏃 욕실 탈옥범',
  STINKY: '💩 냄새나는 전설',
  NEGLECT: '💤 방치의 달인',
} as const;

/**
 * 특정 액션 또는 스탯 갱신 후 호출하여, 다마고치의 해금된 칭호를 판별하고 추가합니다.
 */
export const checkAndUnlockTitles = (tama: ITamagotchi): string[] => {
  const newlyUnlocked: string[] = [];

  const addIfNew = (titleName: string) => {
    if (!tama.unlockedTitles.includes(titleName)) {
      tama.unlockedTitles.push(titleName);
      newlyUnlocked.push(titleName);
    }
  };

  // 1. 전투 100승
  if (tama.battleWins >= 100) {
    addIfNew(TITLES_LIST.WARRIOR);
  }
  // 2. 전투 10승
  if (tama.battleWins >= 10) {
    addIfNew(TITLES_LIST.FIGHTER);
  }
  // 3. 총 전투 300회
  if (tama.battleCount >= 300) {
    addIfNew(TITLES_LIST.BATTLE_MANIAC);
  }
  // 4. 용기 100 달성 100회
  if (tama.stats.courage >= 100) {
    addIfNew(TITLES_LIST.BRAVE);
  }
  // 5. 도망 성공 1회 이상
  if (tama.escapeCount >= 1) {
    addIfNew(TITLES_LIST.COWARD);
  }
  // 6. 도망 50회 달성
  if (tama.escapeCount >= 50) {
    addIfNew(TITLES_LIST.ESCAPE_GOD);
  }
  // 7. 행복도 100 달성 100회
  if (tama.courageGaugeCount >= 100) {
    addIfNew(TITLES_LIST.HAPPY);
  }
  // 8. 목욕 거부 30회 달성
  if (tama.bathRefuseCount >= 30) {
    addIfNew(TITLES_LIST.BATH_HATER);
  }
  // 9. 목욕 탈출 성공 10회
  if (tama.bathEscapeCount >= 10) {
    addIfNew(TITLES_LIST.BATH_ESCAPER);
  }
  // 10. 방치 달인 (행복, 배고픔, 청결 모두 0)
  if (tama.stats.happiness === 0 && tama.stats.hunger === 0 && tama.stats.cleanliness === 0) {
    addIfNew(TITLES_LIST.NEGLECT);
  }

  // 대표 칭호가 아직 지정되지 않았다면 첫 칭호를 자동으로 설정
  if (!tama.representativeTitle && tama.unlockedTitles.length > 0) {
    tama.representativeTitle = tama.unlockedTitles[0];
  }

  return newlyUnlocked;
};
