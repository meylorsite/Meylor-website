import mongoose, { Schema, Document } from 'mongoose';

export interface IGalleryMedia {
  url: string;
  type: 'image' | 'video';
  captionEn?: string;
  captionAr?: string;
  order: number;
}

export interface IGalleryActivity extends Document {
  titleEn: string;
  titleAr: string;
  slug: string;
  descriptionEn: string;
  descriptionAr: string;
  date: Date;
  locationEn: string;
  locationAr: string;
  isInsideSchool: boolean;
  coverImageUrl: string;
  media: IGalleryMedia[];
  isVisible: boolean;
  order: number;
}

const galleryMediaSchema = new Schema<IGalleryMedia>(
  {
    url: { type: String, required: true },
    type: { type: String, enum: ['image', 'video'], default: 'image' },
    captionEn: { type: String, default: '' },
    captionAr: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const galleryActivitySchema = new Schema<IGalleryActivity>(
  {
    titleEn: { type: String, required: true },
    titleAr: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    descriptionEn: { type: String, default: '' },
    descriptionAr: { type: String, default: '' },
    date: { type: Date, default: Date.now },
    locationEn: { type: String, default: 'MEYLOR School' },
    locationAr: { type: String, default: 'مدرسة ميلور' },
    isInsideSchool: { type: Boolean, default: true },
    coverImageUrl: { type: String, default: '' },
    media: [galleryMediaSchema],
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IGalleryActivity>('GalleryActivity', galleryActivitySchema);
