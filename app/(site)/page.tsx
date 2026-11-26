import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Terminal } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';
import { getSettings, getServices, getCourses, getPortfolio, getPosts } from '@/lib/data';
import { getCanonicalUrl } from '@/lib/seo';
import HeroGlobeExperience from '@/components/HeroGlobeExperience';
import CyberServiceWheel from '@/components/CyberServiceWheel';
import { HomeWhoWeAre, HomeLowerSections } from '@/components/HomeSections';

export const revalidate = 60; // ISR cache

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteName = settings.site_name || 'Dream Cyber Security Pakistan';
  const metaTitle = settings.meta_title || `${siteName} | Cyber Defense & IT Solutions`;
  const metaDesc =
    settings.meta_description ||
    'Premier international-standard cybersecurity firm, bespoke software engineering, AI workflow automations, and training academy in Pakistan.';

  return {
    title: { absolute: metaTitle },
    description: metaDesc,
    alternates: {
      canonical: getCanonicalUrl('/'),
    },
  };
}

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
  const heroDesc =
    settings.hero_description ||
    'We engineer international-grade cybersecurity architecture, bespoke software, AI workflow automations, and corporate digital services that safeguard your assets and accelerate operational efficiency.';
  const statProjects = settings.stat_projects || '250+';
  const statClients = settings.stat_clients || '180+';
  const statTeam = settings.stat_team || '35+';
  const statExperience = settings.stat_experience || '8+ Years';

  // Fallback services if db empty
  const displayServices =
    services.length > 0
      ? services
      : [
          {
            title: 'Cybersecurity Services',
            slug: 'cybersecurity-services',
            icon: 'shield-lock',
            summary:
              'Vulnerability assessments, penetration testing, and 24/7 SOC defensive monitoring.',
          },
          {
            title: 'AI Automation & Chatbots',
            slug: 'ai-automation-chatbot-development',
            icon: 'cpu',
            summary:
              'Autonomous workflows, custom LLM agents, and conversational intelligence.',
          },
          {
            title: 'Web Design & Development',
            slug: 'web-design-development',
            icon: 'globe',
            summary:
              'High-performance, secure, responsive enterprise digital platforms.',
          },
          {
            title: 'Software & App Development',
            slug: 'software-application-development',
            icon: 'code',
            summary:
              'Bespoke enterprise software, custom workflow CRM, and secure APIs.',
          },
          {
            title: 'Cloud & DevOps Solutions',
            slug: 'cloud-devops-solutions',
            icon: 'cloud',
            summary:
              'Scalable AWS, Azure, and GCP architectures with automated CI/CD.',
          },
          {
            title: 'E-commerce Development',
            slug: 'ecommerce-development',
            icon: 'shopping-cart',
            summary:
              'Secure, scalable digital commerce architectures and custom payment gateways.',
          },
          {
            title: 'Video Editing & Motion Graphics',
            slug: 'video-editing-motion-graphics',
            icon: 'video',
            summary:
              'Cinematic post-production, corporate showreels, and 3D visual reels.',
          },
          {
            title: 'Domain, Hosting & IT Support',
            slug: 'domain-hosting-it-support',
            icon: 'server',
            summary:
              'Hardened enterprise domain hosting, server infrastructure, and IT support.',
          },
        ];

  // Sanitize services to pure plain objects with primitive values for CyberServiceWheel Client Component
  const wheelServices = displayServices.map((s: any) => ({
    title: String(s.title || ''),
    slug: String(s.slug || ''),
    icon: String(s.icon || ''),
    summary: String(s.summary || ''),
    tagline: String(s.tagline || ''),
  }));

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
                <Link
                  href="/contact"
                  className="btn btn-primary hero-btn-cta"
                  title="Get Security Consultation"
                >
                  <ShieldCheck size={18} className="hero-btn-icon" />
                  <span className="btn-text-full">Get Security Consultation</span>
                  <span className="btn-text-short">Consult</span>
                </Link>

                <Link
                  href="/services"
                  className="btn btn-ghost hero-btn-cta"
                  title="Explore Capabilities"
                >
                  <Terminal size={18} className="hero-btn-icon" />
                  <span className="btn-text-full">Explore Capabilities</span>
                  <span className="btn-text-short">Explore</span>
                </Link>

                <a
                  href={`https://wa.me/${settings.whatsapp_number || '923165478855'}?text=${encodeURIComponent(
                    settings.whatsapp_message ||
                      'Hello Dream Cyber Security Pakistan, I require assistance.'
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
                <div className="stat-number">
                  {statExperience.replace(/\s*years?/i, '').trim() || '8+'}
                </div>
                <div className="stat-label">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Page Subsections (Smoothly revealed when intro transitions) */}
      <div className="site-subsections">
        {/* 2. Who We Are Showcase */}
        <HomeWhoWeAre settings={settings} />

        {/* 3. Comprehensive Technology Services - Cyber Service Wheel Interactive Experience */}
        <div id="services">
          <CyberServiceWheel services={wheelServices} />
        </div>

        {/* 4 to 9: How We Deliver, Delivered Work, Academy, Why Us, Insights & FAQ, CTA */}
        <HomeLowerSections
          settings={settings}
          courses={courses}
          portfolio={portfolio}
          posts={posts}
        />
      </div>
    </>
  );
}
