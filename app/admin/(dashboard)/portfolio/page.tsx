import React from 'react';
import { redirect } from 'next/navigation';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Portfolio } from '@/lib/models/Portfolio';
import { hasModuleAccess } from '@/lib/rbac';
import PortfolioAdminClient from './PortfolioAdminClient';

export const revalidate = 0;

export default async function PortfolioAdminPage() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) redirect('/admin/login');
  if (!hasModuleAccess(admin, 'portfolio')) {
    redirect('/admin?error=access_denied&module=portfolio');
  }

  await connectDB();
  const items = await Portfolio.find().sort({ order_num: 1 }).lean();

  return <PortfolioAdminClient initialItems={JSON.parse(JSON.stringify(items))} />;
}
