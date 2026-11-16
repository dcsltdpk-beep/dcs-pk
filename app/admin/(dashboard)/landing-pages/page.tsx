import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { LandingPage } from '@/lib/models/LandingPage';
import LandingPagesAdminClient from './LandingPagesAdminClient';

export const revalidate = 0;

export default async function LandingPagesAdminPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  await connectDB();
  const pages = await LandingPage.find().sort({ createdAt: -1 }).lean();

  return <LandingPagesAdminClient initialPages={JSON.parse(JSON.stringify(pages))} />;
}
