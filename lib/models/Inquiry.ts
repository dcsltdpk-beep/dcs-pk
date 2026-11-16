import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInquiry extends Document {
  type: 'contact' | 'course_inquiry' | 'quote';
  target_name?: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'unread' | 'read' | 'responded';
  createdAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    type: { type: String, enum: ['contact', 'course_inquiry', 'quote'], default: 'contact' },
    target_name: { type: String, default: '' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    subject: { type: String, default: '' },
    message: { type: String, required: true },
    status: { type: String, enum: ['unread', 'read', 'responded'], default: 'unread' },
  },
  { timestamps: true }
);

export const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema);
