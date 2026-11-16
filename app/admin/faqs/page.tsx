import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Faq } from '@/lib/models/Faq';
import FaqsAdminClient from './FaqsAdminClient';

export const revalidate = 0;

export default async function FaqsAdminPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  await connectDB();
  const faqs = await Faq.find().sort({ order_num: 1 }).lean();

  return <FaqsAdminClient initialFaqs={JSON.parse(JSON.stringify(faqs))} />;
}
