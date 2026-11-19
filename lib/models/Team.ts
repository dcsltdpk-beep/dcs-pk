import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  slug: string;
  designation: string;
  bio: string;
  photo?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  email?: string;
  order_num: number;
  createdAt: Date;
}

const TeamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true },
    slug: { type: String, default: '' },
    designation: { type: String, required: true },
    bio: { type: String, required: true },
    photo: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    github: { type: String, default: '' },
    email: { type: String, default: '' },
    order_num: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Team: Model<ITeam> =
  mongoose.models.Team || mongoose.model<ITeam>('Team', TeamSchema);
