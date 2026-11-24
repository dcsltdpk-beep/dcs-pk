'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa6';

interface ServicesPageClientProps {
  whatsappNumber?: string;
  whatsappMessage?: string;
}

type FilterCategory = 'all' | 'security' | 'dev' | 'marketing' | 'creative';

export default function ServicesPageClient({
  whatsappNumber = '923165478855',
  whatsappMessage = 'Hello Dream Cyber Security Pakistan, I would like to inquire about your technology services.',
}: ServicesPageClientProps) {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  // Canvas refs
  const heroParticlesRef = useRef<HTMLCanvasElement>(null);
  const netCanvasRef = useRef<HTMLCanvasElement>(null);
  const ctaParticlesRef = useRef<HTMLCanvasElement>(null);
  const visualCardRef = useRef<HTMLDivElement>(null);
  const shieldWrapRef = useRef<HTMLDivElement>(null);

  // Dynamic count-up values
  const [countClients, setCountClients] = useState('0+');
  const [countThreats, setCountThreats] = useState('0%');

  // Typewriter effect for services main hero title
  const fullTitle = 'Enterprise technology services';
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
  }, []);

  const displayedWord1 = 'Enterprise'.slice(0, Math.min(typedCount, 10));
  const displayedWord2 = typedCount > 11 ? 'technology'.slice(0, Math.min(typedCount - 11, 10)) : '';
  const displayedWord3 = typedCount > 22 ? 'services'.slice(0, Math.min(typedCount - 22, 8)) : '';
  const cursorPosition = typedCount <= 10 ? 'w1' : typedCount <= 21 ? 'w2' : 'w3';

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
      const d = Math.min(window.devicePixelRatio || 1, 1.5);
      const max = 130 * d;

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
     3. Circuit Network Canvas in Right Shield Card
  ------------------------------------------------------------- */
  useEffect(() => {
    const cv = netCanvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

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
      pts = Array.from({ length: 44 }, () => ({
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
      ctx.clearRect(0, 0, W, H);
      const max = W * 0.22;
      const d = Math.min(window.devicePixelRatio || 1, 1.5);

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
            ctx.strokeStyle = `rgba(58,63,184,${(1 - dist / max) * 0.3})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      pts.forEach((p, i) => {
        ctx.fillStyle = i % 5 ? 'rgba(58,63,184,0.5)' : '#f9ac43';
        ctx.beginPath();
        ctx.arc(p.x, p.y, (i % 5 ? 2 : 3) * d, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      observer?.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  /* -------------------------------------------------------------
     4. 3D Tilt on Visual Card
  ------------------------------------------------------------- */
  useEffect(() => {
    const card = visualCardRef.current;
    const shield = shieldWrapRef.current;
    if (!card || !shield) return;

    let ticking = false;

    const onMove = (e: MouseEvent) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        shield.style.transform = `perspective(800px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
        ticking = false;
      });
    };

    const onLeave = () => {
      shield.style.transform = '';
    };

    card.addEventListener('mousemove', onMove, { passive: true });
    card.addEventListener('mouseleave', onLeave);

    return () => {
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  /* -------------------------------------------------------------
     5. CTA Band Animated Particles
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

  const handleFilterClick = (cat: string) => {
    setActiveCategoryFilter(cat);
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('resize'));
      }
    }, 60);
  };

  const isVisibleCard = (cats: string) => {
    if (activeCategoryFilter === 'all') return true;
    const filterTokens = activeCategoryFilter.split(' ');
    const cardTokens = cats.split(' ');
    return filterTokens.some((t) => cardTokens.includes(t));
  };

  return (
    <div className="dcs-services-root-deck">
      {/* ========================================================
          SECTION 1: HERO SHELL (Golden Warm Architecture)
          ======================================================== */}
      <section className="dcs-hero-section dcs-section-hero">
        <div className="hero-shell">
          <canvas ref={heroParticlesRef} id="particles" aria-hidden="true" />

          <div className="hero-shell-grid">
            <div>
              <span className="tag reveal in">
                <i /> What We Deliver
              </span>
              <h1 className="reveal in" aria-label={fullTitle}>
                {displayedWord1}
                {cursorPosition === 'w1' && (
                  <span className="typewriter-cursor" aria-hidden="true">|</span>
                )}
                {typedCount > 10 && (
                  <>
                    {' '}
                    <span className={`hl ${typedCount >= 21 ? 'highlight-active' : ''}`}>
                      {displayedWord2}
                      {cursorPosition === 'w2' && (
                        <span className="typewriter-cursor" aria-hidden="true">|</span>
                      )}
                    </span>
                  </>
                )}
                {typedCount > 21 && (
                  <>
                    {' '}
                    <span className="gold">
                      {displayedWord3}
                      {cursorPosition === 'w3' && (
                        <span className="typewriter-cursor" aria-hidden="true">|</span>
                      )}
                    </span>
                  </>
                )}
              </h1>
              <p className="lead reveal in">
                Cybersecurity, software, AI automation and digital growth — engineered to international security
                standards with zero-trust principles and modern engineering practices.
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
                <Link href="/contact?inquiry_type=quote" className="btn btn-blue">
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
                  <span>Clients Protected</span>
                </div>
                <div className="stat">
                  <b>
                    {countThreats.replace('%', '')}
                    <em>%</em>
                  </b>
                  <span>Threats Blocked</span>
                </div>
                <div className="stat">
                  <b>
                    24<em>/</em>7
                  </b>
                  <span>SOC Monitoring</span>
                </div>
              </div>
            </div>

            <div className="visual reveal in" ref={visualCardRef}>
              <canvas ref={netCanvasRef} id="net" aria-hidden="true" />
              <div className="shield-wrap" ref={shieldWrapRef}>
                <svg className="shield" viewBox="0 0 200 230" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="rim" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#ffffff" />
                      <stop offset="0.45" stopColor="#b9bdcc" />
                      <stop offset="1" stopColor="#6b6f80" />
                    </linearGradient>
                    <linearGradient id="core" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#3a3fb8" />
                      <stop offset="1" stopColor="#1c1949" />
                    </linearGradient>
                    <linearGradient id="face" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#ffffff" />
                      <stop offset="1" stopColor="#cfd3e0" />
                    </linearGradient>
                    <pattern id="hex" width="14" height="24" patternUnits="userSpaceOnUse">
                      <path
                        d="M7 0 14 4v8l-7 4-7-4V4z"
                        fill="none"
                        stroke="#f9ac43"
                        strokeWidth="0.8"
                        opacity="0.55"
                      />
                    </pattern>
                  </defs>
                  <path d="M100 6 186 36v62c0 60-38 106-86 126C52 204 14 158 14 98V36z" fill="url(#rim)" />
                  <path d="M100 20 172 45v53c0 51-31 90-72 108-41-18-72-57-72-108V45z" fill="url(#core)" />
                  <path d="M100 20 172 45v53c0 51-31 90-72 108-41-18-72-57-72-108V45z" fill="url(#hex)" />
                  <path
                    d="M100 44 148 61v38c0 36-21 64-48 77-27-13-48-41-48-77V61z"
                    fill="url(#face)"
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
                Threat Blocked
              </div>
              <div className="chip c2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>{' '}
                Real-time Monitoring
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 2: SERVICES GRID (Everything to Grow Securely)
          ======================================================== */}
      <section className="section dcs-stacked-section dcs-section-grid" id="services">
        <div className="block">
          <div className="head reveal-s in">
            <span className="eyebrow">Our Services</span>
            <h2>
              Everything your business needs to <span className="u">grow securely</span>
            </h2>
            <p>Twelve specialised practices, one accountable team. Filter by what you need.</p>
          </div>

          <div className="filters reveal-s in">
            <button
              type="button"
              className={activeCategoryFilter === 'all' ? 'on' : ''}
              onClick={() => handleFilterClick('all')}
            >
              All
            </button>
            <button
              type="button"
              className={activeCategoryFilter === 'security cloud hosting' ? 'on' : ''}
              onClick={() => handleFilterClick('security cloud hosting')}
            >
              Security &amp; Infrastructure
            </button>
            <button
              type="button"
              className={activeCategoryFilter === 'web ecommerce software ai' ? 'on' : ''}
              onClick={() => handleFilterClick('web ecommerce software ai')}
            >
              Development &amp; AI
            </button>
            <button
              type="button"
              className={activeCategoryFilter === 'marketing social' ? 'on' : ''}
              onClick={() => handleFilterClick('marketing social')}
            >
              Marketing
            </button>
            <button
              type="button"
              className={activeCategoryFilter === 'branding video' ? 'on' : ''}
              onClick={() => handleFilterClick('branding video')}
            >
              Creative
            </button>
          </div>

          <div className="grid-svc">
            {/* 01 Web Design */}
            {isVisibleCard('web') && (
              <article className="svc reveal-s in" data-cat="web">
                <div className="svc-top">
                  <span className="svc-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m8 9-4 3 4 3M16 9l4 3-4 3M13 6l-2 12" />
                    </svg>
                  </span>
                  <span className="svc-n">01</span>
                </div>
                <h3>Web Design &amp; Development</h3>
                <p>Fast, secure, SEO-ready websites and web apps built with Next.js and React.</p>
                <ul>
                  <li>Corporate websites</li>
                  <li>Web applications</li>
                  <li>CMS &amp; dashboards</li>
                </ul>
                <Link href="/services/web-design-development" className="svc-link">
                  Service Details &amp; Technical Scope{' '}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </Link>
              </article>
            )}

            {/* 02 E-commerce */}
            {isVisibleCard('ecommerce') && (
              <article className="svc reveal-s in" data-cat="ecommerce">
                <div className="svc-top">
                  <span className="svc-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="9" cy="20" r="1.5" />
                      <circle cx="18" cy="20" r="1.5" />
                      <path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 7H6" />
                    </svg>
                  </span>
                  <span className="svc-n">02</span>
                </div>
                <h3>E-commerce Development</h3>
                <p>Conversion-focused stores on Shopify, WooCommerce or fully custom platforms.</p>
                <ul>
                  <li>Shopify / WooCommerce</li>
                  <li>Payment gateways</li>
                  <li>Store optimisation</li>
                </ul>
                <Link href="/services/ecommerce-development" className="svc-link">
                  Service Details &amp; Technical Scope{' '}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </Link>
              </article>
            )}

            {/* 03 Video Editing */}
            {isVisibleCard('video') && (
              <article className="svc reveal-s in" data-cat="video">
                <div className="svc-top">
                  <span className="svc-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="6" width="14" height="12" rx="2" />
                      <path d="m16 10 6-3v10l-6-3" />
                    </svg>
                  </span>
                  <span className="svc-n">03</span>
                </div>
                <h3>Video Editing &amp; Motion Graphics</h3>
                <p>Scroll-stopping edits, explainers and motion graphics that tell your story.</p>
                <ul>
                  <li>Reels &amp; ads</li>
                  <li>Explainer videos</li>
                  <li>2D motion graphics</li>
                </ul>
                <Link href="/services/video-editing-motion-graphics" className="svc-link">
                  Service Details &amp; Technical Scope{' '}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </Link>
              </article>
            )}

            {/* 04 Graphic Design */}
            {isVisibleCard('branding') && (
              <article className="svc reveal-s in" data-cat="branding">
                <div className="svc-top">
                  <span className="svc-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="13.5" cy="6.5" r="1" />
                      <circle cx="17.5" cy="10.5" r="1" />
                      <circle cx="8.5" cy="7.5" r="1" />
                      <circle cx="6.5" cy="12.5" r="1" />
                      <path d="M12 2a10 10 0 0 0 0 20c1 0 1.7-.8 1.7-1.7 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.8-1.7 1.7-1.7h2A5.6 5.6 0 0 0 22 11 10 9.5 0 0 0 12 2z" />
                    </svg>
                  </span>
                  <span className="svc-n">04</span>
                </div>
                <h3>Graphic Design &amp; Branding</h3>
                <p>Identity systems, logos and creatives that make your brand unforgettable.</p>
                <ul>
                  <li>Logo &amp; identity</li>
                  <li>Social creatives</li>
                  <li>Print &amp; packaging</li>
                </ul>
                <Link href="/services/graphic-design-branding" className="svc-link">
                  Service Details &amp; Technical Scope{' '}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </Link>
              </article>
            )}

            {/* 05 AI Automation */}
            {isVisibleCard('ai') && (
              <article className="svc reveal-s in" data-cat="ai">
                <div className="svc-top">
                  <span className="svc-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="4" y="8" width="16" height="12" rx="3" />
                      <path d="M12 8V4M9 13v1M15 13v1M2 14h2M20 14h2" />
                      <circle cx="12" cy="3" r="1" />
                    </svg>
                  </span>
                  <span className="svc-n">05</span>
                </div>
                <h3>AI Automation &amp; Chatbots</h3>
                <p>AI agents, chatbots and workflow automations that run your business 24/7.</p>
                <ul>
                  <li>AI agents &amp; chatbots</li>
                  <li>n8n / Make workflows</li>
                  <li>CRM automation</li>
                </ul>
                <Link href="/services/ai-automation-chatbot-development" className="svc-link">
                  Service Details &amp; Technical Scope{' '}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </Link>
              </article>
            )}

            {/* 06 Cybersecurity */}
            {isVisibleCard('security') && (
              <article className="svc reveal-s in" data-cat="security">
                <div className="svc-top">
                  <span className="svc-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </span>
                  <span className="svc-n">06</span>
                </div>
                <h3>Cybersecurity Services</h3>
                <p>Audits, penetration testing and hardening to defend your infrastructure.</p>
                <ul>
                  <li>Penetration testing</li>
                  <li>Security audits</li>
                  <li>SOC monitoring</li>
                </ul>
                <Link href="/services/cybersecurity-services" className="svc-link">
                  Service Details &amp; Technical Scope{' '}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </Link>
              </article>
            )}

            {/* 07 Marketing & SEO */}
            {isVisibleCard('marketing') && (
              <article className="svc reveal-s in" data-cat="marketing">
                <div className="svc-top">
                  <span className="svc-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1zM15 9a3 3 0 0 1 0 6M18 6a7 7 0 0 1 0 12" />
                    </svg>
                  </span>
                  <span className="svc-n">07</span>
                </div>
                <h3>Digital Marketing &amp; SEO</h3>
                <p>Performance campaigns and SEO that turn traffic into qualified leads.</p>
                <ul>
                  <li>Meta &amp; Google Ads</li>
                  <li>Technical SEO</li>
                  <li>Link building</li>
                </ul>
                <Link href="/services/digital-marketing-seo" className="svc-link">
                  Service Details &amp; Technical Scope{' '}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </Link>
              </article>
            )}

            {/* 08 Social Media */}
            {isVisibleCard('social') && (
              <article className="svc reveal-s in" data-cat="social">
                <div className="svc-top">
                  <span className="svc-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
                    </svg>
                  </span>
                  <span className="svc-n">08</span>
                </div>
                <h3>Social Media Management</h3>
                <p>Consistent, on-brand content and community growth on every platform.</p>
                <ul>
                  <li>Content calendars</li>
                  <li>Community management</li>
                  <li>Growth strategy</li>
                </ul>
                <Link href="/services/social-media-management" className="svc-link">
                  Service Details &amp; Technical Scope{' '}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </Link>
              </article>
            )}

            {/* 09 Software Development */}
            {isVisibleCard('software') && (
              <article className="svc reveal-s in" data-cat="software">
                <div className="svc-top">
                  <span className="svc-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="6" y="2" width="12" height="20" rx="2.5" />
                      <path d="M11 18h2" />
                    </svg>
                  </span>
                  <span className="svc-n">09</span>
                </div>
                <h3>Software &amp; App Development</h3>
                <p>Custom software and mobile apps built around your business processes.</p>
                <ul>
                  <li>Android &amp; iOS apps</li>
                  <li>Custom software</li>
                  <li>APIs &amp; integrations</li>
                </ul>
                <Link href="/services/software-application-development" className="svc-link">
                  Service Details &amp; Technical Scope{' '}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </Link>
              </article>
            )}

            {/* 10 Hosting & IT Support */}
            {isVisibleCard('hosting') && (
              <article className="svc reveal-s in" data-cat="hosting">
                <div className="svc-top">
                  <span className="svc-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="7" rx="2" />
                      <rect x="3" y="14" width="18" height="7" rx="2" />
                      <path d="M7 6.5h.01M7 17.5h.01" />
                    </svg>
                  </span>
                  <span className="svc-n">10</span>
                </div>
                <h3>Domain, Hosting &amp; IT Support</h3>
                <p>Reliable domains, hosting, business email and day-to-day IT support.</p>
                <ul>
                  <li>Domains &amp; hosting</li>
                  <li>Business email</li>
                  <li>IT support</li>
                </ul>
                <Link href="/services/domain-hosting-it-support" className="svc-link">
                  Service Details &amp; Technical Scope{' '}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </Link>
              </article>
            )}

            {/* 11 Cloud & DevOps */}
            {isVisibleCard('cloud') && (
              <article className="svc reveal-s in" data-cat="cloud">
                <div className="svc-top">
                  <span className="svc-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.5 19H8a6 6 0 1 1 5.7-8H15a4.5 4.5 0 0 1 2.5 8z" />
                    </svg>
                  </span>
                  <span className="svc-n">11</span>
                </div>
                <h3>Cloud &amp; DevOps Solutions</h3>
                <p>Cloud architecture and CI/CD that keep you fast, stable and scalable.</p>
                <ul>
                  <li>AWS / GCP / Vercel</li>
                  <li>CI/CD pipelines</li>
                  <li>Monitoring &amp; scaling</li>
                </ul>
                <Link href="/services/cloud-devops-solutions" className="svc-link">
                  Service Details &amp; Technical Scope{' '}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </Link>
              </article>
            )}

            {/* 12 Custom Enterprise */}
            <article className="svc svc-custom reveal-s in">
              <div className="svc-top">
                <span className="svc-ic">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3v18M3 12h18" />
                  </svg>
                </span>
                <span className="svc-n">12</span>
              </div>
              <h3>Custom Enterprise Solution</h3>
              <p>
                Need something that doesn’t fit a box? We scope, architect and deliver bespoke solutions for your
                organisation.
              </p>
              <Link href="/contact?inquiry_type=quote" className="btn btn-blue">
                Request Custom Proposal{' '}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 3: 4-STEP DELIVERY PROCESS
          ======================================================== */}
      <section className="section dcs-stacked-section dcs-section-process">
        <div className="block process">
          <div className="head reveal-s in">
            <span className="eyebrow">How We Work</span>
            <h2>
              A proven <span className="u">4-step</span> delivery process
            </h2>
          </div>
          <div className="steps">
            <div className="step reveal-s in">
              <span className="step-n">01</span>
              <span className="step-ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-5-5" />
                </svg>
              </span>
              <h4>Discover</h4>
              <p>We audit your goals, systems and risks to define a clear scope.</p>
            </div>

            <div className="step reveal-s in">
              <span className="step-n">02</span>
              <span className="step-ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5zM2 2l7.6 7.6" />
                  <circle cx="11" cy="11" r="2" />
                </svg>
              </span>
              <h4>Design</h4>
              <p>Architecture, UX and security plans approved before a line of code.</p>
            </div>

            <div className="step reveal-s in">
              <span className="step-n">03</span>
              <span className="step-ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z" />
                </svg>
              </span>
              <h4>Build &amp; Secure</h4>
              <p>Agile sprints with zero-trust practices and continuous testing.</p>
            </div>

            <div className="step reveal-s in">
              <span className="step-n">04</span>
              <span className="step-ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1zM12 15l-3-3a22 22 0 0 1 2-3.9A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22.4 22.4 0 0 1-4 2z" />
                </svg>
              </span>
              <h4>Launch &amp; Support</h4>
              <p>Deployment, monitoring and ongoing support as you scale.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 4: WHY DREAM CYBER SECURITY
          ======================================================== */}
      <section className="section dcs-stacked-section dcs-section-why">
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
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
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
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
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
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
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
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
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
                  500<em>+</em>
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
                  99.9<em>%</em>
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
          SECTION 5: TECH MARQUEE & CTA BAND
          ======================================================== */}
      <section className="section dcs-stacked-section dcs-section-cta">
        <div className="block" style={{ marginTop: 0 }}>
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

          <div className="cta-band reveal-s in" style={{ marginTop: '70px' }}>
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
              <Link href="/contact?inquiry_type=quote" className="btn btn-blue">
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
