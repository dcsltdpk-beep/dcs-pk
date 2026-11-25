'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa6';
import { ArrowUpRight, FileText, ShieldAlert, Newspaper, Calendar, Clock, CheckCircle2 } from 'lucide-react';

interface BlogPost {
  _id?: string;
  title: string;
  slug: string;
  category: string;
  tags?: string;
  excerpt: string;
  content?: string;
  featured_image?: string;
  read_time?: string;
  published_at?: string | Date;
  is_published?: boolean;
  is_featured?: boolean;
}

interface BlogPageClientProps {
  initialPosts?: BlogPost[];
  whatsappNumber?: string;
  whatsappMessage?: string;
}

const DEFAULT_POSTS: BlogPost[] = [
  {
    title: 'Top 5 Cybersecurity Essentials Every Business Must Implement in 2026',
    slug: 'top-5-cybersecurity-essentials-2026',
    category: 'Cybersecurity Tips',
    excerpt: 'The critical security controls and organisational hygiene every business needs to defend against ransomware and data exfiltration.',
    featured_image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1000&q=80',
    read_time: '6 min read',
    published_at: '2026-11-17T00:00:00.000Z',
    is_published: true,
    is_featured: true,
  },
  {
    title: 'Dream Cyber Security Expands Operations Across Pakistan',
    slug: 'dream-cyber-security-expands-pakistan',
    category: 'Company News',
    excerpt: 'We are expanding our enterprise cyber defense and technology consulting to support growing businesses across Pakistan.',
    featured_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&q=80',
    read_time: '3 min read',
    published_at: '2026-11-17T00:00:00.000Z',
    is_published: true,
    is_featured: false,
  },
];

export default function BlogPageClient({
  initialPosts = [],
  whatsappNumber = '923165478855',
  whatsappMessage = 'Hello Dream Cyber Security Pakistan, I would like to learn more about your cyber threat intelligence & advisories.',
}: BlogPageClientProps) {
  // Canvas refs
  const heroParticlesRef = useRef<HTMLCanvasElement>(null);
  const netCanvasRef = useRef<HTMLCanvasElement>(null);
  const ctaParticlesRef = useRef<HTMLCanvasElement>(null);
  const visualCardRef = useRef<HTMLDivElement>(null);

  // Active category filter state
  const [activeFilter, setActiveFilter] = useState('all');

  // Newsletter subscription state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Stats counter animation
  const [statCategories, setStatCategories] = useState('2');

  // Combined posts list
  const postsList = useMemo(() => {
    if (!initialPosts || initialPosts.length === 0) {
      return DEFAULT_POSTS;
    }
    return initialPosts.map((p) => {
      // Provide default fallback images and read time if missing
      const matchDefault = DEFAULT_POSTS.find((d) => d.slug === p.slug);
      const featured_image =
        p.featured_image ||
        matchDefault?.featured_image ||
        (p.category?.toLowerCase().includes('news')
          ? 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&q=80'
          : 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1000&q=80');
      const read_time = p.read_time || matchDefault?.read_time || '5 min read';
      const published_at = p.published_at || matchDefault?.published_at || 'Nov 17, 2026';

      return {
        ...p,
        featured_image,
        read_time,
        published_at,
      };
    });
  }, [initialPosts]);

  // Featured post: the one with is_featured, or the first post
  const featuredPost = useMemo(() => {
    return postsList.find((p) => p.is_featured) || postsList[0] || DEFAULT_POSTS[0];
  }, [postsList]);

  // Available unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    postsList.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    // Ensure the default canonical ones are included
    cats.add('Cybersecurity Tips');
    cats.add('Company News');
    return Array.from(cats);
  }, [postsList]);

  // Filtered posts
  const filteredPosts = useMemo(() => {
    if (activeFilter === 'all') {
      return postsList;
    }
    return postsList.filter(
      (p) => p.category?.toLowerCase() === activeFilter.toLowerCase()
    );
  }, [postsList, activeFilter]);

  // Dynamic WhatsApp link
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

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
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', pResize);
      observer?.disconnect();
    };
  }, []);

  /* -------------------------------------------------------------
     2. Circuit Network Canvas inside the Visual Card
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
      ctx.clearRect(0, 0, W, H);
      const max = W * 0.28;

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
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < max) {
            ctx.strokeStyle = `rgba(58,63,184,${(1 - d / max) * 0.26})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      const d = Math.min(window.devicePixelRatio || 1, 1.5);
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
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      observer?.disconnect();
    };
  }, []);

  /* -------------------------------------------------------------
     3. 3D Perspective Tilt on Visual Card
  ------------------------------------------------------------- */
  useEffect(() => {
    const card = visualCardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = -(y / (rect.height / 2)) * 6;
      const rotateY = (x / (rect.width / 2)) * 6;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  /* -------------------------------------------------------------
     4. Floating Particles on Warm Gold CTA Band
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
      pts = Array.from({ length: 36 }, () => ({
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
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < m) {
            cx.strokeStyle = `rgba(40,36,95,${(1 - d / m) * 0.18})`;
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
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', rs);
      observer?.disconnect();
    };
  }, []);

  /* -------------------------------------------------------------
     5. Categories Count
  ------------------------------------------------------------- */
  useEffect(() => {
    setStatCategories(categories.length.toString());
  }, [categories]);

  // Format date helper
  const formatDate = (dateVal?: string | Date) => {
    if (!dateVal) return 'Nov 17, 2026';
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return String(dateVal);
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return String(dateVal);
    }
  };

  // Newsletter submission
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setIsSubscribed(true);
  };

  return (
    <div className="dcs-blog-page-deck">
      {/* ================= HERO SECTION ================= */}
      <section className="dcs-hero-section dcs-section-hero">
        <div className="hero-shell">
        <canvas ref={heroParticlesRef} id="blog-hero-particles" />

        {/* Top Breadcrumb Bar */}
        <div className="hero-top-bar">
          <div className="hero-crumbs">
            <Link href="/">Home</Link>
            <span>/</span>
            <strong>Threat Advisories &amp; News</strong>
          </div>
        </div>

        <div className="hero">
          <div>
            <span className="tag">
              <i /> Threat Advisories &amp; News
            </span>
            <h1>
              Latest <span className="hl">insights</span> &amp; <span className="gold">updates</span>
            </h1>
            <p className="lead">
              Cybersecurity advisories, threat intelligence, engineering insights and company news from the Dream Cyber Security team.
            </p>
            <div className="actions">
              <a href="#posts" className="btn btn-outline">
                Read Latest <ArrowUpRight />
              </a>
              <a href="#subscribe" className="btn btn-blue">
                Get Weekly Bulletin <ArrowUpRight />
              </a>
            </div>
            <div className="stats">
              <div className="stat">
                <b>Weekly</b>
                <span>Bulletins</span>
              </div>
              <div className="stat">
                <b>{statCategories}</b>
                <span>Categories</span>
              </div>
              <div className="stat">
                <b>Free</b>
                <span>Access</span>
              </div>
            </div>
          </div>

          {/* Visual Card with Floating Document Badge */}
          <div ref={visualCardRef} className="visual">
            <canvas ref={netCanvasRef} id="net" />
            <div className="hero-visual-grid">
              <div className="hero-doc-badge">
                <FileText />
              </div>
            </div>
            <div className="chip c1">
              <ShieldAlert size={18} /> Threat Intelligence
            </div>
            <div className="chip c2">
              <Newspaper size={18} /> Weekly Advisories
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* ================= POSTS & ADVISORIES SECTION ================= */}
      <section className="section dcs-stacked-section" id="posts">
        <div className="block" id="posts-content">
        <div className="head">
          <span className="eyebrow">From the Desk</span>
          <h2>
            Advisories &amp; <span className="u">news</span>
          </h2>
        </div>

        {/* Featured Post Card */}
        {featuredPost && (
          <article className="featured-post">
            <div className="ph-thumb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featuredPost.featured_image}
                alt={featuredPost.title}
                loading="eager"
              />
              <span className="cat">⭐ Featured · {featuredPost.category}</span>
            </div>
            <div className="fp-body">
              <div className="meta">
                <b>{featuredPost.category}</b>
                <span>{formatDate(featuredPost.published_at)}</span>
                <span>{featuredPost.read_time || '6 min read'}</span>
              </div>
              <h3>{featuredPost.title}</h3>
              <p>{featuredPost.excerpt}</p>
              <Link href={`/blog/${featuredPost.slug}`} className="btn btn-blue">
                Read Advisory <ArrowUpRight />
              </Link>
            </div>
          </article>
        )}

        {/* Category Filter Tabs */}
        <div className="filters">
          <button
            type="button"
            className={activeFilter === 'all' ? 'on' : ''}
            onClick={() => setActiveFilter('all')}
          >
            All Posts
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={activeFilter.toLowerCase() === cat.toLowerCase() ? 'on' : ''}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="grid-svc grid-2" id="bgrid">
          {filteredPosts.map((post) => (
            <article key={post.slug || post.title} className="svc">
              <div className="ph-thumb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.featured_image}
                  alt={post.title}
                  loading="lazy"
                />
                <span className="cat">{post.category}</span>
              </div>
              <div className="meta">
                <span>{formatDate(post.published_at)}</span>
                <span>{post.read_time || '5 min read'}</span>
              </div>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="svc-link">
                Read More <ArrowUpRight />
              </Link>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--grey-500)', fontSize: '16px' }}>
            No advisories found in this category.
          </div>
        )}
        </div>
      </section>

      {/* ================= NEWSLETTER & BRIEFINGS SECTION ================= */}
      <section className="section dcs-stacked-section" id="subscribe">
        <div className="block" id="subscribe-content">
        <div className="news">
          <div>
            <span className="eyebrow">Newsletter &amp; Briefings</span>
            <h2>
              Stay ahead with <span className="u">enterprise intelligence</span>
            </h2>
            <p>
              Weekly cybersecurity bulletins, zero-trust engineering insights and Academy updates — straight to your inbox.
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
                  placeholder="Your work email"
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

      {/* ================= WARM GOLD CTA BAND ================= */}
      <section className="section dcs-stacked-section" id="blog-cta">
        <div className="block">
        <div className="cta-band">
          <canvas ref={ctaParticlesRef} id="blog-cta-particles" />
          <div>
            <h2>Next batch is enrolling now</h2>
            <p>Reserve your seat today — limited seats per batch for personal mentorship.</p>
          </div>
          <div className="cta-actions">
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              <FaWhatsapp size={17} style={{ color: '#25D366' }} /> WhatsApp Us <ArrowUpRight />
            </a>
            <Link href="/contact?type=admission" className="btn btn-blue">
              Submit Admission Inquiry <ArrowUpRight />
            </Link>
          </div>
        </div>
        </div>
      </section>
    </div>
  );
}
