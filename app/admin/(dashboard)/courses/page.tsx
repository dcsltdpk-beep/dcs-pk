import React from 'react';
import { redirect } from 'next/navigation';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Course } from '@/lib/models/Course';
import { hasModuleAccess } from '@/lib/rbac';
import CoursesClient from './CoursesClient';

export const revalidate = 0;

export default async function CoursesAdminPage() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) redirect('/admin/login');
  if (!hasModuleAccess(admin, 'courses')) {
    redirect('/admin?error=access_denied&module=courses');
  }

  await connectDB();
  const courses = await Course.find().sort({ order_num: 1 }).lean();

  return <CoursesClient initialCourses={JSON.parse(JSON.stringify(courses))} />;
}
