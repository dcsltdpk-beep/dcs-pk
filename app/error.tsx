'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <h2 style={{ color: 'var(--color-amber)', marginBottom: '1rem', fontSize: '1.5rem' }}>
        Something went wrong
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '480px', fontSize: '0.95rem' }}>
        {error?.message || 'An unexpected error occurred while rendering this section.'}
      </p>
      <button
        onClick={() => reset()}
        className="btn btn-primary"
        style={{ padding: '8px 22px', fontSize: '0.9rem' }}
      >
        Try Again
      </button>
    </div>
  );
}
