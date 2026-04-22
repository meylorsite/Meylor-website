import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmissionApplication extends Document {
  // Package info
  packageId?: mongoose.Types.ObjectId;
  packageName: string;
  // Parent info
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  relationship: string; // father, mother, guardian
  nationality: string;
  nationalId: string;
  // Student info
  studentNameEn: string;
  studentNameAr: string;
  dateOfBirth: Date;
  gender: string;
  currentGrade: string;
  previousSchool: string;
  medicalConditions?: string;
  // Meta
  locale: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  adminNotes?: string;
  submittedBy?: mongoose.Types.ObjectId; // ref to User if parent is logged in
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IAdmissionApplication>(
  {
    packageId: { type: Schema.Types.ObjectId, ref: 'PricingPackage' },
    packageName: { type: String, default: '' },
    parentName: { type: String, required: true },
    parentEmail: { type: String, required: true },
    parentPhone: { type: String, required: true },
    relationship: { type: String, default: '' },
    nationality: { type: String, default: '' },
    nationalId: { type: String, default: '' },
    studentNameEn: { type: String, default: '' },
    studentNameAr: { type: String, default: '' },
    dateOfBirth: { type: Date },
    gender: { type: String, default: '' },
    currentGrade: { type: String, default: '' },
    previousSchool: { type: String, default: '' },
    medicalConditions: { type: String, default: '' },
    locale: { type: String, default: 'en' },
    status: { type: String, enum: ['pending', 'reviewed', 'accepted', 'rejected'], default: 'pending' },
    adminNotes: { type: String, default: '' },
    submittedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model<IAdmissionApplication>('AdmissionApplication', schema);
