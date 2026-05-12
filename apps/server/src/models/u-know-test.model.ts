import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
  question: string;
  predictedAnswer: string;
}

export interface ISecurity {
  fingerprintHash: string;
  ipHash: string;
}

export interface IUKnowTest extends Document {
  token: string;
  questions: IQuestion[];
  security: ISecurity;
  createdAt: Date;
  expiresAt: Date;
}

const questionSchema = new Schema<IQuestion>(
  {
    question: { type: String, required: true, maxlength: 200 },
    predictedAnswer: { type: String, required: true, maxlength: 200 },
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

const uKnowTestSchema = new Schema<IUKnowTest>(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    questions: {
      type: [questionSchema],
      required: true,
      validate: {
        validator: (v: IQuestion[]) => v.length >= 1 && v.length <= 10,
        message: '질문은 1~10개여야 합니다.',
      },
    },
    security: { type: securitySchema, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// TTL: expiresAt 필드 기반 자동 삭제
uKnowTestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IUKnowTest>('UKnowTest', uKnowTestSchema);
