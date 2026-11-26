'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Calendar, Clock, Share2, Check, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { FaWhatsapp, FaLinkedinIn, FaXTwitter, FaFacebookF } from 'react-icons/fa6';

export interface BlogPostDetail {
  _id?: string;
  title: string;
  slug: string;
  category: string;
  tags?: string;
  featured_image?: string;
  excerpt: string;
  content: string;
  author_name?: string;
  author_role?: string;
  author_avatar?: string;
  read_time?: string;
  is_featured?: boolean;
  status?: string;
  is_published?: boolean;
  published_at?: string | Date;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
}

export interface RelatedPost {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  featured_image?: string;
  read_time?: string;
  published_at?: string | Date;
}

interface BlogPostClientProps {
  post: BlogPostDetail;
  relatedPosts: RelatedPost[];
  whatsappNumber?: string;
  isPreview?: boolean;
}

export default function BlogPostClient({
  post,
  relatedPosts,
  whatsappNumber = '923165478855',
  isPreview = false,
}: BlogPostClientProps) {
  const [copied, setCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Canvas refs for signature DCS particle animations
  const heroParticlesRef = useRef<HTMLCanvasElement>(null);

  // Format date helper
  const formatDate = (val?: string | Date | null) => {
    if (!val) return 'Nov 17, 2026';
    try {
      const d = new Date(val);
      if (isNaN(d.getTime())) return String(val);
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return String(val);
    }
  };

  // Scroll reading progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* -------------------------------------------------------------
     1. Digital Particles Canvas on Hero Shell (Matching /blog)
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
      dots = Array.from({ length: 48 }, () => ({
        x: Math.random() * PW,
        y: Math.random() * PH,
        r: (Math.random() * 2 + 1.2) * d,
        vx: (Math.random() - 0.5) * 0.45 * d,
        vy: (Math.random() - 0.5) * 0.45 * d,
        t: Math.random() * Math.PI * 2,
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
        p.t += 0.02;
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
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', pResize);
      observer?.disconnect();
    };
  }, []);

  // Current page URL for sharing
  const postUrl = typeof window !== 'undefined' ? window.location.href : `https://www.dreamcybersecurity.pk/blog/${post.slug}`;
  const encodedUrl = encodeURIComponent(postUrl);
  const encodedTitle = encodeURIComponent(post.title);

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20-%20${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  };

  const defaultAuthorAvatar = post.author_avatar || '/logo.png';
  const defaultAuthorName = post.author_name || 'DCS Cyber Threat Research Team';
  const defaultAuthorRole = post.author_role || 'Principal Threat Intelligence Architect';

  // Newsletter form handler
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setIsSubscribed(true);
  };

  return (
    <div className="dcs-blog-page-deck">
      {/* Top Reading Progress Bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '4px',
          width: `${readingProgress}%`,
          backgroundColor: 'var(--blue, #3a3fb8)',
          boxShadow: '0 0 12px rgba(58, 63, 184, 0.6)',
          zIndex: 9999,
          transition: 'width 0.1s ease',
        }}
      />

      {/* Preview Mode Alert Banner */}
      {isPreview && (
        <div
          style={{
            backgroundColor: '#fef3c7',
            borderBottom: '2px solid #f59e0b',
            color: '#92400e',
            fontWeight: 700,
            fontSize: '0.9rem',
            padding: '12px 1.5rem',
            textAlign: 'center',
            position: 'sticky',
            top: '70px',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            flexWrap: 'wrap',
          }}
        >
          <span>👀 Article Preview Mode (Draft / Scheduled)</span>
          <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>
            &bull; This article is not yet publicly visible to external visitors.
          </span>
          <Link
            href="/admin/posts"
            style={{
              padding: '3px 10px',
              backgroundColor: '#92400e',
              color: '#ffffff',
              borderRadius: '6px',
              fontSize: '0.78rem',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Back to Admin &rarr;
          </Link>
        </div>
      )}

      {/* ================= HERO HEADER ================= */}
      <section className="dcs-hero-section dcs-section-hero" style={{ paddingBottom: '3.5rem' }}>
        <div className="hero-shell" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <canvas ref={heroParticlesRef} id="blog-hero-particles" />

          {/* Top Breadcrumb Bar */}
          <div className="hero-top-bar" style={{ marginBottom: '1.75rem' }}>
            <div className="hero-crumbs">
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/blog">Threat Advisories &amp; News</Link>
              <span>/</span>
              <strong style={{ color: 'var(--navy-900)' }}>{post.category || 'Advisories'}</strong>
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 2 }}>
            {/* Category Tag (Matching /blog signature tag) */}
            <div style={{ marginBottom: '1.25rem' }}>
              <span className="tag">
                <i /> {post.category || 'Cybersecurity Advisories'}
              </span>
            </div>

            {/* Article Title */}
            <h1
              style={{
                fontSize: 'clamp(32px, 4.4vw, 54px)',
                fontWeight: 800,
                lineHeight: '1.18',
                letterSpacing: '-0.02em',
                color: 'var(--navy-800)',
                margin: '18px 0 24px 0',
                textTransform: 'none',
              }}
            >
              {post.title}
            </h1>

            {/* Meta Row: Date, Read Time & Author Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                flexWrap: 'wrap',
                marginTop: '1.5rem',
              }}
            >
              {/* Date Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: 'var(--navy-700)',
                  backgroundColor: '#ffffff',
                  padding: '7px 16px',
                  borderRadius: '99px',
                  border: '1px solid var(--grey-200)',
                  boxShadow: '0 4px 12px -4px rgba(28, 25, 73, 0.12)',
                }}
              >
                <Calendar size={15} style={{ color: 'var(--blue)' }} />
                <span>{formatDate(post.published_at)}</span>
              </div>

              {/* Reading Time Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: 'var(--navy-700)',
                  backgroundColor: '#ffffff',
                  padding: '7px 16px',
                  borderRadius: '99px',
                  border: '1px solid var(--grey-200)',
                  boxShadow: '0 4px 12px -4px rgba(28, 25, 73, 0.12)',
                }}
              >
                <Clock size={15} style={{ color: 'var(--blue)' }} />
                <span>{post.read_time || '5 min read'}</span>
              </div>

              {/* Author Pill */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '6px 18px 6px 8px',
                  borderRadius: '99px',
                  backgroundColor: '#ffffff',
                  border: '1.5px solid var(--grey-200)',
                  boxShadow: '0 6px 18px -6px rgba(28, 25, 73, 0.15)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={defaultAuthorAvatar}
                  alt={defaultAuthorName}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid var(--gold)',
                  }}
                />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--navy-800)', fontSize: '0.88rem' }}>
                    {defaultAuthorName}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--grey-500)' }}>
                    {defaultAuthorRole}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAIN ARTICLE BODY SECTION ================= */}
      <section className="section dcs-stacked-section" style={{ paddingTop: '0', paddingBottom: '3rem' }}>
        <div className="block" style={{ maxWidth: '1020px', margin: '0 auto', padding: '0 1.5rem' }}>
          {/* Featured Cover Image */}
          {post.featured_image && (
            <div
              style={{
                width: '100%',
                maxHeight: '520px',
                borderRadius: '28px',
                overflow: 'hidden',
                boxShadow: '0 25px 60px -20px rgba(28, 25, 73, 0.25)',
                border: '1.5px solid var(--grey-200)',
                marginBottom: '3rem',
                backgroundColor: 'var(--navy-900)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.featured_image}
                alt={post.title}
                style={{ width: '100%', height: '100%', maxHeight: '520px', objectFit: 'cover', display: 'block' }}
              />
            </div>
          )}

          {/* Social Share Floating Ribbon */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.1rem 1.75rem',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1.5px solid var(--grey-200)',
              boxShadow: '0 10px 30px -12px rgba(28, 25, 73, 0.12)',
              marginBottom: '2.75rem',
              flexWrap: 'wrap',
              gap: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--navy-800)', fontWeight: 700, fontSize: '0.96rem' }}>
              <Share2 size={19} style={{ color: 'var(--blue)' }} />
              <span>Share this Advisory / Article</span>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <a
                href={shareLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on WhatsApp"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#25D366',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  transition: 'transform 0.2s ease',
                  boxShadow: '0 4px 10px rgba(37, 211, 102, 0.3)',
                }}
              >
                <FaWhatsapp size={18} />
              </a>

              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on LinkedIn"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#0077b5',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  transition: 'transform 0.2s ease',
                  boxShadow: '0 4px 10px rgba(0, 119, 181, 0.3)',
                }}
              >
                <FaLinkedinIn size={16} />
              </a>

              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on X / Twitter"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#000000',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  transition: 'transform 0.2s ease',
                }}
              >
                <FaXTwitter size={15} />
              </a>

              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on Facebook"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#1877f2',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  transition: 'transform 0.2s ease',
                  boxShadow: '0 4px 10px rgba(24, 119, 242, 0.3)',
                }}
              >
                <FaFacebookF size={15} />
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                title="Copy Article Link"
                style={{
                  padding: '8px 16px',
                  borderRadius: '99px',
                  backgroundColor: copied ? '#10b981' : 'var(--navy-800)',
                  color: '#ffffff',
                  border: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(28, 25, 73, 0.2)',
                }}
              >
                {copied ? <Check size={14} /> : null}
                <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Lead Executive Excerpt Callout */}
          {post.excerpt && (
            <div
              style={{
                fontSize: '1.22rem',
                lineHeight: '1.8',
                color: 'var(--navy-800)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1.5px solid var(--grey-200)',
                borderLeftWidth: '6px',
                borderLeftColor: 'var(--gold)',
                padding: '1.75rem 2.25rem',
                borderRadius: '0 20px 20px 0',
                marginBottom: '3rem',
                fontStyle: 'italic',
                boxShadow: '0 15px 40px -20px rgba(240, 154, 42, 0.2)',
              }}
            >
              {post.excerpt}
            </div>
          )}

          {/* Rich Article Body Content (High contrast, clearly visible text) */}
          <div
            className="dcs-article-content"
            style={{
              padding: 'clamp(2rem, 4.5vw, 4rem)',
              borderRadius: '28px',
              backgroundColor: '#ffffff',
              border: '1.5px solid var(--grey-200)',
              boxShadow: '0 30px 70px -30px rgba(28, 25, 73, 0.12)',
              marginBottom: '3.5rem',
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags Cloud */}
          {post.tags && (
            <div
              style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
                alignItems: 'center',
                padding: '1.5rem 2rem',
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                border: '1.5px solid var(--grey-200)',
                boxShadow: '0 10px 30px -15px rgba(28, 25, 73, 0.08)',
                marginBottom: '3.5rem',
              }}
            >
              <span style={{ color: 'var(--navy-800)', fontSize: '0.94rem', fontWeight: 700, marginRight: '4px' }}>
                Key Topics &amp; Tags:
              </span>
              {post.tags.split(',').map((tag, i) => (
                <span
                  key={i}
                  style={{
                    backgroundColor: 'rgba(58, 63, 184, 0.06)',
                    color: 'var(--blue, #3a3fb8)',
                    padding: '7px 16px',
                    borderRadius: '99px',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    border: '1px solid rgba(58, 63, 184, 0.15)',
                  }}
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}

          {/* Author Bio Box */}
          <div
            style={{
              display: 'flex',
              gap: '2rem',
              alignItems: 'center',
              padding: '2.25rem',
              borderRadius: '24px',
              backgroundColor: '#ffffff',
              border: '1.5px solid var(--grey-200)',
              boxShadow: '0 20px 50px -20px rgba(28, 25, 73, 0.12)',
              marginBottom: '3.5rem',
              flexWrap: 'wrap',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={defaultAuthorAvatar}
              alt={defaultAuthorName}
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--gold)',
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1, minWidth: '260px' }}>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--blue)', fontWeight: 700 }}>
                Authored by Threat Analyst &amp; Technology Specialist
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy-800)', margin: '6px 0 8px 0' }}>
                {defaultAuthorName}
              </h3>
              <div style={{ color: 'var(--grey-500)', fontSize: '0.92rem', lineHeight: '1.65' }}>
                {defaultAuthorRole} at Dream Cyber Security Pakistan. Leading technical threat advisories, enterprise defense engineering, zero-trust infrastructure, and cybersecurity research.
              </div>
            </div>
          </div>

          {/* Navigation link back to all posts */}
          <div style={{ marginBottom: '2rem' }}>
            <Link
              href="/blog"
              className="btn btn-outline"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                fontSize: '0.92rem',
                fontWeight: 700,
              }}
            >
              <ArrowLeft size={17} />
              <span>Return to All Threat Advisories &amp; Intelligence Briefings</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= RELATED ARTICLES SECTION ================= */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="section dcs-stacked-section" style={{ backgroundColor: 'rgba(28, 25, 73, 0.02)', padding: '4.5rem 0' }}>
          <div className="block" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
            <div className="head" style={{ marginBottom: '2.5rem' }}>
              <span className="eyebrow">Related Briefings</span>
              <h2>
                More in <span className="u">{post.category || 'Threat Intelligence'}</span>
              </h2>
            </div>

            <div className="grid-svc grid-3">
              {relatedPosts.map((rel) => (
                <article key={rel.slug} className="svc">
                  <div className="ph-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        rel.featured_image ||
                        'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1000&q=80'
                      }
                      alt={rel.title}
                      loading="lazy"
                    />
                    <span className="cat">{rel.category}</span>
                  </div>
                  <div className="meta">
                    <span>{formatDate(rel.published_at)}</span>
                    <span>{rel.read_time || '5 min read'}</span>
                  </div>
                  <h3>{rel.title}</h3>
                  <p>{rel.excerpt}</p>
                  <Link href={`/blog/${rel.slug}`} className="svc-link">
                    Read Advisory <ArrowUpRight />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= NEWSLETTER & BRIEFINGS SECTION (Matching /blog) ================= */}
      <section className="section dcs-stacked-section" id="subscribe" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
        <div className="block" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div className="news">
            <div>
              <span className="eyebrow">Enterprise Intelligence</span>
              <h2>
                Stay ahead with <span className="u">weekly threat briefings</span>
              </h2>
              <p>
                Weekly cybersecurity bulletins, zero-trust engineering insights, and tech advisories — straight to your inbox.
              </p>
            </div>

            <div>
              {isSubscribed ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--navy-800)', fontWeight: 700, padding: '16px 20px', background: '#e9fbef', borderRadius: '18px', border: '1px solid #bfeccd' }}>
                  <CheckCircle2 style={{ color: '#15803d' }} size={22} />
                  <span>Thanks! You are subscribed to DCS Enterprise Bulletins.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit}>
                  <input
                    type="email"
                    required
                    placeholder="Enter your work email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                  />
                  <button type="submit" className="btn btn-blue">
                    Subscribe <ArrowUpRight />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= 9. SIGNATURE HOME PAGE CTA SECTION ================= */}
      <section className="section hm panel light">
        <div className="wrap panel-inner">
          <div className="hm-cta on-yellow rv in">
            <span className="lbl">Get in touch</span>
            <h2 className="title">
              Ready to fortify your enterprise &amp; <span className="mark">innovate with AI?</span>
            </h2>
            <p className="lead">
              Book a confidential cybersecurity evaluation, request a project proposal, or ask about
              the next Academy batch — our Lahore team replies within 2–4 business hours.
            </p>
            <div className="actions">
              <Link className="btn btn-blue" href="/contact?type=security_audit">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z" />
                </svg>{' '}
                Schedule Security Audit
              </Link>
              <Link className="btn btn-navy" href="/contact?type=quote">
                Request a Proposal{' '}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </Link>
              <a
                className="btn btn-wa"
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  'Hello Dream Cyber Security Pakistan, I would like to get in touch.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5z" />
                </svg>{' '}
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
