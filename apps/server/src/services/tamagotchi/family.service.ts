import { ITamagotchi } from '../../models/tamagotchi.model';
import { IFamily } from '../../models/family.model';

export const FAMILY_TITLES = {
  G1: '🌱 가문의 시작',
  G2: '🥚 첫 번째 후계자',
  G3: '🧸 작은 가문',
  G5: '🏠 터 잡은 집안',
  G10: '👨‍👩‍👧 대가족',
  G20: '🏛️ 명문가의 기초',
  G50: '🏰 명문 가문',
  G100: '🌟 왕가의 품격',
  G1000: '🌈 창조 신화',
  G10000: '♾️ 끝나지 않는 이야기',
} as const;

/**
 * 가문 세대 변화에 따른 가문 칭호 해금
 */
export const checkFamilyTitles = (family: IFamily): string[] => {
  const newlyUnlocked: string[] = [];

  const addIfNew = (title: string) => {
    if (!family.unlockedFamilyTitles.includes(title)) {
      family.unlockedFamilyTitles.push(title);
      newlyUnlocked.push(title);
    }
  };

  const gen = family.generation;
  if (gen >= 1) addIfNew(FAMILY_TITLES.G1);
  if (gen >= 2) addIfNew(FAMILY_TITLES.G2);
  if (gen >= 3) addIfNew(FAMILY_TITLES.G3);
  if (gen >= 5) addIfNew(FAMILY_TITLES.G5);
  if (gen >= 10) addIfNew(FAMILY_TITLES.G10);
  if (gen >= 20) addIfNew(FAMILY_TITLES.G20);
  if (gen >= 50) addIfNew(FAMILY_TITLES.G50);
  if (gen >= 100) addIfNew(FAMILY_TITLES.G100);
  if (gen >= 1000) addIfNew(FAMILY_TITLES.G1000);
  if (gen >= 10000) addIfNew(FAMILY_TITLES.G10000);

  return newlyUnlocked;
};

/**
 * 은퇴 조상 나이 증가에 따른 자연사 판정 (하루 한 살 증가 및 매일 1회 실행)
 * 나이 70세 이상 자연사 확률 적용
 */
export const rollNaturalDeath = (age: number): { dead: boolean; reason: string | null } => {
  const rand = Math.random() * 100;

  if (age >= 120) {
    if (rand < 35) return { dead: true, reason: '노환으로 인한 아름다운 임종 (향년 120세 이상)' };
  } else if (age >= 100) {
    if (rand < 20) return { dead: true, reason: '100세를 장수하고 떠난 천상 소풍' };
  } else if (age >= 90) {
    if (rand < 10) return { dead: true, reason: '평온한 노화로 생을 마감' };
  } else if (age >= 80) {
    if (rand < 5) return { dead: true, reason: '노쇠로 인한 자연사' };
  } else if (age >= 70) {
    if (rand < 2) return { dead: true, reason: '편안히 누워 숨을 거둠' };
  }

  return { dead: false, reason: null };
};

/**
 * 젊은 은퇴 조상의 예기치 못한 사고사 판정 (매일 1회)
 */
export const rollAccidentalDeath = (age: number): { dead: boolean; reason: string | null } => {
  if (age >= 70) return { dead: false, reason: null }; // 70세 이상은 자연사 판정만

  const rand = Math.random() * 100;
  const accidents = [
    '산책 중 도토리 맞고 뇌진탕',
    '친했던 무당벌레 친구의 쓰라린 배신',
    '욕실에서 비누 밟고 슬라이딩 대참사',
    '과식 축제에서 쿠키 과다 섭취로 체함',
    '미지의 행성을 탐험하겠다며 나선 마지막 모험',
  ];

  if (age <= 30) {
    if (rand < 0.05) {
      return { dead: true, reason: accidents[Math.floor(Math.random() * accidents.length)] };
    }
  } else {
    // 31 ~ 69세
    if (rand < 0.02) {
      return { dead: true, reason: accidents[Math.floor(Math.random() * accidents.length)] };
    }
  }

  return { dead: false, reason: null };
};
export const getRetiredTamagotchiAge = (birthDate: Date, now: Date = new Date()): number => {
  const msDiff = now.getTime() - birthDate.getTime();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  // 현실 시간 1주일 = 1살
  return Math.floor(msDiff / weekMs);
};
