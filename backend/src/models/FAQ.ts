import mongoose, { Schema, Document } from 'mongoose';

export interface IFAQ extends Document {
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
  category: string;
  order: number;
  isVisible: boolean;
}

const faqSchema = new Schema<IFAQ>(
  {
    questionEn: { type: String, required: true },
    questionAr: { type: String, required: true },
    answerEn: { type: String, required: true },
    answerAr: { type: String, required: true },
    category: { type: String, default: 'general' },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IFAQ>('FAQ', faqSchema);
