import React from 'react';
import { redirect } from 'next/navigation';
import { getAuthenticatedAdmin } from '@/lib/auth';
import AdminSidebar from '../AdminSidebar';
import { AdminProvider } from '../AdminContext';

export const metadata = {
  title: 'Control Center | Dream Cyber Security Admin',
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAuthenticatedAdmin();

  if (!admin) {
    redirect('/admin/login');
  }

  return (
    <AdminProvider admin={admin}>
      <div className="admin-layout">
        <AdminSidebar admin={admin} />
        <main className="admin-content">
          {children}
        </main>
      </div>
    </AdminProvider>
  );
}
