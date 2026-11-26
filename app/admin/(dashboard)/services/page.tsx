import React from 'react';
import { redirect } from 'next/navigation';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Service } from '@/lib/models/Service';
import { hasModuleAccess } from '@/lib/rbac';
import ServicesClient from './ServicesClient';

export const revalidate = 0;

export default async function ServicesAdminPage() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) redirect('/admin/login');
  if (!hasModuleAccess(admin, 'services')) {
    redirect('/admin?error=access_denied&module=services');
  }

  await connectDB();
  const services = await Service.find().sort({ order_num: 1 }).lean();

  return <ServicesClient initialServices={JSON.parse(JSON.stringify(services))} />;
}
