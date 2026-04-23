import mongoose, { Schema, Document } from 'mongoose';

export interface IJourneyItem extends Document {
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  date: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  order: number;
  isVisible: boolean;
}

const journeyItemSchema = new Schema<IJourneyItem>(
  {
    titleEn: { type: String, required: true },
    titleAr: { type: String, required: true },
    descriptionEn: { type: String, default: '' },
    descriptionAr: { type: String, default: '' },

  },
  { timestamps: true }
);

export default mongoose.model<IJourneyItem>('JourneyItem', journeyItemSchema);
