import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Service } from '@/lib/models/Service';
import ServicesClient from './ServicesClient';

export const revalidate = 0;

export default async function ServicesAdminPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  await connectDB();
  const services = await Service.find().sort({ order_num: 1 }).lean();

  return <ServicesClient initialServices={JSON.parse(JSON.stringify(services))} />;
}
