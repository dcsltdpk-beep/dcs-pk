'use client';

import React, { useState } from 'react';
import Icon from '@/components/Icon';

interface PortfolioItem {
  _id: string;
  title: string;
  category: string;
  client_name?: string;
  client_logo?: string;
  video_url?: string;
  description: string;
}

export default function PortfolioClient({ items }: { items: PortfolioItem[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Video Editing', 'Graphic Design', 'Web Development', 'AI Automation'];

  const filteredItems = activeCategory === 'All'
    ? items
    : items.filter((item) => item.category === activeCategory);

  return (
    <>
      {/* Category Filter Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`btn ${activeCategory === cat ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-2">
        {filteredItems.map((item) => (
          <div key={item._id} className="card">
            <span className="badge badge-cyan" style={{ marginBottom: '0.75rem' }}>{item.category}</span>
            <h3 style={{ marginBottom: '0.5rem' }}>{item.title}</h3>
            {item.client_name && (
              <p style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', marginBottom: '0.75rem', fontWeight: 600 }}>
                Client: {item.client_name}
              </p>
            )}
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
              {item.description}
            </p>

            {item.video_url && (
              <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                <div className="video-responsive">
                  <iframe src={item.video_url} title={item.title} allowFullScreen loading="lazy"></iframe>
                </div>
              </div>
            )}

            {/* Client Badge */}
            <div
              style={{
                background: 'var(--bg-card-hover)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem 1rem',
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: 'var(--accent-cyan)' }}><Icon name="shield-check" size={18} /></span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Verified Client Engagement
                </span>
              </div>
              <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>Production</span>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No case studies found in this category.
        </div>
      )}
    </>
  );
}
