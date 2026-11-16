import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Icon from '@/components/Icon';
import { getServiceBySlug, getServices, getSettings } from '@/lib/data';

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const service = await getServiceBySlug(params.slug);
  if (!service) return { title: 'Service Not Found | Dream Cyber Security' };
  return {
    title: `${service.title} | Dream Cyber Security Pakistan`,
    description: service.summary,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const [service, settings] = await Promise.all([
    getServiceBySlug(params.slug),
    getSettings(),
  ]);

  if (!service) {
    notFound();
  }
  const whatsappNum = settings.whatsapp_number || '923001234567';
  const whatsappMsg = encodeURIComponent(`Hello Dream Cyber Security, I would like to inquire about ${service.title}.`);

  const featuresList = service.features
    ? service.features.split('\n').map((f: string) => f.trim()).filter((f: string) => f.length > 0)
    : [];

  return (
    <section className="section" style={{ paddingTop: '4rem' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/services" style={{ color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.95rem' }}>
            &larr; Back to All Services
          </Link>
        </div>

        <div className="grid grid-2" style={{ alignItems: 'start', gap: '3rem' }}>
          {/* Left Column: Service Details */}
          <div>
            <span className="badge badge-cyan" style={{ marginBottom: '1rem' }}>Corporate Service</span>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>{service.title}</h1>

            <div style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2.5rem', whiteSpace: 'pre-line' }}>
              {service.description}
            </div>

            {featuresList.length > 0 && (
              <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ marginBottom: '1.25rem' }}>Key Service Features & Technical Capabilities</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {featuresList.map((f: string, idx: number) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'var(--text-main)' }}>
                      <span style={{ color: 'var(--accent-cyan)' }}><Icon name="check" size={16} /></span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {service.benefits && (
              <div className="card" style={{ marginBottom: '2.5rem', borderLeft: '3px solid var(--accent-cyan)' }}>
                <h4 style={{ marginBottom: '0.5rem', color: '#fff' }}>Strategic Business Benefits</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                  {service.benefits}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Inquire & Consultation Box */}
          <div>
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Request Service Consultation</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Engage directly with our technical team to schedule an assessment or discuss project scope.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Link
                  href={`/contact?inquiry_type=quote&target=${encodeURIComponent(service.title)}`}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  Request Detailed Proposal
                </Link>

                <a
                  href={`https://wa.me/${whatsappNum}?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                  style={{ width: '100%' }}
                >
                  <Icon name="whatsapp" size={18} /> Inquire via WhatsApp
                </a>
              </div>

              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Standard Delivery Protocol</h4>
                <ul style={{ listStyle: 'none', color: 'var(--text-muted)', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li>✓ Non-Disclosure Agreement (NDA) Protected</li>
                  <li>✓ Dedicated Solutions Architect Assignment</li>
                  <li>✓ Milestone-based Execution & Reporting</li>
                  <li>✓ Zero Recurring Hidden Royalties</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
