export const BATTLE_LOGS_POOL = [
  '상대방에게 메롱을 날려 정신을 혼미하게 만듭니다!',
  '방구 향 가루가 공중을 수놓아 양쪽 모두 코를 틀어막습니다.',
  '서로 째려보며 기싸움을 하느라 1분이 1년처럼 흘러갑니다.',
  '귀여운 눈빛 공격을 발사했으나 상대가 가볍게 무시합니다.',
  '머리를 한 대 쥐어박고 황급히 눈치코치를 살핍니다.',
  '꼬리를 흔들며 도발을 시전하여 분위기가 급랭합니다.',
  '곡괭이 자루를 돌리다 제 발등에 찍힐 뻔했습니다.',
  '상대방의 기괴한 엉덩이춤에 놀라 3보 뒤로 주춤합니다.',
  '비누 방울을 날리며 목욕 탈출 기술을 뽐냅니다.',
  '치열한 이빨 털기 싸움이 욕설 대잔치로 번지고 있습니다.',
  '서로 머리끄덩이를 잡고 둥글게 둥글게 원을 그리며 돕니다.',
  '갑자기 배고파져서 주머니 속 과자 부스러기를 몰래 훔쳐먹습니다.',
] as const;

/**
 * 10분 전투 매칭에 필요한 연출용 병맛 로그를 타임스탬프 기준으로 슬라이싱하거나
 * 사전 세팅하기 위해 무작위 10개의 로그를 생성해 줍니다.
 */
export const generateBattleLogs = (
  reqName: string,
  recName: string,
  reqSkill: string,
  recSkill: string
): string[] => {
  const logs: string[] = [];
  logs.push(`⚔️ ${reqName}(이)가 ${recName}에게 대결을 선포했습니다!`);
  logs.push(`🔥 ${reqName}의 주특기: [${reqSkill}] vs ${recName}의 방어구: [${recSkill}]`);

  // 랜덤하게 재미 로그 추가
  const tempPool = [...BATTLE_LOGS_POOL];
  for (let i = 0; i < 6; i++) {
    const idx = Math.floor(Math.random() * tempPool.length);
    const logItem = tempPool.splice(idx, 1)[0];
    const target = Math.random() < 0.5 ? reqName : recName;
    logs.push(`[전투 중] ${target}(이)가 ${logItem}`);
  }

  logs.push('⚡ 승패를 결정지을 마지막 일격이 준비되고 있습니다!');
  return logs;
};
