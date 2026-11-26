import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Control Center | Dream Cyber Security Admin',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
