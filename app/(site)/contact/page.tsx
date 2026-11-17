import React from 'react';
import type { Metadata } from 'next';
import ContactClient from './ContactClient';
import { getSettings } from '@/lib/data';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = settings.contact_meta_title || 'Contact Us & Security Consultation | Dream Cyber Security Pakistan';
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

export default async function ContactPage({
  searchParams,
}: {
  searchParams: { inquiry_type?: string; target?: string };
}) {
  const settings = await getSettings();

  return (
    <ContactClient
      initialType={searchParams?.inquiry_type || 'contact'}
      initialTarget={searchParams?.target || ''}
      companyEmail={settings.company_email || 'dcsltd.pk@gmail.com'}
      companyPhone={settings.company_phone || '+92 300 1234567'}
      companyAddress={settings.company_address || 'Level 4, IT Tower, Hali Road, Gulberg III, Lahore, Pakistan'}
      whatsappNumber={settings.whatsapp_number || '923001234567'}
    />
  );
}
