import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLandingPageBySlug } from '@/lib/data';

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const page = await getLandingPageBySlug(params.slug);
  if (!page) return { title: 'Landing Page Not Found' };
  return {
    title: page.meta_title || `${page.title} | Dream Cyber Security`,
    description: page.meta_description || page.subheadline,
  };
}

export default async function DynamicLandingPage({ params }: Props) {
  const page = await getLandingPageBySlug(params.slug);
  if (!page) {
    notFound();
  }

  return (
    <section className="section" style={{ paddingTop: '5rem', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '900px', textAlign: 'center' }}>
        <span className="badge badge-cyan" style={{ marginBottom: '1.25rem' }}>Special Enterprise Program</span>
        <h1 style={{ fontSize: '3rem', marginBottom: '1.25rem', lineHeight: '1.2' }}>{page.headline}</h1>

        {page.subheadline && (
          <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginBottom: '2.5rem', lineHeight: '1.6' }}>
            {page.subheadline}
          </p>
        )}

        <div
          className="card"
          style={{
            textAlign: 'left',
            padding: '2.5rem',
            fontSize: '1.05rem',
            lineHeight: '1.8',
            marginBottom: '3rem',
          }}
          dangerouslySetInnerHTML={{ __html: page.body_content }}
        />

        <div>
          <Link
            href={page.cta_link || '/contact'}
            className="btn btn-primary"
            style={{ padding: '0.9rem 2.5rem', fontSize: '1.1rem' }}
          >
            {page.cta_text || 'Contact Us Today'} &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
