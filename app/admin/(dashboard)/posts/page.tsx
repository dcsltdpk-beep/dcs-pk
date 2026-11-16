import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Post } from '@/lib/models/Post';
import PostsAdminClient from './PostsAdminClient';

export const revalidate = 0;

export default async function PostsAdminPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  await connectDB();
  const posts = await Post.find().sort({ published_at: -1 }).lean();

  return <PostsAdminClient initialPosts={JSON.parse(JSON.stringify(posts))} />;
}
