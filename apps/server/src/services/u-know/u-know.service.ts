import { nanoid } from 'nanoid';
import { getUKnowTestModel, IQuestion, ISecurity } from '../../models/u-know-test.model';
import { getUKnowResponseModel, IAnswer } from '../../models/u-know-response.model';
import {
  TTL_MS,
  TOKEN_LENGTH,
  MAX_QUESTIONS,
  MIN_QUESTIONS,
  MAX_QUESTION_LENGTH,
  MAX_ANSWER_LENGTH,
  MAX_NAME_LENGTH,
  ERROR_MESSAGES,
} from './u-know.constants';

interface CreateTestInput {
  questions: IQuestion[];
  security: ISecurity;
}

interface SubmitAnswerInput {
  token: string;
  responderName: string;
  answers: IAnswer[];
  security: ISecurity;
}

/**
 * 테스트 생성
 */
export const createTest = async (input: CreateTestInput) => {
  const { questions, security } = input;

  validateQuestions(questions);
  validateSecurity(security);

  const token = nanoid(TOKEN_LENGTH);
  const expiresAt = new Date(Date.now() + TTL_MS);

  const UKnowTest = getUKnowTestModel();
  const test = await UKnowTest.create({
    token,
    questions,
    security,
    expiresAt,
  });

  return { token: test.token, expiresAt: test.expiresAt };
};

/**
 * 답변 제출
 */
export const submitAnswer = async (input: SubmitAnswerInput) => {
  const { token, responderName, answers, security } = input;

  if (!responderName || responderName.length > MAX_NAME_LENGTH) {
    throw new ValidationError(ERROR_MESSAGES.NAME_TOO_LONG);
  }

  validateSecurity(security);

  const UKnowTest = getUKnowTestModel();
  const UKnowResponse = getUKnowResponseModel();

  const test = await UKnowTest.findOne({ token });
  if (!test) {
    throw new NotFoundError(ERROR_MESSAGES.TEST_NOT_FOUND);
  }

  validateAnswers(answers, test.questions.length);

  const response = await UKnowResponse.create({
    testId: test._id,
    responderName,
    answers,
    security,
    expiresAt: test.expiresAt,
  });

  return { responseId: response._id };
};

/**
 * 결과 조회
 */
export const getResult = async (token: string) => {
  const UKnowTest = getUKnowTestModel();
  const UKnowResponse = getUKnowResponseModel();

  const test = await UKnowTest.findOne({ token });
  if (!test) {
    throw new NotFoundError(ERROR_MESSAGES.TEST_NOT_FOUND);
  }

  const responses = await UKnowResponse.find({ testId: test._id })
    .sort({ createdAt: -1 })
    .lean();

  return {
    token: test.token,
    questions: test.questions,
    responses: responses.map((r) => ({
      responderName: r.responderName,
      answers: r.answers,
      createdAt: r.createdAt,
    })),
    expiresAt: test.expiresAt,
    createdAt: test.createdAt,
  };
};

// --- Validation helpers ---

const validateQuestions = (questions: IQuestion[]): void => {
  if (!questions || questions.length < MIN_QUESTIONS || questions.length > MAX_QUESTIONS) {
    throw new ValidationError(ERROR_MESSAGES.INVALID_QUESTIONS);
  }

  for (const q of questions) {
    if (!q.question || q.question.length > MAX_QUESTION_LENGTH) {
      throw new ValidationError(ERROR_MESSAGES.QUESTION_TOO_LONG);
    }
    if (!q.predictedAnswer || q.predictedAnswer.length > MAX_ANSWER_LENGTH) {
      throw new ValidationError(ERROR_MESSAGES.ANSWER_TOO_LONG);
    }
  }
};

const validateAnswers = (answers: IAnswer[], questionCount: number): void => {
  for (const a of answers) {
    if (a.questionIndex < 0 || a.questionIndex >= questionCount) {
      throw new ValidationError(ERROR_MESSAGES.INVALID_ANSWER_INDEX);
    }
    if (!a.actualAnswer || a.actualAnswer.length > MAX_ANSWER_LENGTH) {
      throw new ValidationError(ERROR_MESSAGES.ANSWER_TOO_LONG);
    }
  }
};

const validateSecurity = (security: ISecurity): void => {
  if (!security?.fingerprintHash || !security?.ipHash) {
    throw new ValidationError(ERROR_MESSAGES.SECURITY_REQUIRED);
  }
};

// --- Error classes ---

class ValidationError extends Error {
  statusCode = 400;
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends Error {
  statusCode = 404;
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}
