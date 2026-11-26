import React from 'react';
import { redirect } from 'next/navigation';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { isSuperAdmin } from '@/lib/rbac';
import SubAdminsClient, { SubAdminUser } from './SubAdminsClient';

export const revalidate = 0;

export const metadata = {
  title: 'Sub-Admin & RBAC Management | DCS Control Center',
};

export default async function SubAdminsPage() {
  const admin = await getAuthenticatedAdmin();

  if (!admin) {
    redirect('/admin/login');
  }

  if (!admin.isSuperAdmin) {
    redirect('/admin?error=superadmin_required');
  }

  await connectDB();
  const rawUsers = await User.find().select('-password').sort({ createdAt: -1 }).lean();

  const users: SubAdminUser[] = rawUsers.map((u: any) => ({
    _id: u._id.toString(),
    name: u.name || '',
    username: u.username,
    email: u.email,
    role: u.role || 'sub_admin',
    status: u.status || 'active',
    permissions: (u.permissions || []).map((p: any) => ({
      module: p.module,
      actions: Array.isArray(p.actions) ? p.actions : [],
    })),
    lastLogin: u.lastLogin ? new Date(u.lastLogin).toISOString() : null,
    createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : null,
    isSuperAdmin: isSuperAdmin(u.role),
  }));

  return <SubAdminsClient initialUsers={users} currentAdminId={admin.id} />;
}
