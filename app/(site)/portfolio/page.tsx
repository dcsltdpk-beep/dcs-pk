import React from 'react';
import type { Metadata } from 'next';
import PortfolioPageClient from '@/components/PortfolioPageClient';
import { getPortfolio, getSettings } from '@/lib/data';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title =
    settings.portfolio_meta_title ||
    'Client Projects & Technical Case Studies | Dream Cyber Security Pakistan';
  return {
    title: { absolute: title },
    description:
      settings.portfolio_meta_description ||
      'Enterprise case studies delivered across cybersecurity audits, high-concurrency web portals, 3D motion explainers and autonomous AI agents.',
    keywords:
      settings.portfolio_meta_keywords ||
      'cybersecurity portfolio pakistan, enterprise web projects lahore, threat explainer 3d video, autonomous ai agents karachi',
  };
}

export const revalidate = 60;

export default async function PortfolioPage() {
  const [items, settings] = await Promise.all([
    getPortfolio(),
    getSettings(),
  ]);

  return (
    <PortfolioPageClient
      initialItems={JSON.parse(JSON.stringify(items))}
      whatsappNumber={settings.whatsapp_number || '923165478855'}
    />
  );
}
