import React from 'react';
import type { Metadata } from 'next';
import { getTeam, getSettings } from '@/lib/data';
import TeamPageClient from '@/components/TeamPageClient';
import { getCanonicalUrl } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = settings.team_meta_title || 'Leadership & Specialist Team | Dream Cyber Security Pakistan';
  return {
    title: { absolute: title },
    description:
      settings.team_meta_description ||
      'Meet the cybersecurity architects, software engineers, AI automation practitioners, and creatives behind Dream Cyber Security Pakistan.',
    keywords:
      settings.team_meta_keywords ||
      'cybersecurity team pakistan, ethical hackers lahore, full stack developers, AI automation experts',
    alternates: {
      canonical: getCanonicalUrl('/team'),
    },
  };
}

export const revalidate = 60;

export default async function TeamPage() {
  const [team, settings] = await Promise.all([
    getTeam(),
    getSettings(),
  ]);

  return (
    <TeamPageClient
      initialTeam={team}
      whatsappNumber={settings.whatsapp_number}
    />
  );
}
