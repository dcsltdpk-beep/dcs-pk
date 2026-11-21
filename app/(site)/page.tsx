import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/Icon';
import { ShieldCheck, ArrowRight, Terminal, Shield, GraduationCap, Phone } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';
import { getSettings, getServices, getCourses, getPortfolio, getPosts } from '@/lib/data';
import HeroGlobeExperience from '@/components/HeroGlobeExperience';

export const revalidate = 60; // ISR cache

async function getData() {
  const [settings, allServices, allCourses, allPortfolio, allPosts] = await Promise.all([
    getSettings(),
    getServices(),
    getCourses(),
    getPortfolio(),
    getPosts(),
  ]);

  return {
    settings,
    services: allServices.slice(0, 6),
    courses: allCourses.slice(0, 4),
    portfolio: allPortfolio.slice(0, 4),
    posts: allPosts.slice(0, 2),
  };
}

export default async function HomePage() {
  const { settings, services, courses, portfolio, posts } = await getData();

  const heroTag = settings.hero_tag || 'Certified Enterprise Cyber Defense & Digital Engineering';
  const heroTitlePrefix = settings.hero_title_prefix || 'Protecting & Empowering';
  const heroTitleHighlight = settings.hero_title_highlight || 'Modern Businesses in Pakistan';
  const heroDesc = settings.hero_description || 'We engineer international-grade cybersecurity architecture, bespoke software, AI workflow automations, and corporate digital services that safeguard your assets and accelerate operational efficiency.';
  const statProjects = settings.stat_projects || '250+';
  const statClients = settings.stat_clients || '180+';
  const statTeam = settings.stat_team || '35+';
  const statExperience = settings.stat_experience || '8+ Years';
  const introVideo = settings.company_intro_video || 'https://www.youtube.com/embed/inWWhr5tnEA';

  // Fallback services if db empty
  const displayServices = services.length > 0 ? services : [
    { title: 'Web Design & Development', slug: 'web-design-development', icon: 'globe', summary: 'High-performance, secure, responsive enterprise websites.' },
    { title: 'E-commerce Development', slug: 'ecommerce-development', icon: 'shopping-cart', summary: 'Secure, scalable digital commerce architectures.' },
    { title: 'Cybersecurity Services', slug: 'cybersecurity-services', icon: 'shield-lock', summary: 'Vulnerability assessments, penetration testing, and SOC monitoring.' },
    { title: 'AI Automation & Chatbots', slug: 'ai-automation-chatbot-development', icon: 'cpu', summary: 'Autonomous workflows, LLM agents, and 24/7 assistants.' },
    { title: 'Video Editing & Motion Graphics', slug: 'video-editing-motion-graphics', icon: 'video', summary: 'Cinematic post-production, corporate showreels, and 3D reels.' },
    { title: 'Software & App Development', slug: 'software-application-development', icon: 'code', summary: 'Bespoke enterprise software, custom CRM, and secure APIs.' },
  ];

  // Fallback courses if db empty
  const displayCourses = courses.length > 0 ? courses : [
    { title: 'AI Automation & Autonomous Agents', slug: 'ai-automation', duration: '10 Weeks', overview: 'Master generative AI, prompt engineering, and n8n workflows.', instructor_name: 'Tariq Mehmood', instructor_designation: 'Principal AI Architect' },
    { title: 'Enterprise Web Development', slug: 'web-development', duration: '14 Weeks', overview: 'Build scalable full-stack applications with modern web security.', instructor_name: 'Shahid Khan', instructor_designation: 'Senior Lead Architect' },
  ];

  return (
    <>
      {/* Hero Section with Full Banner Intro Transitioning to Interactive Right-Card Globe */}
      <section className="hero-section hero-banner hero_banner">
        {/* Full Hero Banner to Right Card Interactive 2D Globe Experience */}
        <HeroGlobeExperience />

        {/* Bottom to Top Black-to-Transparent Gradient Overlay */}
        <div className="hero-banner-bottom-fade" aria-hidden="true" />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-layout-grid">
            {/* Left Column: Authoritative Brand Typography & CTAs */}
            <div className="hero-content-col">
              <span className="tag hero-tech-badge">
                <span className="tech-pulse-dot" />
                <span>{heroTag}</span>
              </span>

              <h1 className="hero-title">
                {heroTitlePrefix} <br />
                <span className="gold text-gradient-amber">{heroTitleHighlight}</span>
              </h1>

              <h2 className="hero-h2-subtitle">
                Resilient Application Design &amp; Proactive Zero-Trust Architecture
              </h2>

              <p className="hero-desc">{heroDesc}</p>

              <div className="hero-ctas">
                <Link href="/contact" className="btn btn-primary hero-btn-cta" title="Get Security Consultation">
                  <ShieldCheck size={18} className="hero-btn-icon" />
                  <span className="btn-text-full">Get Security Consultation</span>
                  <span className="btn-text-short">Consult</span>
                </Link>

                <Link href="/services" className="btn btn-ghost hero-btn-cta" title="Explore Capabilities">
                  <Terminal size={18} className="hero-btn-icon" />
                  <span className="btn-text-full">Explore Capabilities</span>
                  <span className="btn-text-short">Explore</span>
                </Link>

                <a
                  href={`https://wa.me/${settings.whatsapp_number || '923165478855'}?text=${encodeURIComponent(
                    settings.whatsapp_message || 'Hello Dream Cyber Security Pakistan, I require assistance.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp hero-btn-cta"
                  title="WhatsApp Hotline"
                >
                  <FaWhatsapp size={18} className="hero-btn-icon" />
                  <span className="btn-text-full">WhatsApp Hotline</span>
                  <span className="btn-text-short">WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right Column: Globe Target Card */}
            <div className="hero-visual-col">
              <div className="hero-visual" />
            </div>
          </div>

          {/* STATS COUNTER BAR */}
          <div className="stats-bar">
            <div className="grid grid-4">
              <div className="stat-item">
                <div className="stat-number">{statProjects}</div>
                <div className="stat-label">Enterprise Projects</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{statClients}</div>
                <div className="stat-label">Satisfied Clients</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{statTeam}</div>
                <div className="stat-label">Security &amp; Tech Experts</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{statExperience.replace(/\s*years?/i, '').trim() || '8+'}</div>
                <div className="stat-label">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Page Subsections (Smoothly revealed when intro transitions) */}
      <div className="site-subsections">
        {/* Intro Video */}
        <section className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">Who We Are</span>
              <h2 className="section-title">
                International Standards, <span className="text-gradient">Local Excellence</span>
              </h2>
              <p className="section-desc">
                Watch our executive introduction video to learn how Dream Cyber Security helps enterprises in Pakistan defend against sophisticated threats and adopt cutting-edge technology.
              </p>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <div className="video-responsive">
                <iframe src={introVideo} title="Dream Cyber Security Corporate Video" allowFullScreen loading="lazy"></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* Core Services Section */}
        <section className="section">
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">Our Capabilities</span>
              <h2 className="section-title">
                Comprehensive <span className="text-gradient">Technology Services</span>
              </h2>
              <p className="section-desc">
                From zero-trust cybersecurity assessments to advanced AI workflow automations and cloud software engineering.
              </p>
            </div>

            <div className="grid grid-3">
              {displayServices.map((srv: any) => (
                <div key={srv.slug} className="card">
                  <div style={{ color: 'var(--accent-cyan)', marginBottom: '1rem' }}>
                    <Icon name={srv.icon || 'shield'} size={28} />
                  </div>
                  <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem' }}>{srv.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    {srv.summary}
                  </p>
                  <Link href={`/services/${srv.slug}`} style={{ fontWeight: 600, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    Read Full Details &rarr;
                  </Link>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <Link href="/services" className="btn btn-outline">
                View All 10 Core Services &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* Academy Programs Section */}
        <section className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">Knowledge & Training</span>
              <h2 className="section-title">
                Dream Cyber Security <span className="text-gradient">Academy</span>
              </h2>
              <p className="section-desc">
                Explore our industry-standard practical training programs. Designed to build in-demand technical competence with mentorship from active industry practitioners.
              </p>
            </div>

            <div className="grid grid-2">
              {displayCourses.map((c: any) => (
                <div key={c.slug} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div className="card-meta-header">
                      <span className="badge badge-cyan">Featured Program</span>
                      <span className="card-duration-badge">
                        <Icon name="clock" size={13} className="duration-icon" />
                        <span className="duration-text-full">{c.duration}</span>
                        <span className="duration-text-short">{c.duration ? c.duration.split('(')[0].trim() : ''}</span>
                      </span>
                    </div>
                    <h3 style={{ marginBottom: '0.75rem' }}>{c.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
                      {c.overview}
                    </p>
                    <div style={{ borderLeft: '2px solid var(--accent-cyan)', paddingLeft: '1rem', marginBottom: '1.5rem' }}>
                      <strong style={{ color: '#fff', fontSize: '0.9rem', display: 'block' }}>Instructor:</strong>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {c.instructor_name} ({c.instructor_designation})
                      </span>
                    </div>
                  </div>
                  <div className="card-actions-row">
                    <Link href={`/courses/${c.slug}`} className="btn btn-outline card-action-btn">
                      <GraduationCap size={15} />
                      <span className="card-btn-text-full">View Course Syllabus</span>
                      <span className="card-btn-text-short">Syllabus</span>
                    </Link>
                    <Link
                      href={`/contact?inquiry_type=course_inquiry&target=${encodeURIComponent(c.title)}`}
                      className="btn btn-primary card-action-btn"
                    >
                      <Phone size={14} />
                      <span className="card-btn-text-full">Inquire for Details</span>
                      <span className="card-btn-text-short">Inquire</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Us Section */}
        <section className="section">
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">Why Partner With Us</span>
              <h2 className="section-title">
                Built on Trust, Precision, and <span className="text-gradient">Security</span>
              </h2>
              <p className="section-desc">
                We bridge international security standards with deep contextual understanding of enterprise challenges in Pakistan.
              </p>
            </div>

            <div className="grid grid-3">
              <div className="card">
                <h4 style={{ marginBottom: '0.75rem', color: 'var(--accent-cyan)' }}>Zero-Trust Security Foundation</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  Every project, web platform, or automation script is architected under strict zero-trust standards with hardened defensive controls against intrusion.
                </p>
              </div>
              <div className="card">
                <h4 style={{ marginBottom: '0.75rem', color: 'var(--accent-cyan)' }}>Certified Industry Veterans</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  Our specialists hold globally recognized certifications (CISSP, CEH, OSCP, AWS) and have hands-on experience defending corporate infrastructures.
                </p>
              </div>
              <div className="card">
                <h4 style={{ marginBottom: '0.75rem', color: 'var(--accent-cyan)' }}>Rapid 24/7 Incident Support</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  Enjoy direct communication with security engineers, immediate escalation channels, and transparent progress reports with zero bureaucratic delays.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="section" style={{ background: 'linear-gradient(135deg, rgba(251, 174, 68, 0.08) 0%, rgba(62, 56, 135, 0.15) 100%)', borderTop: '1px solid var(--border-color)' }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: '850px' }}>
            <span className="badge badge-cyan" style={{ marginBottom: '1rem' }}>Get In Touch</span>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.25rem' }}>
              Ready to Fortify Your Enterprise & <span className="text-gradient">Innovate With AI?</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
              Book a confidential cybersecurity evaluation or discuss your digital engineering roadmap with our certified team in Lahore.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
                Schedule Security Audit
              </Link>
              <Link href="/courses" className="btn btn-outline" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
                Explore Academy Courses
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
