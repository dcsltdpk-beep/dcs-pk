'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';

interface HomeCtaSectionProps {
  whatsappNumber?: string;
  whatsappMessage?: string;
  title?: string;
  description?: string;
  primaryBtnText?: string;
  primaryBtnLink?: string;
}

export default function HomeCtaSection({
  whatsappNumber = '923165478855',
  whatsappMessage = 'Hello Dream Cyber Security Pakistan, I would like to inquire about your cybersecurity and enterprise IT services.',
  title = 'Ready to Fortify Your Enterprise & Innovate With AI?',
  description = 'Book a confidential cybersecurity evaluation or discuss your digital engineering roadmap with our certified team in Lahore.',
  primaryBtnText = 'Schedule Security Audit',
  primaryBtnLink = '/contact?inquiry_type=security_audit',
}: HomeCtaSectionProps) {
  const ctaParticlesRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = ctaParticlesRef.current;
    if (!cv) return;
    const cx = cv.getContext('2d');
    if (!cx) return;

    let w = 0;
    let h = 0;
    let pts: Array<{ x: number; y: number; vx: number; vy: number }> = [];
    let raf = 0;
    let running = true;
    let isVisible = true;

    const rs = () => {
      if (!cv) return;
      const d = window.devicePixelRatio || 1;
      const r = cv.getBoundingClientRect();
      const newW = Math.max(1, Math.floor(r.width * d));
      const newH = Math.max(1, Math.floor(r.height * d));
      if (newW === w && newH === h && pts.length > 0) return;
      w = cv.width = newW;
      h = cv.height = newH;
      pts = Array.from({ length: 35 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4 * d,
        vy: (Math.random() - 0.5) * 0.4 * d,
      }));
    };

    rs();
    window.addEventListener('resize', rs);

    // ResizeObserver ensures canvas updates immediately when container dimensions settle
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        rs();
      });
      resizeObserver.observe(cv);
    }

    // Intersection observer pauses animation when offscreen for 120 FPS buttery smooth scrolling
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
        if (isVisible && running) {
          if (w <= 1 || h <= 1) {
            rs();
          }
          if (!raf) {
            raf = requestAnimationFrame(dr);
          }
        }
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(cv);

    const dr = () => {
      if (!running || !cx || !isVisible) {
        raf = 0;
        return;
      }
      cx.clearRect(0, 0, w, h);
      const m = 120 * (window.devicePixelRatio || 1);

      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      });

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i];
          const b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < m) {
            cx.strokeStyle = `rgba(40,36,95,${Math.max(0, (1 - d / m) * 0.18)})`;
            cx.beginPath();
            cx.moveTo(a.x, a.y);
            cx.lineTo(b.x, b.y);
            cx.stroke();
          }
        }
      }

      pts.forEach((p, i) => {
        cx.fillStyle = i % 4 ? 'rgba(40,36,95,0.35)' : 'rgba(255,255,255,0.85)';
        cx.beginPath();
        cx.arc(p.x, p.y, Math.max(0.1, 2.2), 0, Math.PI * 2);
        cx.fill();
      });

      raf = requestAnimationFrame(dr);
    };

    raf = requestAnimationFrame(dr);

    return () => {
      running = false;
      intersectionObserver.disconnect();
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', rs);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div
      className="home-cta-wrapper dcs-course-root"
      style={{
        background: 'transparent',
        minHeight: 'auto',
        padding: 0,
        boxShadow: 'none',
        position: 'relative',
        zIndex: 2,
        width: '100%',
      }}
    >
      <style>{`
        .home-cta-band-golden {
          position: relative;
          overflow: hidden;
          isolation: isolate;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          flex-wrap: wrap;
          padding: 52px 56px;
          border-radius: 34px;
          width: 100%;
          box-sizing: border-box;
          background: radial-gradient(circle at 20% 30%, #ffd98f 0%, transparent 55%),
                      linear-gradient(135deg, #ffc65e 0%, #f9ac43 50%, #f09a2a 100%) !important;
          box-shadow: 0 40px 80px -30px rgba(240, 154, 42, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.65) !important;
        }
        .home-cta-band-golden .btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 13px 22px;
          border-radius: 99px;
          font-weight: 600;
          font-size: 14px;
          transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
          cursor: pointer;
          border: 0;
          font-family: inherit;
          text-decoration: none;
        }
        .home-cta-band-golden .btn svg {
          width: 16px;
          height: 16px;
          transition: transform 0.2s;
        }
        .home-cta-band-golden .btn:hover svg {
          transform: translate(2px, -2px);
        }
        .home-cta-band-golden .btn-blue {
          color: #f9ac43 !important;
          background: linear-gradient(135deg, #3a3fb8, #302b73 55%, #221e54) !important;
          box-shadow: 0 10px 24px -8px rgba(58, 63, 184, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.25) !important;
        }
        .home-cta-band-golden .btn-blue:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 30px -8px rgba(58, 63, 184, 0.75) !important;
        }
        .home-cta-band-golden .btn-outline {
          color: #f9ac43 !important;
          background: #28245f !important;
          border: 1.5px solid #28245f !important;
          box-shadow: 0 10px 24px -10px rgba(28, 25, 73, 0.6) !important;
        }
        .home-cta-band-golden .btn-outline:hover {
          background: #1c1949 !important;
          transform: translateY(-2px);
        }
        @media (max-width: 900px) {
          .home-cta-band-golden {
            padding: 34px 22px !important;
            border-radius: 24px !important;
            gap: 24px;
          }
          .home-cta-band-golden .cta-actions {
            width: 100%;
          }
          .home-cta-band-golden .cta-actions .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      {/* The Warm Golden CTA Band (Exact match to courses/ai-automation page) */}
      <div className="cta-band home-cta-band-golden">
        <canvas
          ref={ctaParticlesRef}
          id="cta-particles"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '640px', position: 'relative', zIndex: 1 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 'clamp(22px, 3.2vw, 40px)',
              fontWeight: 800,
              lineHeight: 1.18,
              color: '#221e54',
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </h2>
          <p
            style={{
              marginTop: '12px',
              marginBottom: 0,
              color: '#28245f',
              fontWeight: 500,
              fontSize: '15.5px',
              lineHeight: 1.65,
            }}
          >
            {description}
          </p>
        </div>

        <div
          className="cta-actions"
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            <FaWhatsapp size={18} style={{ color: '#25D366' }} />
            <span>WhatsApp Us</span>
            <ArrowUpRight size={16} />
          </a>

          <Link href={primaryBtnLink} className="btn btn-blue">
            <span>{primaryBtnText}</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
