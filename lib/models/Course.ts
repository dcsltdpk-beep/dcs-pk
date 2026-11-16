import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  slug: string;
  duration: string;
  target_audience: string;
  overview: string;
  syllabus: string;
  what_you_will_learn: string;
  instructor_name: string;
  instructor_designation: string;
  instructor_bio?: string;
  instructor_photo?: string;
  intro_video_url?: string;
  order_num: number;
  status: 'active' | 'inactive';
  createdAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    duration: { type: String, required: true },
    target_audience: { type: String, required: true },
    overview: { type: String, required: true },
    syllabus: { type: String, required: true },
    what_you_will_learn: { type: String, required: true },
    instructor_name: { type: String, required: true },
    instructor_designation: { type: String, required: true },
    instructor_bio: { type: String, default: '' },
    instructor_photo: { type: String, default: '' },
    intro_video_url: { type: String, default: '' },
    order_num: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export const Course: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
