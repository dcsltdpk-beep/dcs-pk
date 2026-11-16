import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILandingPage extends Document {
  slug: string;
  title: string;
  meta_title?: string;
  meta_description?: string;
  headline: string;
  subheadline?: string;
  body_content: string;
  cta_text: string;
  cta_link: string;
  is_active: boolean;
  createdAt: Date;
}

const LandingPageSchema = new Schema<ILandingPage>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    meta_title: { type: String, default: '' },
    meta_description: { type: String, default: '' },
    headline: { type: String, required: true },
    subheadline: { type: String, default: '' },
    body_content: { type: String, required: true },
    cta_text: { type: String, default: 'Contact Us' },
    cta_link: { type: String, default: '/contact' },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const LandingPage: Model<ILandingPage> =
  mongoose.models.LandingPage ||
  mongoose.model<ILandingPage>('LandingPage', LandingPageSchema);
