'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaWhatsapp, FaEnvelope, FaGithub, FaXTwitter } from 'react-icons/fa6';
import { ArrowUpRight, Lock, Code2, GraduationCap, Users2, ShieldCheck, Cpu, Terminal, Compass, Briefcase } from 'lucide-react';

export interface TeamMemberData {
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

interface TeamMemberDetailClientProps {
  member: TeamMemberData;
  allTeam?: TeamMemberData[];
  whatsappNumber?: string;
}

const FALLBACK_COLLEAGUES: TeamMemberData[] = [
  {
    name: 'Ahmmad Hassan',
    slug: 'ahmmad-hassan',
    designation: 'Chief Executive Officer / Managing Director',
    department: 'Leadership',
    initials: 'AH',
    bio: 'Leads Dream Cyber Security toward secure, resilient digital growth for businesses across Pakistan and the region.',
    photo: '',
  },
  {
    name: 'Rashid Ali',
    slug: 'rashid-ali',
    designation: 'Senior Full Stack Developer',
    department: 'Engineering',
    initials: 'RA',
    bio: 'Builds secure, scalable software that protects clients and their data.',
    photo: '',
  },
  {
    name: 'Moeed Rizwan Farooq',
    slug: 'moeed-rizwan-farooq',
    designation: 'Senior AI & Automations Expert',
    department: 'AI & Automation',
    initials: 'MR',
    bio: 'Builds automation that makes security operations smarter, faster and more efficient.',
    photo: '',
  },
  {
    name: 'Aqsa Irshad',
    slug: 'aqsa-irshad',
    designation: 'HR Manager',
    department: 'People',
    initials: 'AQ',
    bio: 'Builds a skilled, motivated team and a productive, people-first workplace.',
    photo: '',
  },
];

export default function TeamMemberDetailClient({
  member,
  allTeam = [],
  whatsappNumber = '923165478855',
}: TeamMemberDetailClientProps) {
  // Canvas & Interaction refs
  const heroParticlesRef = useRef<HTMLCanvasElement>(null);
  const netCanvasRef = useRef<HTMLCanvasElement>(null);
  const ctaParticlesRef = useRef<HTMLCanvasElement>(null);
  const visualCardRef = useRef<HTMLDivElement>(null);

  // Parse names for styling
  const nameParts = member.name.trim().split(' ');
  const firstName = nameParts[0] || member.name;
  const restOfName = nameParts.slice(1).join(' ');

  // Compute initials
  const initials =
    member.initials ||
    (nameParts.length >= 2
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : member.name.substring(0, 2).toUpperCase());

  // WhatsApp consultation link
  const waMessage = `Hello Dream Cyber Security, I would like to consult with ${member.name} (${member.designation}).`;
  const waLink = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waMessage)}`;

  // Filter other colleagues to display
  const colleagues = (allTeam.length > 0 ? allTeam : FALLBACK_COLLEAGUES)
    .filter((m) => m.slug !== member.slug && m.name.toLowerCase() !== member.name.toLowerCase())
    .slice(0, 3);

  /* -------------------------------------------------------------
     1. Digital Particles Canvas on Hero Shell
  ------------------------------------------------------------- */
  useEffect(() => {
    const cv = heroParticlesRef.current;
    if (!cv) return;
    const cx = cv.getContext('2d');
    if (!cx) return;

    let w = 0;
    let h = 0;
    let pts: Array<{ x: number; y: number; vx: number; vy: number; r: number; c: string }> = [];
    let raf = 0;
    let running = true;
    let isVisible = true;

    const rs = () => {
      const d = Math.min(window.devicePixelRatio || 1, 1.5);
      const r = cv.getBoundingClientRect();
      w = cv.width = Math.max(10, r.width * d);
      h = cv.height = Math.max(10, r.height * d);
      pts = Array.from({ length: 42 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.45 * d,
        vy: (Math.random() - 0.5) * 0.45 * d,
        r: (Math.random() * 2 + 1) * d,
        c: Math.random() > 0.4 ? 'rgba(58,63,184,0.45)' : 'rgba(255,255,255,0.75)',
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
      const m = 110 * Math.min(window.devicePixelRatio || 1, 1.5);

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
            cx.strokeStyle = `rgba(58,63,184,${(1 - d / m) * 0.18})`;
            cx.lineWidth = 1;
            cx.beginPath();
            cx.moveTo(a.x, a.y);
            cx.lineTo(b.x, b.y);
            cx.stroke();
          }
        }
      }

      pts.forEach((p) => {
        cx.fillStyle = p.c;
        cx.beginPath();
        cx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
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
     2. Interactive Particle Net on Profile Showcase Card
  ------------------------------------------------------------- */
  useEffect(() => {
    const canvas = netCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let pts: Array<{ x: number; y: number; vx: number; vy: number }> = [];
    let raf = 0;
    let running = true;
    let isVisible = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const r = canvas.getBoundingClientRect();
      W = canvas.width = Math.max(10, r.width * dpr);
      H = canvas.height = Math.max(10, r.height * dpr);
      pts = Array.from({ length: 22 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.55 * dpr,
        vy: (Math.random() - 0.5) * 0.55 * dpr,
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
      observer.observe(canvas);
    } catch {
      isVisible = true;
    }

    const draw = () => {
      if (!running || !isVisible) {
        raf = 0;
        return;
      }
      ctx.clearRect(0, 0, W, H);
      const max = W * 0.32;

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
            ctx.strokeStyle = `rgba(249,172,67,${(1 - d / max) * 0.28})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      const d = Math.min(window.devicePixelRatio || 1, 1.5);
      pts.forEach((p, i) => {
        ctx.fillStyle = i % 4 ? 'rgba(58,63,184,0.45)' : '#f9ac43';
        ctx.beginPath();
        ctx.arc(p.x, p.y, (i % 4 ? 2 : 3) * d, 0, Math.PI * 2);
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
     3. 3D Perspective Tilt on Profile Visual Card
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
        p.y += p.vy;
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

  return (
    <div className="dcs-team-page-deck">
      {/* ================= HERO SECTION (PROFILE SHOWCASE) ================= */}
      <section className="dcs-hero-section dcs-section-hero">
        <div className="hero-shell">
          <canvas ref={heroParticlesRef} id="team-hero-particles" />

          {/* Top Breadcrumb Bar */}
          <div className="hero-top-bar">
            <div className="hero-crumbs">
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/team">Leadership &amp; Team</Link>
              <span>/</span>
              <strong>{member.name}</strong>
            </div>
            <Link
              href="/team"
              className="btn btn-sm btn-outline"
              style={{ padding: '7px 16px', fontSize: '13px', background: 'rgba(255,255,255,0.7)', color: 'var(--navy-900)' }}
            >
              &larr; All Specialists
            </Link>
          </div>

          <div className="hero">
            <div>
              <span className="tag">
                <i /> {member.department || 'Specialist Architect'}
              </span>

              <h1>
                Meet <span className="hl">{firstName}</span> {restOfName && <span className="gold">{restOfName}</span>}
              </h1>

              <p
                style={{
                  fontSize: '19px',
                  fontWeight: 700,
                  color: 'var(--blue)',
                  margin: '-10px 0 16px',
                  letterSpacing: '-0.01em',
                }}
              >
                {member.designation}
              </p>

              <p className="lead">{member.bio}</p>

              {member.quote && (
                <blockquote
                  style={{
                    margin: '20px 0',
                    padding: '14px 20px',
                    borderLeft: '4px solid var(--gold)',
                    background: 'rgba(255, 255, 255, 0.75)',
                    borderRadius: '0 16px 16px 0',
                    fontStyle: 'italic',
                    color: 'var(--navy-900)',
                    lineHeight: '1.6',
                    fontSize: '15px',
                  }}
                >
                  {member.quote}
                </blockquote>
              )}

              {/* Actions */}
              <div className="actions">
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-blue">
                  <FaWhatsapp size={17} style={{ color: '#25D366' }} /> WhatsApp {firstName} <ArrowUpRight />
                </a>
                <Link href="/contact" className="btn btn-outline">
                  Schedule Consultation <ArrowUpRight />
                </Link>
              </div>

              {/* Social Channels Row */}
              <div className="member-socials-row">
                {member.twitter && member.twitter !== 'https://twitter.com' && (
                  <a
                    href={member.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on Twitter`}
                    title="Twitter / X"
                  >
                    <FaXTwitter size={15} />
                  </a>
                )}
                {member.github && member.github !== 'https://github.com' && (
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on GitHub`}
                    title="GitHub"
                  >
                    <FaGithub size={16} />
                  </a>
                )}
                {member.email && (
                  <a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`} title="Direct Email">
                    <FaEnvelope size={15} />
                  </a>
                )}
              </div>

              {/* Highlight Stats Row */}
              <div className="stats">
                <div className="stat">
                  <b>
                    100<em>%</em>
                  </b>
                  <span>Verified Specialist</span>
                </div>
                <div className="stat">
                  <b>Lahore</b>
                  <span>HQ Operation Base</span>
                </div>
                <div className="stat">
                  <b>Active</b>
                  <span>Available for Projects</span>
                </div>
              </div>
            </div>

            {/* Profile Image Showcase Visual (NO QR CODE) */}
            <div ref={visualCardRef} className="visual member-showcase">
              <canvas ref={netCanvasRef} id="net" />

              <div className="member-photo-frame">
                {member.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="member-profile-img"
                  />
                ) : (
                  <div className="member-avatar-placeholder">
                    <span className="avatar-initials">{initials}</span>
                    <span className="avatar-tag">{member.designation}</span>
                  </div>
                )}
              </div>

              {/* Decorative Floating Badges */}
              <div className="chip c1">
                <ShieldCheck size={18} /> {member.department || 'Security Specialist'}
              </div>
              <div className="chip c2">
                <Users2 size={18} /> Lahore HQ
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= EXPERTISE & CORE CAPABILITIES SECTION ================= */}
      <section className="section dcs-stacked-section" id="member-capabilities">
        <div className="block">
          <div className="head">
            <span className="eyebrow">Professional Expertise</span>
            <h2>
              Core focus &amp; <span className="u">technical capabilities</span>
            </h2>
            <p>
              How {member.name} applies hands-on engineering, security rigor, and architectural precision to solve client challenges.
            </p>
          </div>

          <div className="capabilities-grid">
            <div className="cap-card">
              <div className="cap-ic">
                <ShieldCheck size={26} />
              </div>
              <h3>Zero-Trust Security &amp; Defense</h3>
              <p>
                Implementing defensive perimeters, credential isolation, least-privilege policies, and regular vulnerability assessment across web applications and private networks.
              </p>
            </div>

            <div className="cap-card">
              <div className="cap-ic">
                <Cpu size={26} />
              </div>
              <h3>Infrastructure Hardening &amp; Cloud</h3>
              <p>
                Hardening containerized microservices, secure server orchestration, SSL/TLS modern ciphers, and zero-exposure deployment pipelines designed for resilience.
              </p>
            </div>

            <div className="cap-card">
              <div className="cap-ic">
                <Terminal size={26} />
              </div>
              <h3>Incident Triage &amp; Code Review</h3>
              <p>
                Thorough peer code audits, static code analysis, threat surface minimization, and rapid response to emerging threat advisories to ensure zero vulnerabilities.
              </p>
            </div>

            <div className="cap-card">
              <div className="cap-ic">
                <Compass size={26} />
              </div>
              <h3>Strategic Architecture &amp; Advisory</h3>
              <p>
                Advising enterprise leadership, planning scalable roadmap milestones, and delivering reliable software architecture aligned with global security standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CULTURE & PROCESS SECTION ("HOW WE WORK TOGETHER") ================= */}
      <section className="section dcs-stacked-section" id="team-culture">
        <div className="block process">
          <div className="head">
            <span className="eyebrow">How We Work Together</span>
            <h2>
              A culture built on <span className="u">trust</span>
            </h2>
            <p>Our standard operating procedures guarantee precision, accountability, and maximum security for every engagement.</p>
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

      {/* ================= MEET OTHER SPECIALISTS SECTION ================= */}
      {colleagues.length > 0 && (
        <section className="section dcs-stacked-section" id="team-colleagues">
          <div className="block">
            <div className="head">
              <span className="eyebrow">Specialist Colleagues</span>
              <h2>
                Meet more of <span className="u">our team</span>
              </h2>
              <p>Certified cybersecurity engineers, developers, and creatives collaborating at Dream Cyber Security.</p>
            </div>

            <div className="team-grid">
              {colleagues.map((c) => (
                <article key={c.slug} className="member">
                  <div className="photo">
                    <span className="dept">{c.department || 'Specialist'}</span>
                    {c.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.photo} alt={c.name} />
                    ) : (
                      <div className="ini">{c.initials || c.name.substring(0, 2).toUpperCase()}</div>
                    )}
                  </div>
                  <div className="m-body">
                    <h3>{c.name}</h3>
                    <em>{c.designation}</em>
                    <p>{c.bio}</p>
                    <div className="m-social">
                      <Link href={`/team/${c.slug}`} className="m-profile-btn">
                        View Profile <ArrowUpRight size={14} />
                      </Link>
                      {c.email && (
                        <a href={`mailto:${c.email}`} aria-label={`Email ${c.name}`}>
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
      )}

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
                <Link
                  href="/team"
                  className="btn btn-outline"
                  style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.08)' }}
                >
                  View Full Team Roster <ArrowUpRight />
                </Link>
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
              <h2>Consult with {member.name} &amp; Our Team</h2>
              <p>Reserve a direct security consultation or project discovery session with our specialists.</p>
            </div>
            <div className="cta-actions">
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                <FaWhatsapp size={17} style={{ color: '#25D366' }} /> WhatsApp Us <ArrowUpRight />
              </a>
              <Link href="/contact" className="btn btn-blue">
                Schedule Consultation <ArrowUpRight />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
