import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Video } from '@/lib/models/Video';
import VideosAdminClient from './VideosAdminClient';

export const revalidate = 0;

export default async function VideosAdminPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  await connectDB();
  const videos = await Video.find().sort({ order_num: 1 }).lean();

  return <VideosAdminClient initialVideos={JSON.parse(JSON.stringify(videos))} />;
}
