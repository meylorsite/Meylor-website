import mongoose, { Schema, Document } from 'mongoose';

export interface INewsPost extends Document {
  titleEn: string;
  titleAr: string;
  slug: string;
  excerptEn: string;
  excerptAr: string;
  contentEn: string;
  contentAr: string;
  imageUrl: string;
  categoryEn: string;
  categoryAr: string;
  publishedAt: Date;
  isPublished: boolean;
  order: number;
}

const newsPostSchema = new Schema<INewsPost>(
  {
    titleEn: { type: String, required: true },
    titleAr: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerptEn: { type: String, default: '' },
    excerptAr: { type: String, default: '' },
    contentEn: { type: String, default: '' },
    contentAr: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    categoryEn: { type: String, default: 'General' },
    categoryAr: { type: String, default: 'عام' },
    publishedAt: { type: Date, default: Date.now },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<INewsPost>('NewsPost', newsPostSchema);
