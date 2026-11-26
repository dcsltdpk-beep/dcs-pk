'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { usePermissions } from '@/app/admin/AdminContext';

interface SeoPageConfig {
  id: string;
  label: string;
  path: string;
  titleKey: string;
  descKey: string;
  kwKey: string;
  defaultTitle: string;
  defaultDesc: string;
  defaultKw: string;
}

const SEO_PAGES: SeoPageConfig[] = [
  {
    id: 'home',
    label: '🏠 Home (/)',
    path: '',
    titleKey: 'meta_title',
    descKey: 'meta_description',
    kwKey: 'meta_keywords',
    defaultTitle: 'Dream Cyber Security Pakistan | Cyber Defense & IT Solutions',
    defaultDesc: 'Premier international-standard cybersecurity firm, bespoke software engineering, AI workflow automations, and training academy in Pakistan.',
    defaultKw: 'cybersecurity pakistan, penetration testing lahore, web development, AI automation, IT firm pakistan, SOC monitoring',
  },
  {
    id: 'about',
    label: '📖 About (/about)',
    path: '/about',
    titleKey: 'about_meta_title',
    descKey: 'about_meta_description',
    kwKey: 'about_meta_keywords',
    defaultTitle: 'About Us | Dream Cyber Security Pakistan',
    defaultDesc: 'Learn about our corporate story, cyber defense mission, executive vision, and international engineering standards.',
    defaultKw: 'about dream cyber security, cybersecurity company lahore, enterprise defense leadership',
  },
  {
    id: 'services',
    label: '🛡️ Services (/services)',
    path: '/services',
    titleKey: 'services_meta_title',
    descKey: 'services_meta_description',
    kwKey: 'services_meta_keywords',
    defaultTitle: 'Enterprise Cybersecurity & Software Engineering Services',
    defaultDesc: 'High-performance cybersecurity auditing, bespoke software engineering, AI workflow automations, and enterprise technology services in Pakistan.',
    defaultKw: 'cybersecurity services pakistan, penetration testing lahore, custom software development, SOC monitoring, AI automation',
  },
  {
    id: 'courses',
    label: '🎓 Courses (/courses)',
    path: '/courses',
    titleKey: 'courses_meta_title',
    descKey: 'courses_meta_description',
    kwKey: 'courses_meta_keywords',
    defaultTitle: 'Cybersecurity & Technology Training Academy',
    defaultDesc: 'Hands-on technical certifications in offensive cybersecurity, AI automation engineering, enterprise full-stack development, and digital arts in Pakistan.',
    defaultKw: 'cybersecurity courses lahore, ethical hacking training pakistan, ai automation course, web development training',
  },
  {
    id: 'portfolio',
    label: '💼 Portfolio (/portfolio)',
    path: '/portfolio',
    titleKey: 'portfolio_meta_title',
    descKey: 'portfolio_meta_description',
    kwKey: 'portfolio_meta_keywords',
    defaultTitle: 'Client Projects & Technical Case Studies',
    defaultDesc: 'Proven engineering delivery across defense cybersecurity audits, custom enterprise web architectures, and automation pipelines in Pakistan.',
    defaultKw: 'cybersecurity case studies, enterprise software portfolio, web development projects lahore',
  },
  {
    id: 'videos',
    label: '🎥 Videos (/videos)',
    path: '/videos',
    titleKey: 'videos_meta_title',
    descKey: 'videos_meta_description',
    kwKey: 'videos_meta_keywords',
    defaultTitle: 'Video Showcase & Technical Demonstrations',
    defaultDesc: 'Watch cybersecurity proof-of-concepts, technical workshops, company briefings, and engineering showreels.',
    defaultKw: 'cybersecurity videos, ethical hacking demos, tech webinars pakistan',
  },
  {
    id: 'team',
    label: '👥 Team (/team)',
    path: '/team',
    titleKey: 'team_meta_title',
    descKey: 'team_meta_description',
    kwKey: 'team_meta_keywords',
    defaultTitle: 'Our Team & Specialist Leadership',
    defaultDesc: 'Meet the executive leadership, certified cybersecurity researchers, full-stack software architects, and AI automation practitioners behind DCS Pakistan.',
    defaultKw: 'cybersecurity team pakistan, certified ethical hackers lahore, enterprise security consultants',
  },
  {
    id: 'contact',
    label: '✉️ Contact (/contact)',
    path: '/contact',
    titleKey: 'contact_meta_title',
    descKey: 'contact_meta_description',
    kwKey: 'contact_meta_keywords',
    defaultTitle: 'Contact Us & Security Consultation',
    defaultDesc: 'Speak directly with our security architects. Request a confidential vulnerability assessment, enterprise software proposal, or academy consultation.',
    defaultKw: 'contact dream cyber security, hire penetration testers pakistan, cybersecurity consultation lahore',
  },
  {
    id: 'faq',
    label: '❓ FAQ (/faq)',
    path: '/faq',
    titleKey: 'faq_meta_title',
    descKey: 'faq_meta_description',
    kwKey: 'faq_meta_keywords',
    defaultTitle: 'Frequently Asked Questions & Advisory Support',
    defaultDesc: 'Answers to common queries regarding cybersecurity audits, SLA timelines, corporate training programs, and software development pricing.',
    defaultKw: 'cybersecurity faq pakistan, penetration testing questions, enterprise IT pricing faq',
  },
  {
    id: 'blog',
    label: '📰 Blog List (/blog)',
    path: '/blog',
    titleKey: 'blog_meta_title',
    descKey: 'blog_meta_description',
    kwKey: 'blog_meta_keywords',
    defaultTitle: 'Cyber Advisories, Threat Intelligence & News',
    defaultDesc: 'Stay informed with technical threat advisories, vulnerability breakdowns, defense engineering playbooks, and corporate news from DCS researchers.',
    defaultKw: 'cyber threat intelligence, pakistani cybersecurity advisories, zero-day alerts, security blog',
  },
];

export default function SettingsClient({ initialSettings }: { initialSettings: Record<string, string> }) {
  const { canEdit } = usePermissions('settings');
  const [settings, setSettings] = useState<Record<string, string>>({
    ...initialSettings,
    site_url: initialSettings.site_url || 'https://www.dreamcybersecurity.pk',
    google_verification: initialSettings.google_verification || 'pewPU0U99OKBT9gp2PI4t2h_uS--HT4ISi200Px3K9E',
    gtm_id: initialSettings.gtm_id || 'GTM-N72RQZVG',
  });
  const [activeSeoTab, setActiveSeoTab] = useState<string>('home');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [uploadingOg, setUploadingOg] = useState(false);
  const [ogError, setOgError] = useState<string | null>(null);
  const ogInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (key: string, val: string) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
  };

  const handleOgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingOg(true);
    setOgError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'dcs_pakistan/seo');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Upload failed');
      }

      handleChange('og_image', data.url);
    } catch (err: any) {
      console.error('OG image upload error:', err);
      setOgError(err?.message || 'Failed to upload image to Cloudinary');
    } finally {
      setUploadingOg(false);
      if (ogInputRef.current) ogInputRef.current.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setMsg('✓ All page meta titles, descriptions, keywords and global settings saved to database!');
        setTimeout(() => setMsg(''), 6000);
      }
    } catch (e) {
      console.error(e);
      alert('Error updating settings');
    } finally {
      setLoading(false);
    }
  };

  const currentPage = SEO_PAGES.find((p) => p.id === activeSeoTab) || SEO_PAGES[0];
  const currentTitle = settings[currentPage.titleKey] ?? currentPage.defaultTitle;
  const currentDesc = settings[currentPage.descKey] ?? currentPage.defaultDesc;
  const currentKw = settings[currentPage.kwKey] ?? currentPage.defaultKw;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>Configuration</span>
        <h1>Site Settings & <span className="text-gradient">Per-Page SEO Intelligence</span></h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Configure custom meta titles, meta descriptions, and primary keywords for every individual page on the website.
        </p>
      </div>

      {msg && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {msg}
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* ================================================================== */}
        {/* SECTION 1: PER-PAGE SEO INTELLIGENCE (META TITLES, DESCS, KEYWORDS) */}
        {/* ================================================================== */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem', border: '1px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <span className="badge badge-cyan" style={{ marginBottom: '0.4rem', fontSize: '0.72rem' }}>Frontend Pages</span>
              <h3 style={{ margin: 0, color: 'var(--accent-cyan)' }}>1. Per-Page SEO & Meta Management</h3>
            </div>
            <Link
              href="/admin/posts"
              className="btn btn-outline"
              style={{ padding: '6px 14px', fontSize: '0.82rem', borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}
            >
              ✍️ Manage Individual Blog Post Slugs & SEO &rarr;
            </Link>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
            Select any page below to customize its exact Google Search Title, Meta Description snippet, and Primary Keywords.
          </p>

          {/* PAGE SELECTOR TABS */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              flexWrap: 'wrap',
              marginBottom: '1.75rem',
              padding: '6px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
            }}
          >
            {SEO_PAGES.map((page) => {
              const isActive = activeSeoTab === page.id;
              return (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => setActiveSeoTab(page.id)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '6px',
                    border: 'none',
                    background: isActive ? 'var(--accent-cyan)' : 'transparent',
                    color: isActive ? '#0a0e1a' : 'var(--text-muted)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {page.label}
                </button>
              );
            })}
          </div>

          {/* ACTIVE PAGE SEO EDITOR CARD */}
          <div
            style={{
              padding: '1.75rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(0, 240, 255, 0.02)',
              border: '1px solid rgba(0, 240, 255, 0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                Editing SEO for: <span style={{ color: 'var(--accent-cyan)' }}>{currentPage.label}</span>
              </div>
              <span
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--accent-cyan)',
                  fontFamily: 'var(--font-mono, monospace)',
                  background: 'rgba(0, 240, 255, 0.08)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                }}
              >
                URL: {settings.site_url ? settings.site_url.replace(/\/$/, '') : 'https://www.dreamcybersecurity.pk'}{currentPage.path}
              </span>
            </div>

            {/* LIVE GOOGLE SERP PREVIEW FOR THIS SPECIFIC PAGE */}
            <div
              style={{
                padding: '1.25rem',
                borderRadius: '6px',
                background: '#0a0d1a',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '6px' }}>
                🔍 Google SERP Snippet Preview for {currentPage.label}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#000', fontWeight: 900 }}>
                  D
                </div>
                <div>
                  <span style={{ fontSize: '0.82rem', color: '#e6edf3', fontWeight: 500 }}>
                    {settings.site_name || 'Dream Cyber Security Pakistan'}
                  </span>
                  <span style={{ fontSize: '0.74rem', color: '#8b949e', marginLeft: '6px' }}>
                    {settings.site_url ? settings.site_url.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'dreamcybersecurity.pk'}{currentPage.path}
                  </span>
                </div>
              </div>
              <div style={{ color: '#58a6ff', fontSize: '1.15rem', fontWeight: 500, lineHeight: '1.3', marginBottom: '6px' }}>
                {currentTitle}
              </div>
              <div style={{ color: '#8b949e', fontSize: '0.86rem', lineHeight: '1.5' }}>
                {currentDesc}
              </div>
            </div>

            {/* META TITLE INPUT */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>
                  Meta Title for {currentPage.label} *
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => handleChange(currentPage.titleKey, currentPage.defaultTitle)}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.75rem', cursor: 'pointer', padding: 0 }}
                  >
                    Reset to Default
                  </button>
                  <span style={{ fontSize: '0.78rem', color: (currentTitle || '').length > 60 ? '#ff6b6b' : 'var(--text-muted)' }}>
                    {(currentTitle || '').length} / 60 chars {(currentTitle || '').length >= 45 && (currentTitle || '').length <= 60 ? '✓ Ideal' : ''}
                  </span>
                </div>
              </div>
              <input
                type="text"
                className="form-control"
                value={settings[currentPage.titleKey] ?? ''}
                placeholder={currentPage.defaultTitle}
                onChange={(e) => handleChange(currentPage.titleKey, e.target.value)}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Displayed in the browser tab and main blue link on Google.
              </div>
            </div>

            {/* META DESCRIPTION TEXTAREA */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>
                  Meta Description for {currentPage.label} *
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => handleChange(currentPage.descKey, currentPage.defaultDesc)}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.75rem', cursor: 'pointer', padding: 0 }}
                  >
                    Reset to Default
                  </button>
                  <span style={{ fontSize: '0.78rem', color: (currentDesc || '').length > 165 ? '#ff6b6b' : 'var(--text-muted)' }}>
                    {(currentDesc || '').length} / 160 chars {(currentDesc || '').length >= 130 && (currentDesc || '').length <= 160 ? '✓ Ideal' : ''}
                  </span>
                </div>
              </div>
              <textarea
                className="form-control"
                rows={3}
                value={settings[currentPage.descKey] ?? ''}
                placeholder={currentPage.defaultDesc}
                onChange={(e) => handleChange(currentPage.descKey, e.target.value)}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Summary snippet shown directly underneath the title in search engines.
              </div>
            </div>

            {/* PRIMARY KEYWORDS INPUT */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>
                  Primary Keywords for {currentPage.label} (comma-separated) *
                </label>
                <button
                  type="button"
                  onClick={() => handleChange(currentPage.kwKey, currentPage.defaultKw)}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.75rem', cursor: 'pointer', padding: 0 }}
                >
                  Reset to Default
                </button>
              </div>
              <input
                type="text"
                className="form-control"
                value={settings[currentPage.kwKey] ?? ''}
                placeholder={currentPage.defaultKw}
                onChange={(e) => handleChange(currentPage.kwKey, e.target.value)}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Target search queries indexable by search engine bots for this specific page.
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================== */}
        {/* SECTION 2: GLOBAL DOMAIN, SOCIAL & VERIFICATION SETTINGS */}
        {/* ================================================================== */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
          <h3 style={{ marginBottom: '1.25rem', color: 'var(--accent-cyan)' }}>2. Canonical Base URL & Google Search Console</h3>

          <div className="grid grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Canonical Site URL</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://www.dreamcybersecurity.pk"
                value={settings.site_url || ''}
                onChange={(e) => handleChange('site_url', e.target.value)}
              />
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Domain authority base URL for all canonical tags and sitemaps.
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Google Search Console Verification Token</label>
              <input
                type="text"
                className="form-control"
                placeholder="pewPU0U99OKBT9gp2PI4t2h_uS--HT4ISi200Px3K9E"
                value={settings.google_verification || ''}
                onChange={(e) => handleChange('google_verification', e.target.value)}
              />
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Verification code inside &lt;meta name=&quot;google-site-verification&quot;&gt;.
              </div>
            </div>
          </div>

          {/* OpenGraph Social Card Image */}
          <div
            style={{
              padding: '1.25rem',
              marginTop: '0.5rem',
              marginBottom: '1rem',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-sm)',
              border: '1px dashed var(--border-color)',
            }}
          >
            <label className="form-label" style={{ marginBottom: '0.5rem' }}>Default Social Share Card Banner (OG Image)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              <div
                style={{
                  width: '120px',
                  height: '63px',
                  borderRadius: '6px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  flexShrink: 0,
                }}
              >
                {settings.og_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={settings.og_image}
                    alt="OG Social Card Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>1200x630</span>
                )}
                {uploadingOg && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)', fontSize: '0.75rem' }}>
                    ...
                  </div>
                )}
              </div>

              <div style={{ flex: 1, minWidth: '220px' }}>
                <input
                  ref={ogInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleOgUpload}
                />
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                  <button
                    type="button"
                    disabled={uploadingOg}
                    onClick={() => ogInputRef.current?.click()}
                    className="btn btn-primary"
                    style={{ padding: '5px 12px', fontSize: '0.82rem' }}
                  >
                    {uploadingOg ? 'Uploading...' : settings.og_image ? 'Change OG Image' : 'Upload OG Image'}
                  </button>
                  {settings.og_image && (
                    <button
                      type="button"
                      onClick={() => handleChange('og_image', '')}
                      className="btn btn-outline"
                      style={{ padding: '5px 10px', fontSize: '0.82rem', color: '#ff6b6b' }}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input
                  type="url"
                  placeholder="Or enter direct image URL (https://...)"
                  className="form-control"
                  style={{ padding: '4px 10px', fontSize: '0.82rem' }}
                  value={settings.og_image || ''}
                  onChange={(e) => handleChange('og_image', e.target.value)}
                />
                {ogError && <div style={{ color: '#ff6b6b', fontSize: '0.8rem', marginTop: '4px' }}>{ogError}</div>}
              </div>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Displayed when website links are shared on WhatsApp, LinkedIn, Twitter/X, and Facebook.
            </div>
          </div>

          {/* Web Analytics & Tracking IDs */}
          <div className="grid grid-3" style={{ gap: '1rem', marginTop: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Google Tag Manager ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="GTM-N72RQZVG"
                value={settings.gtm_id || ''}
                onChange={(e) => handleChange('gtm_id', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Google Analytics 4 ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="G-DCSPAK2026"
                value={settings.ga4_id || ''}
                onChange={(e) => handleChange('ga4_id', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Meta / Facebook Pixel ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="123456789012345"
                value={settings.meta_pixel_id || ''}
                onChange={(e) => handleChange('meta_pixel_id', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ================================================================== */}
        {/* SECTION 3: CORPORATE CHANNELS & SOCIAL LINKS */}
        {/* ================================================================== */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.25rem', color: 'var(--accent-cyan)' }}>3. Corporate Identity & Official Channels</h3>

          <div className="grid grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Brand / Organization Name</label>
              <input
                type="text"
                className="form-control"
                value={settings.site_name || ''}
                onChange={(e) => handleChange('site_name', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Corporate Tagline</label>
              <input
                type="text"
                className="form-control"
                value={settings.site_tagline || ''}
                onChange={(e) => handleChange('site_tagline', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-3" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Official Inquiries Email</label>
              <input
                type="email"
                className="form-control"
                value={settings.company_email || ''}
                onChange={(e) => handleChange('company_email', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Telephone Number</label>
              <input
                type="text"
                className="form-control"
                value={settings.company_phone || ''}
                onChange={(e) => handleChange('company_phone', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">WhatsApp Number (with country code)</label>
              <input
                type="text"
                className="form-control"
                placeholder="923001234567"
                value={settings.whatsapp_number || ''}
                onChange={(e) => handleChange('whatsapp_number', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Physical Office Address</label>
            <input
              type="text"
              className="form-control"
              value={settings.company_address || ''}
              onChange={(e) => handleChange('company_address', e.target.value)}
            />
          </div>
        </div>

        {canEdit ? (
          <button type="submit" disabled={loading || uploadingOg} className="btn btn-primary" style={{ padding: '0.85rem 2.5rem', fontSize: '1rem' }}>
            {loading ? 'Saving All Settings & SEO...' : 'Save All Settings & SEO to Database'}
          </button>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
            View-only mode: You do not have permission to modify global settings or SEO.
          </div>
        )}
      </form>
    </div>
  );
}
