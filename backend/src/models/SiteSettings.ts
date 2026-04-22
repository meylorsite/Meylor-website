import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteSettings extends Document {
  logoUrl: string;
  faviconUrl: string;
  schoolNameEn: string;
  schoolNameAr: string;
  taglineEn: string;
  taglineAr: string;
  phone: string;
  email: string;
  addressEn: string;
  addressAr: string;
  mapUrl: string;
  socialLinks: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
    linkedin?: string;
    snapchat?: string;
    tiktok?: string;
  };
  seoTitleEn: string;
  seoTitleAr: string;
  seoDescriptionEn: string;
  seoDescriptionAr: string;
  seoKeywordsEn: string;
  seoKeywordsAr: string;
  ogImageUrl: string;
}

const siteSettingsSchema = new Schema<ISiteSettings>(
  {
    logoUrl: { type: String, default: '' },
    faviconUrl: { type: String, default: '' },
    schoolNameEn: { type: String, default: 'MEYLOR School' },
    schoolNameAr: { type: String, default: 'مدرسة ميلور' },
    taglineEn: { type: String, default: 'Excellence in Education' },
    taglineAr: { type: String, default: 'التميّز في التعليم' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    addressEn: { type: String, default: 'Al-Naeem District, Jeddah, Saudi Arabia' },
    addressAr: { type: String, default: 'حي النعيم، جدة، المملكة العربية السعودية' },
    mapUrl: { type: String, default: '' },
    socialLinks: {
      twitter: { type: String, default: '' },
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
      youtube: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      snapchat: { type: String, default: '' },
      tiktok: { type: String, default: '' },
    },
    seoTitleEn: { type: String, default: 'MEYLOR School | Premium Education in Jeddah' },
    seoTitleAr: { type: String, default: 'مدرسة ميلور | تعليم متميّز في جدة' },
    seoDescriptionEn: { type: String, default: '' },
    seoDescriptionAr: { type: String, default: '' },
    seoKeywordsEn: { type: String, default: '' },
    seoKeywordsAr: { type: String, default: '' },
    ogImageUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<ISiteSettings>('SiteSettings', siteSettingsSchema);
