import mongoose, { Document, Schema } from 'mongoose';

export interface ITamagotchi extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  species: 'cutie' | 'weird' | 'normal' | 'unique';
  colorPalette: number; // 0 ~ 4
  hat: string; // crown, wizard, explorer 등 10종
  flower: string | null; // 장착된 꽃 장식
  stats: {
    happiness: number;
    hunger: number;
    cleanliness: number;
    courage: number;
  };
  lastInteractionAt: Date;
  courageGaugeCount: number; // 행복도 100 달성 횟수 (행복왕 랭킹용)
  escapeCount: number; // 도망친 횟수 (겁쟁이 랭킹용)
  battleWins: number; // 전투 승리 횟수 (최강 전사 랭킹용)
  battleCount: number; // 총 전투 횟수
  bathRefuseCount: number; // 목욕 거부 횟수
  bathEscapeCount: number; // 목욕 탈출 성공 횟수
  unlockedTitles: string[]; // 해금된 칭호 목록
  representativeTitle: string | null; // 대표 칭호
  generation: number; // 현재 세대
  birthDate: Date;
  familyId: mongoose.Types.ObjectId | null; // 소속 가문 ID
  isRetired: boolean;
  isDead: boolean;
  deathReason: string | null;
  deathTimerStartAt: Date | null; // 위급 상태 돌입 시간 (72시간 타이머)
  createdAt: Date;
  updatedAt: Date;
}

const tamagotchiSchema = new Schema<ITamagotchi>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User', index: true },
    name: { type: String, required: true, unique: true, index: true },
    species: { type: String, required: true, enum: ['cutie', 'weird', 'normal', 'unique'] },
    colorPalette: { type: Number, required: true, default: 0 },
    hat: { type: String, required: true },
    flower: { type: String, default: null },
    stats: {
      happiness: { type: Number, required: true, default: 50, min: 0, max: 100 },
      hunger: { type: Number, required: true, default: 50, min: 0, max: 100 },
      cleanliness: { type: Number, required: true, default: 100, min: 0, max: 100 },
      courage: { type: Number, required: true, default: 10, min: 0, max: 100 },
    },
    lastInteractionAt: { type: Date, required: true, default: Date.now },
    courageGaugeCount: { type: Number, required: true, default: 0 },
    escapeCount: { type: Number, required: true, default: 0 },
    battleWins: { type: Number, required: true, default: 0 },
    battleCount: { type: Number, required: true, default: 0 },
    bathRefuseCount: { type: Number, required: true, default: 0 },
    bathEscapeCount: { type: Number, required: true, default: 0 },
    unlockedTitles: { type: [String], default: [] },
    representativeTitle: { type: String, default: null },
    generation: { type: Number, required: true, default: 1 },
    birthDate: { type: Date, required: true, default: Date.now },
    familyId: { type: Schema.Types.ObjectId, ref: 'Family', default: null },
    isRetired: { type: Boolean, required: true, default: false },
    isDead: { type: Boolean, required: true, default: false },
    deathReason: { type: String, default: null },
    deathTimerStartAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

export const getTamagotchiModel = () => {
  return mongoose.models.Tamagotchi || mongoose.model<ITamagotchi>('Tamagotchi', tamagotchiSchema);
};
