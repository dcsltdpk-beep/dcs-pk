'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaWhatsapp, FaEnvelope } from 'react-icons/fa6';
import { ArrowUpRight, Lock, Code2, GraduationCap, Users2, ShieldCheck } from 'lucide-react';

interface TeamMember {
  _id?: string;
  name: string;
  slug: string;
  designation: string;
  department?: string;
  initials?: string;
  bio: string;
  quote?: string;
  photo?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  email?: string;
  order_num?: number;
}

interface TeamPageClientProps {
  initialTeam?: TeamMember[];
  whatsappNumber?: string;
  whatsappMessage?: string;
}

const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Ahmmad Hassan',
    slug: 'ahmmad-hassan',
    designation: 'Chief Executive Officer / Managing Director',
    department: 'Leadership',
    initials: 'AH',
    bio: 'Leads Dream Cyber Security toward secure, resilient digital growth for businesses across Pakistan and the region.',
    quote: '“Security is not a product we sell — it is a promise we keep to every client.”',
    photo: '',
    linkedin: 'https://linkedin.com',
    email: 'info@dreamcybersecurity.pk',
    order_num: 1,
  },
  {
    name: 'Aqsa Irshad',
    slug: 'aqsa-irshad',
    designation: 'HR Manager',
    department: 'People',
    initials: 'AQ',
    bio: 'Builds a skilled, motivated team and a productive, people-first workplace.',
    photo: '',
    linkedin: 'https://linkedin.com',
    email: 'info@dreamcybersecurity.pk',
    order_num: 2,
  },
  {
    name: 'Moeed Rizwan Farooq',
    slug: 'moeed-rizwan-farooq',
    designation: 'Senior AI & Automations Expert',
    department: 'AI & Automation',
    initials: 'MR',
    bio: 'Builds automation that makes security operations smarter, faster and more efficient.',
    photo: '',
    linkedin: 'https://linkedin.com',
    email: 'info@dreamcybersecurity.pk',
    order_num: 3,
  },
  {
    name: 'Husnain Niaz',
    slug: 'husnain-niaz',
    designation: 'Senior Graphic Designer & Video Editor',
    department: 'Creative',
    initials: 'HN',
    bio: 'Creates visuals and videos that bring the Dream Cyber Security brand to life.',
    photo: '',
    linkedin: 'https://linkedin.com',
    email: 'info@dreamcybersecurity.pk',
    order_num: 4,
  },
  {
    name: 'Rashid Ali',
    slug: 'rashid-ali',
    designation: 'Senior Full Stack Developer',
    department: 'Engineering',
    initials: 'RA',
    bio: 'Builds secure, scalable software that protects clients and their data.',
    photo: '',
    linkedin: 'https://linkedin.com',
    email: 'info@dreamcybersecurity.pk',
    order_num: 5,
  },
  {
    name: 'Md Masrur Nakib',
    slug: 'md-masrur-nakib',
    designation: 'Cybersecurity Specialist & Systems Architect',
    department: 'Security & Defense',
    initials: 'MN',
    bio: 'Dedicated cybersecurity practitioner specializing in vulnerability assessment, threat intelligence, cloud infrastructure hardening, and defensive security architectures.',
    quote: '“Proactive defense and zero-trust engineering are the foundation of modern digital resilience.”',
    photo: '',
    linkedin: 'https://linkedin.com',
    email: 'info@dreamcybersecurity.pk',
    order_num: 6,
  },
];

export default function TeamPageClient({
  initialTeam = [],
  whatsappNumber = '923165478855',
  whatsappMessage = 'Hello Dream Cyber Security Pakistan, I would like to consult with your leadership and specialist team.',
}: TeamPageClientProps) {
  // Canvas refs
  const heroParticlesRef = useRef<HTMLCanvasElement>(null);
  const netCanvasRef = useRef<HTMLCanvasElement>(null);
  const ctaParticlesRef = useRef<HTMLCanvasElement>(null);
  const visualCardRef = useRef<HTMLDivElement>(null);

  // Counter stats animation
  const [statSpecialists, setStatSpecialists] = useState('0');
  const [statDepartments, setStatDepartments] = useState('0');
  const [statMission, setStatMission] = useState('0');

  // Merged team list
  const teamList = React.useMemo(() => {
    if (!initialTeam || initialTeam.length === 0) {
      return DEFAULT_TEAM_MEMBERS;
    }
    // Map with default fallbacks for department and initials if not in DB
    return initialTeam.map((m, idx) => {
      const matchDefault = DEFAULT_TEAM_MEMBERS.find(
        (d) => d.slug === m.slug || d.name.toLowerCase() === m.name.toLowerCase()
      );
      const initials =
        m.initials ||
        matchDefault?.initials ||
        m.name
          .split(' ')
          .map((n) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase();
      const department = m.department || matchDefault?.department || (idx === 0 ? 'Leadership' : 'Specialist');
      const quote = m.quote || matchDefault?.quote || (idx === 0 ? '“Security is not a product we sell — it is a promise we keep to every client.”' : undefined);
      return {
        ...m,
        initials,
        department,
        quote,
      };
    });
  }, [initialTeam]);

  const leadershipMembers = teamList.slice(0, 3);
  const teamMembers = teamList.slice(3);

  // WhatsApp link
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
     5. Smooth Counter Animation on Mount
  ------------------------------------------------------------- */
  useEffect(() => {
    let frameId: number;
    const start = performance.now();
    const duration = 1400;

    const animateCounters = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, Math.max(0, elapsed / duration));
      const ease = 1 - Math.pow(1 - progress, 3);

      setStatSpecialists(Math.floor(ease * 5).toString());
      setStatDepartments(Math.floor(ease * 4).toString());
      setStatMission(Math.floor(ease * 1).toString());

      if (progress < 1) {
        frameId = requestAnimationFrame(animateCounters);
      } else {
        setStatSpecialists('5');
        setStatDepartments('4');
        setStatMission('1');
      }
    };

    frameId = requestAnimationFrame(animateCounters);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="dcs-team-page-deck">
      {/* ================= HERO SECTION ================= */}
      <section className="dcs-hero-section dcs-section-hero">
        <div className="hero-shell">
          <canvas ref={heroParticlesRef} id="team-hero-particles" />

          {/* Top Breadcrumb Bar */}
          <div className="hero-top-bar">
            <div className="hero-crumbs">
              <Link href="/">Home</Link>
              <span>/</span>
              <strong>Leadership &amp; Team</strong>
            </div>
          </div>

          <div className="hero">
            <div>
              <span className="tag">
                <i /> Leadership &amp; Engineers
              </span>
              <h1>
                Meet our <span className="hl">specialist</span> <span className="gold">team</span>
              </h1>
              <p className="lead">
                Cybersecurity architects, engineers, automation experts and creatives — working together from our Lahore headquarters to keep your business secure and growing.
              </p>
              <div className="actions">
                <a href="#careers" className="btn btn-outline">
                  Join Our Team <ArrowUpRight />
                </a>
                <Link href="/contact" className="btn btn-blue">
                  Work With Us <ArrowUpRight />
                </Link>
              </div>
              <div className="stats">
                <div className="stat">
                  <b>
                    {statSpecialists}
                    <em>+</em>
                  </b>
                  <span>Specialists</span>
                </div>
                <div className="stat">
                  <b>{statDepartments}</b>
                  <span>Departments</span>
                </div>
                <div className="stat">
                  <b>{statMission}</b>
                  <span>Mission</span>
                </div>
              </div>
            </div>

            {/* Visual Card with Avatars Grid */}
            <div ref={visualCardRef} className="visual">
              <canvas ref={netCanvasRef} id="net" />
              <div className="hero-visual-grid">
                <div className="avatars">
                  <div>AH</div>
                  <div>AQ</div>
                  <div>MR</div>
                  <div>HN</div>
                  <div>RA</div>
                  <div>+</div>
                </div>
              </div>
              <div className="chip c1">
                <Users2 size={18} /> Lahore HQ
              </div>
              <div className="chip c2">
                <ShieldCheck size={18} /> Security-First Culture
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 1. LEADERSHIP SECTION (First 3 Cards) ================= */}
      <section className="section dcs-stacked-section" id="team-leadership">
        <div className="block">
          <div className="head">
            <span className="eyebrow">Executive Leadership</span>
            <h2>
              The Vision &amp; <span className="u">Steering Force</span>
            </h2>
            <p>Guiding Dream Cyber Security with strategic foresight, executive governance, and a commitment to digital resilience.</p>
          </div>

          <div className="team-grid">
            {leadershipMembers.map((member) => (
              <article key={member.slug || member.name} className="member leadership-card">
                <div className="photo">
                  <span className="dept">{member.department || 'Leadership'}</span>
                  {member.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.photo}
                      alt={member.name}
                      style={{ objectPosition: 'center top' }}
                    />
                  ) : (
                    <div className="ini">{member.initials || 'LD'}</div>
                  )}
                </div>
                <div className="m-body">
                  <h3>{member.name}</h3>
                  <em>{member.designation}</em>
                  <p>{member.bio}</p>
                  {member.quote && <blockquote>{member.quote}</blockquote>}
                  <div className="m-social">
                    <Link href={`/team/${member.slug}`} className="m-profile-btn">
                      View Profile <ArrowUpRight size={14} />
                    </Link>
                    {member.email && (
                      <a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`}>
                        <FaEnvelope />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 2. TEAM / SPECIALISTS SECTION (Remaining Cards) ================= */}
      <section className="section dcs-stacked-section" id="team-grid">
        <div className="block">
          <div className="head">
            <span className="eyebrow">Our Team</span>
            <h2>
              The Minds Behind <span className="u">Your Security</span>
            </h2>
            <p>Every specialist brings hands-on experience delivering enterprise defense, scalable software, and intelligent automation.</p>
          </div>

          <div className="team-grid">
            {teamMembers.map((member) => (
              <article key={member.slug || member.name} className="member">
                <div className="photo">
                  <span className="dept">{member.department || 'Specialist'}</span>
                  {member.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.photo}
                      alt={member.name}
                      style={{ objectPosition: 'center top' }}
                    />
                  ) : (
                    <div className="ini">{member.initials || 'SP'}</div>
                  )}
                </div>
                <div className="m-body">
                  <h3>{member.name}</h3>
                  <em>{member.designation}</em>
                  <p>{member.bio}</p>
                  {member.quote && <blockquote>{member.quote}</blockquote>}
                  <div className="m-social">
                    <Link href={`/team/${member.slug}`} className="m-profile-btn">
                      View Profile <ArrowUpRight size={14} />
                    </Link>
                    {member.email && (
                      <a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`}>
                        <FaEnvelope />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}

            {/* Hiring Callout Card */}
            <article className="member hiring-card">
              <div className="photo">
                <div className="ini">+</div>
              </div>
              <div className="m-body">
                <h3>This could be you</h3>
                <em>We’re hiring</em>
                <p>Passionate about security, code or creativity? Join our growing team.</p>
                <div className="m-social">
                  <a
                    href="#careers"
                    className="btn btn-sm"
                    style={{ width: 'auto', padding: '0 18px', background: 'var(--gold)', color: 'var(--navy-900)' }}
                  >
                    See open roles
                  </a>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ================= CULTURE & PROCESS SECTION ================= */}
      <section className="section dcs-stacked-section" id="team-culture">
        <div className="block process">
          <div className="head">
            <span className="eyebrow">How We Work Together</span>
            <h2>
              A culture built on <span className="u">trust</span>
            </h2>
          </div>
          <div className="steps">
            <div className="step">
              <span className="step-n">01</span>
              <span className="step-ic">
                <Lock size={24} />
              </span>
              <h4>Confidentiality</h4>
              <p>Strict NDAs and zero-leakage protocols on every engagement.</p>
            </div>
            <div className="step">
              <span className="step-n">02</span>
              <span className="step-ic">
                <Code2 size={24} />
              </span>
              <h4>Peer review</h4>
              <p>Code, rules and pipelines are tested by multiple engineers.</p>
            </div>
            <div className="step">
              <span className="step-n">03</span>
              <span className="step-ic">
                <GraduationCap size={24} />
              </span>
              <h4>Always learning</h4>
              <p>Continuous training through our own Skill Academy.</p>
            </div>
            <div className="step">
              <span className="step-n">04</span>
              <span className="step-ic">
                <Users2 size={24} />
              </span>
              <h4>One team</h4>
              <p>Security, engineering and creative working side by side.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CAREERS SECTION ================= */}
      <section className="section dcs-stacked-section" id="team-careers">
        <div className="block" id="careers">
          <div className="join">
            <div>
              <span className="eyebrow light">Careers</span>
              <h2>
                Build your career at <span>Dream Cyber Security</span>
              </h2>
              <p>
                We’re always looking for talented engineers, marketers and creatives. Send your CV and portfolio — top Academy graduates get priority internship access.
              </p>
              <div className="actions">
                <a
                  href="mailto:info@dreamcybersecurity.pk?subject=Job%20Application"
                  className="btn"
                  style={{ background: 'linear-gradient(135deg, var(--gold-light), var(--gold))', color: 'var(--navy-900)' }}
                >
                  Send Your CV <ArrowUpRight />
                </a>
              </div>
            </div>
            <div className="roles">
              <div>
                Performance Marketing Executive <span>Open</span>
              </div>
              <div>
                Cybersecurity Analyst <span>Open</span>
              </div>
              <div>
                Full Stack Developer <span>Open</span>
              </div>
              <div>
                Academy Internship Program <span>Rolling</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WARM GOLD CTA BAND ================= */}
      <section className="section dcs-stacked-section" id="team-cta">
        <div className="block">
          <div className="cta-band">
            <canvas ref={ctaParticlesRef} id="team-cta-particles" />
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
