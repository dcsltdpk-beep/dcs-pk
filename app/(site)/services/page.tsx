import React from 'react';
import Link from 'next/link';
import Icon from '@/components/Icon';
import { getServices } from '@/lib/data';

export const metadata = {
  title: 'Corporate Services | Dream Cyber Security Pakistan',
  description: 'Explore our 10 international-standard technology & cyber defense services tailored for enterprises in Pakistan.',
};

export const revalidate = 60;

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <section className="section" style={{ paddingTop: '4rem' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">What We Deliver</span>
          <h1 className="section-title">
            Enterprise <span className="text-gradient">Technology Services</span>
          </h1>
          <p className="section-desc">
            Engineered under international cybersecurity standards, zero-trust protocols, and state-of-the-art software methodologies.
          </p>
        </div>

        <div className="grid grid-3">
          {services.map((srv) => (
            <div key={srv.slug} className="card">
              <div style={{ color: 'var(--accent-cyan)', marginBottom: '1rem' }}>
                <Icon name={srv.icon || 'shield'} size={32} />
              </div>
              <h3 style={{ marginBottom: '0.75rem', fontSize: '1.3rem' }}>{srv.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                {srv.summary}
              </p>
              <Link
                href={`/services/${srv.slug}`}
                style={{ fontWeight: 600, fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                Service Details & Technical Scope &rarr;
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div
          className="card"
          style={{
            marginTop: '4rem',
            textAlign: 'center',
            padding: '3rem 2rem',
            background: 'linear-gradient(135deg, rgba(251, 174, 68, 0.08), rgba(62, 56, 135, 0.15))',
          }}
        >
          <h3 style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>Need a Tailored Custom Enterprise Solution?</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto 1.5rem auto' }}>
            We architect bespoke defense frameworks, custom software engines, and integrated AI automation pipelines tailored to unique organizational requirements.
          </p>
          <Link href="/contact?inquiry_type=quote" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
            Request Custom Proposal &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
