'use client';

import React, { useState } from 'react';

export default function SettingsClient({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleChange = (key: string, val: string) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
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
        setMsg('Global site settings and SEO configuration updated successfully!');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>Configuration</span>
        <h1>Global Settings & <span className="text-gradient">SEO Intelligence</span></h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Configure enterprise contact channels, WhatsApp integration, meta tags, and analytics tracking codes.
        </p>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}

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
              <label className="form-label">WhatsApp Number (No spaces)</label>
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

        {/* Global SEO & Tracking */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.25rem', color: 'var(--accent-cyan)' }}>3. Search Engine Optimization & Tracking</h3>

          <div className="form-group">
            <label className="form-label">Global Meta Title</label>
            <input
              type="text"
              className="form-control"
              value={settings.meta_title || ''}
              onChange={(e) => handleChange('meta_title', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Global Meta Description</label>
            <textarea
              className="form-control"
              rows={2}
              value={settings.meta_description || ''}
              onChange={(e) => handleChange('meta_description', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Global Meta Keywords (comma separated)</label>
            <input
              type="text"
              className="form-control"
              value={settings.meta_keywords || ''}
              onChange={(e) => handleChange('meta_keywords', e.target.value)}
            />
          </div>

          <div className="grid grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Google Analytics 4 Measurement ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="G-XXXXXXXXXX"
                value={settings.ga4_id || ''}
                onChange={(e) => handleChange('ga4_id', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Meta Pixel ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="1234567890"
                value={settings.meta_pixel_id || ''}
                onChange={(e) => handleChange('meta_pixel_id', e.target.value)}
              />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.85rem 2.5rem', fontSize: '1rem' }}>
          {loading ? 'Saving Settings...' : 'Save All Global Settings'}
        </button>
      </form>
    </div>
  );
}
