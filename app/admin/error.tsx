'use client';

import { useEffect } from 'react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin Error caught:', error);
  }, [error]);

  return (
    <div
      style={{
        padding: '3rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '520px',
          padding: '2.5rem',
          border: '1px solid rgba(255, 107, 107, 0.3)',
          background: 'rgba(255, 107, 107, 0.05)',
        }}
      >
        <span style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }}>⚠️</span>
        <h3 style={{ color: '#ff6b6b', marginBottom: '0.75rem' }}>Admin Module Notice</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
          {error?.message || 'A temporary cache or rendering error occurred in this admin view.'}
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button onClick={() => reset()} className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '0.85rem' }}>
            Reload Module
          </button>
          <button onClick={() => window.location.reload()} className="btn btn-outline" style={{ padding: '6px 16px', fontSize: '0.85rem' }}>
            Full Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
