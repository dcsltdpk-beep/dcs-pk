'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export interface VideoItem {
  _id?: string;
  title: string;
  category: string;
  client_name?: string;
  cover_image?: string;
  video_type?: 'embed' | 'upload';
  video_source?: string;
  description?: string;
  order_num?: number;
}

interface VideosPageClientProps {
  initialVideos?: VideoItem[];
  whatsappNumber?: string;
}

// Helper: Extract YouTube ID from various YouTube URL formats or raw 11-char IDs
function getYouTubeId(url: string | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? match[1] : null;
}

// Helper: Resolve authentic video thumbnail (never dummy stock/unsplash photos)
function getVideoThumbnail(video: VideoItem): string {
  // If custom user upload or non-stock image is provided, use it
  if (video.cover_image && !video.cover_image.includes('unsplash.com')) {
    return video.cover_image;
  }
  // Extract YouTube ID from video_source
  const ytId = getYouTubeId(video.video_source);
  if (ytId) {
    return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  }
  return 'https://img.youtube.com/vi/inWWhr5tnEA/hqdefault.jpg';
}

const DEFAULT_VIDEOS: VideoItem[] = [
  {
    title: 'Dream Cyber Security Corporate Overview 2026',
    category: 'Company Videos',
    client_name: 'DCS Media',
    cover_image: 'https://img.youtube.com/vi/inWWhr5tnEA/hqdefault.jpg',
    video_source: 'inWWhr5tnEA',
    description: 'Executive introduction to our mission, cyber-defense capabilities and technology standards.',
  },
  {
    title: 'Academy Showcase: AI Automation in Practice',
    category: 'Course Introduction Videos',
    client_name: 'DCS Media',
    cover_image: 'https://img.youtube.com/vi/CWxoDT05ED0/hqdefault.jpg',
    video_source: 'CWxoDT05ED0',
    description: 'How our Academy trains professionals to deploy enterprise automations and intelligent bots.',
  },
  {
    title: 'Student Project: Cloud Incident Detection System',
    category: 'Student Projects & Work',
    client_name: 'DCS Media',
    cover_image: 'https://img.youtube.com/vi/3Kq1MIfTWCE/hqdefault.jpg',
    video_source: '3Kq1MIfTWCE',
    description: 'An automated anomaly-detection script built by our web & security batch students.',
  },
  {
    title: 'Educational Guide: Defending Against Social Engineering',
    category: 'Tutorials & Educational',
    client_name: 'DCS Media',
    cover_image: 'https://img.youtube.com/vi/hXSFdwIOfnE/hqdefault.jpg',
    video_source: 'hXSFdwIOfnE',
    description: 'Guidance for corporate teams on protecting credentials from phishing attacks.',
  },
];

export default function VideosPageClient({
  initialVideos = [],
  whatsappNumber = '923165478855',
}: VideosPageClientProps) {
  // Normalize videos ensuring authentic video thumbnails instead of dummy stock
  const videos: VideoItem[] = (
    initialVideos && initialVideos.length > 0 ? initialVideos : DEFAULT_VIDEOS
  ).map((v, idx) => {
    const fallback = DEFAULT_VIDEOS[idx % DEFAULT_VIDEOS.length];
    const source = v.video_source || fallback.video_source;
    const resolvedThumb =
      v.cover_image && !v.cover_image.includes('unsplash.com')
        ? v.cover_image
        : getVideoThumbnail({ ...v, video_source: source });

    return {
      ...v,
      cover_image: resolvedThumb,
      client_name: v.client_name || fallback.client_name,
      video_source: source,
      description: v.description || fallback.description,
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

  // Filter logic matching videos.html categories
  const filteredVideos = videos.filter((video) => {
    if (activeFilter === 'all') return true;
    const cat = (video.category || '').toLowerCase();
    if (activeFilter === 'company') return cat.includes('company');
    if (activeFilter === 'course') return cat.includes('course') || cat.includes('intro');
    if (activeFilter === 'student') return cat.includes('student') || cat.includes('project');
    if (activeFilter === 'tutorial') return cat.includes('tutorial') || cat.includes('edu');
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

  // 2. Visual Card Circuit Canvas
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

  const openModal = (url: string | undefined) => {
    const id = getYouTubeId(url);
    setModalVideoId(id || 'inWWhr5tnEA');
  };

  return (
    <div className="dcs-videos-page-deck">
      {/* ================= HERO SHELL ================= */}
      <section className="dcs-hero-section dcs-section-hero">
        <div className="hero-shell">
        <canvas id="videos-hero-particles" ref={heroCanvasRef} />

        {/* Top Breadcrumb */}
        <div className="hero-top-bar">
          <div className="hero-crumbs">
            <Link href="/">Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--navy-800)', fontWeight: 700 }}>Visual Insights</span>
          </div>
        </div>

        {/* Hero Grid */}
        <div className="hero">
          <div>
            <span className="tag">
              <i /> Visual Insights
            </span>
            <h1>
              Featured <span className="hl">video</span> <span className="gold">gallery</span>
            </h1>
            <p className="lead">
              Company films, course introductions, student projects and security tutorials — see
              Dream Cyber Security in action.
            </p>
            <div className="actions">
              <a href="#gallery" className="btn btn-outline">
                Browse Videos{' '}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </a>
              <Link href="/academy" className="btn btn-blue">
                Explore Academy{' '}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </Link>
            </div>
            <div className="stats">
              <div className="stat">
                <b>4</b>
                <span>Videos</span>
              </div>
              <div className="stat">
                <b>4</b>
                <span>Categories</span>
              </div>
              <div className="stat">
                <b>HD</b>
                <span>Quality</span>
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
                  animation: 'dcsVidFloat 6s ease-in-out infinite',
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
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <path d="m10 8 6 4-6 4z" />
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
              Tech Showreels
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
              Tutorials &amp; Demos
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* ================= VIDEOS SHOWCASE GRID ================= */}
      <section className="section dcs-stacked-section" id="gallery">
        <div className="block" id="gallery-content">
        <div className="head">
          <span className="eyebrow">Watch &amp; Learn</span>
          <h2>
            Stories, demos &amp; <span className="u">tutorials</span>
          </h2>
        </div>

        {/* Filters */}
        <div className="filters">
          <button
            className={activeFilter === 'all' ? 'on' : ''}
            onClick={() => setActiveFilter('all')}
          >
            All Showcase
          </button>
          <button
            className={activeFilter === 'company' ? 'on' : ''}
            onClick={() => setActiveFilter('company')}
          >
            Company Videos
          </button>
          <button
            className={activeFilter === 'course' ? 'on' : ''}
            onClick={() => setActiveFilter('course')}
          >
            Course Introduction Videos
          </button>
          <button
            className={activeFilter === 'student' ? 'on' : ''}
            onClick={() => setActiveFilter('student')}
          >
            Student Projects &amp; Work
          </button>
          <button
            className={activeFilter === 'tutorial' ? 'on' : ''}
            onClick={() => setActiveFilter('tutorial')}
          >
            Tutorials &amp; Educational
          </button>
        </div>

        {/* Count indicator */}
        <p className="count">
          Showing {filteredVideos.length} of {videos.length}
        </p>

        {/* Grid */}
        <div className="grid-svc grid-2" id="vgrid">
          {filteredVideos.map((item, index) => {
            const thumbUrl = getVideoThumbnail(item);
            return (
              <article key={item.title || index} className="svc">
                <div
                  className="ph-thumb"
                  onClick={() => openModal(item.video_source)}
                  role="button"
                  aria-label={`Play ${item.title}`}
                  title="Click to play video"
                >
                  <img
                    src={thumbUrl}
                    alt={item.title}
                    loading="lazy"
                    onError={(e) => {
                      const ytId = getYouTubeId(item.video_source);
                      if (ytId && !e.currentTarget.src.includes('hqdefault.jpg')) {
                        e.currentTarget.src = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
                      }
                    }}
                  />
                  <span className="cat">{item.category}</span>
                  <span className="pl">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 4v16l13-8z" />
                    </svg>
                  </span>
                </div>
                <div className="client">{item.client_name || 'DCS Media'}</div>
                <h3 style={{ marginTop: 6 }}>{item.title}</h3>
                {item.description && <p>{item.description}</p>}
                <button
                  type="button"
                  className="svc-link"
                  onClick={() => openModal(item.video_source)}
                >
                  Watch Video{' '}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </button>
              </article>
            );
          })}
        </div>

        {filteredVideos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--grey-500)' }}>
            <p style={{ fontSize: 18, fontWeight: 600 }}>No videos found in this category.</p>
          </div>
        )}
        </div>
      </section>

      {/* ================= NEWSLETTER CARD ================= */}
      <section className="section dcs-stacked-section" id="videos-newsletter">
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
      <section className="section dcs-stacked-section" id="videos-cta">
        <div className="block">
        <div className="cta-band">
          <canvas id="videos-cta-particles" ref={ctaCanvasRef} />
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
                title="Video Showcase Player"
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
