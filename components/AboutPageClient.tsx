'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa6';
import { ArrowUpRight } from 'lucide-react';

interface AboutPageClientProps {
  whatsappNumber?: string;
  whatsappMessage?: string;
  companyIntroVideo?: string;
}

export default function AboutPageClient({
  whatsappNumber = '923165478855',
  whatsappMessage = 'Hello Dream Cyber Security Pakistan, I would like to learn more about your firm and services.',
  companyIntroVideo = 'https://www.youtube.com/embed/inWWhr5tnEA',
}: AboutPageClientProps) {
  // Video player state
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // Canvas refs
  const heroParticlesRef = useRef<HTMLCanvasElement>(null);
  const netCanvasRef = useRef<HTMLCanvasElement>(null);
  const ctaParticlesRef = useRef<HTMLCanvasElement>(null);
  const visualCardRef = useRef<HTMLDivElement>(null);
  const shieldWrapRef = useRef<HTMLDivElement>(null);

  // Counter stats animation
  const [statClients, setStatClients] = useState('0');
  const [statServices, setStatServices] = useState('0');
  const [statThreats, setStatThreats] = useState('0');

  // WhatsApp link
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  // Extract clean embed url
  const getCleanEmbedUrl = (raw: string) => {
    let base = raw;
    if (base.includes('watch?v=')) {
      base = base.replace('watch?v=', 'embed/');
    }
    const glue = base.includes('?') ? '&' : '?';
    return `${base}${glue}autoplay=1&rel=0`;
  };

  /* -------------------------------------------------------------
     1. Digital Particles Canvas on Hero Shell
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
      dots = Array.from({ length: 85 }, () => ({
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
     2. Circuit Network Canvas in Right Visual Card
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
      pts = Array.from({ length: 46 }, () => ({
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
     3. 3D Perspective Tilt on Visual Card
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
     4. Warm Gold CTA Band Particles
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
            cx.lineTo(b.x, b.y);
            cx.stroke();
          }
        }
      }

      pts.forEach((p, i) => {
        cx.fillStyle = i % 4 ? 'rgba(40,36,95,0.35)' : 'rgba(255,255,255,0.85)';
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

  /* -------------------------------------------------------------
     5. Counter Animation for Security Stats
  ------------------------------------------------------------- */
  useEffect(() => {
    const t0 = performance.now() + 350;
    let raf = 0;

    const tick = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - t0) / 1500));
      const e = 1 - Math.pow(1 - p, 3);
      setStatClients(String(Math.round(500 * e)));
      setStatServices(String(Math.round(12 * e)));
      setStatThreats((99.9 * e).toFixed(1));

      if (p < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="dcs-about-page-deck">
      {/* ========================================================
          1. HERO SHELL (Golden Warm Architecture & Cyber Shield)
          ======================================================== */}
      <section className="dcs-hero-section dcs-section-hero">
        <div className="hero-shell">
        <canvas ref={heroParticlesRef} id="particles" />

        <div className="crumbs">
          <Link href="/">Home</Link> / <span>About Us</span>
        </div>

        <div className="hero">
          {/* Left Column */}
          <div>
            <span className="tag">
              <i /> Our Corporate Story
            </span>

            <h1>
              Pioneering <span className="hl">cyber</span> resilience &amp; <span className="gold">digital</span> mastery
            </h1>

            <p className="lead">
              Founded to deliver international-standard cyber defense, zero-trust architectures and software engineering to enterprises across Pakistan and the region.
            </p>

            <div className="actions">
              <Link href="/team" className="btn btn-outline">
                <span>Meet the Team</span>
                <ArrowUpRight size={16} />
              </Link>

              <Link href="/contact" className="btn btn-blue">
                <span>Consult Security</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>

            <div className="stats">
              <div className="stat">
                <b>Lahore</b>
                <span>Headquarters</span>
              </div>
              <div className="stat">
                <b>
                  Zero<em>-</em>Trust
                </b>
                <span>Architecture</span>
              </div>
              <div className="stat">
                <b>
                  24<em>/</em>7
                </b>
                <span>SOC Monitoring</span>
              </div>
            </div>
          </div>

          {/* Right Visual Card Column */}
          <div ref={visualCardRef} className="visual">
            <canvas ref={netCanvasRef} id="net" />

            <div ref={shieldWrapRef} className="shield-wrap">
              <svg className="shield" viewBox="0 0 200 230" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="dcs-rim" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#ffffff" />
                    <stop offset="0.45" stopColor="#b9bdcc" />
                    <stop offset="1" stopColor="#6b6f80" />
                  </linearGradient>
                  <linearGradient id="dcs-core" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#3a3fb8" />
                    <stop offset="1" stopColor="#1c1949" />
                  </linearGradient>
                  <pattern id="dcs-hex" width="14" height="24" patternUnits="userSpaceOnUse">
                    <path d="M7 0 14 4v8l-7 4-7-4V4z" fill="none" stroke="#f9ac43" strokeWidth="0.8" opacity="0.55" />
                  </pattern>
                </defs>
                <path d="M100 6 186 36v62c0 60-38 106-86 126C52 204 14 158 14 98V36z" fill="url(#dcs-rim)" />
                <path d="M100 20 172 45v53c0 51-31 90-72 108-41-18-72-57-72-108V45z" fill="url(#dcs-core)" />
                <path d="M100 20 172 45v53c0 51-31 90-72 108-41-18-72-57-72-108V45z" fill="url(#dcs-hex)" />
                <text x="100" y="118" textAnchor="middle" fontFamily="Sora" fontWeight="800" fontSize="40" fill="#f9ac43">
                  DCS
                </text>
                <text x="100" y="142" textAnchor="middle" fontFamily="Sora" fontWeight="600" fontSize="10" letterSpacing="3" fill="#ffffff">
                  PAKISTAN
                </text>
              </svg>
            </div>

            <div className="chip c1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z" />
              </svg>
              <span>Zero-Leakage Protocols</span>
            </div>

            <div className="chip c2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              <span>Proactive Threat Intel</span>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* ========================================================
          2. CORPORATE VIDEO SHOWCASE (Interactive 21:9 Card)
          ======================================================== */}
      <section className="section dcs-stacked-section" id="about-video">
        <div className="block">
        <div
          className="video-wide"
          onClick={() => setIsPlayingVideo(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsPlayingVideo(true);
            }
          }}
          aria-label="Play Dream Cyber Security Corporate Video"
        >
          {isPlayingVideo ? (
            <iframe
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
              src={getCleanEmbedUrl(companyIntroVideo)}
              title="Dream Cyber Security Corporate Film"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1800&q=80"
                alt="Dream Cyber Security corporate film"
                loading="lazy"
              />
              <button type="button" className="play" aria-label="Play Video">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 4v16l13-8z" />
                </svg>
              </button>
              <div className="vtxt">
                <h3>Watch our story</h3>
                <p>How Dream Cyber Security is building cyber resilience for businesses across the region.</p>
              </div>
            </>
          )}
        </div>
        </div>
      </section>

      {/* ========================================================
          3. MISSION & VISION (Split Cards)
          ======================================================== */}
      <section className="section dcs-stacked-section" id="about-mission">
        <div className="block">
        <div className="head">
          <span className="eyebrow">Mission &amp; Vision</span>
          <h2>
            Why we <span className="u">exist</span>
          </h2>
        </div>

        <div className="split">
          <div className="mv">
            <span className="big-ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </span>
            <h3>
              Corporate <span>Mission</span>
            </h3>
            <ul>
              <li>Protect enterprise digital assets from sophisticated state-level and financial cyber threats.</li>
              <li>Make high-impact software engineering and autonomous AI workflows accessible to boost business productivity.</li>
            </ul>
          </div>

          <div className="mv dark">
            <span className="big-ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </span>
            <h3>
              Strategic <span>Vision</span>
            </h3>
            <ul>
              <li>Become South Asia’s most trusted cybersecurity and digital engineering firm.</li>
              <li>Set global benchmarks in proactive threat intelligence, zero-trust cloud architectures and specialized technology workforce training.</li>
            </ul>
          </div>
        </div>
        </div>
      </section>

      {/* ========================================================
          4. OUR CORE VALUES (3-Column Principles)
          ======================================================== */}
      <section className="section dcs-stacked-section" id="about-values">
        <div className="block">
        <div className="head">
          <span className="eyebrow">Our Values</span>
          <h2>
            Principles we <span className="u">never compromise</span>
          </h2>
        </div>

        <div className="values">
          <article className="svc">
            <div className="svc-top">
              <span className="svc-ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <span className="svc-n">01</span>
            </div>
            <h3>Absolute Confidentiality</h3>
            <p>
              Client relationships and audit findings are governed by strict NDAs, encrypted communications and zero-leakage protocols.
            </p>
          </article>

          <article className="svc">
            <div className="svc-top">
              <span className="svc-ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
                </svg>
              </span>
              <span className="svc-n">02</span>
            </div>
            <h3>Engineering Rigor</h3>
            <p>
              Every line of code, security rule and AI pipeline goes through multi-stage peer testing and vulnerability analysis.
            </p>
          </article>

          <article className="svc">
            <div className="svc-top">
              <span className="svc-ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10 12 5 2 10l10 5 10-5z" />
                  <path d="M6 12v5c3 2 9 2 12 0v-5" />
                </svg>
              </span>
              <span className="svc-n">03</span>
            </div>
            <h3>Empowering Local Talent</h3>
            <p>
              Our Academy trains engineers through hands-on labs so they can compete on a global stage.
            </p>
          </article>
        </div>
        </div>
      </section>

      {/* ========================================================
          5. WHAT WE DO: FOUR PILLARS
          ======================================================== */}
      <section className="section dcs-stacked-section" id="about-pillars">
        <div className="block process">
        <div className="head">
          <span className="eyebrow">What We Do</span>
          <h2>
            Four pillars, <span className="u">one firm</span>
          </h2>
        </div>

        <div className="steps">
          <div className="step">
            <span className="step-n">01</span>
            <span className="step-ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z" />
              </svg>
            </span>
            <h4>Cyber Defense</h4>
            <p>Audits, pen-testing &amp; SOC monitoring</p>
          </div>

          <div className="step">
            <span className="step-n">02</span>
            <span className="step-ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="m8 9-4 3 4 3M16 9l4 3-4 3M13 6l-2 12" />
              </svg>
            </span>
            <h4>Software Engineering</h4>
            <p>Secure web, apps &amp; cloud</p>
          </div>

          <div className="step">
            <span className="step-n">03</span>
            <span className="step-ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="8" width="16" height="12" rx="3" />
                <path d="M12 8V4M9 13v1M15 13v1" />
              </svg>
            </span>
            <h4>AI Automation</h4>
            <p>Agents &amp; autonomous workflows</p>
          </div>

          <div className="step">
            <span className="step-n">04</span>
            <span className="step-ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10 12 5 2 10l10 5 10-5z" />
                <path d="M6 12v5c3 2 9 2 12 0v-5" />
              </svg>
            </span>
            <h4>Skill Academy</h4>
            <p>Training the next generation</p>
          </div>
        </div>
        </div>
      </section>

      {/* ========================================================
          6. SECURITY STANDARDS (Why Us Split Card)
          ======================================================== */}
      <section className="section dcs-stacked-section" id="about-why">
        <div className="block why">
        <div className="why-card">
          <div>
            <span className="eyebrow light">Security Standards</span>
            <h2>
              Built on <span>international standards.</span>
            </h2>

            <ul className="why-list">
              <li>
                <i>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12 5 5 9-10" />
                  </svg>
                </i>
                <div>
                  <b>Zero-trust architecture</b>
                  <span>Never trust, always verify — across networks, cloud and applications.</span>
                </div>
              </li>

              <li>
                <i>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12 5 5 9-10" />
                  </svg>
                </i>
                <div>
                  <b>Secure development lifecycle</b>
                  <span>Security testing at every stage, from design to deployment.</span>
                </div>
              </li>

              <li>
                <i>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12 5 5 9-10" />
                  </svg>
                </i>
                <div>
                  <b>Strict NDAs &amp; encrypted comms</b>
                  <span>Your data and findings never leave a protected channel.</span>
                </div>
              </li>

              <li>
                <i>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12 5 5 9-10" />
                  </svg>
                </i>
                <div>
                  <b>Proactive threat intelligence</b>
                  <span>We look for threats before they become incidents.</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="why-stats">
            <div>
              <b>
                {statClients}
                <em>+</em>
              </b>
              <span>Clients Protected</span>
            </div>
            <div>
              <b>
                {statServices}
                <em></em>
              </b>
              <span>Service Practices</span>
            </div>
            <div>
              <b>
                {statThreats}
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
          7. LEADERSHIP & TEAM CALLOUT
          ======================================================== */}
      <section className="section dcs-stacked-section" id="about-team">
        <div className="block">
        <div className="join">
          <div>
            <span className="eyebrow light">Leadership &amp; Team</span>
            <h2>
              Meet the people behind <span>Dream Cyber Security</span>
            </h2>
            <p>
              Security architects, engineers, designers and automation experts working together from our Lahore headquarters.
            </p>
            <div className="actions" style={{ marginTop: '28px' }}>
              <Link href="/team" className="btn btn-gold">
                <span>Meet the Team</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>

          <div className="avatars">
            <div>AH</div>
            <div>AQ</div>
            <div>MR</div>
            <div>HN</div>
            <div>RA</div>
            <div>+</div>
          </div>
        </div>
        </div>
      </section>

      {/* ========================================================
          8. WARM GOLD CTA BAND
          ======================================================== */}
      <section className="section dcs-stacked-section" id="about-cta">
        <div className="block" style={{ marginBottom: '40px' }}>
        <div className="cta-band">
          <canvas ref={ctaParticlesRef} id="cta-particles" />
          <div>
            <h2>Ready to fortify your enterprise &amp; innovate with AI?</h2>
            <p>Book a confidential cybersecurity evaluation or discuss your digital engineering roadmap with our certified team in Lahore.</p>
          </div>
          <div className="cta-actions">
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              <FaWhatsapp size={17} style={{ color: '#25D366' }} />
              <span>WhatsApp Us</span>
              <ArrowUpRight size={16} />
            </a>
            <Link href="/contact?inquiry_type=security_audit" className="btn btn-blue">
              <span>Consult Security</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
        </div>
      </section>
    </div>
  );
}
