'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa6';
import { ArrowUpRight, ShieldCheck, Activity } from 'lucide-react';

interface StatItem {
  value?: number;
  suffix?: string;
  label: string;
  decimals?: number;
  staticText?: string;
}

interface ServiceDetailHeroProps {
  tag?: string;
  titlePrefix?: string;
  titleHighlight?: string;
  titleSuffix?: string;
  lead?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
  proposalHref?: string;
  proposalText?: string;
  stats?: StatItem[];
  chip1Text?: string;
  chip2Text?: string;
}

export default function ServiceDetailHero({
  tag = 'Cybersecurity Services for Modern Businesses',
  titlePrefix = 'Secure your',
  titleHighlight = 'business',
  titleSuffix = 'from cyber threats',
  lead = 'Comprehensive defensive and offensive cybersecurity consulting to shield your business from state-sponsored and cybercrime threats. We audit, harden, and defend enterprise infrastructures.',
  whatsappNumber = '923165478855',
  whatsappMessage = 'Hello Dream Cyber Security Pakistan, I require information on your services.',
  proposalHref = '/contact?inquiry_type=quote',
  proposalText = 'Request Custom Proposal',
  stats = [
    { value: 500, suffix: '+', label: 'Clients Protected' },
    { value: 99.9, suffix: '%', label: 'Threats Blocked', decimals: 1 },
    { staticText: '24/7', label: 'SOC Monitoring' },
  ],
  chip1Text = 'Threat Blocked',
  chip2Text = 'Real-time Monitoring',
}: ServiceDetailHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesCanvasRef = useRef<HTMLCanvasElement>(null);
  const netCanvasRef = useRef<HTMLCanvasElement>(null);
  const visualCardRef = useRef<HTMLDivElement>(null);
  const shieldWrapRef = useRef<HTMLDivElement>(null);

  // Animated count-up stats state
  const [counts, setCounts] = useState<string[]>(() =>
    stats.map((s) => (s.staticText ? s.staticText : `0${s.suffix || ''}`))
  );

  /* -------------------------------------------------------------
     1. Digital Background Particles Canvas (behind shell text)
  ------------------------------------------------------------- */
  useEffect(() => {
    const canvas = particlesCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let running = true;
    let isVisible = true;
    let PW = 0;
    let PH = 0;

    interface ParticleDot {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      t: number;
    }

    let dots: ParticleDot[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      PW = canvas.width = Math.max(10, rect.width * dpr);
      PH = canvas.height = Math.max(10, rect.height * dpr);

      dots = Array.from({ length: 70 }, () => ({
        x: Math.random() * PW,
        y: Math.random() * PH,
        r: (Math.random() * 2 + 0.8) * dpr,
        vx: (Math.random() - 0.5) * 0.4 * dpr,
        vy: (Math.random() - 0.5) * 0.4 * dpr,
        t: Math.random() * 6,
      }));
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // IntersectionObserver to pause when off-screen
    let observer: IntersectionObserver | null = null;
    try {
      observer = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && running && !animId) {
          animId = requestAnimationFrame(draw);
        }
      });
      observer.observe(canvas);
    } catch {
      isVisible = true;
    }

    const draw = () => {
      if (!running || !isVisible) {
        animId = 0;
        return;
      }

      ctx.clearRect(0, 0, PW, PH);
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const maxDist = 120 * dpr;

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
          if (dist < maxDist) {
            ctx.strokeStyle = `rgba(40,36,95,${(1 - dist / maxDist) * 0.16})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      dots.forEach((p, i) => {
        ctx.fillStyle =
          i % 4
            ? `rgba(40,36,95,${0.25 + Math.sin(p.t) * 0.15})`
            : `rgba(255,255,255,${0.6 + Math.sin(p.t) * 0.3})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      running = false;
      if (animId) cancelAnimationFrame(animId);
      observer?.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  /* -------------------------------------------------------------
     2. Animated Circuit / Network Traces Canvas (inside right card)
  ------------------------------------------------------------- */
  useEffect(() => {
    const canvas = netCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let running = true;
    let isVisible = true;
    let CW = 0;
    let CH = 0;

    interface NetNode {
      x: number;
      y: number;
      vx: number;
      vy: number;
    }

    let pts: NetNode[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      CW = canvas.width = Math.max(10, rect.width * dpr);
      CH = canvas.height = Math.max(10, rect.height * dpr);

      pts = Array.from({ length: 42 }, () => ({
        x: Math.random() * CW,
        y: Math.random() * CH,
        vx: (Math.random() - 0.5) * 0.35 * dpr,
        vy: (Math.random() - 0.5) * 0.35 * dpr,
      }));
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    let observer: IntersectionObserver | null = null;
    try {
      observer = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && running && !animId) {
          animId = requestAnimationFrame(drawNet);
        }
      });
      observer.observe(canvas);
    } catch {
      isVisible = true;
    }

    const drawNet = () => {
      if (!running || !isVisible) {
        animId = 0;
        return;
      }

      ctx.clearRect(0, 0, CW, CH);
      const max = CW * 0.22;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > CW) p.vx *= -1;
        if (p.y < 0 || p.y > CH) p.vy *= -1;
      }

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i];
          const b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < max) {
            ctx.strokeStyle = `rgba(58,63,184,${(1 - d / max) * 0.28})`;
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
        ctx.arc(p.x, p.y, (i % 5 ? 2 : 3) * dpr, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(drawNet);
    };

    animId = requestAnimationFrame(drawNet);

    return () => {
      running = false;
      if (animId) cancelAnimationFrame(animId);
      observer?.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  /* -------------------------------------------------------------
     3. Subtle 3D Perspective Tilt on MouseMove
  ------------------------------------------------------------- */
  useEffect(() => {
    const card = visualCardRef.current;
    const shield = shieldWrapRef.current;
    if (!card || !shield) return;

    let ticking = false;

    const handleMouseMove = (e: MouseEvent) => {
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

    const handleMouseLeave = () => {
      shield.style.transform = '';
    };

    card.addEventListener('mousemove', handleMouseMove, { passive: true });
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  /* -------------------------------------------------------------
     4. Animated Count-Up Numbers for Stats
  ------------------------------------------------------------- */
  useEffect(() => {
    const startTime = performance.now() + 250;
    const duration = 1600;
    let rafId = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, Math.max(0, (now - startTime) / duration));
      const ease = 1 - Math.pow(1 - progress, 3);

      const nextCounts = stats.map((s) => {
        if (s.staticText) return s.staticText;
        const targetVal = s.value ?? 0;
        const currentVal = targetVal * ease;
        const formatted =
          s.decimals !== undefined ? currentVal.toFixed(s.decimals) : Math.round(currentVal).toString();
        return `${formatted}${s.suffix || ''}`;
      });

      setCounts(nextCounts);

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [stats]);

  return (
    <div className="service-hero-wrapper" ref={containerRef}>
      <section className="service-hero-shell">
        {/* Background Digital Particle Net Canvas */}
        <canvas ref={particlesCanvasRef} className="service-hero-particles-canvas" aria-hidden="true" />

        <div className="service-hero-grid">
          {/* Left Column: Authoritative Copy & CTAs */}
          <div className="service-hero-content">
            <span className="service-hero-tag">
              <i className="service-hero-pulse-dot" />
              <span>{tag}</span>
            </span>

            <h1 className="service-hero-title">
              {titlePrefix}{' '}
              {titleHighlight && <span className="service-hero-hl">{titleHighlight}</span>}{' '}
              {titleSuffix && <span className="service-hero-accent-text">{titleSuffix}</span>}
            </h1>

            <p className="service-hero-lead">{lead}</p>

            <div className="service-hero-actions">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="service-hero-btn service-hero-btn-outline"
                title="Chat on WhatsApp"
              >
                <FaWhatsapp size={16} />
                <span>WhatsApp Us</span>
                <ArrowUpRight size={15} />
              </a>

              <Link href={proposalHref} className="service-hero-btn service-hero-btn-blue">
                <span>{proposalText}</span>
                <ArrowUpRight size={15} />
              </Link>
            </div>

            {/* Stats Counter Bar */}
            <div className="service-hero-stats">
              {stats.map((s, idx) => (
                <div key={idx} className="service-hero-stat">
                  <b className="service-hero-stat-number">{counts[idx]}</b>
                  <span className="service-hero-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Visual Shield Card with Notched Corner */}
          <div className="service-hero-visual" ref={visualCardRef}>
            {/* Background Circuit Grid Canvas */}
            <canvas ref={netCanvasRef} className="service-hero-net-canvas" aria-hidden="true" />

            {/* 3D Floating Vector Shield with metallic rim, hex mesh, and gold cyber lock */}
            <div className="service-hero-shield-wrap" ref={shieldWrapRef}>
              <svg className="service-hero-shield" viewBox="0 0 200 230" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="shield-rim" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#ffffff" />
                    <stop offset="0.45" stopColor="#b9bdcc" />
                    <stop offset="1" stopColor="#6b6f80" />
                  </linearGradient>
                  <linearGradient id="shield-core" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#3a3fb8" />
                    <stop offset="1" stopColor="#1c1949" />
                  </linearGradient>
                  <linearGradient id="shield-face" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#ffffff" />
                    <stop offset="1" stopColor="#cfd3e0" />
                  </linearGradient>
                  <pattern id="shield-hex" width="14" height="24" patternUnits="userSpaceOnUse">
                    <path d="M7 0 14 4v8l-7 4-7-4V4z" fill="none" stroke="#f9ac43" strokeWidth="0.8" opacity="0.55" />
                  </pattern>
                </defs>

                {/* Rim */}
                <path d="M100 6 186 36v62c0 60-38 106-86 126C52 204 14 158 14 98V36z" fill="url(#shield-rim)" />
                {/* Core */}
                <path d="M100 20 172 45v53c0 51-31 90-72 108-41-18-72-57-72-108V45z" fill="url(#shield-core)" />
                {/* Honeycomb grid overlay */}
                <path d="M100 20 172 45v53c0 51-31 90-72 108-41-18-72-57-72-108V45z" fill="url(#shield-hex)" />
                {/* Inner Face with golden stroke */}
                <path
                  d="M100 44 148 61v38c0 36-21 64-48 77-27-13-48-41-48-77V61z"
                  fill="url(#shield-face)"
                  stroke="#f9ac43"
                  strokeWidth="2"
                />
                <path d="M100 44 148 61v38c0 36-21 64-48 77z" fill="#000" opacity="0.06" />

                {/* Cyber Lock Emblem */}
                <rect x="86" y="96" width="28" height="22" rx="4" fill="#28245f" />
                <path d="M91 96v-7a9 9 0 0 1 18 0v7" fill="none" stroke="#28245f" strokeWidth="4" />
                <circle cx="100" cy="106" r="3" fill="#f9ac43" />
              </svg>
            </div>

            {/* Floating Status Chips */}
            <div className="service-hero-chip service-hero-chip-top">
              <ShieldCheck size={17} className="service-hero-chip-icon-blue" />
              <span>{chip1Text}</span>
            </div>

            <div className="service-hero-chip service-hero-chip-bottom">
              <Activity size={17} className="service-hero-chip-icon-gold" />
              <span>{chip2Text}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
