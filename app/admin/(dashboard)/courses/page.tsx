import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Course } from '@/lib/models/Course';
import CoursesClient from './CoursesClient';

export const revalidate = 0;

export default async function CoursesAdminPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  await connectDB();
  const courses = await Course.find().sort({ order_num: 1 }).lean();

  return <CoursesClient initialCourses={JSON.parse(JSON.stringify(courses))} />;
}
