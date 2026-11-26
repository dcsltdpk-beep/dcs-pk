import React from 'react';
import { redirect } from 'next/navigation';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Post } from '@/lib/models/Post';
import { hasModuleAccess } from '@/lib/rbac';
import PostsAdminClient from './PostsAdminClient';

export const revalidate = 0;

export default async function PostsAdminPage() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) redirect('/admin/login');
  if (!hasModuleAccess(admin, 'posts')) {
    redirect('/admin?error=access_denied&module=posts');
  }

  await connectDB();
  const posts = await Post.find().sort({ published_at: -1 }).lean();

  return <PostsAdminClient initialPosts={JSON.parse(JSON.stringify(posts))} />;
}
