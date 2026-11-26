import React from 'react';
import { redirect } from 'next/navigation';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { getSettingsMap } from '@/lib/models/Setting';
import { hasModuleAccess } from '@/lib/rbac';
import SettingsClient from './SettingsClient';

export const revalidate = 0;

export default async function SettingsAdminPage() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) redirect('/admin/login');
  if (!hasModuleAccess(admin, 'settings')) {
    redirect('/admin?error=access_denied&module=settings');
  }

  await connectDB();
  const settings = await getSettingsMap();

  return <SettingsClient initialSettings={settings} />;
}
