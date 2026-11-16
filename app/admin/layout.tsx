import React from 'react';
import { cookies } from 'next/headers';
import { verifyAdminToken } from '@/lib/auth';
import AdminSidebar from './AdminSidebar';

export const metadata = {
  title: 'Control Center | Dream Cyber Security Admin',
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_token')?.value;

  // Verify auth session
  let session = null;
  if (token) {
    session = await verifyAdminToken(token);
  }

  // If unauthenticated (e.g. /admin/login), render in clean centered full-width layout
  if (!session) {
    return <main className="admin-login-layout">{children}</main>;
  }

  // If authenticated, render full responsive dashboard shell
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}
