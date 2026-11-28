import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WebsiteScrollAnimations from '@/components/WebsiteScrollAnimations';
import { getCourses, getSettings } from '@/lib/data';

export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [courses, settings] = await Promise.all([
    getCourses(),
    getSettings(),
  ]);

  return (
    <>
      <Header
        courses={courses}
        siteName={settings.site_name}
        whatsappNumber={settings.whatsapp_number}
      />
      <main id="main-content">{children}</main>
      <Footer
        courses={courses}
        whatsappNumber={settings.whatsapp_number}
        whatsappMessage={settings.whatsapp_message}
        companyEmail={settings.company_email}
        companyPhone={settings.company_phone}
        companyAddress={settings.company_address}
      />
      <WebsiteScrollAnimations />
    </>
  );
}
