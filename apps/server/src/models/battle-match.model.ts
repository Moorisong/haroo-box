import mongoose, { Document, Schema } from 'mongoose';

export interface IBattleMatch extends Document {
  requesterId: mongoose.Types.ObjectId; // 대결 신청한 다마고치 ID
  receiverId: mongoose.Types.ObjectId; // 대결 상대방 다마고치 ID
  requesterSkill: number; // 1 ~ 6
  receiverSkill: number | null; // 수락 시 선택
  status: 'pending' | 'accepted' | 'rejected' | 'timeout' | 'completed';
  battleLogs: string[]; // 10분 동안의 병맛 전투 로그
  winnerId: mongoose.Types.ObjectId | null;
  runAwayOccurred: boolean;
  runAwaySuccess: boolean | null;
  createdAt: Date;
  resolvedAt: Date | null;
  updatedAt: Date;
}

const battleMatchSchema = new Schema<IBattleMatch>(
  {
    requesterId: { type: Schema.Types.ObjectId, required: true, ref: 'Tamagotchi', index: true },
    receiverId: { type: Schema.Types.ObjectId, required: true, ref: 'Tamagotchi', index: true },
    requesterSkill: { type: Number, required: true, min: 1, max: 6 },
    receiverSkill: { type: Number, default: null, min: 1, max: 6 },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'accepted', 'rejected', 'timeout', 'completed'],
      default: 'pending',
    },
    battleLogs: { type: [String], default: [] },
    winnerId: { type: Schema.Types.ObjectId, ref: 'Tamagotchi', default: null },
    runAwayOccurred: { type: Boolean, required: true, default: false },
    runAwaySuccess: { type: Boolean, default: null },
    resolvedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

export const getBattleMatchModel = () => {
  return mongoose.models.BattleMatch || mongoose.model<IBattleMatch>('BattleMatch', battleMatchSchema);
};
