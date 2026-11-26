import React from 'react';
import { redirect } from 'next/navigation';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { LandingPage } from '@/lib/models/LandingPage';
import { hasModuleAccess } from '@/lib/rbac';
import LandingPagesAdminClient from './LandingPagesAdminClient';

export const revalidate = 0;

export default async function LandingPagesAdminPage() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) redirect('/admin/login');
  if (!hasModuleAccess(admin, 'landing-pages')) {
    redirect('/admin?error=access_denied&module=landing-pages');
  }

  await connectDB();
  const pages = await LandingPage.find().sort({ createdAt: -1 }).lean();

  return <LandingPagesAdminClient initialPages={JSON.parse(JSON.stringify(pages))} />;
}
