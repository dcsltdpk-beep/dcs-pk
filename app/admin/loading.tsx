import React from 'react';
import Image from 'next/image';

export default function AdminLoading() {
  return (
    <div className="cyber-loader-screen admin-loader-screen" role="status" aria-label="Loading Admin Control Center">
      <div className="cyber-loader-content">
        <div className="radar-loader-wrapper">
          <div className="radar-ring-outer" style={{ borderColor: 'rgba(251, 174, 67, 0.4)' }} />
          <div className="radar-ring-mid" style={{ borderColor: 'rgba(185, 221, 235, 0.4)' }} />
          <div className="radar-scanner-sweep" />
          <div className="radar-emblem-center">
            <Image
              src="/logo.png"
              alt="DCS Admin Console"
              width={48}
              height={48}
              className="loader-logo-img"
              priority
            />
          </div>
        </div>

        <div className="loader-brand-title" style={{ fontSize: '1.1rem', letterSpacing: '2px' }}>
          <span style={{ color: '#FBAE43', fontWeight: 800 }}>DCS</span>{' '}
          <span style={{ color: '#1c1949', fontWeight: 800 }}>CONTROL CENTER</span>
        </div>

        <div className="loader-status-bar">
          <div className="loader-progress-track">
            <div className="loader-progress-glow" />
          </div>
          <p className="loader-status-label" style={{ color: 'var(--color-amber)' }}>
            AUTHENTICATING CONSOLE SESSION<span className="loader-dots" />
          </p>
        </div>
      </div>
    </div>
  );
}
