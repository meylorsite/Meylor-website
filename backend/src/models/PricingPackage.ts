import mongoose, { Schema, Document } from 'mongoose';

export interface IPricingPackage extends Document {
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  price: string;
  currency: string;
  period: string;
  featuresEn: string[];
  featuresAr: string[];
  highlightedFeatures: number[];
  includesEn: string[];
  includesAr: string[];
  notIncludedEn: string[];
  notIncludedAr: string[];
  registrationFee: string;
  installmentPlan: string;
  isPopular: boolean;
  order: number;
  isVisible: boolean;
}

const pricingPackageSchema = new Schema<IPricingPackage>(
  {
    titleEn: { type: String, required: true },
    titleAr: { type: String, required: true },
    descriptionEn: { type: String, default: '' },
    descriptionAr: { type: String, default: '' },
    price: { type: String, required: true },
    currency: { type: String, default: 'SAR' },
    period: { type: String, default: 'year' },
    featuresEn: [{ type: String }],
    featuresAr: [{ type: String }],
    highlightedFeatures: [{ type: Number }],
    includesEn: [{ type: String }],
    includesAr: [{ type: String }],
    notIncludedEn: [{ type: String }],
    notIncludedAr: [{ type: String }],
    registrationFee: { type: String, default: '' },
    installmentPlan: { type: String, default: '' },
    isPopular: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IPricingPackage>('PricingPackage', pricingPackageSchema);
