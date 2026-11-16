import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Portfolio } from '@/lib/models/Portfolio';
import PortfolioAdminClient from './PortfolioAdminClient';

export const revalidate = 0;

export default async function PortfolioAdminPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  await connectDB();
  const items = await Portfolio.find().sort({ order_num: 1 }).lean();

  return <PortfolioAdminClient initialItems={JSON.parse(JSON.stringify(items))} />;
}
