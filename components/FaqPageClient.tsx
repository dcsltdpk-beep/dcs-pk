'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa6';
import { ArrowUpRight, HelpCircle, Info, ShieldCheck, GraduationCap, Search, CheckCircle2 } from 'lucide-react';

interface FaqItem {
  _id?: string;
  question: string;
  answer: string;
  category: string;
  order_num?: number;
}

interface FaqPageClientProps {
  initialFaqs?: FaqItem[];
  whatsappNumber?: string;
  whatsappMessage?: string;
}

const DEFAULT_FAQS: FaqItem[] = [
  {
    question: 'How quickly can your team respond to security inquiries or project requests?',
    answer: 'Our team reviews every inquiry within 2–4 business hours. For urgent matters, use the WhatsApp button for faster help.',
    category: 'General',
    order_num: 1,
  },
  {
    question: 'Where is Dream Cyber Security located?',
    answer: 'Our headquarters is in Lahore, Pakistan, and we serve clients across Pakistan and the region.',
    category: 'General',
    order_num: 2,
  },
  {
    question: 'What cybersecurity services does Dream Cyber Security provide in Pakistan?',
    answer: 'We offer vulnerability assessment and penetration testing, zero-trust hardening, ISO 27001 readiness, incident response and continuous security audits for enterprises.',
    category: 'Services',
    order_num: 3,
  },
  {
    question: 'Do you provide custom software and web development?',
    answer: 'Yes. We build custom enterprise web applications, corporate websites, CRM/ERP modules and secure APIs that meet international performance and security standards.',
    category: 'Services',
    order_num: 4,
  },
  {
    question: 'Can we enroll or purchase courses directly online?',
    answer: 'The Academy section is for information only — courses can’t be bought or enrolled in online. For curriculum, schedules or corporate training, use “Contact for Details” or message us on WhatsApp.',
    category: 'Academy',
    order_num: 5,
  },
];

export default function FaqPageClient({
  initialFaqs = [],
  whatsappNumber = '923165478855',
  whatsappMessage = 'Hello Dream Cyber Security Pakistan, I have a question regarding your services and academy programs.',
}: FaqPageClientProps) {
  // Canvas refs
  const heroParticlesRef = useRef<HTMLCanvasElement>(null);
  const netCanvasRef = useRef<HTMLCanvasElement>(null);
  const ctaParticlesRef = useRef<HTMLCanvasElement>(null);
  const visualCardRef = useRef<HTMLDivElement>(null);

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');

  // Active section for sticky nav scrollspy
  const [activeNav, setActiveNav] = useState('general');

  // Newsletter subscription state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Merged FAQ list
  const faqsList = useMemo(() => {
    if (!initialFaqs || initialFaqs.length === 0) {
      return DEFAULT_FAQS;
    }
    return initialFaqs;
  }, [initialFaqs]);

  // Distinct categories in canonical order
  const categories = useMemo(() => {
    const canonicalOrder = ['General', 'Services', 'Academy'];
    const catsInFaqs = Array.from(new Set(faqsList.map((f) => f.category || 'General')));
    
    // Sort canonical first, then any extra custom categories
    return catsInFaqs.sort((a, b) => {
      const idxA = canonicalOrder.indexOf(a);
      const idxB = canonicalOrder.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [faqsList]);

  // Filtered FAQs based on search
  const filteredFaqsByCategory = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const result: Record<string, FaqItem[]> = {};

    categories.forEach((cat) => {
      const catItems = faqsList.filter((f) => (f.category || 'General').toLowerCase() === cat.toLowerCase());
      if (!q) {
        result[cat] = catItems;
      } else {
        result[cat] = catItems.filter(
          (f) =>
            f.question.toLowerCase().includes(q) ||
            f.answer.toLowerCase().includes(q) ||
            f.category.toLowerCase().includes(q)
        );
      }
    });

    return result;
  }, [categories, faqsList, searchQuery]);

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
     5. Scrollspy for Sticky FAQ Navigation
  ------------------------------------------------------------- */
  useEffect(() => {
    const handleScroll = () => {
      const groups = categories.map((cat) => document.getElementById(cat.toLowerCase()));
      for (let i = groups.length - 1; i >= 0; i--) {
        const g = groups[i];
        if (g) {
          const rect = g.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveNav(categories[i].toLowerCase());
            return;
          }
        }
      }
      if (categories[0]) {
        setActiveNav(categories[0].toLowerCase());
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories]);

  // Smooth scroll handler
  const scrollToGroup = (catId: string) => {
    setActiveNav(catId);
    const el = document.getElementById(catId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Category Icon helper
  const renderCategoryIcon = (catName: string) => {
    const lower = catName.toLowerCase();
    if (lower.includes('service')) {
      return <ShieldCheck size={18} />;
    }
    if (lower.includes('academy')) {
      return <GraduationCap size={18} />;
    }
    return <Info size={18} />;
  };

  // Newsletter submission
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setIsSubscribed(true);
  };

  return (
    <div className="dcs-faq-page-deck">
      {/* ================= HERO SECTION ================= */}
      <section className="dcs-hero-section dcs-section-hero">
        <div className="hero-shell">
        <canvas ref={heroParticlesRef} id="faq-hero-particles" />

        {/* Top Breadcrumb Bar */}
        <div className="hero-top-bar">
          <div className="hero-crumbs">
            <Link href="/">Home</Link>
            <span>/</span>
            <strong>Knowledgebase &amp; FAQ</strong>
          </div>
        </div>

        <div className="hero">
          <div>
            <span className="tag">
              <i /> Knowledgebase
            </span>
            <h1>
              Frequently asked <span className="hl">questions</span>
            </h1>
            <p className="lead">
              Quick answers about our cybersecurity services, software engineering and the DCS Skill Academy. Can’t find yours? Our desk replies within 2–4 business hours.
            </p>
            <div className="actions">
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                Ask on WhatsApp <ArrowUpRight />
              </a>
              <Link href="/contact" className="btn btn-blue">
                Contact Support <ArrowUpRight />
              </Link>
            </div>
            <div className="stats">
              <div className="stat">
                <b>
                  2<em>–</em>4h
                </b>
                <span>Response Time</span>
              </div>
              <div className="stat">
                <b>{categories.length}</b>
                <span>Topics</span>
              </div>
              <div className="stat">
                <b>
                  24<em>/</em>7
                </b>
                <span>WhatsApp Desk</span>
              </div>
            </div>
          </div>

          {/* Visual Card with Center Help/Question Mark Circle */}
          <div ref={visualCardRef} className="visual">
            <canvas ref={netCanvasRef} id="net" />
            <div className="hero-visual-grid">
              <div className="hero-faq-badge">
                <HelpCircle />
              </div>
            </div>
            <div className="chip c1">
              <ShieldCheck size={18} /> Corporate Answers
            </div>
            <div className="chip c2">
              <Info size={18} /> Knowledgebase
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* ================= SEARCH & KNOWLEDGEBASE SECTION ================= */}
      <section className="section dcs-stacked-section" id="faq-list">
        <div className="block">
        <div className="head">
          <span className="eyebrow">Help Center</span>
          <h2>
            How can we <span className="u">help?</span>
          </h2>
        </div>

        {/* Real-time Search Box */}
        <div className="search">
          <Search size={20} />
          <input
            id="faq-search"
            type="search"
            placeholder="Search questions…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* FAQ Two-Column Wrap */}
        <div className="faq-wrap">
          {/* Sticky Nav Sidebar */}
          <nav className="faq-nav">
            {categories.map((cat) => {
              const catId = cat.toLowerCase();
              const hasMatchingItems = (filteredFaqsByCategory[cat] || []).length > 0;
              if (searchQuery && !hasMatchingItems) return null;

              return (
                <a
                  key={cat}
                  className={activeNav === catId ? 'on' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToGroup(catId);
                  }}
                  role="button"
                  tabIndex={0}
                >
                  {renderCategoryIcon(cat)} {cat} Inquiries
                </a>
              );
            })}
          </nav>

          {/* Grouped Accordions */}
          <div>
            {categories.map((cat) => {
              const catId = cat.toLowerCase();
              const items = filteredFaqsByCategory[cat] || [];
              if (items.length === 0) return null;

              return (
                <div key={cat} className="faq-group" id={catId}>
                  <h3>
                    <span>{renderCategoryIcon(cat)}</span>
                    {cat} Inquiries
                  </h3>

                  {items.map((item, idx) => {
                    // Open first item in General by default if no search query
                    const isFirstDefault = !searchQuery && cat.toLowerCase() === 'general' && idx === 0;
                    // When searching, auto-open all matching items
                    const isOpen = isFirstDefault || Boolean(searchQuery);

                    return (
                      <details key={item._id || item.question} className="faq" open={isOpen}>
                        <summary>
                          <span>{item.question}</span>
                          <i>+</i>
                        </summary>
                        <p>{item.answer}</p>
                      </details>
                    );
                  })}
                </div>
              );
            })}

            {/* Empty Search Result State */}
            {Object.values(filteredFaqsByCategory).every((arr) => arr.length === 0) && (
              <div style={{ textAlign: 'center', padding: '50px 20px', background: '#fff', borderRadius: '24px', boxShadow: '0 20px 40px -32px rgba(28,25,73,0.3)' }}>
                <HelpCircle size={44} style={{ color: 'var(--blue)', marginBottom: '16px' }} />
                <h3 style={{ fontSize: '20px', color: 'var(--navy-800)', marginBottom: '8px' }}>No matching questions found</h3>
                <p style={{ color: 'var(--grey-500)', maxWidth: '420px', margin: '0 auto 20px' }}>
                  Can’t find what you’re looking for? Message our 24/7 security &amp; training desk on WhatsApp.
                </p>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-blue">
                  Ask Us on WhatsApp <ArrowUpRight />
                </a>
              </div>
            )}
          </div>
        </div>
        </div>
      </section>

      {/* ================= NEWSLETTER & BRIEFINGS SECTION ================= */}
      <section className="section dcs-stacked-section" id="faq-newsletter">
        <div className="block">
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
      <section className="section dcs-stacked-section" id="faq-cta">
        <div className="block">
        <div className="cta-band">
          <canvas ref={ctaParticlesRef} id="faq-cta-particles" />
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
