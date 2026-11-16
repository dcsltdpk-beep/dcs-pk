import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVideo extends Document {
  title: string;
  category:
    | 'Company Videos'
    | 'Course Introduction Videos'
    | 'Student Projects and Work'
    | 'Tutorials and Educational Videos';
  video_type: 'embed' | 'upload';
  video_source: string;
  description?: string;
  order_num: number;
  createdAt: Date;
}

const VideoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        'Company Videos',
        'Course Introduction Videos',
        'Student Projects and Work',
        'Tutorials and Educational Videos',
      ],
    },
    video_type: { type: String, enum: ['embed', 'upload'], default: 'embed' },
    video_source: { type: String, required: true },
    description: { type: String, default: '' },
    order_num: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Video: Model<IVideo> =
  mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);
