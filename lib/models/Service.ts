import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IService extends Document {
  title: string;
  slug: string;
  icon: string;
  summary: string;
  description: string;
  features?: string;
  benefits?: string;
  order_num: number;
  status: 'active' | 'inactive';
  createdAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    icon: { type: String, default: 'shield' },
    summary: { type: String, required: true },
    description: { type: String, required: true },
    features: { type: String, default: '' },
    benefits: { type: String, default: '' },
    order_num: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
