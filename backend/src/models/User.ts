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

  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});


};

export default mongoose.model<IUser>('User', userSchema);
