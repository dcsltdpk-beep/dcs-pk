import React from 'react';
import { redirect } from 'next/navigation';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Inquiry } from '@/lib/models/Inquiry';
import { hasModuleAccess } from '@/lib/rbac';
import InquiriesClient from './InquiriesClient';

export const revalidate = 0;

export default async function InquiriesAdminPage() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) redirect('/admin/login');
  if (!hasModuleAccess(admin, 'inquiries')) {
    redirect('/admin?error=access_denied&module=inquiries');
  }

  await connectDB();
  const inquiries = await Inquiry.find().sort({ createdAt: -1 }).lean();

  return <InquiriesClient initialInquiries={JSON.parse(JSON.stringify(inquiries))} />;
}
