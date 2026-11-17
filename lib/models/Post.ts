import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPost extends Document {
  title: string;
  slug: string;
  category: string;
  tags?: string;
  featured_image?: string;
  excerpt: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
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
    meta_title: { type: String, default: '' },
    meta_description: { type: String, default: '' },
    meta_keywords: { type: String, default: '' },
    is_published: { type: Boolean, default: true },
    published_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
