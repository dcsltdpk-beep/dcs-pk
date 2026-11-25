'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export interface PortfolioItem {
  _id?: string;
  title: string;
  category: string;
  client_name?: string;
  cover_image?: string;
  video_url?: string;
  description: string;
  tags?: string[];
  order_num?: number;
}

interface PortfolioPageClientProps {
  initialItems?: PortfolioItem[];
  whatsappNumber?: string;
}

const DEFAULT_PROJECTS: PortfolioItem[] = [
  {
    title: 'National Cyber Defense Portal',
    category: 'Web Development',
    client_name: 'GovTech Security Initiative',
    cover_image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1000&q=80',
    video_url: '',
    description: 'Secure, high-traffic web portal with hardened authentication, role-based access control and real-time security alerts.',
    tags: ['Next.js', 'RBAC', 'Security Alerts'],
  },
  {
    title: 'Corporate Threat Explainer 3D Reel',
    category: 'Video Editing',
    client_name: 'FinSecure Bank Ltd',
    cover_image: 'https://img.youtube.com/vi/inWWhr5tnEA/hqdefault.jpg',
    video_url: 'inWWhr5tnEA',
    description: '3D motion-graphics showreel explaining modern ransomware attack methods and how organisations can prevent them.',
    tags: ['3D Motion', 'After Effects', 'Explainer'],
  },
  {
    title: 'Zero-Trust Identity Brand Kit',
    category: 'Graphic Design',
    client_name: 'Apex Cyber Defense',
    cover_image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1000&q=80',
    video_url: '',
    description: 'Corporate visual identity package — vector logo, typography, stationery and security badges.',
    tags: ['Logo', 'Typography', 'Brand Kit'],
  },
  {
    title: 'Autonomous Lead & SOC Intake Bot',
    category: 'AI Automation',
    client_name: 'Global Telecom Provider',
    cover_image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1000&q=80',
    video_url: '',
    description: 'Multi-channel AI agent that triages leads, onboards customers and logs initial technical incidents 24/7.',
    tags: ['AI Agent', 'n8n', 'Multi-channel'],
  },
];

export default function PortfolioPageClient({
  initialItems = [],
  whatsappNumber = '923165478855',
}: PortfolioPageClientProps) {
  // Normalize projects
  const projects: PortfolioItem[] = (
    initialItems && initialItems.length > 0 ? initialItems : DEFAULT_PROJECTS
  ).map((p, idx) => {
    const fallback = DEFAULT_PROJECTS[idx % DEFAULT_PROJECTS.length];
    const isVideo = Boolean(p.video_url || p.category.toLowerCase().includes('video'));
    let cover = p.cover_image || fallback.cover_image;
    if (isVideo && (!cover || cover.includes('unsplash.com'))) {
      const ytId = parseVideoId(p.video_url || fallback.video_url);
      if (ytId) {
        cover = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
      }
    }
    return {
      ...p,
      cover_image: cover,
      client_name: p.client_name || fallback.client_name,
      tags: p.tags && p.tags.length > 0 ? p.tags : fallback.tags,
      video_url: p.video_url || (p.category.toLowerCase().includes('video') ? fallback.video_url : ''),
    };
  });

  // State
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [modalVideoId, setModalVideoId] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState<boolean>(false);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});

  // Canvas Refs
  const heroCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const netCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctaCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const visualCardRef = useRef<HTMLDivElement | null>(null);

  // Clean WhatsApp number
  const cleanWhatsapp = (whatsappNumber || '923165478855').replace(/[^0-9]/g, '');

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    if (activeFilter === 'all') return true;
    const cat = (project.category || '').toLowerCase();
    if (activeFilter === 'video') return cat.includes('video');
    if (activeFilter === 'design') return cat.includes('design') || cat.includes('graphic');
    if (activeFilter === 'web') return cat.includes('web') || cat.includes('dev');
    if (activeFilter === 'ai') return cat.includes('ai') || cat.includes('automation');
    return false;
  });

  // 1. Hero Canvas (Golden digital particles)
  useEffect(() => {
    const canvas = heroCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dots: Array<{ x: number; y: number; r: number; vx: number; vy: number; t: number }> = [];

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      width = canvas.width = rect.width * dpr;
      height = canvas.height = rect.height * dpr;
      dots = Array.from({ length: 90 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: (Math.random() * 2 + 0.8) * dpr,
        vx: (Math.random() - 0.5) * 0.4 * dpr,
        vy: (Math.random() - 0.5) * 0.4 * dpr,
        t: Math.random() * 6,
      }));
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const maxDist = 130 * (window.devicePixelRatio || 1);

      for (const p of dots) {
        p.x += p.vx;
        p.y += p.vy;
        p.t += 0.03;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }

      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i];
          const b = dots[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < maxDist) {
            ctx.strokeStyle = `rgba(40,36,95,${(1 - dist / maxDist) * 0.18})`;
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

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // 2. Visual Card Circuit Canvas (Right-angle traces)
  useEffect(() => {
    const canvas = netCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let points: Array<{ x: number; y: number; vx: number; vy: number }> = [];

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      width = canvas.width = rect.width * dpr;
      height = canvas.height = rect.height * dpr;
      points = Array.from({ length: 46 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35 * dpr,
        vy: (Math.random() - 0.5) * 0.35 * dpr,
      }));
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const maxDist = width * 0.22;

      for (const p of points) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i];
          const b = points[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < maxDist) {
            ctx.strokeStyle = `rgba(58,63,184,${(1 - dist / maxDist) * 0.3})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      const dpr = window.devicePixelRatio || 1;
      points.forEach((p, i) => {
        ctx.fillStyle = i % 5 ? 'rgba(58,63,184,.5)' : '#f9ac43';
        ctx.beginPath();
        ctx.arc(p.x, p.y, (i % 5 ? 2 : 3) * dpr, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // 3. CTA Band Canvas
  useEffect(() => {
    const canvas = ctaCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let points: Array<{ x: number; y: number; vx: number; vy: number }> = [];

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      width = canvas.width = rect.width * dpr;
      height = canvas.height = rect.height * dpr;
      points = Array.from({ length: 40 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4 * dpr,
        vy: (Math.random() - 0.5) * 0.4 * dpr,
      }));
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const maxDist = 120 * (window.devicePixelRatio || 1);

      points.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      });

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i];
          const b = points[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < maxDist) {
            ctx.strokeStyle = `rgba(40,36,95,${(1 - dist / maxDist) * 0.18})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      points.forEach((p, i) => {
        ctx.fillStyle = i % 4 ? 'rgba(40,36,95,.35)' : 'rgba(255,255,255,.8)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // 3D Perspective Tilt for Visual Card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = visualCardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -6;
    const rotY = ((x - cx) / cx) * 6;
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out',
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease-out',
    });
  };

  // Keyboard Escape listener for Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalVideoId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Newsletter Submit Handler
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
    }
  };

  // Extract clean YouTube ID
  const parseVideoId = (url: string | undefined): string => {
    if (!url) return 'dQw4w9WgXcQ';
    if (!url.includes('/') && !url.includes('.')) return url;
    const match = url.match(/(?:embed\/|v=|vi\/|youtu\.be\/|\/v\/|watch\?v=)([^#&?]*)/);
    return match && match[1] ? match[1] : 'dQw4w9WgXcQ';
  };

  return (
    <div className="dcs-portfolio-page-deck">
      {/* ================= HERO SHELL ================= */}
      <section className="dcs-hero-section dcs-section-hero">
        <div className="hero-shell">
        <canvas id="portfolio-hero-particles" ref={heroCanvasRef} />

        {/* Top Breadcrumb */}
        <div className="hero-top-bar">
          <div className="hero-crumbs">
            <Link href="/">Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--navy-800)', fontWeight: 700 }}>Delivered Work</span>
          </div>
        </div>

        {/* Hero Content */}
        <div className="hero">
          <div>
            <span className="tag">
              <i /> Delivered Work
            </span>
            <h1>
              Enterprise <span className="hl">portfolio</span> &amp;{' '}
              <span className="gold">case studies</span>
            </h1>
            <p className="lead">
              Real-world projects delivered for enterprise clients — from secure web portals and AI
              agents to 3D explainers and brand identities.
            </p>
            <div className="actions">
              <a href="#work" className="btn btn-outline">
                View Case Studies{' '}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </a>
              <Link href="/contact" className="btn btn-blue">
                Start Your Project{' '}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </Link>
            </div>
            <div className="stats">
              <div className="stat">
                <b>4</b>
                <span>Featured Projects</span>
              </div>
              <div className="stat">
                <b>4</b>
                <span>Disciplines</span>
              </div>
              <div className="stat">
                <b>
                  100<em>%</em>
                </b>
                <span>Verified</span>
              </div>
            </div>
          </div>

          {/* Visual Card */}
          <div
            className="visual"
            ref={visualCardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={tiltStyle}
          >
            <canvas id="net" ref={netCanvasRef} />
            <div className="hero-visual-grid">
              <div
                style={{
                  width: '58%',
                  aspectRatio: '1',
                  borderRadius: '60px',
                  display: 'grid',
                  placeItems: 'center',
                  color: 'var(--gold)',
                  background: 'linear-gradient(135deg, var(--navy-600), var(--navy-900))',
                  boxShadow: '0 40px 60px -24px rgba(28,25,73,.6)',
                  animation: 'dcsPortFloat 6s ease-in-out infinite',
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ width: '50%', height: '50%' }}
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                </svg>
              </div>
            </div>
            <div className="chip c1">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              </svg>{' '}
              Verified Engagements
            </div>
            <div className="chip c2">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
              </svg>{' '}
              Production Ready
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* ================= CASE STUDIES GRID ================= */}
      <section className="section dcs-stacked-section" id="work">
        <div className="block" id="work-content">
        <div className="head">
          <span className="eyebrow">Case Studies</span>
          <h2>
            Work that <span className="u">speaks for itself</span>
          </h2>
        </div>

        {/* Filter Buttons */}
        <div className="filters">
          <button
            className={activeFilter === 'all' ? 'on' : ''}
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          <button
            className={activeFilter === 'video' ? 'on' : ''}
            onClick={() => setActiveFilter('video')}
          >
            Video Editing
          </button>
          <button
            className={activeFilter === 'design' ? 'on' : ''}
            onClick={() => setActiveFilter('design')}
          >
            Graphic Design
          </button>
          <button
            className={activeFilter === 'web' ? 'on' : ''}
            onClick={() => setActiveFilter('web')}
          >
            Web Development
          </button>
          <button
            className={activeFilter === 'ai' ? 'on' : ''}
            onClick={() => setActiveFilter('ai')}
          >
            AI Automation
          </button>
        </div>

        {/* Counter */}
        <p className="count">
          Showing {filteredProjects.length} of {projects.length}
        </p>

        {/* Cards Grid */}
        <div className="grid-svc grid-2">
          {filteredProjects.map((item, index) => {
            const hasVideo = Boolean(item.video_url);
            return (
              <article key={item.title || index} className="svc">
                <div className="ph-thumb">
                  <img src={item.cover_image} alt={item.title} loading="lazy" />
                  <span className="cat">{item.category}</span>
                  {hasVideo && (
                    <span
                      className="pl"
                      onClick={() => setModalVideoId(parseVideoId(item.video_url))}
                      role="button"
                      aria-label="Play video"
                      title="Play video"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 4v16l13-8z" />
                      </svg>
                    </span>
                  )}
                </div>
                <div className="client">{item.client_name}</div>
                <h3 style={{ marginTop: 6 }}>{item.title}</h3>
                <p>{item.description}</p>
                {item.tags && item.tags.length > 0 && (
                  <ul>
                    {item.tags.map((tag, tIdx) => (
                      <li key={tIdx}>{tag}</li>
                    ))}
                  </ul>
                )}
                <div className="badges" style={{ marginTop: 0 }}>
                  <span>✓ Verified Client Engagement</span>
                  <span className="p">● Production</span>
                </div>
                <Link href="/contact" className="svc-link">
                  Discuss a similar project{' '}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </Link>
              </article>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--grey-500)' }}>
            <p style={{ fontSize: 18, fontWeight: 600 }}>No case studies found in this category.</p>
          </div>
        )}
        </div>
      </section>

      {/* ================= NEWSLETTER CARD ================= */}
      <section className="section dcs-stacked-section" id="portfolio-newsletter">
        <div className="block">
        <div className="news">
          <div>
            <span className="eyebrow">Newsletter &amp; Briefings</span>
            <h2>
              Stay ahead with <span className="u">enterprise intelligence</span>
            </h2>
            <p>
              Weekly cybersecurity bulletins, zero-trust engineering insights and Academy updates
              — straight to your inbox.
            </p>
          </div>
          {newsletterSubscribed ? (
            <div
              style={{
                color: 'var(--navy-700)',
                fontWeight: 700,
                fontSize: '1.05rem',
                padding: '16px 20px',
                background: 'rgba(58,63,184,0.08)',
                borderRadius: '99px',
                display: 'inline-block',
              }}
            >
              ✓ Thanks! You are subscribed.
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                required
                placeholder="Your work email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
              />
              <button type="submit" className="btn btn-blue">
                Subscribe{' '}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </button>
            </form>
          )}
        </div>
        </div>
      </section>

      {/* ================= WARM GOLD CTA BAND ================= */}
      <section className="section dcs-stacked-section" id="portfolio-cta">
        <div className="block">
        <div className="cta-band">
          <canvas id="portfolio-cta-particles" ref={ctaCanvasRef} />
          <div>
            <h2>Next batch is enrolling now</h2>
            <p>Reserve your seat today — limited seats per batch for personal mentorship.</p>
          </div>
          <div className="cta-actions">
            <a
              href={`https://wa.me/${cleanWhatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              WhatsApp Us{' '}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
            </a>
            <Link href="/contact?type=admission" className="btn btn-blue">
              Submit Admission Inquiry{' '}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
            </Link>
          </div>
        </div>
        </div>
      </section>

      {/* ================= VIDEO MODAL ================= */}
      {modalVideoId && (
        <div
          className="modal on"
          id="modal"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalVideoId(null);
          }}
        >
          <div className="modal-wrap">
            <button
              className="modal-x"
              onClick={() => setModalVideoId(null)}
              aria-label="Close modal"
            >
              ×
            </button>
            <div className="modal-box">
              <iframe
                src={`https://www.youtube.com/embed/${modalVideoId}?autoplay=1&rel=0`}
                title="Case Study Video"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
