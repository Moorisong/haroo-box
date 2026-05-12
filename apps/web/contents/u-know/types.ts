/**
 * 너잘알(u-know) 타입 정의
 */

export interface UKnowQuestion {
  question: string;
  predictedAnswer: string;
}

export interface UKnowAnswer {
  questionIndex: number;
  actualAnswer: string;
}

export interface UKnowSecurity {
  fingerprintHash: string;
  ipHash: string;
}

export interface CreateTestRequest {
  questions: UKnowQuestion[];
  security: UKnowSecurity;
}

export interface CreateTestResponse {
  token: string;
  expiresAt: string;
}

export interface SubmitAnswerRequest {
  token: string;
  responderName: string;
  answers: UKnowAnswer[];
  security: UKnowSecurity;
}

export interface SubmitAnswerResponse {
  responseId: string;
}

export interface ResponseEntry {
  responderName: string;
  answers: UKnowAnswer[];
  createdAt: string;
}

export interface GetResultResponse {
  token: string;
  questions: UKnowQuestion[];
  responses: ResponseEntry[];
  expiresAt: string;
  createdAt: string;
}
