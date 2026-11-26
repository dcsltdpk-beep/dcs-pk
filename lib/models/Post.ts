import mongoose, { Schema, Document, Model } from 'mongoose';

export type PostStatus = 'published' | 'draft' | 'scheduled';

export interface IPost extends Document {
  title: string;
  slug: string;
  category: string;
  tags?: string;
  featured_image?: string;
  excerpt: string;
  content: string;
  author_name?: string;
  author_role?: string;
  author_avatar?: string;
  read_time?: string;
  is_featured?: boolean;
  status: PostStatus;
  is_published: boolean;
  published_at: Date;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  focus_keyword?: string;
  secondary_keywords?: string;
  canonical_url?: string;
  og_image?: string;
  views?: number;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    category: { type: String, default: 'Cybersecurity Tips', trim: true },
    tags: { type: String, default: '', trim: true },
    featured_image: { type: String, default: '' },
    excerpt: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author_name: { type: String, default: 'DCS Cyber Threat Research Team', trim: true },
    author_role: { type: String, default: 'Principal Threat Intelligence Architect', trim: true },
    author_avatar: { type: String, default: '/logo.png' },
    read_time: { type: String, default: '5 min read', trim: true },
    is_featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['published', 'draft', 'scheduled'],
      default: 'published',
    },
    is_published: { type: Boolean, default: true },
    published_at: { type: Date, default: Date.now },
    meta_title: { type: String, default: '', trim: true },
    meta_description: { type: String, default: '', trim: true },
    meta_keywords: { type: String, default: '', trim: true },
    focus_keyword: { type: String, default: '', trim: true },
    secondary_keywords: { type: String, default: '', trim: true },
    canonical_url: { type: String, default: '', trim: true },
    og_image: { type: String, default: '' },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Optimize query indexes
PostSchema.index({ status: 1, published_at: -1 });
PostSchema.index({ is_published: 1, published_at: -1 });
PostSchema.index({ is_featured: 1, published_at: -1 });
PostSchema.index({ category: 1 });

export const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
