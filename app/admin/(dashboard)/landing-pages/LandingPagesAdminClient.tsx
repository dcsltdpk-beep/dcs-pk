'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface LandingItem {
  _id?: string;
  slug: string;
  title: string;
  headline: string;
  subheadline?: string;
  body_content: string;
  cta_text: string;
  cta_link: string;
  is_active: boolean;
}

export default function LandingPagesAdminClient({ initialPages }: { initialPages: LandingItem[] }) {
  const [pages, setPages] = useState<LandingItem[]>(initialPages);
  const [editing, setEditing] = useState<LandingItem | null>(null);
  const [loading, setLoading] = useState(false);

  const emptyForm: LandingItem = {
    slug: '',
    title: '',
    headline: '',
    subheadline: '',
    body_content: '<p>Enter targeted campaign proposition here...</p>',
    cta_text: 'Get Started Now',
    cta_link: '/contact',
    is_active: true,
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setLoading(true);

    try {
      const res = await fetch('/api/admin/landing-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      const saved = await res.json();
      if (res.ok) {
        if (editing._id) {
          setPages(pages.map((p) => (p._id === saved._id ? saved : p)));
        } else {
          setPages([saved, ...pages]);
        }
        setEditing(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign landing page?')) return;
    const res = await fetch(`/api/admin/landing-pages?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setPages(pages.filter((p) => p._id !== id));
      if (editing?._id === id) setEditing(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>Growth Engine</span>
          <h1>Campaign <span className="text-gradient">Landing Pages</span></h1>
        </div>
        <button onClick={() => setEditing(emptyForm)} className="btn btn-primary">
          + Create Landing Page
        </button>
      </div>

      {editing && (
        <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem', border: '1px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>{editing._id ? 'Edit Landing Page' : 'Create Landing Page'}</h3>
            <button onClick={() => setEditing(null)} className="btn btn-outline" style={{ padding: '4px 10px' }}>
              ✕ Cancel
            </button>
          </div>

          <form onSubmit={handleSave}>
            <div className="grid grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Internal Title *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">URL Slug (e.g. cyber-audit-2026)</label>
                <input
                  type="text"
                  className="form-control"
                  value={editing.slug}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Primary Hero Headline *</label>
              <input
                type="text"
                className="form-control"
                required
                value={editing.headline}
                onChange={(e) => setEditing({ ...editing, headline: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subheadline</label>
              <input
                type="text"
                className="form-control"
                value={editing.subheadline || ''}
                onChange={(e) => setEditing({ ...editing, subheadline: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Page HTML Body Content *</label>
              <textarea
                className="form-control"
                rows={6}
                required
                value={editing.body_content}
                onChange={(e) => setEditing({ ...editing, body_content: e.target.value })}
              />
            </div>

            <div className="grid grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">CTA Button Label</label>
                <input
                  type="text"
                  className="form-control"
                  value={editing.cta_text}
                  onChange={(e) => setEditing({ ...editing, cta_text: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">CTA Destination URL</label>
                <input
                  type="text"
                  className="form-control"
                  value={editing.cta_link}
                  onChange={(e) => setEditing({ ...editing, cta_link: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
              {loading ? 'Saving Landing Page...' : 'Save Landing Page'}
            </button>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Public URL</th>
              <th>Headline</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((p) => (
              <tr key={p._id}>
                <td style={{ fontWeight: 600 }}>{p.title}</td>
                <td>
                  <Link href={`/landing/${p.slug}`} target="_blank" style={{ color: 'var(--accent-cyan)' }}>
                    /landing/{p.slug}
                  </Link>
                </td>
                <td style={{ color: 'var(--text-muted)' }}>{p.headline}</td>
                <td>
                  <span className={`badge ${p.is_active ? 'badge-cyan' : ''}`}>
                    {p.is_active ? 'Active' : 'Draft'}
                  </span>
                </td>
                <td style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setEditing(p)}
                    className="btn btn-outline"
                    style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => p._id && handleDelete(p._id)}
                    className="btn btn-danger"
                    style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {pages.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2.5rem' }}>
                  No campaign landing pages configured yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
