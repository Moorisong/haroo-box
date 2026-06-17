import mongoose, { Document, Schema } from 'mongoose';

export interface IFamily extends Document {
  founderId: mongoose.Types.ObjectId; // 시조 다마고치 ID
  name: string; // 가문 이름
  generation: number; // 현재 도달한 세대 수
  unlockedFamilyTitles: string[]; // 해금된 가문 칭호
  representativeFamilyTitle: string | null; // 장착된 대표 가문 칭호
  createdAt: Date;
  updatedAt: Date;
}

const familySchema = new Schema<IFamily>(
  {
    founderId: { type: Schema.Types.ObjectId, required: true, ref: 'Tamagotchi' },
    name: { type: String, required: true },
    generation: { type: Number, required: true, default: 1 },
    unlockedFamilyTitles: { type: [String], default: ['가문의 시작'] },
    representativeFamilyTitle: { type: String, default: '가문의 시작' },
  },
  {
    timestamps: true,
  }
);

export const getFamilyModel = () => {
  return mongoose.models.Family || mongoose.model<IFamily>('Family', familySchema);
};
