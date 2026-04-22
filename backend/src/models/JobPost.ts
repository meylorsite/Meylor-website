import mongoose, { Schema, Document } from 'mongoose';

export interface IJobPost extends Document {
  titleEn: string;
  titleAr: string;
  slug: string;
  descriptionEn: string;
  descriptionAr: string;
  requirementsEn: string[];
  requirementsAr: string[];
  departmentEn: string;
  departmentAr: string;
  typeEn: string;
  typeAr: string;
  locationEn: string;
  locationAr: string;
  qualificationsEn: string[];
  qualificationsAr: string[];
  benefitsEn: string[];
  benefitsAr: string[];
  salaryRange: string;
  experienceRequired: string;
  isOpen: boolean;
  order: number;
}

const jobPostSchema = new Schema<IJobPost>(
  {
    titleEn: { type: String, required: true },
    titleAr: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    descriptionEn: { type: String, default: '' },
    descriptionAr: { type: String, default: '' },
    requirementsEn: [{ type: String }],
    requirementsAr: [{ type: String }],
    departmentEn: { type: String, default: '' },
    departmentAr: { type: String, default: '' },
    typeEn: { type: String, default: 'Full-time' },
    typeAr: { type: String, default: 'دوام كامل' },
    locationEn: { type: String, default: 'Jeddah, Saudi Arabia' },
    locationAr: { type: String, default: 'جدة، المملكة العربية السعودية' },
    qualificationsEn: [{ type: String }],
    qualificationsAr: [{ type: String }],
    benefitsEn: [{ type: String }],
    benefitsAr: [{ type: String }],
    salaryRange: { type: String, default: '' },
    experienceRequired: { type: String, default: '' },
    isOpen: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IJobPost>('JobPost', jobPostSchema);
