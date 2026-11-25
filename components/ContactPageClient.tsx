'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface ContactPageClientProps {
  initialType?: string;
  initialTarget?: string;
  companyEmail?: string;
  companyPhone?: string;
  companyAddress?: string;
  whatsappNumber?: string;
}

export default function ContactPageClient({
  initialType = 'General Consultation',
  initialTarget = '',
  companyEmail = 'dcsltd.pk@gmail.com',
  companyPhone = '+92 316 5478855',
  companyAddress = 'Central Tower I, 90-B Hali Road, Block B, Gulberg II, Lahore-54660, Pakistan',
  whatsappNumber = '923165478855',
}: ContactPageClientProps) {
  // Normalize initial category
  const getInitialCategory = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('admission') || t.includes('academy') || t.includes('course')) {
      return 'Academy Course Admission';
    }
    if (t.includes('rfp') || t.includes('quote') || t.includes('corporate') || t.includes('proposal')) {
      return 'Corporate RFP / Price Quote';
    }
    return 'General Consultation';
  };

  // Form State
  const [category, setCategory] = useState<string>(getInitialCategory(initialType));
  const [program, setProgram] = useState<string>(initialTarget);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [subject, setSubject] = useState<string>(initialTarget ? `Inquiry regarding: ${initialTarget}` : '');
  const [message, setMessage] = useState<string>('');
  const [websiteHp, setWebsiteHp] = useState<string>(''); // Anti-bot honeypot

  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState<boolean>(false);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});

  // Canvas Refs
  const heroCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const netCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctaCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const visualCardRef = useRef<HTMLDivElement | null>(null);

  // Clean WhatsApp and Phone
  const cleanWhatsapp = (whatsappNumber || '923165478855').replace(/[^0-9]/g, '');
  const cleanPhone = (companyPhone || '+92 316 5478855').replace(/\s+/g, '');

  // Detect URL search params on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const typeParam = params.get('type') || params.get('inquiry_type');
    if (typeParam) {
      const cat = getInitialCategory(typeParam);
      setCategory(cat);
    }
    const targetParam = params.get('target') || params.get('course') || params.get('service');
    if (targetParam) {
      setProgram(targetParam);
      if (!subject) {
        setSubject(`Inquiry regarding: ${targetParam}`);
      }
    }
  }, []);

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

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please fill in all required fields (Name, Email, Message).');
      return;
    }

    setLoading(true);

    try {
      const typeKey =
        category === 'Academy Course Admission'
          ? 'admission'
          : category === 'Corporate RFP / Price Quote'
          ? 'quote'
          : 'contact';

      const payload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject: subject.trim() || (program ? `[${category}] ${program}` : `[${category}] Inquiry`),
        message: message.trim(),
        inquiry_type: typeKey,
        target_name: program || category,
        website_hp: websiteHp,
      };

      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to submit inquiry. Please try again or WhatsApp us.');
      } else {
        setSuccess(true);
      }
    } catch {
      setErrorMsg('Network or service error. Please contact us via WhatsApp for immediate support.');
    } finally {
      setLoading(false);
    }
  };

  // Newsletter Submit Handler
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
    }
  };

  return (
    <div className="dcs-contact-page-deck">
      {/* ================= HERO SHELL ================= */}
      <section className="hero-shell">
        <canvas id="contact-hero-particles" ref={heroCanvasRef} />

        {/* Top Breadcrumb */}
        <div className="hero-top-bar">
          <div className="hero-crumbs">
            <Link href="/">Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--navy-800)', fontWeight: 700 }}>Contact &amp; Consultation</span>
          </div>
        </div>

        {/* Hero Grid */}
        <div className="hero">
          <div>
            <span className="tag">
              <i /> Contact &amp; Consultation
            </span>
            <h1>
              Initiate a <span className="hl">security</span>{' '}
              <span className="gold">consultation</span>
            </h1>
            <p className="lead">
              Cyber assessments, custom software architecture or Academy training — tell us what
              you need and our technical team will get back to you.
            </p>
            <div className="actions">
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
              <a href="#form" className="btn btn-blue">
                Send a Message{' '}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </a>
            </div>
            <div className="stats">
              <div className="stat">
                <b>
                  2<em>–</em>4h
                </b>
                <span>Response SLA</span>
              </div>
              <div className="stat">
                <b>Lahore</b>
                <span>Gulberg II</span>
              </div>
              <div className="stat">
                <b>
                  100<em>%</em>
                </b>
                <span>Confidential</span>
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
                  animation: 'dcsCtFloat 6s ease-in-out infinite',
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
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 6-10 7L2 6" />
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
                <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z" />
              </svg>{' '}
              Encrypted &amp; Confidential
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
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>{' '}
              Reply in 2–4 hours
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTACT FORM & DESK ================= */}
      <section className="block" id="form">
        <div className="c-grid">
          {/* Form Card */}
          <div className="form-card">
            {!success ? (
              <form onSubmit={handleSubmit} noValidate>
                <span className="eyebrow">Send Us a Message</span>
                <h2>Tell us about your requirement</h2>
                <p>All inquiries are handled confidentially by our technical desk.</p>

                {errorMsg && (
                  <div
                    style={{
                      background: '#fff1f2',
                      border: '1px solid #fecdd3',
                      color: '#be123c',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      marginBottom: '18px',
                      fontSize: '14px',
                      fontWeight: 600,
                    }}
                  >
                    ⚠ {errorMsg}
                  </div>
                )}

                {/* Honeypot field (hidden from human users) */}
                <input
                  type="text"
                  name="website_hp"
                  value={websiteHp}
                  onChange={(e) => setWebsiteHp(e.target.value)}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* Inquiry Category Radios */}
                <div className="field">
                  <label>
                    Inquiry Category <em>*</em>
                  </label>
                </div>
                <div className="cats" style={{ marginTop: -8 }}>
                  <label>
                    <input
                      type="radio"
                      name="category"
                      value="General Consultation"
                      checked={category === 'General Consultation'}
                      onChange={() => setCategory('General Consultation')}
                    />
                    <span>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z" />
                      </svg>
                      General Consultation
                      <small>Security &amp; IT services</small>
                    </span>
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="category"
                      value="Academy Course Admission"
                      checked={category === 'Academy Course Admission'}
                      onChange={() => setCategory('Academy Course Admission')}
                    />
                    <span>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 10 12 5 2 10l10 5 10-5z" />
                        <path d="M6 12v5c3 2 9 2 12 0v-5" />
                      </svg>
                      Academy Admission
                      <small>Courses &amp; batches</small>
                    </span>
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="category"
                      value="Corporate RFP / Price Quote"
                      checked={category === 'Corporate RFP / Price Quote'}
                      onChange={() => setCategory('Corporate RFP / Price Quote')}
                    />
                    <span>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <path d="M14 2v6h6M9 15h6" />
                      </svg>
                      Corporate RFP
                      <small>Price quote &amp; proposal</small>
                    </span>
                  </label>
                </div>

                {/* Target Program / Service */}
                <div className="field">
                  <label htmlFor="program">
                    Subject / Target Program <small>(optional)</small>
                  </label>
                  <select
                    id="program"
                    name="program"
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                  >
                    <option value="">— Select a service or course —</option>
                    <optgroup label="Services">
                      <option value="Cybersecurity Services">Cybersecurity Services</option>
                      <option value="Web Design & Development">Web Design &amp; Development</option>
                      <option value="E-commerce Development">E-commerce Development</option>
                      <option value="AI Automation & Chatbots">AI Automation &amp; Chatbots</option>
                      <option value="Software & App Development">Software &amp; App Development</option>
                      <option value="Digital Marketing & SEO">Digital Marketing &amp; SEO</option>
                      <option value="Social Media Management">Social Media Management</option>
                      <option value="Graphic Design & Branding">Graphic Design &amp; Branding</option>
                      <option value="Video Editing & Motion Graphics">Video Editing &amp; Motion Graphics</option>
                      <option value="Domain, Hosting & IT Support">Domain, Hosting &amp; IT Support</option>
                      <option value="Cloud & DevOps Solutions">Cloud &amp; DevOps Solutions</option>
                      <option value="Custom Enterprise Solution">Custom Enterprise Solution</option>
                    </optgroup>
                    <optgroup label="Academy">
                      <option value="AI Automation & Agents">AI Automation &amp; Agents</option>
                      <option value="Enterprise Web Dev">Enterprise Web Dev</option>
                      <option value="Video Editing & Design">Video Editing &amp; Design</option>
                      <option value="Computer Basics & Office">Computer Basics &amp; Office</option>
                      <option value="Corporate & Group Training">Corporate &amp; Group Training</option>
                    </optgroup>
                  </select>
                </div>

                {/* Name & Email Row */}
                <div className="row2">
                  <div className="field">
                    <label htmlFor="name">
                      Full Name <em>*</em>
                    </label>
                    <input
                      id="name"
                      name="name"
                      required
                      autoComplete="name"
                      placeholder="e.g. Tariq Mehmood"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="email">
                      Business / Personal Email <em>*</em>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Phone & Subject Row */}
                <div className="row2">
                  <div className="field">
                    <label htmlFor="phone">
                      Contact Phone / WhatsApp <small>(optional)</small>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+92 3XX XXXXXXX"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="subject">
                      Subject Heading <small>(optional)</small>
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      placeholder="Brief topic heading"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                </div>

                {/* Message Details */}
                <div className="field">
                  <label htmlFor="msg">
                    Message Details <em>*</em>
                  </label>
                  <textarea
                    id="msg"
                    name="message"
                    required
                    placeholder="Briefly describe your project, systems or the course you're interested in…"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                {/* Form Footer */}
                <div className="form-foot">
                  <small>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>{' '}
                    Protected under our confidentiality policy
                  </small>
                  <button className="btn btn-blue" type="submit" disabled={loading}>
                    {loading ? 'Submitting Inquiry...' : 'Submit Confidential Inquiry'}{' '}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M7 17 17 7M8 7h9v9" />
                    </svg>
                  </button>
                </div>
              </form>
            ) : (
              /* Success State */
              <div className="success on" id="success">
                <i>✓</i>
                <h3>Inquiry received</h3>
                <p>
                  Thank you, <b>{name}</b>! Your inquiry has been securely logged in our technical
                  queue. Our desk will respond within 2–4 business hours.
                </p>
                <div className="actions" style={{ marginTop: 24 }}>
                  <a
                    href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                      `Hello Dream Cyber Security, I just submitted an inquiry on your website: ${subject || program || category}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                  >
                    Need it faster? WhatsApp Us{' '}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M7 17 17 7M8 7h9v9" />
                    </svg>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Desk Sidebar */}
          <aside className="desk">
            <div className="desk-card">
              <span className="eyebrow">Direct Communication Desk</span>
              <h2>Talk to us directly</h2>

              <div className="ci">
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5z" />
                  </svg>
                </i>
                <div>
                  <span>WhatsApp &amp; Phone</span>
                  <a href={`tel:${cleanPhone}`}>{companyPhone}</a>
                </div>
              </div>

              <div className="ci">
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 6-10 7L2 6" />
                  </svg>
                </i>
                <div>
                  <span>Inquiry Email</span>
                  <a href={`mailto:${companyEmail}`}>{companyEmail}</a>
                </div>
              </div>

              <div className="ci">
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 6-10 7L2 6" />
                  </svg>
                </i>
                <div>
                  <span>General Email</span>
                  <a href="mailto:info@dreamcybersecurity.pk">info@dreamcybersecurity.pk</a>
                </div>
              </div>

              <div className="ci">
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </i>
                <div>
                  <span>Headquarters</span>
                  <b>{companyAddress}</b>
                </div>
              </div>
            </div>

            {/* SLA Commitment */}
            <div className="sla">
              <i>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </i>
              <div>
                <b>SLA Commitment</b>
                <p>
                  Corporate security inquiries and Academy admission requests are logged in a secure
                  internal queue and answered within 2–4 business hours.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick">
              <a
                className="q-wa"
                href={`https://wa.me/${cleanWhatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5z" />
                </svg>{' '}
                WhatsApp
              </a>
              <a className="q-call" href={`tel:${cleanPhone}`}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
                </svg>{' '}
                Call Now
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* ================= GOOGLE MAP ================= */}
      <section className="block">
        <div className="map">
          <iframe
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Dream Cyber Security Pakistan Headquarters - Central Tower I, Gulberg II, Lahore"
            src="https://maps.google.com/maps?q=31.5181,74.3428&hl=en&z=17&output=embed"
            allowFullScreen
          />
          <div className="map-card">
            <b>Visit our headquarters</b>
            <p>Central Tower I, 90-B Hali Road, Block B, Gulberg II, Lahore-54660, Pakistan</p>
            <a
              className="btn btn-blue btn-sm"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.google.com/maps/search/?api=1&query=Central+Tower+I,+90-B+Hali+Road,+Block+B,+Gulberg+II,+Lahore-54660,+Pakistan"
            >
              Get Directions{' '}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ================= NEWSLETTER CARD ================= */}
      <section className="block">
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
      </section>

      {/* ================= WARM GOLD CTA BAND ================= */}
      <section className="block">
        <div className="cta-band">
          <canvas id="contact-cta-particles" ref={ctaCanvasRef} />
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
            <a href="#form" className="btn btn-blue">
              Submit Admission Inquiry{' '}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
