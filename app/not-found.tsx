import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, Shield, GraduationCap, Phone, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: '404 - Page Not Found | Dream Cyber Security Pakistan',
  description: 'The requested route does not exist or has been relocated under our updated infrastructure.',
};

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        background: 'radial-gradient(ellipse at 50% 20%, #272460 0%, #1A1845 70%, #0d0b24 100%)',
      }}
    >
      <div
        style={{
          maxWidth: '680px',
          width: '100%',
          textAlign: 'center',
          background: 'rgba(26, 24, 69, 0.85)',
          border: '1px solid rgba(251, 174, 67, 0.3)',
          borderRadius: '16px',
          padding: '3rem 2rem',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(251, 174, 67, 0.1)',
          backdropFilter: 'blur(16px)',
        }}
      >
        {/* Emblem Crest */}
        <div style={{ display: 'inline-flex', marginBottom: '1.5rem', position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              inset: '-8px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(251, 174, 67, 0.3) 0%, transparent 70%)',
            }}
          />
          <Image
            src="/logo.png"
            alt="Dream Cyber Security Official Crest"
            width={72}
            height={72}
            style={{ width: '72px', height: '72px', objectFit: 'contain', position: 'relative', zIndex: 1 }}
            priority
          />
        </div>

        {/* Technical Label */}
        <div
          style={{
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            fontSize: '11px',
            letterSpacing: '3px',
            color: '#B9DDEB',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}
        >
          HTTP_STATUS: 404 &bull; ROUTE_UNAVAILABLE
        </div>

        {/* 404 Heading */}
        <h1
          style={{
            fontFamily: "var(--font-display, 'Cinzel', serif)",
            fontSize: 'clamp(2.5rem, 6vw, 3.8rem)',
            fontWeight: 700,
            color: '#FCCD7B',
            lineHeight: 1.1,
            marginBottom: '1rem',
            textShadow: '0 0 25px rgba(251, 174, 67, 0.4)',
          }}
        >
          404 &mdash; Page Not Found
        </h1>

        <p
          style={{
            fontFamily: "var(--font-body, 'Manrope', sans-serif)",
            color: '#F7F4EE',
            fontSize: '1.05rem',
            lineHeight: 1.65,
            maxWidth: '520px',
            margin: '0 auto 2.5rem auto',
            opacity: 0.9,
          }}
        >
          The requested page or enterprise asset does not exist or has been relocated to our updated international infrastructure.
        </p>

        {/* Quick Nav Action Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px',
            marginBottom: '2rem',
          }}
        >
          <Link
            href="/"
            className="btn btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '0.75rem 1rem',
              fontSize: '0.9rem',
            }}
          >
            <Home size={16} />
            <span>Homepage</span>
          </Link>

          <Link
            href="/services"
            className="btn btn-outline"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '0.75rem 1rem',
              fontSize: '0.9rem',
            }}
          >
            <Shield size={16} />
            <span>Services</span>
          </Link>

          <Link
            href="/courses"
            className="btn btn-outline"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '0.75rem 1rem',
              fontSize: '0.9rem',
            }}
          >
            <GraduationCap size={16} />
            <span>Academy</span>
          </Link>

          <Link
            href="/contact"
            className="btn btn-outline"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '0.75rem 1rem',
              fontSize: '0.9rem',
            }}
          >
            <Phone size={16} />
            <span>Contact Desk</span>
          </Link>
        </div>

        <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(185, 221, 235, 0.15)' }}>
          <Link
            href="/"
            style={{
              color: '#B9DDEB',
              fontSize: '0.88rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            }}
          >
            <ArrowLeft size={14} />
            <span>RETURN TO DCS PAKISTAN PORTAL</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
