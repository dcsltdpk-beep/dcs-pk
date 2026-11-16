import React from 'react';

export const metadata = {
  title: 'Sign In | Dream Cyber Security Control Center',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <main className="admin-login-layout">{children}</main>;
}
