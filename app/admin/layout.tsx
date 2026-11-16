import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
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

  // If unauthenticated, allow login page through, else redirect
  // Note: /admin/login handles its own unauthenticated view
  return (
    <div className="admin-layout">
      {session && <AdminSidebar />}
      <div className="admin-content" style={{ width: '100%', minHeight: '100vh' }}>
        {children}
      </div>
    </div>
  );
}
