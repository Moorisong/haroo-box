/**
 * 하루엽서 API 통신 유틸리티
 * - 환경변수 NEXT_PUBLIC_API_URL 기반으로 엔드포인트 구성
 * - 엽서 생성(FormData), 엽서 조회, 만료 분기 처리
 */

import type {
  CreatePostcardResponse,
  GetPostcardResponse,
} from '@/types/postcard';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
const POSTCARD_ENDPOINT = `${API_BASE_URL}/api/postcards`;

/** 엽서 생성 API 호출 (multipart/form-data) */
export const createPostcardApi = async (
  formData: FormData
): Promise<CreatePostcardResponse> => {
  const res = await fetch(POSTCARD_ENDPOINT, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: '서버 오류가 발생했습니다.' }));
    throw new Error(error.message ?? '엽서 생성에 실패했습니다.');
  }

  return res.json() as Promise<CreatePostcardResponse>;
};

/** 엽서 조회 API 호출 */
export const getPostcardApi = async (
  id: string
): Promise<{ status: number; data: GetPostcardResponse | null; expired: boolean }> => {
  const res = await fetch(`${POSTCARD_ENDPOINT}/${id}`, {
    cache: 'no-store',
  });

  // 만료된 엽서 (410 Gone)
  if (res.status === 410) {
    return { status: 410, data: null, expired: true };
  }

  // 존재하지 않는 엽서 (404)
  if (res.status === 404) {
    return { status: 404, data: null, expired: false };
  }

  if (!res.ok) {
    throw new Error('엽서 조회에 실패했습니다.');
  }

  const data = (await res.json()) as GetPostcardResponse;

  // image_url 도메인이 다를 경우 현재 API_BASE_URL로 보정하여 이미지 404 방지
  if (data?.data?.image_url) {
    try {
      const parsedUrl = new URL(data.data.image_url);
      const apiBase = new URL(API_BASE_URL);
      // host가 다른 경우 (예: 운영서버 주소 → 로컬 개발서버 주소)
      if (parsedUrl.host !== apiBase.host) {
        data.data.image_url = `${apiBase.origin}${parsedUrl.pathname}`;
      }
    } catch {
      // 상대경로 등 URL 파싱 실패 시 기본 보정
      if (data.data.image_url.startsWith('/')) {
        data.data.image_url = `${API_BASE_URL}${data.data.image_url}`;
      }
    }
  }

  return { status: 200, data, expired: false };
};
