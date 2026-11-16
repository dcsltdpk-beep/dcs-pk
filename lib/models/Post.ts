import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPost extends Document {
  title: string;
  slug: string;
  category: string;
  tags?: string;
  featured_image?: string;
  excerpt: string;
  content: string;
  is_published: boolean;
  published_at: Date;
  createdAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, default: 'Updates' },
    tags: { type: String, default: '' },
    featured_image: { type: String, default: '' },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    is_published: { type: Boolean, default: true },
    published_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
