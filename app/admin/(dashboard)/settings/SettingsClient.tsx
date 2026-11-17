'use client';

import React, { useState, useRef } from 'react';

export default function SettingsClient({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [settings, setSettings] = useState<Record<string, string>>({
    ...initialSettings,
    site_url: initialSettings.site_url || 'https://www.dreamcybersecurity.pk',
    google_verification: initialSettings.google_verification || 'pewPU0U99OKBT9gp2PI4t2h_uS--HT4ISi200Px3K9E',
    gtm_id: initialSettings.gtm_id || 'GTM-N72RQZVG',
  });
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
        setMsg('✓ Global site settings and SEO intelligence updated successfully in the database!');
        setTimeout(() => setMsg(''), 5000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const titleLength = (settings.meta_title || '').length;
  const descLength = (settings.meta_description || '').length;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>Configuration</span>
        <h1>Global Settings & <span className="text-gradient">SEO Intelligence</span></h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Configure enterprise corporate identity, primary keywords, meta tags, search engine indexing, and analytics tracking codes.
        </p>
      </div>

      {msg && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {msg}
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Brand & Corporate Channels */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.25rem', color: 'var(--accent-cyan)' }}>1. Corporate Identity & Contact Channels</h3>

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
            <label className="form-label">Default WhatsApp Pre-filled Message</label>
            <input
              type="text"
              className="form-control"
              value={settings.whatsapp_message || ''}
              onChange={(e) => handleChange('whatsapp_message', e.target.value)}
            />
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

        {/* Social Media Links */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.25rem', color: 'var(--accent-cyan)' }}>2. Social Authority Links</h3>

          <div className="grid grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">LinkedIn Company Page</label>
              <input
                type="text"
                className="form-control"
                value={settings.linkedin_url || ''}
                onChange={(e) => handleChange('linkedin_url', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Twitter / X Profile</label>
              <input
                type="text"
                className="form-control"
                value={settings.twitter_url || ''}
                onChange={(e) => handleChange('twitter_url', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Facebook Page</label>
              <input
                type="text"
                className="form-control"
                value={settings.facebook_url || ''}
                onChange={(e) => handleChange('facebook_url', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">YouTube Channel</label>
              <input
                type="text"
                className="form-control"
                value={settings.youtube_url || ''}
                onChange={(e) => handleChange('youtube_url', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Global SEO Intelligence & Meta Configuration */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem', border: '1px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0, color: 'var(--accent-cyan)' }}>3. Search Engine Optimization & Meta Intelligence</h3>
            <span className="badge badge-cyan" style={{ fontSize: '0.75rem' }}>Front-End SEO Live</span>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
            These parameters directly control the Google SERP meta tags, OpenGraph social cards (Facebook, LinkedIn, WhatsApp preview), and SEO indexability of the public portal.
          </p>

          {/* Live Google Search Preview Box */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-sm)',
              background: '#0a0d1a',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '2rem',
            }}
          >
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '0.75rem' }}>
              🔍 Live Google SERP Simulation Preview
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#000', fontWeight: 900 }}>
                D
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', color: '#e6edf3', fontWeight: 500 }}>
                  {settings.site_name || 'Dream Cyber Security Pakistan'}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#8b949e', marginLeft: '6px' }}>
                  {settings.site_url ? settings.site_url.replace(/^https?:\/\//, '') : 'dreamcybersecurity.pk'}
                </span>
              </div>
            </div>
            <div style={{ color: '#58a6ff', fontSize: '1.15rem', fontWeight: 500, lineHeight: '1.3', marginBottom: '6px', cursor: 'pointer' }}>
              {settings.meta_title || 'Dream Cyber Security Pakistan | Cyber Defense & IT Solutions'}
            </div>
            <div style={{ color: '#8b949e', fontSize: '0.88rem', lineHeight: '1.5' }}>
              {settings.meta_description || 'Premier international-standard cybersecurity firm, bespoke software engineering, AI workflow automations, and training academy in Pakistan.'}
            </div>
          </div>

          {/* Primary Meta Title */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Primary Meta Title (Global)</label>
              <span style={{ fontSize: '0.78rem', color: titleLength > 60 ? '#ff6b6b' : 'var(--text-muted)' }}>
                {titleLength} / 60 characters {titleLength >= 45 && titleLength <= 60 ? '✓ Ideal length' : ''}
              </span>
            </div>
            <input
              type="text"
              className="form-control"
              value={settings.meta_title || ''}
              onChange={(e) => handleChange('meta_title', e.target.value)}
              placeholder="e.g. Dream Cyber Security Pakistan | Cyber Defense & IT Solutions"
            />
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Primary HTML title tag for browser tabs and Google Search result headlines.
            </div>
          </div>

          {/* Primary Meta Description */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Primary Meta Description (Global)</label>
              <span style={{ fontSize: '0.78rem', color: descLength > 165 ? '#ff6b6b' : 'var(--text-muted)' }}>
                {descLength} / 160 characters {descLength >= 130 && descLength <= 160 ? '✓ Ideal length' : ''}
              </span>
            </div>
            <textarea
              className="form-control"
              rows={3}
              value={settings.meta_description || ''}
              onChange={(e) => handleChange('meta_description', e.target.value)}
              placeholder="Concise corporate summary shown in search result snippets and social shares..."
            />
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Displayed by search engines under the title in search results.
            </div>
          </div>

          {/* Primary Keywords */}
          <div className="form-group">
            <label className="form-label">Primary Keywords (comma-separated)</label>
            <textarea
              className="form-control"
              rows={2}
              value={settings.meta_keywords || ''}
              onChange={(e) => handleChange('meta_keywords', e.target.value)}
              placeholder="cybersecurity pakistan, penetration testing lahore, web development, AI automation, SOC monitoring"
            />
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Target search queries and tags indexable by search engine bots.
            </div>
          </div>

          {/* Canonical URL & Google Verification */}
          <div className="grid grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Canonical Base URL</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://www.dreamcybersecurity.pk"
                value={settings.site_url || ''}
                onChange={(e) => handleChange('site_url', e.target.value)}
              />
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Prevents duplicate content issues and establishes domain authority.
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
                Token inside &lt;meta name=&quot;google-site-verification&quot;&gt;.
              </div>
            </div>
          </div>

          {/* OpenGraph Social Card Image */}
          <div
            style={{
              padding: '1.25rem',
              marginTop: '1rem',
              marginBottom: '1rem',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-sm)',
              border: '1px dashed var(--border-color)',
            }}
          >
            <label className="form-label" style={{ marginBottom: '0.5rem' }}>Social Share Card Banner (OG Image)</label>
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
              Displayed when link is shared on WhatsApp, LinkedIn, Twitter/X, and Facebook (Recommended 1200 × 630 px).
            </div>
          </div>

          {/* Web Analytics & Tracking IDs */}
          <div className="grid grid-3" style={{ gap: '1rem', marginTop: '1.5rem' }}>
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

        <button type="submit" disabled={loading || uploadingOg} className="btn btn-primary" style={{ padding: '0.85rem 2.5rem', fontSize: '1rem' }}>
          {loading ? 'Saving Settings & SEO...' : 'Save All Global Settings & SEO'}
        </button>
      </form>
    </div>
  );
}
