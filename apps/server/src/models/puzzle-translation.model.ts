import { Schema } from 'mongoose';
import { getPuzzleConnection } from '../config/database';

export interface IPuzzleTranslation {
  key: string;
  ko: string;
  en: string;
  updatedAt: Date;
}

const puzzleTranslationSchema = new Schema<IPuzzleTranslation>({
  key: { type: String, required: true, unique: true, index: true, trim: true },
  ko: { type: String, required: true },
  en: { type: String, required: true },
}, { timestamps: true });

export function getPuzzleTranslationModel() {
  const conn = getPuzzleConnection();
  return conn.models.PuzzleTranslation || conn.model<IPuzzleTranslation>('PuzzleTranslation', puzzleTranslationSchema);
}
