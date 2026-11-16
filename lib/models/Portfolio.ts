import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPortfolio extends Document {
  title: string;
  category: 'Video Editing' | 'Graphic Design' | 'Web Development' | 'AI Automation';
  client_name?: string;
  client_logo?: string;
  cover_image?: string;
  video_url?: string;
  description: string;
  order_num: number;
  createdAt: Date;
}

const PortfolioSchema = new Schema<IPortfolio>(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Video Editing', 'Graphic Design', 'Web Development', 'AI Automation'],
    },
    client_name: { type: String, default: '' },
    client_logo: { type: String, default: '' },
    cover_image: { type: String, default: '' },
    video_url: { type: String, default: '' },
    description: { type: String, required: true },
    order_num: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Portfolio: Model<IPortfolio> =
  mongoose.models.Portfolio || mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);
