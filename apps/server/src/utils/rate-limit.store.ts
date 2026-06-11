import mongoose, { Schema, Document } from 'mongoose';
import type { Store, Options, ClientRateLimitInfo } from 'express-rate-limit';
import { getUKnowConnection } from '../config/database';

interface IRateLimit extends Document {
  key: string;
  hits: number;
  expiresAt: Date;
}

const rateLimitSchema = new Schema<IRateLimit>({
  key: { type: String, required: true, unique: true },
  hits: { type: Number, required: true, default: 0 },
  expiresAt: { type: Date, required: true, expires: 0 }, // MongoDB TTL Index 기능
});

export const getRateLimitModel = (collectionName: string) => {
  // 사용자가 요청한 대로 uknow DB에 저장하기 위해 getUKnowConnection 사용
  const conn = getUKnowConnection();
  return conn.models[collectionName] || conn.model<IRateLimit>(collectionName, rateLimitSchema, collectionName);
};

export class MongoRateLimitStore implements Store {
  private collectionName: string;
  private windowMs: number;

  constructor(collectionName: string, windowMs: number) {
    this.collectionName = collectionName;
    this.windowMs = windowMs;
  }

  init(options: Options) {
    this.windowMs = options.windowMs || this.windowMs;
  }

  async increment(key: string): Promise<ClientRateLimitInfo> {
    try {
      const model = getRateLimitModel(this.collectionName);
      const now = new Date();
      const newExpiresAt = new Date(now.getTime() + this.windowMs);

      // 만료된 문서가 TTL에 의해 아직 삭제되지 않았을 수 있으므로,
      // 만료 시점이 지난 문서는 hits를 1로 리셋한다.
      const expired = await model.findOneAndUpdate(
        { key, expiresAt: { $lte: now } },
        { $set: { hits: 1, expiresAt: newExpiresAt } },
        { new: true }
      );

      if (expired) {
        return { totalHits: expired.hits, resetTime: expired.expiresAt };
      }

      // 만료되지 않은 기존 문서이거나 새 문서인 경우
      const result = await model.findOneAndUpdate(
        { key },
        {
          $inc: { hits: 1 },
          $setOnInsert: { expiresAt: newExpiresAt }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      return {
        totalHits: result.hits,
        resetTime: result.expiresAt
      };
    } catch (error) {
      console.error('MongoRateLimitStore increment error:', error);
      // 에러 발생 시 진행을 막지 않도록 임시 값 반환
      return { totalHits: 1, resetTime: new Date(Date.now() + this.windowMs) };
    }
  }

  async decrement(key: string): Promise<void> {
    try {
      const model = getRateLimitModel(this.collectionName);
      await model.findOneAndUpdate({ key }, { $inc: { hits: -1 } });
    } catch (error) {
      console.error('MongoRateLimitStore decrement error:', error);
    }
  }

  async resetKey(key: string): Promise<void> {
    try {
      const model = getRateLimitModel(this.collectionName);
      await model.deleteOne({ key });
    } catch (error) {
      console.error('MongoRateLimitStore resetKey error:', error);
    }
  }
}

export const createMongoStore = (collectionName: string, windowMs: number) => {
  return new MongoRateLimitStore(collectionName, windowMs);
};
