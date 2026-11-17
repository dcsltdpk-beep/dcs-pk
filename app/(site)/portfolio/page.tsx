import React from 'react';
import type { Metadata } from 'next';
import PortfolioClient from './PortfolioClient';
import { getPortfolio, getSettings } from '@/lib/data';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = settings.portfolio_meta_title || 'Client Projects & Technical Case Studies | Dream Cyber Security Pakistan';
  return {
    title: { absolute: title },
    description:
      settings.portfolio_meta_description ||
      'Proven engineering delivery across defense cybersecurity audits, custom enterprise web architectures, and automation pipelines in Pakistan.',
    keywords:
      settings.portfolio_meta_keywords ||
      'cybersecurity case studies, enterprise software portfolio, web development projects lahore',
  };
}

export const revalidate = 60;

export default async function PortfolioPage() {
  const items = await getPortfolio();

  return (
    <section className="section" style={{ paddingTop: '4rem' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Delivered Work</span>
          <h1 className="section-title">
            Enterprise <span className="text-gradient">Portfolio & Case Studies</span>
          </h1>
          <p className="section-desc">
            A selection of projects delivered across cybersecurity architecture, custom web platforms, motion graphics, and autonomous AI pipelines.
          </p>
        </div>

        <PortfolioClient items={JSON.parse(JSON.stringify(items))} />
      </div>
    </section>
  );
}
