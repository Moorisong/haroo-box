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
      
      const result = await model.findOneAndUpdate(
        { key },
        {
          $inc: { hits: 1 },
          $setOnInsert: { expiresAt: new Date(now.getTime() + this.windowMs) }
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
