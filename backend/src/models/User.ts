import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IChild {
  nameEn: string;
  nameAr: string;
  dateOfBirth: Date;
  gender: string;
  grade: string;
  medicalConditions: string;
}

export interface IUser extends Document {
  email: string;
  password: string;
  nameEn: string;
  nameAr: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'PARENT' | 'STUDENT';
  refreshTokens: string[];
  isActive: boolean;
  phone: string;
  nationality: string;
  nationalId: string;
  avatarUrl: string;
  children: IChild[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    nameEn: { type: String, required: true },
    nameAr: { type: String, required: true },
    role: { type: String, enum: ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'PARENT', 'STUDENT'], default: 'ADMIN' },
    refreshTokens: [{ type: String }],
    isActive: { type: Boolean, default: true },
    phone: { type: String, default: '' },
    nationality: { type: String, default: '' },
    nationalId: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    children: [{
      nameEn: { type: String, default: '' },
      nameAr: { type: String, default: '' },
      dateOfBirth: { type: Date },
      gender: { type: String, default: '' },
      grade: { type: String, default: '' },
      medicalConditions: { type: String, default: '' },
    }],
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshTokens;
  return obj;
};

export default mongoose.model<IUser>('User', userSchema);
