import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { getSettingsMap } from '@/lib/models/Setting';
import HomeContentClient from './HomeContentClient';

export const revalidate = 0;

export default async function HomeContentAdminPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  await connectDB();
  const settings = await getSettingsMap();

  return <HomeContentClient initialSettings={settings} />;
}
