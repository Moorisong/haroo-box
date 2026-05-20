import { Schema, Document, Types } from 'mongoose';
import { getUKnowConnection } from '../config/database';
import { ISecurity } from './u-know-test.model';

export interface IAnswer {
  questionIndex: number;
  actualAnswer: string;
}

export interface IUKnowResponse extends Document {
  testId: Types.ObjectId;
  responderName: string;
  answers: IAnswer[];
  security: ISecurity;
  createdAt: Date;
  expiresAt: Date;
}

const answerSchema = new Schema<IAnswer>(
  {
    questionIndex: { type: Number, required: true },
    actualAnswer: { type: String, required: true, maxlength: 200 },
  },
  { _id: false }
);

const securitySchema = new Schema<ISecurity>(
  {
    fingerprintHash: { type: String, required: true },
    ipHash: { type: String, required: true },
  },
  { _id: false }
);

const uKnowResponseSchema = new Schema<IUKnowResponse>(
  {
    testId: {
      type: Schema.Types.ObjectId,
      ref: 'UKnowTest',
      required: true,
      index: true,
    },
    responderName: {
      type: String,
      required: true,
      maxlength: 20,
    },
    answers: {
      type: [answerSchema],
      required: true,
    },
    security: { type: securitySchema, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// TTL: expiresAt 필드 기반 자동 삭제
uKnowResponseSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const getUKnowResponseModel = () => {
  const conn = getUKnowConnection();
  return conn.models.UKnowResponse || conn.model<IUKnowResponse>('UKnowResponse', uKnowResponseSchema);
};
