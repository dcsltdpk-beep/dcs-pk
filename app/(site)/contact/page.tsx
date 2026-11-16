import React from 'react';
import ContactClient from './ContactClient';
import { getSettings } from '@/lib/data';

export const metadata = {
  title: 'Contact Us & Business Inquiries | Dream Cyber Security Pakistan',
  description: 'Get in touch with Dream Cyber Security Pakistan. Reach out via email, phone, consultation form, or direct WhatsApp.',
};

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
      companyEmail={settings.company_email || 'info@dreamcyber.pk'}
      companyPhone={settings.company_phone || '+92 300 1234567'}
      companyAddress={settings.company_address || 'Level 4, IT Tower, Hali Road, Gulberg III, Lahore, Pakistan'}
      whatsappNumber={settings.whatsapp_number || '923001234567'}
    />
  );
}
