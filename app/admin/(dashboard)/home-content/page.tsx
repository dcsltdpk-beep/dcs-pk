import React from 'react';
import { redirect } from 'next/navigation';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { getSettingsMap } from '@/lib/models/Setting';
import { hasModuleAccess } from '@/lib/rbac';
import HomeContentClient from './HomeContentClient';

export const revalidate = 0;

export default async function HomeContentAdminPage() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) redirect('/admin/login');
  if (!hasModuleAccess(admin, 'home-content')) {
    redirect('/admin?error=access_denied&module=home-content');
  }

  await connectDB();
  const settings = await getSettingsMap();

  return <HomeContentClient initialSettings={settings} />;
}
