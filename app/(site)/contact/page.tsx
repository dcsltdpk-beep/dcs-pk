import React from 'react';
import type { Metadata } from 'next';
import ContactPageClient from '@/components/ContactPageClient';
import { getSettings } from '@/lib/data';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title =
    settings.contact_meta_title ||
    'Contact Us & Security Consultation | Dream Cyber Security Pakistan';
  return {
    title: { absolute: title },
    description:
      settings.contact_meta_description ||
      'Speak directly with our security architects. Request a confidential vulnerability assessment, enterprise software proposal, or academy consultation.',
    keywords:
      settings.contact_meta_keywords ||
      'contact dream cyber security, hire penetration testers pakistan, cybersecurity consultation lahore',
  };
}

export const revalidate = 60;

export default async function ContactPage({
  searchParams,
}: {
  searchParams?: {
    inquiry_type?: string;
    type?: string;
    target?: string;
    course?: string;
    service?: string;
  };
}) {
  const settings = await getSettings();

  const initialType = searchParams?.type || searchParams?.inquiry_type || 'General Consultation';
  const initialTarget = searchParams?.target || searchParams?.course || searchParams?.service || '';

  return (
    <ContactPageClient
      initialType={initialType}
      initialTarget={initialTarget}
      companyEmail={settings.company_email || 'dcsltd.pk@gmail.com'}
      companyPhone={settings.company_phone || '+92 316 5478855'}
      companyAddress={
        settings.company_address ||
        'Central Tower I, 90-B Hali Road, Block B, Gulberg II, Lahore-54660, Pakistan'
      }
      whatsappNumber={settings.whatsapp_number || '923165478855'}
    />
  );
}
