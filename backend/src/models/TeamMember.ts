import mongoose, { Schema, Document } from 'mongoose';

export interface ITeamMember extends Document {
  nameEn: string;
  nameAr: string;
  roleEn: string;
  roleAr: string;
  bioEn?: string;
  bioAr?: string;
  imageUrl?: string;
  email?: string;
  phone?: string;
  category: 'board' | 'leadership' | 'staff';
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const teamMemberSchema = new Schema<ITeamMember>(
  {
    nameEn: { type: String, required: true },
    nameAr: { type: String, required: true },
    roleEn: { type: String, required: true },
    roleAr: { type: String, required: true },
    bioEn: { type: String, default: '' },
    bioAr: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    category: { type: String, enum: ['board', 'leadership', 'staff'], required: true },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<ITeamMember>('TeamMember', teamMemberSchema);
