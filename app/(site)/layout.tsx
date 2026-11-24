import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WebsiteScrollAnimations from '@/components/WebsiteScrollAnimations';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <WebsiteScrollAnimations />
    </>
  );
}
