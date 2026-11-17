'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#141133', color: '#fff', fontFamily: 'sans-serif', margin: 0, padding: '3rem', textAlign: 'center' }}>
        <h2 style={{ color: '#FBAE43', marginBottom: '1rem' }}>Application Error</h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1.5rem' }}>
          {error?.message || 'A critical error occurred.'}
        </p>
        <button
          onClick={() => reset()}
          style={{
            background: '#FBAE43',
            color: '#141133',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '6px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Reload Console
        </button>
      </body>
    </html>
  );
}
