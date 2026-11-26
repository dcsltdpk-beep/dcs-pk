import React from 'react';
import { redirect } from 'next/navigation';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Video } from '@/lib/models/Video';
import { hasModuleAccess } from '@/lib/rbac';
import VideosAdminClient from './VideosAdminClient';

export const revalidate = 0;

export default async function VideosAdminPage() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) redirect('/admin/login');
  if (!hasModuleAccess(admin, 'videos')) {
    redirect('/admin?error=access_denied&module=videos');
  }

  await connectDB();
  const videos = await Video.find().sort({ order_num: 1 }).lean();

  return <VideosAdminClient initialVideos={JSON.parse(JSON.stringify(videos))} />;
}
