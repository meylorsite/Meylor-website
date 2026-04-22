import mongoose, { Schema, Document } from 'mongoose';

export interface ISection extends Document {
  key: string;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  contentEn: string;
  contentAr: string;
  imageUrl: string;
  ctaTextEn: string;
  ctaTextAr: string;
  ctaLink: string;
  order: number;
  isVisible: boolean;
  page: string;
}

const sectionSchema = new Schema<ISection>(
  {
    key: { type: String, required: true, unique: true },
    titleEn: { type: String, default: '' },
    titleAr: { type: String, default: '' },
    subtitleEn: { type: String, default: '' },
    subtitleAr: { type: String, default: '' },
    contentEn: { type: String, default: '' },
    contentAr: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    ctaTextEn: { type: String, default: '' },
    ctaTextAr: { type: String, default: '' },
    ctaLink: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
    page: { type: String, default: 'home' },
  },
  { timestamps: true }
);

export default mongoose.model<ISection>('Section', sectionSchema);
