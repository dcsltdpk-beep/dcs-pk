'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa6';
import { ArrowUpRight } from 'lucide-react';

interface CoursesPageClientProps {
  whatsappNumber?: string;
  whatsappMessage?: string;
  dbCourses?: any[];
}

type FilterCategory = 'all' | 'ai' | 'dev' | 'creative' | 'basics';

interface CourseItem {
  id: string;
  cat: FilterCategory;
  num: string;
  ribbon?: string;
  title: string;
  desc: string;
  duration: string;
  level: string;
  tags: string[];
  slug: string;
  iconType: 'bot' | 'code' | 'video' | 'computer';
}

const DEFAULT_COURSES: CourseItem[] = [
  {
    id: 'ai-automation',
    cat: 'ai',
    num: '01',
    ribbon: 'Hot',
    title: 'AI Automation & Agents',
    desc: 'Agentic AI, n8n / Make workflows, chatbots and business process automation.',
    duration: '10 Weeks',
    level: 'Intermediate',
    tags: ['Generative AI', 'AI Agents', 'n8n / Make', 'CRM Automation'],
    slug: '/courses/ai-automation',
    iconType: 'bot',
  },
  {
    id: 'web-dev',
    cat: 'dev',
    num: '02',
    title: 'Enterprise Web Dev',
    desc: 'Full-stack web development from HTML & CSS to React, Next.js and databases.',
    duration: '14 Weeks',
    level: 'Beginner → Pro',
    tags: ['HTML / CSS', 'JavaScript', 'React & Next.js', 'MongoDB'],
    slug: '/courses/web-development',
    iconType: 'code',
  },
  {
    id: 'video-design',
    cat: 'creative',
    num: '03',
    title: 'Video Editing & Design',
    desc: 'Professional editing, motion graphics and brand design for social media and ads.',
    duration: '8 Weeks',
    level: 'Beginner',
    tags: ['Photoshop', 'Illustrator', 'Premiere Pro', 'After Effects'],
    slug: '/courses/video-editing-graphic-design',
    iconType: 'video',
  },
  {
    id: 'computer-basics',
    cat: 'basics',
    num: '04',
    title: 'Computer Basics & Office',
    desc: 'Computer fundamentals, MS Office, internet, email and online safety.',
    duration: '6 Weeks',
    level: 'Absolute Beginner',
    tags: ['Windows', 'MS Word', 'MS Excel', 'Online Safety'],
    slug: '/courses/computer-basics',
    iconType: 'computer',
  },
];

const TOOLS_LIST = [
  'ChatGPT',
  'Claude',
  'n8n',
  'Make',
  'Zapier',
  'HTML',
  'CSS',
  'JavaScript',
  'React',
  'Next.js',
  'MongoDB',
  'Photoshop',
  'Illustrator',
  'Premiere Pro',
  'After Effects',
  'MS Office',
];

export default function CoursesPageClient({
  whatsappNumber = '923165478855',
  whatsappMessage = 'Hello Dream Cyber Security Pakistan, I would like to inquire about your academy training courses.',
  dbCourses,
}: CoursesPageClientProps) {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');

  // Canvas refs
  const heroParticlesRef = useRef<HTMLCanvasElement>(null);
  const netCanvasRef = useRef<HTMLCanvasElement>(null);
  const ctaParticlesRef = useRef<HTMLCanvasElement>(null);
  const visualCardRef = useRef<HTMLDivElement>(null);
  const shieldWrapRef = useRef<HTMLDivElement>(null);

  // Stats count-up values
  const [statCourses, setStatCourses] = useState('0');
  const [statLabs, setStatLabs] = useState('0');
  const [statWhyCourses, setStatWhyCourses] = useState('0');
  const [statWhyWeeks, setStatWhyWeeks] = useState('0');
  const [statWhyLabs, setStatWhyLabs] = useState('0');

  // WhatsApp Link
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  /* -------------------------------------------------------------
     1. Digital Floating Particles on Hero Shell
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
     5. Counter Animation for Stats
  ------------------------------------------------------------- */
  useEffect(() => {
    const t0 = performance.now() + 350;
    let raf = 0;

    const tick = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - t0) / 1500));
      const e = 1 - Math.pow(1 - p, 3);
      setStatCourses(String(Math.round(4 * e)));
      setStatLabs(String(Math.round(100 * e)));
      setStatWhyCourses(String(Math.round(4 * e)));
      setStatWhyWeeks(String(Math.round(10 * e)));
      setStatWhyLabs(String(Math.round(100 * e)));

      if (p < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const handleFilterClick = (cat: FilterCategory) => {
    setActiveFilter(cat);
  };

  const filteredCourses = DEFAULT_COURSES.filter((course) => {
    if (activeFilter === 'all') return true;
    return course.cat === activeFilter;
  });

  const renderIcon = (type: CourseItem['iconType']) => {
    switch (type) {
      case 'bot':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="8" width="16" height="12" rx="3" />
            <path d="M12 8V4M9 13v1M15 13v1M2 14h2M20 14h2" />
            <circle cx="12" cy="3" r="1" />
          </svg>
        );
      case 'code':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="m8 9-4 3 4 3M16 9l4 3-4 3M13 6l-2 12" />
          </svg>
        );
      case 'video':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="6" width="14" height="12" rx="2" />
            <path d="m16 10 6-3v10l-6-3" />
          </svg>
        );
      case 'computer':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="13" rx="2" />
            <path d="M8 21h8M12 17v4" />
          </svg>
        );
    }
  };

  return (
    <div className="dcs-academy-catalog-root">
      {/* ========================================================
          1. HERO SHELL (Golden Warm Architecture & Network Visual)
          ======================================================== */}
      <section className="hero-shell">
        <canvas ref={heroParticlesRef} id="particles" />

        <div className="crumbs">
          <Link href="/">Home</Link> / <span>DCS Academy Courses</span>
        </div>

        <div className="hero">
          {/* Left Hero Column */}
          <div>
            <span className="tag">
              <i /> DCS Training Academy · Lahore
            </span>

            <h1>
              Learn <span className="hl">skills</span> that get you <span className="gold">hired</span>
            </h1>

            <p className="lead">
              Practical, industry-led courses in AI automation, web engineering, design and computer fundamentals — taught by working professionals from Dream Cyber Security.
            </p>

            <div className="actions">
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                <FaWhatsapp size={17} style={{ color: '#25D366' }} />
                <span>Ask on WhatsApp</span>
                <ArrowUpRight size={16} />
              </a>

              <a href="#courses" className="btn btn-blue">
                <span>Explore Courses</span>
                <ArrowUpRight size={16} />
              </a>
            </div>

            <div className="stats">
              <div className="stat">
                <b>
                  {statCourses}
                  <em></em>
                </b>
                <span>Career Courses</span>
              </div>
              <div className="stat">
                <b>
                  {statLabs}
                  <em>%</em>
                </b>
                <span>Practical Labs</span>
              </div>
              <div className="stat">
                <b>
                  On<em>/</em>Off
                </b>
                <span>Online &amp; Offline</span>
              </div>
            </div>
          </div>

          {/* Right Visual Card Column */}
          <div ref={visualCardRef} className="visual">
            <canvas ref={netCanvasRef} id="net" />

            <div ref={shieldWrapRef} className="shield-wrap">
              <svg className="shield" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="dcs-cap" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#3a3fb8" />
                    <stop offset="1" stopColor="#1c1949" />
                  </linearGradient>
                  <linearGradient id="dcs-book" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#ffffff" />
                    <stop offset="1" stopColor="#cfd3e0" />
                  </linearGradient>
                  <pattern id="dcs-hex" width="14" height="24" patternUnits="userSpaceOnUse">
                    <path d="M7 0 14 4v8l-7 4-7-4V4z" fill="none" stroke="#f9ac43" strokeWidth="0.8" opacity="0.55" />
                  </pattern>
                </defs>
                <path d="M30 150 110 175 190 150V196L110 214 30 196z" fill="url(#dcs-book)" stroke="#b9bdcc" />
                <path d="M110 175v39" stroke="#b9bdcc" strokeWidth="2" />
                <path d="M60 104v34c0 14 22 26 50 26s50-12 50-26v-34" fill="url(#dcs-cap)" />
                <path d="M60 104v34c0 14 22 26 50 26s50-12 50-26v-34" fill="url(#dcs-hex)" />
                <path d="M110 40 205 82 110 124 15 82z" fill="url(#dcs-cap)" />
                <path d="M110 40 205 82 110 124 15 82z" fill="url(#dcs-hex)" />
                <path d="M110 40 205 82 110 124 15 82z" fill="none" stroke="#f9ac43" strokeWidth="2.5" />
                <path d="M110 82 175 96v52" fill="none" stroke="#f9ac43" strokeWidth="4" strokeLinecap="round" />
                <circle cx="175" cy="154" r="9" fill="#f9ac43" />
                <circle cx="110" cy="82" r="7" fill="#f9ac43" />
              </svg>
            </div>

            <div className="chip c1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span>Certificate Earned</span>
            </div>

            <div className="chip c2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              <span>Next Batch Enrolling</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. COURSES CATALOG GRID & FILTERS
          ======================================================== */}
      <section className="block" id="courses">
        <div className="head">
          <span className="eyebrow">Our Courses</span>
          <h2>
            Career-focused courses, <span className="u">real projects</span>
          </h2>
          <p>
            Every course is hands-on, mentor-led and ends with a portfolio project and a verified certificate.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="filters">
          <button
            type="button"
            className={activeFilter === 'all' ? 'on' : ''}
            onClick={() => handleFilterClick('all')}
          >
            All Courses
          </button>
          <button
            type="button"
            className={activeFilter === 'ai' ? 'on' : ''}
            onClick={() => handleFilterClick('ai')}
          >
            AI &amp; Automation
          </button>
          <button
            type="button"
            className={activeFilter === 'dev' ? 'on' : ''}
            onClick={() => handleFilterClick('dev')}
          >
            Development
          </button>
          <button
            type="button"
            className={activeFilter === 'creative' ? 'on' : ''}
            onClick={() => handleFilterClick('creative')}
          >
            Creative
          </button>
          <button
            type="button"
            className={activeFilter === 'basics' ? 'on' : ''}
            onClick={() => handleFilterClick('basics')}
          >
            Foundations
          </button>
        </div>

        {/* Courses Grid */}
        <div className="grid-svc">
          {filteredCourses.map((course) => (
            <article key={course.id} className="svc course" data-cat={course.cat}>
              {course.ribbon && <span className="ribbon">{course.ribbon}</span>}

              <div className="svc-top">
                <span className="svc-ic">{renderIcon(course.iconType)}</span>
                <span className="svc-n">{course.num}</span>
              </div>

              <h3>{course.title}</h3>
              <p>{course.desc}</p>

              <div className="c-meta">
                <span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                  {course.duration}
                </span>
                <span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 20V14M10 20V9M16 20V4M22 20H2" />
                  </svg>
                  {course.level}
                </span>
              </div>

              <ul>
                {course.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>

              <div className="c-actions">
                <Link href={course.slug} className="svc-link">
                  <span>Course Details</span>
                  <ArrowUpRight size={16} />
                </Link>

                <Link
                  href={`/contact?inquiry_type=course_inquiry&target=${encodeURIComponent(course.title)}`}
                  className="btn btn-blue btn-sm"
                >
                  Enroll
                </Link>
              </div>
            </article>
          ))}

          {/* Wide Corporate & Group Training Card */}
          <article className="svc course-wide">
            <div className="svc-top">
              <span className="svc-ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
                </svg>
              </span>
              <span className="svc-n">+</span>
            </div>

            <h3>Corporate &amp; Group Training</h3>
            <p>
              Upskill your team with a custom curriculum in AI automation, cybersecurity awareness or web development — on-site or online.
            </p>

            <Link href="/contact?inquiry_type=corporate_training" className="btn btn-blue">
              <span>Request Training Plan</span>
              <ArrowUpRight size={16} />
            </Link>
          </article>
        </div>
      </section>

      {/* ========================================================
          3. PROCESS: YOUR LEARNING JOURNEY
          ======================================================== */}
      <section className="block process">
        <div className="head">
          <span className="eyebrow">Your Learning Journey</span>
          <h2>
            From first class to <span className="u">certified</span> professional
          </h2>
        </div>

        <div className="steps">
          <div className="step">
            <span className="step-n">01</span>
            <span className="step-ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M19 8v6M22 11h-6" />
              </svg>
            </span>
            <h4>Enroll</h4>
            <p>Book your seat online or on WhatsApp and choose an online or offline batch.</p>
          </div>

          <div className="step">
            <span className="step-n">02</span>
            <span className="step-ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </span>
            <h4>Learn</h4>
            <p>Live classes with practical lab sessions and weekly assignments.</p>
          </div>

          <div className="step">
            <span className="step-n">03</span>
            <span className="step-ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="m14.7 6.3 3 3L7 20H4v-3zM16 5l3 3" />
              </svg>
            </span>
            <h4>Build</h4>
            <p>Create a capstone portfolio project with mentor reviews.</p>
          </div>

          <div className="step">
            <span className="step-n">04</span>
            <span className="step-ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="6" />
                <path d="M15.5 13 17 22l-5-3-5 3 1.5-9" />
              </svg>
            </span>
            <h4>Get Certified</h4>
            <p>Earn a verified certificate and career guidance to land work.</p>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. WHY DCS ACADEMY (Split Card Architecture)
          ======================================================== */}
      <section className="block why">
        <div className="why-card">
          <div>
            <span className="eyebrow light">Why DCS Academy</span>
            <h2>
              Learn from people <span>who do the work.</span>
            </h2>

            <ul className="why-list">
              <li>
                <i>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12 5 5 9-10" />
                  </svg>
                </i>
                <div>
                  <b>Taught by industry experts</b>
                  <span>Trainers who build real projects for clients at Dream Cyber Security every day.</span>
                </div>
              </li>

              <li>
                <i>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12 5 5 9-10" />
                  </svg>
                </i>
                <div>
                  <b>100% practical labs</b>
                  <span>Learn by doing — every class has hands-on lab work, not just slides.</span>
                </div>
              </li>

              <li>
                <i>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12 5 5 9-10" />
                  </svg>
                </i>
                <div>
                  <b>Portfolio-ready projects</b>
                  <span>Graduate with real capstone projects you can show to employers and clients.</span>
                </div>
              </li>

              <li>
                <i>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12 5 5 9-10" />
                  </svg>
                </i>
                <div>
                  <b>Online &amp; offline batches</b>
                  <span>Join in person at our Lahore campus or live online from anywhere.</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="why-stats">
            <div>
              <b>
                {statWhyCourses}
                <em></em>
              </b>
              <span>Career Courses</span>
            </div>
            <div>
              <b>
                {statWhyWeeks}
                <em></em>
              </b>
              <span>Weeks Avg. Duration</span>
            </div>
            <div>
              <b>
                {statWhyLabs}
                <em>%</em>
              </b>
              <span>Hands-on Labs</span>
            </div>
            <div>
              <b>
                1<em>×</em>
              </b>
              <span>Verified Certificate</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. TECH TOOLS MARQUEE
          ======================================================== */}
      <section className="tech">
        <p>Tools you will master</p>
        <div className="marquee">
          <div className="track">
            {TOOLS_LIST.concat(TOOLS_LIST).map((tool, idx) => (
              <span key={`${tool}-${idx}`}>{tool}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          6. FAQS (Interactive Accordion)
          ======================================================== */}
      <section className="block faqs">
        <div className="head">
          <span className="eyebrow">FAQ</span>
          <h2>
            Questions before you <span className="u">enroll?</span>
          </h2>
        </div>

        <div className="faq-list">
          <details className="faq" open>
            <summary>
              <span>Are classes online or offline?</span>
              <i>+</i>
            </summary>
            <p>Both. You can join in person at our Lahore campus or attend the same live class online.</p>
          </details>

          <details className="faq">
            <summary>
              <span>Do I need prior experience?</span>
              <i>+</i>
            </summary>
            <p>No. Computer Basics and Video &amp; Design start from zero; Web Engineering and AI Automation start with fundamentals.</p>
          </details>

          <details className="faq">
            <summary>
              <span>Will I get a certificate?</span>
              <i>+</i>
            </summary>
            <p>Yes — every student who completes the course and capstone project receives a verified DCS Academy certificate.</p>
          </details>

          <details className="faq">
            <summary>
              <span>How do I enroll in the next batch?</span>
              <i>+</i>
            </summary>
            <p>Click Enroll on any course or message us on WhatsApp and our admissions desk will share the schedule and fees.</p>
          </details>
        </div>
      </section>

      {/* ========================================================
          7. WARM GOLD CTA BAND
          ======================================================== */}
      <section className="block" style={{ marginBottom: '40px' }}>
        <div className="cta-band">
          <canvas ref={ctaParticlesRef} id="cta-particles" />
          <div>
            <h2>Next batch is enrolling now</h2>
            <p>Reserve your seat today — limited seats per batch for personal mentorship.</p>
          </div>
          <div className="cta-actions">
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              <FaWhatsapp size={17} style={{ color: '#25D366' }} />
              <span>WhatsApp Us</span>
              <ArrowUpRight size={16} />
            </a>
            <Link href="/contact?inquiry_type=course_inquiry" className="btn btn-blue">
              <span>Submit Admission Inquiry</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
