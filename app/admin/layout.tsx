import React from 'react';
import AdminShell from './AdminShell';

export const metadata = {
  title: 'Control Center | Dream Cyber Security Admin',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
