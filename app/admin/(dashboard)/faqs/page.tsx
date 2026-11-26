import React from 'react';
import { redirect } from 'next/navigation';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Faq } from '@/lib/models/Faq';
import { hasModuleAccess } from '@/lib/rbac';
import FaqsAdminClient from './FaqsAdminClient';

export const revalidate = 0;

export default async function FaqsAdminPage() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) redirect('/admin/login');
  if (!hasModuleAccess(admin, 'faqs')) {
    redirect('/admin?error=access_denied&module=faqs');
  }

  await connectDB();
  const faqs = await Faq.find().sort({ order_num: 1 }).lean();

  return <FaqsAdminClient initialFaqs={JSON.parse(JSON.stringify(faqs))} />;
}
