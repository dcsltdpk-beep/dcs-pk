import React from 'react';
import PortfolioClient from './PortfolioClient';
import { getPortfolio } from '@/lib/data';

export const metadata = {
  title: 'Client Portfolio | Dream Cyber Security Pakistan',
  description: 'Explore our track record of enterprise engineering, cyber defense, video production, and AI automation.',
};

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
