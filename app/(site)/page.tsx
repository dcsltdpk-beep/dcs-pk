import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/Icon';
import { ShieldCheck, ArrowRight, Terminal, Shield, GraduationCap, Phone } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';
import { getSettings, getServices, getCourses, getPortfolio, getPosts } from '@/lib/data';
import HeroGlobeExperience from '@/components/HeroGlobeExperience';
import CyberServiceWheel from '@/components/CyberServiceWheel';

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
    services: allServices.slice(0, 10),
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
    { title: 'Cybersecurity Services', slug: 'cybersecurity-services', icon: 'shield-lock', summary: 'Vulnerability assessments, penetration testing, and 24/7 SOC defensive monitoring.' },
    { title: 'AI Automation & Chatbots', slug: 'ai-automation-chatbot-development', icon: 'cpu', summary: 'Autonomous workflows, custom LLM agents, and conversational intelligence.' },
    { title: 'Web Design & Development', slug: 'web-design-development', icon: 'globe', summary: 'High-performance, secure, responsive enterprise digital platforms.' },
    { title: 'Software & App Development', slug: 'software-application-development', icon: 'code', summary: 'Bespoke enterprise software, custom workflow CRM, and secure APIs.' },
    { title: 'Cloud & DevOps Solutions', slug: 'cloud-devops-solutions', icon: 'cloud', summary: 'Scalable AWS, Azure, and GCP architectures with automated CI/CD.' },
    { title: 'E-commerce Development', slug: 'ecommerce-development', icon: 'shopping-cart', summary: 'Secure, scalable digital commerce architectures and custom payment gateways.' },
    { title: 'Video Editing & Motion Graphics', slug: 'video-editing-motion-graphics', icon: 'video', summary: 'Cinematic post-production, corporate showreels, and 3D visual reels.' },
    { title: 'Domain, Hosting & IT Support', slug: 'domain-hosting-it-support', icon: 'server', summary: 'Hardened enterprise domain hosting, server infrastructure, and IT support.' },
  ];

  // Sanitize services to pure plain objects with primitive values for CyberServiceWheel Client Component
  const wheelServices = displayServices.map((s: any) => ({
    title: String(s.title || ''),
    slug: String(s.slug || ''),
    icon: String(s.icon || ''),
    summary: String(s.summary || ''),
    tagline: String(s.tagline || ''),
  }));

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
        {/* Who We Are Showcase Section */}
        <section className="section who-we-are-section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
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

            <div className="who-we-are-card card">
              <div className="who-we-are-grid">
                {/* Left Column: Video Presentation */}
                <div className="who-we-are-video-col">
                  <div className="video-responsive">
                    <iframe
                      src={introVideo}
                      title="Dream Cyber Security Corporate Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Right Column: Executive Overview & Story */}
                <div className="who-we-are-content-col">
                  <h3 className="who-we-are-heading">
                    Pioneering Cyber Resilience &amp; <span className="text-gradient">Digital Mastery</span>
                  </h3>
                  <p className="who-we-are-desc">
                    Dream Cyber Security was established with an uncompromising mandate: deliver international-standard cyber defense, zero-trust architectures, and cutting-edge software engineering to enterprises across Pakistan and the region.
                  </p>
                  <p className="who-we-are-desc">
                    We bridge certified technical vigilance with strategic technological innovation, enabling corporate organizations, institutions, and fast-growing businesses to operate fearlessly in an evolving threat landscape.
                  </p>
                  <Link href="/about" className="btn btn-primary who-we-are-btn">
                    <span>Explore Our Story</span>
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comprehensive Technology Services - Cyber Service Wheel Interactive Experience */}
        <CyberServiceWheel services={wheelServices} />

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
                <div key={c.slug} className="card course-card-compact">
                  <div>
                    <div className="card-meta-header">
                      <span className="badge badge-cyan">Featured Program</span>
                      <span className="card-duration-badge">
                        <Icon name="clock" size={13} className="duration-icon" />
                        <span className="duration-text-full">{c.duration}</span>
                        <span className="duration-text-short">{c.duration ? c.duration.split('(')[0].trim() : ''}</span>
                      </span>
                    </div>
                    <h3 className="course-card-title">{c.title}</h3>
                    <p className="course-card-desc">
                      {c.overview}
                    </p>
                    <div className="course-instructor-box">
                      <strong style={{ color: '#fff', fontSize: '0.86rem', display: 'block' }}>Instructor:</strong>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
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
        <section className="section" style={{ background: 'var(--bg-primary)' }}>
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
              <div className="card why-us-card">
                <h4 className="why-us-title">Zero-Trust Security Foundation</h4>
                <p className="why-us-desc">
                  Every project, web platform, or automation script is architected under strict zero-trust standards with hardened defensive controls against intrusion.
                </p>
              </div>
              <div className="card why-us-card">
                <h4 className="why-us-title">Certified Industry Veterans</h4>
                <p className="why-us-desc">
                  Our specialists hold globally recognized certifications (CISSP, CEH, OSCP, AWS) and have hands-on experience defending corporate infrastructures.
                </p>
              </div>
              <div className="card why-us-card">
                <h4 className="why-us-title">Rapid 24/7 Incident Support</h4>
                <p className="why-us-desc">
                  Enjoy direct communication with security engineers, immediate escalation channels, and transparent progress reports with zero bureaucratic delays.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="section" style={{ background: 'linear-gradient(135deg, rgba(251, 174, 68, 0.12) 0%, rgba(62, 56, 135, 0.25) 100%), #141133', borderTop: '1px solid var(--border-color)' }}>
          <div className="container">
            <div className="cta-banner-wrap">
              <span className="badge badge-cyan" style={{ marginBottom: 'clamp(0.4rem, 0.8vh, 0.65rem)', display: 'inline-flex' }}>Get In Touch</span>
              <h2 className="cta-banner-title">
                Ready to Fortify Your Enterprise &amp; <span className="text-gradient">Innovate With AI?</span>
              </h2>
              <p className="cta-banner-desc">
                Book a confidential cybersecurity evaluation or discuss your digital engineering roadmap with our certified team in Lahore.
              </p>
              <div className="cta-banner-actions">
                <Link href="/contact" className="btn btn-primary cta-banner-btn">
                  Schedule Security Audit
                </Link>
                <Link href="/courses" className="btn btn-outline cta-banner-btn">
                  Explore Academy Courses
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
