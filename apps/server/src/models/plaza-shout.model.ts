import mongoose, { Document, Schema } from 'mongoose';

export interface IPlazaShout extends Document {
  tamagotchiId: mongoose.Types.ObjectId;
  content: string;
  likes: string[]; // 유저 ID (providerId 또는 kakaoId) 목록
  comments: Array<{
    userId: string;
    nickname: string;
    content: string;
    createdAt: Date;
  }>;
  expireAt: Date; // 자정에 삭제하기 위한 TTL 날짜 필드
  createdAt: Date;
  updatedAt: Date;
}

const plazaShoutSchema = new Schema<IPlazaShout>(
  {
    tamagotchiId: { type: Schema.Types.ObjectId, required: true, ref: 'Tamagotchi', index: true },
    content: { type: String, required: true, maxlength: 100 },
    likes: { type: [String], default: [] },
    comments: [
      {
        userId: { type: String, required: true },
        nickname: { type: String, required: true },
        content: { type: String, required: true, maxlength: 100 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    expireAt: { type: Date, required: true, index: { expires: 0 } }, // TTL 인덱스
  },
  {
    timestamps: true,
  }
);

export const getPlazaShoutModel = () => {
  return mongoose.models.PlazaShout || mongoose.model<IPlazaShout>('PlazaShout', plazaShoutSchema);
};
