import { Request, Response } from 'express';
import { ApiResponse } from '../types/api.types';
import * as uKnowService from '../services/u-know/u-know.service';

/**
 * POST /api/u-know/create
 * 테스트 생성
 */
export const createTest = async (
  req: Request,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { questions, security } = req.body;
    const result = await uKnowService.createTest({ questions, security });

    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ success: false, error: error.message });
  }
};

/**
 * POST /api/u-know/submit
 * 답변 제출
 */
export const submitAnswer = async (
  req: Request,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { token, responderName, answers, security } = req.body;
    const result = await uKnowService.submitAnswer({
      token,
      responderName,
      answers,
      security,
    });

    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/u-know/result/:token
 * 결과 조회
 */
export const getResult = async (
  req: Request,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const token = req.params.token as string;
    const result = await uKnowService.getResult(token);

    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ success: false, error: error.message });
  }
};
