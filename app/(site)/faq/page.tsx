import React from 'react';
import type { Metadata } from 'next';
import { getFaqs, getSettings } from '@/lib/data';
import FaqPageClient from '@/components/FaqPageClient';
import { getCanonicalUrl } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = settings.faq_meta_title || 'Knowledgebase & FAQ | Dream Cyber Security Pakistan';
  return {
    title: { absolute: title },
    description:
      settings.faq_meta_description ||
      'Quick answers about our cybersecurity consulting services, enterprise software engineering, and the DCS Skill Academy.',
    keywords:
      settings.faq_meta_keywords ||
      'cybersecurity faq pakistan, penetration testing questions, enterprise IT pricing faq, dcs academy inquiries',
    alternates: {
      canonical: getCanonicalUrl('/faq'),
    },
  };
}

export const revalidate = 60;

export default async function FaqPage() {
  const [faqs, settings] = await Promise.all([
    getFaqs(),
    getSettings(),
  ]);

  return (
    <FaqPageClient
      initialFaqs={faqs}
      whatsappNumber={settings.whatsapp_number}
    />
  );
}
