'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa6';
import { Check, Clock, ArrowLeft, ArrowUpRight, ShieldCheck, Activity } from 'lucide-react';

interface ServiceData {
  title: string;
  slug: string;
  summary?: string;
  description?: string;
  features?: string;
  benefits?: string;
  icon?: string;
}

interface ServiceDetailPageClientProps {
  service: ServiceData;
  whatsappNumber?: string;
  whatsappMessage?: string;
}

export default function ServiceDetailPageClient({
  service,
  whatsappNumber = '923165478855',
  whatsappMessage = 'Hello Dream Cyber Security Pakistan, I require information on your services.',
}: ServiceDetailPageClientProps) {
  // Canvas refs
  const heroParticlesRef = useRef<HTMLCanvasElement>(null);
  const netCanvasRef = useRef<HTMLCanvasElement>(null);
  const ctaParticlesRef = useRef<HTMLCanvasElement>(null);
  const visualCardRef = useRef<HTMLDivElement>(null);
  const shieldWrapRef = useRef<HTMLDivElement>(null);

  // Dynamic count-up values
  const [countClients, setCountClients] = useState('0+');
  const [countThreats, setCountThreats] = useState('0%');

  // Typewriter effect for service hero title
  const fullTitle = (service.title || 'Enterprise Capability').trim();
  const titleWords = fullTitle.split(/\s+/);
  const firstWord = titleWords[0] || 'Enterprise';
  const remainingWords = titleWords.slice(1).join(' ');

  const [typedCount, setTypedCount] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setTypedCount(fullTitle.length);
      setIsTypingComplete(true);
      return;
    }

    setTypedCount(0);
    setIsTypingComplete(false);

    let current = 0;
    const total = fullTitle.length;

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        current += 1;
        setTypedCount(current);

        if (current >= total) {
          clearInterval(interval);
          setIsTypingComplete(true);
        }
      }, 55);

      return () => clearInterval(interval);
    }, 280);

    return () => clearTimeout(timer);
  }, [fullTitle]);

  const firstWordLimit = firstWord.length;
  const displayedFirstWord = firstWord.slice(0, Math.min(typedCount, firstWordLimit));
  const remainingOffset = firstWordLimit + 1;
  const displayedRemainingWords = remainingWords
    ? remainingWords.slice(0, Math.max(0, typedCount - remainingOffset))
    : '';
  const isCursorOnRemaining = remainingWords.length > 0 && typedCount > firstWordLimit;

  const featuresList = service.features
    ? service.features.split('\n').map((f) => f.trim()).filter((f) => f.length > 0)
    : [
      'Enterprise-grade architecture & zero-trust posture',
      'Certified technical review & vulnerability audit',
      'High-availability SLA & 24/7 incident response',
      'Seamless integration with modern cloud & on-prem pipelines',
    ];

  /* -------------------------------------------------------------
     1. Count-Up Animation
  ------------------------------------------------------------- */
  useEffect(() => {
    const t0 = performance.now() + 400;
    let raf = 0;

    const tick = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - t0) / 1600));
      const e = 1 - Math.pow(1 - p, 3);
      setCountClients(`${Math.round(500 * e)}+`);
      setCountThreats(`${(99.9 * e).toFixed(1)}%`);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* -------------------------------------------------------------
     2. Digital Particles Canvas on Hero Shell
  ------------------------------------------------------------- */
  useEffect(() => {
    const pc = heroParticlesRef.current;
    if (!pc) return;
    const px = pc.getContext('2d');
    if (!px) return;

    let PW = 0;
    let PH = 0;
    let dots: Array<{ x: number; y: number; r: number; vx: number; vy: number; t: number }> = [];
    let raf = 0;
    let running = true;
    let isVisible = true;

    const pResize = () => {
      const d = Math.min(window.devicePixelRatio || 1, 1.5);
      const r = pc.getBoundingClientRect();
      PW = pc.width = Math.max(10, r.width * d);
      PH = pc.height = Math.max(10, r.height * d);
      dots = Array.from({ length: 80 }, () => ({
        x: Math.random() * PW,
        y: Math.random() * PH,
        r: (Math.random() * 2 + 0.8) * d,
        vx: (Math.random() - 0.5) * 0.4 * d,
        vy: (Math.random() - 0.5) * 0.4 * d,
        t: Math.random() * 6,
      }));
    };

    pResize();
    window.addEventListener('resize', pResize, { passive: true });

    let observer: IntersectionObserver | null = null;
    try {
      observer = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && running && !raf) {
          raf = requestAnimationFrame(pDraw);
        }
      });
      observer.observe(pc);
    } catch {
      isVisible = true;
    }

    const pDraw = () => {
      if (!running || !isVisible) {
        raf = 0;
        return;
      }
      px.clearRect(0, 0, PW, PH);
      const max = 130 * Math.min(window.devicePixelRatio || 1, 1.5);

      for (const p of dots) {
        p.x += p.vx;
        p.y += p.vy;
        p.t += 0.03;
        if (p.x < 0 || p.x > PW) p.vx *= -1;
        if (p.y < 0 || p.y > PH) p.vy *= -1;
      }

      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i];
          const b = dots[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < max) {
            px.strokeStyle = `rgba(40,36,95,${(1 - dist / max) * 0.18})`;
            px.lineWidth = 1;
            px.beginPath();
            px.moveTo(a.x, a.y);
            px.lineTo(b.x, b.y);
            px.stroke();
          }
        }
      }

      dots.forEach((p, i) => {
        px.fillStyle =
          i % 4
            ? `rgba(40,36,95,${0.25 + Math.sin(p.t) * 0.15})`
            : `rgba(255,255,255,${0.6 + Math.sin(p.t) * 0.3})`;
        px.beginPath();
        px.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        px.fill();
      });

      raf = requestAnimationFrame(pDraw);
    };

    raf = requestAnimationFrame(pDraw);

    return () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      observer?.disconnect();
      window.removeEventListener('resize', pResize);
    };
  }, []);

  /* -------------------------------------------------------------
     3. Circuit Grid Canvas & 3D Mouse Parallax Tilt on Shield
  ------------------------------------------------------------- */
  useEffect(() => {
    const cv = netCanvasRef.current;
    if (!cv) return;
    const cx = cv.getContext('2d');
    if (!cx) return;

    let W = 0;
    let H = 0;
    let pts: Array<{ x: number; y: number; vx: number; vy: number }> = [];
    let raf = 0;
    let running = true;
    let isVisible = true;

    const resize = () => {
      const r = cv.getBoundingClientRect();
      const d = Math.min(window.devicePixelRatio || 1, 1.5);
      W = cv.width = Math.max(10, r.width * d);
      H = cv.height = Math.max(10, r.height * d);
      pts = Array.from({ length: 42 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35 * d,
        vy: (Math.random() - 0.5) * 0.35 * d,
      }));
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    let observer: IntersectionObserver | null = null;
    try {
      observer = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && running && !raf) {
          raf = requestAnimationFrame(draw);
        }
      });
      observer.observe(cv);
    } catch {
      isVisible = true;
    }

    const draw = () => {
      if (!running || !isVisible) {
        raf = 0;
        return;
      }
      cx.clearRect(0, 0, W, H);
      const max = W * 0.22;

      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i];
          const b = pts[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < max) {
            cx.strokeStyle = `rgba(58,63,184,${(1 - dist / max) * 0.3})`;
            cx.lineWidth = 1;
            cx.beginPath();
            cx.moveTo(a.x, a.y);
            cx.lineTo(b.x, a.y);
            cx.lineTo(b.x, b.y);
            cx.stroke();
          }
        }
      }

      pts.forEach((p, i) => {
        cx.fillStyle = i % 5 ? 'rgba(58,63,184,0.5)' : '#f9ac43';
        cx.beginPath();
        cx.arc(p.x, p.y, (i % 5 ? 2 : 3) * Math.min(window.devicePixelRatio || 1, 1.5), 0, Math.PI * 2);
        cx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    // 3D Mouse Parallax Tilt
    const card = visualCardRef.current;
    const shield = shieldWrapRef.current;
    let ticking = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!card || !shield || ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        shield.style.transform = `perspective(800px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
        ticking = false;
      });
    };

    const handleMouseLeave = () => {
      if (shield) shield.style.transform = '';
    };

    if (card) {
      card.addEventListener('mousemove', handleMouseMove, { passive: true });
      card.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      observer?.disconnect();
      window.removeEventListener('resize', resize);
      if (card) {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  /* -------------------------------------------------------------
     4. Animated CTA Band Particles
  ------------------------------------------------------------- */
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
      const d = Math.min(window.devicePixelRatio || 1, 1.5);
      const r = cv.getBoundingClientRect();
      w = cv.width = Math.max(10, r.width * d);
      h = cv.height = Math.max(10, r.height * d);
      pts = Array.from({ length: 40 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4 * d,
        vy: (Math.random() - 0.5) * 0.4 * d,
      }));
    };

    rs();
    window.addEventListener('resize', rs, { passive: true });

    let observer: IntersectionObserver | null = null;
    try {
      observer = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && running && !raf) {
          raf = requestAnimationFrame(dr);
        }
      });
      observer.observe(cv);
    } catch {
      isVisible = true;
    }

    const dr = () => {
      if (!running || !isVisible) {
        raf = 0;
        return;
      }
      cx.clearRect(0, 0, w, h);
      const m = 120 * Math.min(window.devicePixelRatio || 1, 1.5);

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
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < m) {
            cx.strokeStyle = `rgba(40,36,95,${(1 - dist / m) * 0.18})`;
            cx.beginPath();
            cx.moveTo(a.x, a.y);
            cx.lineTo(b.x, a.y);
            cx.stroke();
          }
        }
      }

      pts.forEach((p, i) => {
        cx.fillStyle = i % 4 ? 'rgba(40,36,95,0.35)' : 'rgba(255,255,255,0.8)';
        cx.beginPath();
        cx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
        cx.fill();
      });

      raf = requestAnimationFrame(dr);
    };

    raf = requestAnimationFrame(dr);

    return () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      observer?.disconnect();
      window.removeEventListener('resize', rs);
    };
  }, []);

  return (
    <div className="dcs-services-root-deck">
      {/* ========================================================
          SECTION 1: HERO SHELL (Matching services.html)
          ======================================================== */}
      <section className="dcs-hero-section dcs-section-hero">
        <div className="hero-shell">
          <canvas ref={heroParticlesRef} id="particles" aria-hidden="true" />

          <div className="hero-shell-grid">
            <div>
              <span className="tag reveal in">
                <i /> Certified Enterprise Capability
              </span>
              <h1 className="reveal in" aria-label={fullTitle}>
                {displayedFirstWord}
                {!isCursorOnRemaining && (
                  <span className="typewriter-cursor" aria-hidden="true">|</span>
                )}
                {remainingWords && (
                  <>
                    {' '}
                    <span className={`hl ${isTypingComplete ? 'highlight-active' : ''}`}>
                      {displayedRemainingWords}
                      {isCursorOnRemaining && (
                        <span className="typewriter-cursor" aria-hidden="true">|</span>
                      )}
                    </span>
                  </>
                )}
              </h1>
              <p className="lead reveal in">
                {service.summary ||
                  service.description?.slice(0, 240) ||
                  'High-performance zero-trust architecture and bespoke technology engineering for forward-thinking enterprises.'}
              </p>
              <div className="actions reveal in">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  WhatsApp Us{' '}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </a>
                <Link
                  href={`/contact?inquiry_type=quote&target=${encodeURIComponent(service.title)}`}
                  className="btn btn-blue"
                >
                  Request Custom Proposal{' '}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </Link>
              </div>
              <div className="stats reveal in">
                <div className="stat">
                  <b>
                    {countClients.replace('+', '')}
                    <em>+</em>
                  </b>
                  <span>Engagements</span>
                </div>
                <div className="stat">
                  <b>
                    {countThreats.replace('%', '')}
                    <em>%</em>
                  </b>
                  <span>Uptime &amp; Defense</span>
                </div>
                <div className="stat">
                  <b>
                    24<em>/</em>7
                  </b>
                  <span>SOC &amp; Support</span>
                </div>
              </div>
            </div>

            <div className="visual reveal in" ref={visualCardRef}>
              <canvas ref={netCanvasRef} id="net" aria-hidden="true" />
              <div className="shield-wrap" ref={shieldWrapRef}>
                <svg className="shield" viewBox="0 0 200 230" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="rim-detail" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#ffffff" />
                      <stop offset="0.45" stopColor="#b9bdcc" />
                      <stop offset="1" stopColor="#6b6f80" />
                    </linearGradient>
                    <linearGradient id="core-detail" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#3a3fb8" />
                      <stop offset="1" stopColor="#1c1949" />
                    </linearGradient>
                    <linearGradient id="face-detail" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#ffffff" />
                      <stop offset="1" stopColor="#cfd3e0" />
                    </linearGradient>
                    <pattern id="hex-detail" width="14" height="24" patternUnits="userSpaceOnUse">
                      <path
                        d="M7 0 14 4v8l-7 4-7-4V4z"
                        fill="none"
                        stroke="#f9ac43"
                        strokeWidth="0.8"
                        opacity="0.55"
                      />
                    </pattern>
                  </defs>
                  <path d="M100 6 186 36v62c0 60-38 106-86 126C52 204 14 158 14 98V36z" fill="url(#rim-detail)" />
                  <path d="M100 20 172 45v53c0 51-31 90-72 108-41-18-72-57-72-108V45z" fill="url(#core-detail)" />
                  <path d="M100 20 172 45v53c0 51-31 90-72 108-41-18-72-57-72-108V45z" fill="url(#hex-detail)" />
                  <path
                    d="M100 44 148 61v38c0 36-21 64-48 77-27-13-48-41-48-77V61z"
                    fill="url(#face-detail)"
                    stroke="#f9ac43"
                    strokeWidth="2"
                  />
                  <path d="M100 44 148 61v38c0 36-21 64-48 77z" fill="#000" opacity="0.06" />
                  <rect x="86" y="96" width="28" height="22" rx="4" fill="#28245f" />
                  <path d="M91 96v-7a9 9 0 0 1 18 0v7" fill="none" stroke="#28245f" strokeWidth="4" />
                  <circle cx="100" cy="106" r="3" fill="#f9ac43" />
                </svg>
              </div>
              <div className="chip c1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>{' '}
                Verified Standard
              </div>
              <div className="chip c2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>{' '}
                24/7 Operations
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 2: TECHNICAL SCOPE & ARCHITECTURE (Matching services.html Cards)
          ======================================================== */}
      <section className="section dcs-stacked-section" id="service-scope">
        <div className="block">
          <div style={{ marginBottom: '2rem' }}>
            <Link
              href="/services"
              className="svc-link"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '15px',
                fontWeight: 700,
                color: 'var(--blue)',
              }}
            >
              <ArrowLeft size={17} />
              <span>Back to All Services</span>
            </Link>
          </div>

          <div className="service-detail-grid">
            {/* Left Column: Scope, Capabilities & Strategic Value */}
            <div>
              <span className="eyebrow">Technical Scope</span>
              <h2
                style={{
                  fontSize: 'clamp(28px, 3.4vw, 44px)',
                  fontWeight: 800,
                  lineHeight: 1.15,
                  color: 'var(--navy-800)',
                  marginTop: '10px',
                  marginBottom: '18px',
                }}
              >
                {service.title} <span className="u">Architecture</span>
              </h2>

              <p
                style={{
                  fontSize: '16px',
                  lineHeight: '1.75',
                  color: 'var(--navy-700)',
                  marginBottom: '28px',
                  whiteSpace: 'pre-line',
                }}
              >
                {service.description || service.summary}
              </p>

              {/* Capabilities Card */}
              <div
                className="svc"
                style={{
                  padding: '32px',
                  marginBottom: '26px',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'var(--navy-800)',
                    marginBottom: '18px',
                    marginTop: 0,
                  }}
                >
                  Key Service Features &amp; Technical Capabilities
                </h3>
                <ul
                  style={{
                    listStyle: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    margin: 0,
                    padding: 0,
                  }}
                >
                  {featuresList.map((f, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        fontSize: '14.5px',
                        lineHeight: 1.5,
                        color: 'var(--navy-700)',
                        background: 'transparent',
                        border: 'none',
                        padding: 0,
                      }}
                    >
                      <span
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--gold-light), var(--gold))',
                          display: 'grid',
                          placeItems: 'center',
                          flexShrink: 0,
                          marginTop: '2px',
                          color: 'var(--navy-900)',
                        }}
                      >
                        <Check size={14} strokeWidth={2.8} />
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Strategic Benefits Highlight Card */}
              {service.benefits && (
                <div
                  className="svc svc-custom"
                  style={{
                    padding: '28px 32px',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: 'var(--gold)',
                      marginBottom: '10px',
                    }}
                  >
                    Strategic Business Benefits
                  </h4>
                  <p
                    style={{
                      fontSize: '14.5px',
                      lineHeight: '1.7',
                      color: '#c9c6e6',
                      margin: 0,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {service.benefits}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Direct Engagement Navy Consultation Card */}
            <div style={{ position: 'sticky', top: '100px' }}>
              <div
                className="why-card"
                style={{
                  gridTemplateColumns: '1fr',
                  padding: '40px 36px',
                  gap: '24px',
                }}
              >
                <div>
                  <span className="eyebrow light">Direct Engagement</span>
                  <h3
                    style={{
                      fontSize: '24px',
                      fontWeight: 800,
                      color: '#ffffff',
                      marginTop: '8px',
                      lineHeight: 1.25,
                    }}
                  >
                    Request Service Consultation
                  </h3>
                  <p
                    style={{
                      color: '#c9c6e6',
                      fontSize: '14.5px',
                      lineHeight: 1.6,
                      marginTop: '12px',
                      marginBottom: '26px',
                    }}
                  >
                    Engage directly with our technical team in Lahore to schedule an evaluation or discuss technical scope
                    for {service.title}.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <Link
                      href={`/contact?inquiry_type=quote&target=${encodeURIComponent(service.title)}`}
                      className="btn btn-blue"
                      style={{
                        width: '100%',
                        justifyContent: 'center',
                        fontSize: '15px',
                        padding: '14px 20px',
                      }}
                    >
                      <span>Request Detailed Proposal</span>
                      <ArrowUpRight size={16} />
                    </Link>

                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                        `Hello Dream Cyber Security Pakistan, I require consultation on ${service.title}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                      style={{
                        width: '100%',
                        justifyContent: 'center',
                        fontSize: '15px',
                        padding: '14px 20px',
                        background: '#25D366',
                        borderColor: '#25D366',
                        color: '#ffffff',
                      }}
                    >
                      <FaWhatsapp size={18} />
                      <span>Chat Directly on WhatsApp</span>
                    </a>
                  </div>

                  <div
                    style={{
                      marginTop: '28px',
                      paddingTop: '20px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      color: '#b9b6d8',
                      fontSize: '13px',
                    }}
                  >
                    <Clock size={16} style={{ color: 'var(--gold)' }} />
                    <span>Average response time: &lt; 2 business hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 3: 4-STEP DELIVERY PROCESS (From services.html)
          ======================================================== */}
      <section className="section dcs-stacked-section" id="services-process">
        <div className="block process">
          <div className="head reveal-s in">
            <span className="eyebrow">How We Work</span>
            <h2>
              A proven <span className="u">4-step</span> delivery process
            </h2>
            <p>Predictable execution from discovery to deployment with continuous security validation.</p>
          </div>
          <div className="steps">
            <div className="step reveal-s in">
              <span className="step-n">01</span>
              <span className="step-ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-5-5" />
                </svg>
              </span>
              <h4>Discover</h4>
              <p>We audit your goals, systems and risks to define a clear technical scope.</p>
            </div>
            <div className="step reveal-s in">
              <span className="step-n">02</span>
              <span className="step-ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5zM2 2l7.6 7.6" />
                  <circle cx="11" cy="11" r="2" />
                </svg>
              </span>
              <h4>Design</h4>
              <p>Architecture, UX and security blueprints approved before a single line of code.</p>
            </div>
            <div className="step reveal-s in">
              <span className="step-n">03</span>
              <span className="step-ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z" />
                </svg>
              </span>
              <h4>Build &amp; Secure</h4>
              <p>Agile engineering sprints with strict zero-trust practices and continuous testing.</p>
            </div>
            <div className="step reveal-s in">
              <span className="step-n">04</span>
              <span className="step-ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1zM12 15l-3-3a22 22 0 0 1 2-3.9A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22.4 22.4 0 0 1-4 2z" />
                </svg>
              </span>
              <h4>Launch &amp; Support</h4>
              <p>Secure deployment, SOC monitoring and ongoing operational engineering as you scale.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 4: WHY DREAM CYBER SECURITY (From services.html)
          ======================================================== */}
      <section className="section dcs-stacked-section" id="services-why">
        <div className="block why">
          <div className="why-card reveal-s in">
            <div>
              <span className="eyebrow light">Why Dream Cyber Security</span>
              <h2>
                Built in Lahore. <span>Trusted worldwide.</span>
              </h2>
              <ul className="why-list">
                <li className="reveal-s in">
                  <i>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="m5 12 5 5 9-10" />
                    </svg>
                  </i>
                  <div>
                    <b>Security-first engineering</b>
                    <span>Every project follows international cybersecurity standards and zero-trust principles.</span>
                  </div>
                </li>
                <li className="reveal-s in">
                  <i>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="m5 12 5 5 9-10" />
                    </svg>
                  </i>
                  <div>
                    <b>One partner, every service</b>
                    <span>Security, software, AI, design and marketing under one roof — no hand-offs.</span>
                  </div>
                </li>
                <li className="reveal-s in">
                  <i>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="m5 12 5 5 9-10" />
                    </svg>
                  </i>
                  <div>
                    <b>Certified, in-house team</b>
                    <span>Engineers, designers and marketers based in our Lahore headquarters.</span>
                  </div>
                </li>
                <li className="reveal-s in">
                  <i>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="m5 12 5 5 9-10" />
                    </svg>
                  </i>
                  <div>
                    <b>Transparent delivery</b>
                    <span>Clear scope, fixed milestones and weekly progress reports.</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="why-stats">
              <div>
                <b>
                  {countClients.replace('+', '')}
                  <em>+</em>
                </b>
                <span>Clients Protected</span>
              </div>
              <div>
                <b>
                  12<em></em>
                </b>
                <span>Service Practices</span>
              </div>
              <div>
                <b>
                  {countThreats.replace('%', '')}
                  <em>%</em>
                </b>
                <span>Threats Blocked</span>
              </div>
              <div>
                <b>
                  24<em>/</em>7
                </b>
                <span>SOC Monitoring</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 5: TECH MARQUEE & WARM-GOLD CTA BAND (From services.html)
          ======================================================== */}
      <section className="section dcs-stacked-section" id="services-cta">
        <div className="block">
          <div className="tech">
            <p>Technologies we work with</p>
            <div className="marquee">
              <div className="track">
                <span>Next.js</span>
                <span>React</span>
                <span>Node.js</span>
                <span>MongoDB</span>
                <span>Python</span>
                <span>n8n</span>
                <span>OpenAI</span>
                <span>AWS</span>
                <span>Vercel</span>
                <span>Docker</span>
                <span>Shopify</span>
                <span>WordPress</span>
                <span>Figma</span>
                <span>Premiere Pro</span>
                <span>Kali Linux</span>
                <span>Burp Suite</span>
                <span>Next.js</span>
                <span>React</span>
                <span>Node.js</span>
                <span>MongoDB</span>
                <span>Python</span>
                <span>n8n</span>
                <span>OpenAI</span>
                <span>AWS</span>
                <span>Vercel</span>
                <span>Docker</span>
                <span>Shopify</span>
                <span>WordPress</span>
                <span>Figma</span>
                <span>Premiere Pro</span>
                <span>Kali Linux</span>
                <span>Burp Suite</span>
              </div>
            </div>
          </div>

          <div className="cta-band reveal-s in">
            <canvas ref={ctaParticlesRef} id="cta-particles" aria-hidden="true" />
            <div>
              <h2>Have a project in mind?</h2>
              <p>Tell us what you need — we’ll reply with a scoped proposal within 24 hours.</p>
            </div>
            <div className="cta-actions">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                WhatsApp Us{' '}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </a>
              <Link
                href={`/contact?inquiry_type=quote&target=${encodeURIComponent(service.title)}`}
                className="btn btn-blue"
              >
                Request Custom Proposal{' '}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
