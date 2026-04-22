import mongoose, { Schema, Document } from 'mongoose';

export interface IFacility extends Document {
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  imageUrl: string;
  iconUrl: string;
  order: number;
  isVisible: boolean;
}

const facilitySchema = new Schema<IFacility>(
  {
    titleEn: { type: String, required: true },
    titleAr: { type: String, required: true },
    descriptionEn: { type: String, default: '' },
    descriptionAr: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    iconUrl: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IFacility>('Facility', facilitySchema);
