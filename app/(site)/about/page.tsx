import React from 'react';
import type { Metadata } from 'next';
import AboutPageClient from '@/components/AboutPageClient';
import { getSettings } from '@/lib/data';
import { getCanonicalUrl } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteName = settings.site_name || 'Dream Cyber Security Pakistan';
  const title = settings.about_meta_title || `About Us | ${siteName}`;
  return {
    title: { absolute: title },
    description:
      settings.about_meta_description ||
      'Founded to deliver international-standard cyber defense, zero-trust architectures and software engineering to enterprises across Pakistan and the region.',
    keywords:
      settings.about_meta_keywords ||
      'about dream cyber security, cybersecurity company lahore, enterprise defense leadership pakistan, zero trust architecture',
    alternates: {
      canonical: getCanonicalUrl('/about'),
    },
  };
}

export const revalidate = 60;

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <AboutPageClient
      whatsappNumber={settings.whatsapp_number || '923165478855'}
      whatsappMessage={
        settings.whatsapp_message ||
        'Hello Dream Cyber Security Pakistan, I would like to learn more about your firm and services.'
      }
      companyIntroVideo={settings.company_intro_video || 'https://www.youtube.com/embed/inWWhr5tnEA'}
    />
  );
}
