import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import Icon from '@/components/Icon';
import { getSettings } from '@/lib/data';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteName = settings.site_name || 'Dream Cyber Security Pakistan';
  const title = settings.about_meta_title || `About Us | ${siteName}`;
  return {
    title: { absolute: title },
    description:
      settings.about_meta_description ||
      'Learn about our corporate story, cyber defense mission, executive vision, and international engineering standards.',
    keywords:
      settings.about_meta_keywords ||
      'about dream cyber security, cybersecurity company lahore, enterprise defense leadership',
  };
}

export default async function AboutPage() {
  const settings = await getSettings();

  const introVideo = settings.company_intro_video || 'https://www.youtube.com/embed/inWWhr5tnEA';

  return (
    <div style={{ paddingTop: '3rem' }}>
      {/* Page Header */}
      <section className="section" style={{ paddingBottom: '3rem' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Our Corporate Story</span>
            <h1 className="section-title">
              Pioneering Cyber Resilience & <span className="text-gradient">Digital Mastery in Pakistan</span>
            </h1>
            <p className="section-desc">
              Dream Cyber Security was established with an uncompromising mandate: deliver international-standard cyber defense, zero-trust architectures, and cutting-edge software engineering to enterprises across Pakistan and the region.
            </p>
          </div>
        </div>
      </section>

      {/* Video Presentation */}
      <section className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div className="video-responsive">
              <iframe src={introVideo} title="Dream Cyber Security Corporate Introduction" allowFullScreen loading="lazy"></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Grid */}
      <section className="section">
        <div className="container">
          <div className="grid grid-2">
            <div className="card" style={{ borderLeft: '3px solid var(--accent-cyan)' }}>
              <span className="badge badge-cyan" style={{ marginBottom: '1rem' }}>Our Purpose</span>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.6rem' }}>Corporate Mission</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.8' }}>
                To safeguard enterprise digital assets against sophisticated state-level and financial cyber threats, while democratizing access to high-impact software engineering and autonomous AI workflows that drive business productivity.
              </p>
            </div>

            <div className="card" style={{ borderLeft: '3px solid var(--accent-blue)' }}>
              <span className="badge badge-cyan" style={{ marginBottom: '1rem' }}>Our Horizon</span>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.6rem' }}>Strategic Vision</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.8' }}>
                To become South Asia’s most trusted cybersecurity and digital engineering firm, setting global benchmarks in proactive threat intelligence, zero-trust cloud architectures, and specialized technology workforce training.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Guiding Principles</span>
            <h2 className="section-title">
              The Values That <span className="text-gradient">Define Our Work</span>
            </h2>
          </div>

          <div className="grid grid-3">
            <div className="card">
              <div style={{ color: 'var(--accent-cyan)', marginBottom: '1rem' }}>
                <Icon name="shield-check" size={28} />
              </div>
              <h4 style={{ marginBottom: '0.75rem' }}>Absolute Confidentiality</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Strict non-disclosure agreements, encrypted communications, and zero-leakage protocols govern every client relationship and audit finding.
              </p>
            </div>

            <div className="card">
              <div style={{ color: 'var(--accent-cyan)', marginBottom: '1rem' }}>
                <Icon name="award" size={28} />
              </div>
              <h4 style={{ marginBottom: '0.75rem' }}>Engineering Rigor</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                We avoid shortcuts. Every piece of code, security rule, or AI pipeline undergoes multi-stage peer testing and vulnerability analysis.
              </p>
            </div>

            <div className="card">
              <div style={{ color: 'var(--accent-cyan)', marginBottom: '1rem' }}>
                <Icon name="users" size={28} />
              </div>
              <h4 style={{ marginBottom: '0.75rem' }}>Empowering Local Talent</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Through our Academy, we train professionals with hands-on labs, creating world-class engineers capable of competing on the global stage.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link href="/contact" className="btn btn-primary" style={{ padding: '0.85rem 2rem' }}>
              Connect With Leadership
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
