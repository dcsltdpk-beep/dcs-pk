import React from 'react';
import AdminSidebar from '../AdminSidebar';

export const metadata = {
  title: 'Control Center | Dream Cyber Security Admin',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}
