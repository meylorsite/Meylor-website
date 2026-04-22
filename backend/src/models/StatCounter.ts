import mongoose, { Schema, Document } from 'mongoose';

export interface IStatCounter extends Document {
  labelEn: string;
  labelAr: string;
  value: number;
  suffix: string;
  iconUrl: string;
  order: number;
  isVisible: boolean;
}

const statCounterSchema = new Schema<IStatCounter>(
  {
    labelEn: { type: String, required: true },
    labelAr: { type: String, required: true },
    value: { type: Number, required: true },
    suffix: { type: String, default: '+' },
    iconUrl: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IStatCounter>('StatCounter', statCounterSchema);
