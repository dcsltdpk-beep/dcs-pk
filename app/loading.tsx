import React from 'react';
import Image from 'next/image';

export default function Loading() {
  return (
    <div className="cyber-loader-screen" aria-label="Loading Dream Cyber Security" role="status">
      <div className="cyber-loader-content">
        {/* Radar Spinner & Emblem */}
        <div className="radar-loader-wrapper">
          <div className="radar-ring-outer" />
          <div className="radar-ring-mid" />
          <div className="radar-ring-inner" />
          <div className="radar-scanner-sweep" />
          <div className="radar-emblem-center">
            <Image
              src="/logo.png"
              alt="Dream Cyber Security"
              width={56}
              height={56}
              className="loader-logo-img"
              priority
            />
          </div>
        </div>

        {/* Brand & Technical Status Text */}
        <div className="loader-brand-title">
          <span className="loader-brand-dream">DREAM</span>{' '}
          <span className="loader-brand-cyber">CYBER</span>{' '}
          <span className="loader-brand-sec">SECURITY</span>
        </div>

        <div className="loader-status-bar">
          <div className="loader-progress-track">
            <div className="loader-progress-glow" />
          </div>
          <p className="loader-status-label">
            ESTABLISHING SECURE PROTOCOL<span className="loader-dots" />
          </p>
        </div>
      </div>
    </div>
  );
}
