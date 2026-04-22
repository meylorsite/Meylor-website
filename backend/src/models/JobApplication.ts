import mongoose, { Schema, Document } from 'mongoose';

export interface IJobApplication extends Document {
  jobPost: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  yearsOfExperience: number;
  message: string;
  cvLink: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
}

const jobApplicationSchema = new Schema<IJobApplication>(
  {
    jobPost: { type: Schema.Types.ObjectId, ref: 'JobPost', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    yearsOfExperience: { type: Number, default: 0 },
    message: { type: String, default: '' },
    cvLink: { type: String, required: true },
    status: { type: String, enum: ['pending', 'reviewed', 'shortlisted', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.model<IJobApplication>('JobApplication', jobApplicationSchema);
