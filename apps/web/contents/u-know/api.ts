import { UKNOW_API } from './constants';
import type {
  CreateTestRequest,
  CreateTestResponse,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
  GetResultResponse,
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * 테스트 생성
 */
export const createTest = async (
  body: CreateTestRequest
): Promise<ApiResult<CreateTestResponse>> => {
  try {
    const res = await fetch(`${API_BASE}${UKNOW_API.CREATE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch {
    return { success: false, error: '서버 연결에 실패했습니다.' };
  }
};

/**
 * 답변 제출
 */
export const submitAnswer = async (
  body: SubmitAnswerRequest
): Promise<ApiResult<SubmitAnswerResponse>> => {
  try {
    const res = await fetch(`${API_BASE}${UKNOW_API.SUBMIT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch {
    return { success: false, error: '서버 연결에 실패했습니다.' };
  }
};

/**
 * 결과 조회
 */
export const getResult = async (
  token: string
): Promise<ApiResult<GetResultResponse>> => {
  try {
    const res = await fetch(`${API_BASE}${UKNOW_API.RESULT(token)}`);
    return await res.json();
  } catch {
    return { success: false, error: '서버 연결에 실패했습니다.' };
  }
};
