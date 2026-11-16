import React from 'react';
import Link from 'next/link';
import { getFaqs } from '@/lib/data';

export const metadata = {
  title: 'Frequently Asked Questions (FAQ) | Dream Cyber Security Pakistan',
  description: 'Find answers regarding our cybersecurity services, academy training inquiries, response SLAs, and corporate partnerships.',
};

export const revalidate = 60;

export default async function FaqPage() {
  const faqs = await getFaqs();

  const categories = ['General', 'Services', 'Academy'];

  return (
    <section className="section" style={{ paddingTop: '4rem' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div className="section-header">
          <span className="section-subtitle">Common Questions</span>
          <h1 className="section-title">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h1>
          <p className="section-desc">
            Everything you need to know about our corporate consulting services, academy policies, and technical delivery protocols.
          </p>
        </div>

        {categories.map((cat) => {
          const catFaqs = faqs.filter((f) => f.category === cat);
          if (catFaqs.length === 0) return null;

          return (
            <div key={cat} style={{ marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.25rem', color: 'var(--accent-cyan)' }}>
                {cat} Inquiries
              </h3>

              {catFaqs.map((faq) => (
                <details key={faq._id} className="faq-item">
                  <summary>{faq.question}</summary>
                  <div className="faq-answer">{faq.answer}</div>
                </details>
              ))}
            </div>
          );
        })}

        {/* Still have questions */}
        <div
          className="card"
          style={{
            marginTop: '4rem',
            textAlign: 'center',
            padding: '2.5rem',
            background: 'var(--bg-secondary)',
          }}
        >
          <h3 style={{ marginBottom: '0.5rem' }}>Have a Different Question?</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Our security and academy advisors are available 24/7 to provide prompt, confidential guidance.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-primary">
              Contact Support Desk
            </Link>
            <a
              href="https://wa.me/923001234567?text=Hello%20Dream%20Cyber%20Security%20Pakistan"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
