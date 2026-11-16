import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Inquiry } from '@/lib/models/Inquiry';
import InquiriesClient from './InquiriesClient';

export const revalidate = 0;

export default async function InquiriesAdminPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  await connectDB();
  const inquiries = await Inquiry.find().sort({ createdAt: -1 }).lean();

  return <InquiriesClient initialInquiries={JSON.parse(JSON.stringify(inquiries))} />;
}
