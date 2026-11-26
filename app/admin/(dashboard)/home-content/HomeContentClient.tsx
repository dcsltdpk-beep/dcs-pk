'use client';

import React, { useState } from 'react';
import { usePermissions } from '@/app/admin/AdminContext';

export default function HomeContentClient({ initialSettings }: { initialSettings: Record<string, string> }) {
  const { canEdit } = usePermissions('home-content');
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
      const res = await fetch('/api/admin/home-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setMsg('Homepage content updated successfully!');
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
        <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>Visual Page Editor</span>
        <h1>Homepage Content <span className="text-gradient">Manager</span></h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Customize every headline, hero text, stats counter, and button displayed on the public homepage.
        </p>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}

      <form onSubmit={handleSave}>
        {/* Hero Section Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.25rem', color: 'var(--accent-cyan)' }}>1. Hero Banner Content</h3>

          <div className="form-group">
            <label className="form-label">Hero Tagline Pill</label>
            <input
              type="text"
              className="form-control"
              value={settings.hero_tag || ''}
              onChange={(e) => handleChange('hero_tag', e.target.value)}
            />
          </div>

          <div className="grid grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Hero Title Prefix</label>
              <input
                type="text"
                className="form-control"
                value={settings.hero_title_prefix || ''}
                onChange={(e) => handleChange('hero_title_prefix', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hero Title Highlight (Cyan Gradient)</label>
              <input
                type="text"
                className="form-control"
                value={settings.hero_title_highlight || ''}
                onChange={(e) => handleChange('hero_title_highlight', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Hero Description</label>
            <textarea
              className="form-control"
              rows={3}
              value={settings.hero_description || ''}
              onChange={(e) => handleChange('hero_description', e.target.value)}
            />
          </div>

          <div className="grid grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Hero Button 1 Text</label>
              <input
                type="text"
                className="form-control"
                value={settings.hero_btn_1_text || ''}
                onChange={(e) => handleChange('hero_btn_1_text', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Hero Button 2 Text</label>
              <input
                type="text"
                className="form-control"
                value={settings.hero_btn_2_text || ''}
                onChange={(e) => handleChange('hero_btn_2_text', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Stats Counters Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.25rem', color: 'var(--accent-cyan)' }}>2. Live Stats Counters</h3>

          <div className="grid grid-4" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Enterprise Projects</label>
              <input
                type="text"
                className="form-control"
                value={settings.stat_projects || ''}
                onChange={(e) => handleChange('stat_projects', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Satisfied Clients</label>
              <input
                type="text"
                className="form-control"
                value={settings.stat_clients || ''}
                onChange={(e) => handleChange('stat_clients', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Security & Tech Experts</label>
              <input
                type="text"
                className="form-control"
                value={settings.stat_team || ''}
                onChange={(e) => handleChange('stat_team', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Industry Experience</label>
              <input
                type="text"
                className="form-control"
                value={settings.stat_experience || ''}
                onChange={(e) => handleChange('stat_experience', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Video Section Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.25rem', color: 'var(--accent-cyan)' }}>3. Company Presentation Video</h3>

          <div className="form-group">
            <label className="form-label">YouTube/Vimeo Embed URL</label>
            <input
              type="text"
              className="form-control"
              value={settings.company_intro_video || ''}
              onChange={(e) => handleChange('company_intro_video', e.target.value)}
            />
          </div>
        </div>

        {canEdit ? (
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.85rem 2.5rem', fontSize: '1rem' }}>
            {loading ? 'Updating Homepage...' : 'Save All Homepage Settings'}
          </button>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
            View-only mode: You do not have permission to modify homepage content.
          </div>
        )}
      </form>
    </div>
  );
}
