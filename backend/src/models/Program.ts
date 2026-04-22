import mongoose, { Schema, Document } from 'mongoose';

export interface IProgram extends Document {
  titleEn: string;
  titleAr: string;
  slug: string;
  descriptionEn: string;
  descriptionAr: string;
  highlightsEn: string[];
  highlightsAr: string[];
  imageUrl: string;
  iconUrl: string;
  gradeRange: string;
  curriculumEn: string;
  curriculumAr: string;
  ageRange: string;
  classSize: string;
  scheduleEn: string;
  scheduleAr: string;
  extracurricularsEn: string[];
  extracurricularsAr: string[];
  order: number;
  isVisible: boolean;
}

const programSchema = new Schema<IProgram>(
  {
    titleEn: { type: String, required: true },
    titleAr: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    descriptionEn: { type: String, default: '' },
    descriptionAr: { type: String, default: '' },
    highlightsEn: [{ type: String }],
    highlightsAr: [{ type: String }],
    imageUrl: { type: String, default: '' },
    iconUrl: { type: String, default: '' },
    gradeRange: { type: String, default: '' },
    curriculumEn: { type: String, default: '' },
    curriculumAr: { type: String, default: '' },
    ageRange: { type: String, default: '' },
    classSize: { type: String, default: '' },
    scheduleEn: { type: String, default: '' },
    scheduleAr: { type: String, default: '' },
    extracurricularsEn: [{ type: String }],
    extracurricularsAr: [{ type: String }],
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IProgram>('Program', programSchema);
