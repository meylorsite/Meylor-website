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

  coverImageUrl: string;
  media: IGalleryMedia[];
  isVisible: boolean;
  order: number;
}

const galleryMediaSchema = new Schema<IGalleryMedia>(
  {
    url: { type: String, required: true },
 default: 0 },
  },
  { _id: true }
);

const galleryActivitySchema = new Schema<IGalleryActivity>(
  {
    titleEn: { type: String, required: true },
    titleAr: { type: String, required: true },
    slug:: true },
    coverImageUrl: { type: String, default: '' },
    media: [galleryMediaSchema],
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IGalleryActivity>('GalleryActivity', galleryActivitySchema);
