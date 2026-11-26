import React from 'react';
import type { Metadata } from 'next';
import ServicesPageClient from '@/components/ServicesPageClient';
import { getSettings } from '@/lib/data';
import { getCanonicalUrl } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title =
    settings.services_meta_title ||
    'Enterprise Technology Services | Dream Cyber Security Pakistan';
  return {
    title: { absolute: title },
    description:
      settings.services_meta_description ||
      'Cybersecurity, bespoke software engineering, AI workflow automations, and enterprise digital solutions engineered to international standards.',
    keywords:
      settings.services_meta_keywords ||
      'cybersecurity services pakistan, software development lahore, SOC monitoring, penetration testing, AI automation',
    alternates: {
      canonical: getCanonicalUrl('/services'),
    },
  };
}

export const revalidate = 60;

export default async function ServicesPage() {
  const settings = await getSettings();

  return (
    <ServicesPageClient
      whatsappNumber={settings.whatsapp_number || '923165478855'}
      whatsappMessage={
        settings.whatsapp_message ||
        'Hello Dream Cyber Security Pakistan, I would like to inquire about your technology services.'
      }
    />
  );
}
