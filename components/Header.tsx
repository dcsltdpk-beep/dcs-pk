'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  Shield,
  Code2,
  Bot,
  Video,
  Palette,
  ShoppingCart,
  Layers,
  Cloud,
  GraduationCap,
  Users,
  Briefcase,
  PlaySquare,
  FileText,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Menu,
  X,
  Phone,
} from 'lucide-react';

interface HeaderProps {
  siteName?: string;
}

export default function Header({ siteName = 'Dream Cyber Security Pakistan' }: HeaderProps) {
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close menus on page navigation
  useEffect(() => {
    setActiveMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  // Handle desktop mouse enter/leave with debounce
  const handleMouseEnter = (menuName: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveMenu(menuName);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const toggleMobileMenu = () => {
    setMobileOpen((prev) => !prev);
  };

  const toggleMobileAccordion = (key: string) => {
    setMobileAccordion((prev) => (prev === key ? null : key));
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.nav-item-has-dropdown') && !target.closest('.mega-dropdown-menu')) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* Brand Logo */}
        <Link href="/" className="brand-logo" aria-label={siteName}>
          <Image
            src="/logo.png"
            alt={siteName}
            width={38}
            height={38}
            style={{ width: '38px', height: '38px', objectFit: 'contain', borderRadius: '50%' }}
            priority
          />
          <div className="brand-text-wrap">
            <span className="brand-dream">DREAM</span>
            <span className="brand-cyber">CYBER</span>
            <span className="brand-badge">Pakistan</span>
          </div>
        </Link>

        {/* Desktop Navigation with Mega Menus */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <ul className="nav-menu">
            {/* 1. Home */}
            <li className="nav-item">
              <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
                Home
              </Link>
            </li>

            {/* 2. Services Mega Menu */}
            <li
              className="nav-item nav-item-has-dropdown nav-item-mega"
              onMouseEnter={() => handleMouseEnter('services')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={`nav-link dropdown-trigger ${pathname.startsWith('/services') || activeMenu === 'services' ? 'active' : ''}`}
                onClick={() => setActiveMenu(activeMenu === 'services' ? null : 'services')}
                aria-expanded={activeMenu === 'services'}
              >
                <span>Services</span>
                <ChevronDown className={`chevron-icon ${activeMenu === 'services' ? 'rotated' : ''}`} size={14} />
              </button>

              {/* Mega Dropdown Panel */}
              {activeMenu === 'services' && (
                <div
                  className="mega-dropdown-menu mega-services"
                  onMouseEnter={() => handleMouseEnter('services')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="mega-grid-3">
                    {/* Col 1: Tech & Cyber Defense */}
                    <div className="mega-col">
                      <div className="mega-col-heading">Cyber Defense & Engineering</div>
                      <div className="mega-links-list">
                        <Link href="/services/cybersecurity-services" className="mega-item">
                          <div className="mega-icon-box">
                            <Shield size={18} />
                          </div>
                          <div>
                            <div className="mega-title">Cybersecurity Services</div>
                            <div className="mega-desc">VAPT, SOC monitoring & hardened defense</div>
                          </div>
                        </Link>

                        <Link href="/services/web-design-development" className="mega-item">
                          <div className="mega-icon-box">
                            <Code2 size={18} />
                          </div>
                          <div>
                            <div className="mega-title">Web Design & Development</div>
                            <div className="mega-desc">High-performance secure web systems</div>
                          </div>
                        </Link>

                        <Link href="/services/software-application-development" className="mega-item">
                          <div className="mega-icon-box">
                            <Layers size={18} />
                          </div>
                          <div>
                            <div className="mega-title">Software & App Development</div>
                            <div className="mega-desc">Bespoke enterprise software & APIs</div>
                          </div>
                        </Link>

                        <Link href="/services/cloud-devops-solutions" className="mega-item">
                          <div className="mega-icon-box">
                            <Cloud size={18} />
                          </div>
                          <div>
                            <div className="mega-title">Cloud & DevOps Solutions</div>
                            <div className="mega-desc">Zero-trust architecture & CI/CD</div>
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* Col 2: AI, Commerce & Creative */}
                    <div className="mega-col">
                      <div className="mega-col-heading">Automation & Creative</div>
                      <div className="mega-links-list">
                        <Link href="/services/ai-automation-chatbot-development" className="mega-item">
                          <div className="mega-icon-box">
                            <Bot size={18} />
                          </div>
                          <div>
                            <div className="mega-title">AI Automation & Chatbots</div>
                            <div className="mega-desc">LLM agents & autonomous workflows</div>
                          </div>
                        </Link>

                        <Link href="/services/ecommerce-development" className="mega-item">
                          <div className="mega-icon-box">
                            <ShoppingCart size={18} />
                          </div>
                          <div>
                            <div className="mega-title">E-Commerce Development</div>
                            <div className="mega-desc">High-conversion scalable online stores</div>
                          </div>
                        </Link>

                        <Link href="/services/video-editing-motion-graphics" className="mega-item">
                          <div className="mega-icon-box">
                            <Video size={18} />
                          </div>
                          <div>
                            <div className="mega-title">Video & Motion Graphics</div>
                            <div className="mega-desc">Cinematic post-production & reels</div>
                          </div>
                        </Link>

                        <Link href="/services/graphic-design-branding" className="mega-item">
                          <div className="mega-icon-box">
                            <Palette size={18} />
                          </div>
                          <div>
                            <div className="mega-title">Graphic Design & Branding</div>
                            <div className="mega-desc">Visual identities & modern UI/UX</div>
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* Col 3: Featured Launch Package Strip (matches dcs-card) */}
                    <div className="mega-col mega-featured-card">
                      <div className="featured-badge">
                        <Sparkles size={12} /> ALL-IN-ONE SOLUTION
                      </div>
                      <h4 className="featured-title">Business Startup Package</h4>
                      <p className="featured-desc">
                        Complete launch suite for ambitious startups: Branding, Logo, Web, Socials & Promo Video.
                      </p>
                      <div className="featured-tags">
                        <span>Branding</span>
                        <span>Website</span>
                        <span>SEO</span>
                        <span>Security</span>
                      </div>
                      <Link href="/services" className="featured-cta-link">
                        Explore All 10 Services <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </li>

            {/* 3. Academy Mega Menu */}
            <li
              className="nav-item nav-item-has-dropdown nav-item-mega"
              onMouseEnter={() => handleMouseEnter('academy')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={`nav-link dropdown-trigger ${pathname.startsWith('/courses') || activeMenu === 'academy' ? 'active' : ''}`}
                onClick={() => setActiveMenu(activeMenu === 'academy' ? null : 'academy')}
                aria-expanded={activeMenu === 'academy'}
              >
                <span>Academy</span>
                <ChevronDown className={`chevron-icon ${activeMenu === 'academy' ? 'rotated' : ''}`} size={14} />
              </button>

              {activeMenu === 'academy' && (
                <div
                  className="mega-dropdown-menu mega-academy"
                  onMouseEnter={() => handleMouseEnter('academy')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="mega-grid-3">
                    {/* Programs Col 1 */}
                    <div className="mega-col">
                      <div className="mega-col-heading">Specialized Engineering</div>
                      <div className="mega-links-list">
                        <Link href="/courses/ai-automation" className="mega-item">
                          <div className="mega-icon-box">
                            <Bot size={18} />
                          </div>
                          <div>
                            <div className="mega-title">
                              AI Automation & Agents <span className="mini-badge-gold">HOT</span>
                            </div>
                            <div className="mega-desc">LLM workflows, agents & n8n (10 Weeks)</div>
                          </div>
                        </Link>

                        <Link href="/courses/web-development" className="mega-item">
                          <div className="mega-icon-box">
                            <Code2 size={18} />
                          </div>
                          <div>
                            <div className="mega-title">
                              Enterprise Web Dev <span className="mini-badge-blue">CAREER</span>
                            </div>
                            <div className="mega-desc">Full-stack React, Next.js & APIs (14 Weeks)</div>
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* Programs Col 2 */}
                    <div className="mega-col">
                      <div className="mega-col-heading">Creative & Foundations</div>
                      <div className="mega-links-list">
                        <Link href="/courses/video-editing-graphic-design" className="mega-item">
                          <div className="mega-icon-box">
                            <Video size={18} />
                          </div>
                          <div>
                            <div className="mega-title">Video Editing & Design</div>
                            <div className="mega-desc">Premiere Pro, After Effects & 3D (8 Weeks)</div>
                          </div>
                        </Link>

                        <Link href="/courses/computer-basics" className="mega-item">
                          <div className="mega-icon-box">
                            <GraduationCap size={18} />
                          </div>
                          <div>
                            <div className="mega-title">Computer Basics & Office</div>
                            <div className="mega-desc">Digital literacy & cyber hygiene (6 Weeks)</div>
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* Academy Spotlight Banner */}
                    <div className="mega-col mega-featured-card">
                      <div className="featured-badge">
                        <GraduationCap size={12} /> DCS SKILL ACADEMY
                      </div>
                      <h4 className="featured-title">Learn & Earn Guarantee</h4>
                      <p className="featured-desc">
                        Hands-on corporate labs, certified professional mentors, verified diploma & direct internship access.
                      </p>
                      <Link href="/courses" className="featured-cta-link">
                        View All Programs <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </li>

            {/* 4. Company Dropdown */}
            <li
              className="nav-item nav-item-has-dropdown"
              onMouseEnter={() => handleMouseEnter('company')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={`nav-link dropdown-trigger ${pathname === '/about' || pathname === '/team' || activeMenu === 'company' ? 'active' : ''}`}
                onClick={() => setActiveMenu(activeMenu === 'company' ? null : 'company')}
                aria-expanded={activeMenu === 'company'}
              >
                <span>Company</span>
                <ChevronDown className={`chevron-icon ${activeMenu === 'company' ? 'rotated' : ''}`} size={14} />
              </button>

              {activeMenu === 'company' && (
                <div
                  className="mega-dropdown-menu simple-dropdown"
                  onMouseEnter={() => handleMouseEnter('company')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="mega-links-list">
                    <Link href="/about" className="mega-item">
                      <div className="mega-icon-box">
                        <Shield size={18} />
                      </div>
                      <div>
                        <div className="mega-title">About Our Firm</div>
                        <div className="mega-desc">Our mission, security standards & leadership</div>
                      </div>
                    </Link>

                    <Link href="/team" className="mega-item">
                      <div className="mega-icon-box">
                        <Users size={18} />
                      </div>
                      <div>
                        <div className="mega-title">Leadership & Team</div>
                        <div className="mega-desc">Certified cybersecurity architects & engineers</div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </li>

            {/* 5. Showcase & Insights Dropdown */}
            <li
              className="nav-item nav-item-has-dropdown"
              onMouseEnter={() => handleMouseEnter('insights')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={`nav-link dropdown-trigger ${pathname === '/portfolio' || pathname === '/videos' || pathname === '/blog' || pathname === '/faq' || activeMenu === 'insights' ? 'active' : ''}`}
                onClick={() => setActiveMenu(activeMenu === 'insights' ? null : 'insights')}
                aria-expanded={activeMenu === 'insights'}
              >
                <span>Insights</span>
                <ChevronDown className={`chevron-icon ${activeMenu === 'insights' ? 'rotated' : ''}`} size={14} />
              </button>

              {activeMenu === 'insights' && (
                <div
                  className="mega-dropdown-menu simple-dropdown insights-dropdown"
                  onMouseEnter={() => handleMouseEnter('insights')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="mega-links-list">
                    <Link href="/portfolio" className="mega-item">
                      <div className="mega-icon-box">
                        <Briefcase size={18} />
                      </div>
                      <div>
                        <div className="mega-title">Delivered Portfolio</div>
                        <div className="mega-desc">Real-world enterprise client case studies</div>
                      </div>
                    </Link>

                    <Link href="/videos" className="mega-item">
                      <div className="mega-icon-box">
                        <PlaySquare size={18} />
                      </div>
                      <div>
                        <div className="mega-title">Video Gallery</div>
                        <div className="mega-desc">Tech showreels, demonstrations & demos</div>
                      </div>
                    </Link>

                    <Link href="/blog" className="mega-item">
                      <div className="mega-icon-box">
                        <FileText size={18} />
                      </div>
                      <div>
                        <div className="mega-title">Threat Advisories & Blog</div>
                        <div className="mega-desc">Latest cybersecurity insights & updates</div>
                      </div>
                    </Link>

                    <Link href="/faq" className="mega-item">
                      <div className="mega-icon-box">
                        <HelpCircle size={18} />
                      </div>
                      <div>
                        <div className="mega-title">Knowledgebase & FAQ</div>
                        <div className="mega-desc">Answers to common corporate questions</div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </li>

            {/* 6. Contact */}
            <li className="nav-item">
              <Link href="/contact" className={`nav-link ${pathname === '/contact' ? 'active' : ''}`}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right CTA Consultation Button */}
        <div className="header-actions">
          <Link href="/contact" className="btn btn-primary header-cta-btn">
            <Phone size={14} />
            <span>Consult Security</span>
          </Link>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            className="mobile-menu-toggle-btn"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Over Drawer Navigation */}
      {mobileOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileOpen(false)}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div className="brand-logo">
                <Image
                  src="/logo.png"
                  alt={siteName}
                  width={32}
                  height={32}
                  style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                />
                <span className="brand-dream">DREAM</span>
                <span className="brand-cyber">CYBER</span>
              </div>
              <button
                type="button"
                className="mobile-drawer-close"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mobile-drawer-body">
              {/* Home */}
              <Link href="/" className={`mobile-nav-link ${pathname === '/' ? 'active' : ''}`}>
                Home
              </Link>

              {/* Services Accordion */}
              <div className="mobile-accordion-group">
                <button
                  type="button"
                  className="mobile-accordion-trigger"
                  onClick={() => toggleMobileAccordion('services')}
                >
                  <span>Services</span>
                  <ChevronDown className={`chevron-icon ${mobileAccordion === 'services' ? 'rotated' : ''}`} size={16} />
                </button>
                {mobileAccordion === 'services' && (
                  <div className="mobile-accordion-content">
                    <Link href="/services/cybersecurity-services">Cybersecurity Services</Link>
                    <Link href="/services/web-design-development">Web Design & Development</Link>
                    <Link href="/services/software-application-development">Software & App Development</Link>
                    <Link href="/services/ai-automation-chatbot-development">AI Automation & Chatbots</Link>
                    <Link href="/services/ecommerce-development">E-Commerce Development</Link>
                    <Link href="/services/video-editing-motion-graphics">Video & Motion Graphics</Link>
                    <Link href="/services/graphic-design-branding">Graphic Design & Branding</Link>
                    <Link href="/services" className="mobile-view-all">View All 10 Services &rarr;</Link>
                  </div>
                )}
              </div>

              {/* Academy Accordion */}
              <div className="mobile-accordion-group">
                <button
                  type="button"
                  className="mobile-accordion-trigger"
                  onClick={() => toggleMobileAccordion('academy')}
                >
                  <span>DCS Academy</span>
                  <ChevronDown className={`chevron-icon ${mobileAccordion === 'academy' ? 'rotated' : ''}`} size={16} />
                </button>
                {mobileAccordion === 'academy' && (
                  <div className="mobile-accordion-content">
                    <Link href="/courses/ai-automation">AI Automation & Agents (10 Wks)</Link>
                    <Link href="/courses/web-development">Enterprise Web Development (14 Wks)</Link>
                    <Link href="/courses/video-editing-graphic-design">Video Editing & Motion (8 Wks)</Link>
                    <Link href="/courses/computer-basics">Computer Basics & Office (6 Wks)</Link>
                    <Link href="/courses" className="mobile-view-all">View All Academy Courses &rarr;</Link>
                  </div>
                )}
              </div>

              {/* Company Accordion */}
              <div className="mobile-accordion-group">
                <button
                  type="button"
                  className="mobile-accordion-trigger"
                  onClick={() => toggleMobileAccordion('company')}
                >
                  <span>Company</span>
                  <ChevronDown className={`chevron-icon ${mobileAccordion === 'company' ? 'rotated' : ''}`} size={16} />
                </button>
                {mobileAccordion === 'company' && (
                  <div className="mobile-accordion-content">
                    <Link href="/about">About Us</Link>
                    <Link href="/team">Leadership & Team</Link>
                  </div>
                )}
              </div>

              {/* Insights Accordion */}
              <div className="mobile-accordion-group">
                <button
                  type="button"
                  className="mobile-accordion-trigger"
                  onClick={() => toggleMobileAccordion('insights')}
                >
                  <span>Insights & Media</span>
                  <ChevronDown className={`chevron-icon ${mobileAccordion === 'insights' ? 'rotated' : ''}`} size={16} />
                </button>
                {mobileAccordion === 'insights' && (
                  <div className="mobile-accordion-content">
                    <Link href="/portfolio">Delivered Portfolio</Link>
                    <Link href="/videos">Video Showcase</Link>
                    <Link href="/blog">Threat Advisories & Blog</Link>
                    <Link href="/faq">Knowledgebase & FAQ</Link>
                  </div>
                )}
              </div>

              {/* Contact */}
              <Link href="/contact" className={`mobile-nav-link ${pathname === '/contact' ? 'active' : ''}`}>
                Contact Us
              </Link>

              {/* Mobile CTA */}
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(63, 57, 131, 0.5)' }}>
                <Link href="/contact" className="btn btn-primary" style={{ width: '100%' }}>
                  <Phone size={16} />
                  <span>Get Security Consultation</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
