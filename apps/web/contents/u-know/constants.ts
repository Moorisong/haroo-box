/**
 * 너잘알(u-know) 프론트엔드 상수
 */

/** 라우트 경로 */
export const UKNOW_ROUTES = {
  HOME: '/u-know',
  CREATE: '/u-know/create',
  SHARE: (id: string) => `/u-know/share/${id}`,
  PLAY: (token: string) => `/u-know/play/${token}`,
  RESULT: (token: string) => `/u-know/result/${token}`,
} as const;

/** API 경로 */
export const UKNOW_API = {
  CREATE: '/api/u-know/create',
  SUBMIT: '/api/u-know/submit',
  RESULT: (token: string) => `/api/u-know/result/${token}`,
} as const;

/** 입력 제한 */
export const UKNOW_LIMITS = {
  MAX_QUESTIONS: 10,
  MAX_QUESTION_LENGTH: 200,
  MAX_ANSWER_LENGTH: 200,
  MAX_NAME_LENGTH: 20,
} as const;

/** placeholder 랜덤 목록 */
export const QUESTION_PLACEHOLDERS = [
  '내가 새벽 4시에 전화하면?',
  '내가 갑자기 운다면?',
  '내가 100만원 빌려달라면?',
  '나한테 제일 하고 싶은 말?',
  '내가 머리 파마하면?',
  '나 결혼하면 축의금 얼마?',
  '내가 외국 간다면?',
] as const;

export const ANSWER_PLACEHOLDERS = [
  '분명 욕할 듯 ㅋㅋㅋ',
  '읽씹할 듯',
  '걍 끊을 듯',
  '아마 웃기만 할 듯',
  '모른 척할 거 같은데',
  '3만원...?',
  '안 갔으면 좋겠다 할 듯',
] as const;

/** 결과 리액션 텍스트 */
export const RESULT_REACTIONS = [
  '생각보다 모르네 ㅋㅋㅋ',
  '이 정도면 타인 아님?',
  '친구 계속 해도 되겠다',
  '와 신기하게 비슷한데?',
  '뭐야 이 사람 누구야',
  '오...의외인데?',
  '진짜 잘 아네 소름',
] as const;

/** TTL 안내 문구 */
export const TTL_NOTICE = '서버비 아까우니까 결과는 3일 뒤 삭제됨 😇';
