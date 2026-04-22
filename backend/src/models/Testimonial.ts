import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  nameEn: string;
  nameAr: string;
  roleEn: string;
  roleAr: string;
  contentEn: string;
  contentAr: string;
  avatarUrl: string;
  rating: number;
  order: number;
  isVisible: boolean;
  isApproved: boolean;
  submittedBy?: mongoose.Types.ObjectId;
  submitterEmail?: string;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    nameEn: { type: String, required: true },
    nameAr: { type: String, default: '' },
    roleEn: { type: String, default: '' },
    roleAr: { type: String, default: '' },
    contentEn: { type: String, required: true },
    contentAr: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: false },
    submittedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    submitterEmail: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<ITestimonial>('Testimonial', testimonialSchema);
