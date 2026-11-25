'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaWhatsapp } from 'react-icons/fa6';

interface HeaderProps {
  siteName?: string;
  whatsappNumber?: string;
}

export default function Header({
  siteName = 'Dream Cyber Security Pakistan',
  whatsappNumber = '923165478855',
}: HeaderProps) {
  const rawPathname = usePathname();
  const pathname = rawPathname || '';

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDetails, setOpenDetails] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const headerRef = useRef<HTMLElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sliding pill position
  const [pillStyle, setPillStyle] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
    opacity: number;
  }>({ left: 0, top: 0, width: 0, height: 0, opacity: 0 });

  // Small panels (Company, Insights) dynamic horizontal offset
  const [smOffsets, setSmOffsets] = useState<{ company: number; insights: number }>({
    company: 0,
    insights: 0,
  });

  // Close menus on pathname change
  useEffect(() => {
    setActiveMenu(null);
    setMobileOpen(false);
    setPillStyle((prev) => ({ ...prev, opacity: 0 }));
  }, [pathname]);

  // Scroll shrink & progress line
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      if (barRef.current) {
        barRef.current.style.setProperty('--p', progress.toFixed(3));
      }
      if (headerRef.current) {
        headerRef.current.style.setProperty('--p', progress.toFixed(3));
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Click outside and Escape key handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
        setMobileOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMenu(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Helper to move sliding pill indicator
  const movePill = (el: HTMLElement | null) => {
    if (!el || !barRef.current) {
      setPillStyle((prev) => ({ ...prev, opacity: 0 }));
      return;
    }
    const r = el.getBoundingClientRect();
    const h = barRef.current.getBoundingClientRect();
    setPillStyle({
      left: r.left - h.left,
      top: r.top - h.top,
      width: r.width,
      height: r.height,
      opacity: 1,
    });
  };

  // Helper to position small mega panels under their trigger
  const positionSmPanel = (btn: HTMLElement, menuKey: 'company' | 'insights') => {
    if (!barRef.current) return;
    const b = btn.getBoundingClientRect();
    const h = barRef.current.getBoundingClientRect();
    const w = 420;
    const left = Math.min(Math.max(b.left - h.left + b.width / 2 - w / 2, 0), h.width - w);
    setSmOffsets((prev) => ({ ...prev, [menuKey]: left }));
  };

  const handleTriggerMouseEnter = (e: React.MouseEvent<HTMLButtonElement>, menuKey: string) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    movePill(e.currentTarget);
    if (menuKey === 'company' || menuKey === 'insights') {
      positionSmPanel(e.currentTarget, menuKey);
    }
    setActiveMenu(menuKey);
  };

  const handleLinkMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    movePill(e.currentTarget);
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 120);
  };

  const handleBarMouseLeave = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
      movePill(null);
    }, 180);
  };

  const handleMegaMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
  };

  const handleTriggerClick = (e: React.MouseEvent<HTMLButtonElement>, menuKey: string) => {
    e.preventDefault();
    if (activeMenu === menuKey) {
      setActiveMenu(null);
    } else {
      movePill(e.currentTarget);
      if (menuKey === 'company' || menuKey === 'insights') {
        positionSmPanel(e.currentTarget, menuKey);
      }
      setActiveMenu(menuKey);
    }
  };

  // Active route checking
  const isHome = pathname === '/';
  const isServices = pathname.startsWith('/services');
  const isAcademy = pathname.startsWith('/courses');
  const isCompany = pathname === '/about' || pathname.startsWith('/team');
  const isInsights =
    pathname === '/portfolio' ||
    pathname === '/videos' ||
    pathname.startsWith('/blog') ||
    pathname === '/faq';
  const isContact = pathname === '/contact';

  const isExactItem = (href: string) => {
    const cleanPath = pathname.replace(/\/$/, '') || '/';
    const cleanHref = href.split('?')[0].replace(/\/$/, '') || '/';
    return cleanPath === cleanHref;
  };

  const itemStyle = (href: string) => {
    return isExactItem(href) ? { background: '#fff7e8' } : undefined;
  };

  const waHref = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '') || '923165478855'}`;

  return (
    <header
      ref={headerRef}
      className={`dcs-header ${scrolled ? 'scrolled' : ''} ${mobileOpen ? 'menu-open' : ''}`}
      id="dcsHeader"
    >
      <div ref={barRef} className="dcs-bar" onMouseLeave={handleBarMouseLeave}>
        {/* Sliding hover pill indicator */}
        <span
          className="dcs-pill"
          aria-hidden="true"
          style={{
            left: `${pillStyle.left}px`,
            top: `${pillStyle.top}px`,
            width: `${pillStyle.width}px`,
            height: `${pillStyle.height}px`,
            opacity: pillStyle.opacity,
          }}
        />

        {/* Brand Logo */}
        <Link
          href="/"
          className="dcs-logo"
          aria-label={`${siteName} — Home`}
          onClick={() => setMobileOpen(false)}
        >
          <img
            src="/logo.png"
            alt={siteName}
            width={42}
            height={42}
          />
          <span>
            <b>DREAM CYBER SECURITY</b>
            <small>PAKISTAN</small>
          </span>
        </Link>

        {/* Desktop Main Navigation */}
        <ul className="dcs-nav" role="menubar">
          {/* HOME */}
          <li role="none">
            <Link
              href="/"
              role="menuitem"
              className={`dcs-link ${isHome ? 'current' : ''}`}
              onMouseEnter={handleLinkMouseEnter}
              onFocus={(e) => movePill(e.currentTarget)}
            >
              Home
            </Link>
          </li>

          {/* SERVICES */}
          <li role="none">
            <button
              type="button"
              className={`dcs-link ${isServices ? 'current' : ''}`}
              aria-expanded={activeMenu === 'services'}
              aria-controls="m-services"
              onMouseEnter={(e) => handleTriggerMouseEnter(e, 'services')}
              onClick={(e) => handleTriggerClick(e, 'services')}
              onFocus={(e) => movePill(e.currentTarget)}
            >
              Services
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            <div
              className={`dcs-mega ${activeMenu === 'services' ? 'open' : ''}`}
              id="m-services"
              onMouseEnter={handleMegaMouseEnter}
            >
              <div className="dcs-panel dcs-cols-3">
                {/* Col 1 */}
                <div className="dcs-col">
                  <h6>Cyber Defense &amp; Engineering</h6>
                  <Link
                    className="dcs-item"
                    href="/services/cybersecurity"
                    style={itemStyle('/services/cybersecurity')}
                  >
                    <span className="dcs-ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z" />
                      </svg>
                    </span>
                    <div>
                      <b>Cybersecurity Services</b>
                      <span>VAPT, SOC monitoring &amp; hardened defense</span>
                    </div>
                    <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>

                  <Link
                    className="dcs-item"
                    href="/services/web-development"
                    style={itemStyle('/services/web-development')}
                  >
                    <span className="dcs-ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="m8 9-4 3 4 3M16 9l4 3-4 3M13 6l-2 12" />
                      </svg>
                    </span>
                    <div>
                      <b>Web Design &amp; Development</b>
                      <span>High-performance secure web systems</span>
                    </div>
                    <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>

                  <Link
                    className="dcs-item"
                    href="/services/software-development"
                    style={itemStyle('/services/software-development')}
                  >
                    <span className="dcs-ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="m12 2 10 5-10 5L2 7z" />
                        <path d="m2 17 10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    </span>
                    <div>
                      <b>Software &amp; App Development</b>
                      <span>Bespoke enterprise software &amp; APIs</span>
                    </div>
                    <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>

                  <Link
                    className="dcs-item"
                    href="/services/cloud-devops"
                    style={itemStyle('/services/cloud-devops')}
                  >
                    <span className="dcs-ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M17.5 19H8a6 6 0 1 1 5.7-8H15a4.5 4.5 0 0 1 2.5 8z" />
                      </svg>
                    </span>
                    <div>
                      <b>Cloud &amp; DevOps Solutions</b>
                      <span>Zero-trust architecture &amp; CI/CD</span>
                    </div>
                    <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </div>

                {/* Col 2 */}
                <div className="dcs-col">
                  <h6>Automation &amp; Creative</h6>
                  <Link
                    className="dcs-item"
                    href="/services/ai-automation"
                    style={itemStyle('/services/ai-automation')}
                  >
                    <span className="dcs-ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="4" y="8" width="16" height="12" rx="3" />
                        <path d="M12 8V4M9 13v1M15 13v1M2 14h2M20 14h2" />
                      </svg>
                    </span>
                    <div>
                      <b>AI Automation &amp; Chatbots</b>
                      <span>LLM agents &amp; autonomous workflows</span>
                    </div>
                    <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>

                  <Link
                    className="dcs-item"
                    href="/services/ecommerce"
                    style={itemStyle('/services/ecommerce')}
                  >
                    <span className="dcs-ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <circle cx="9" cy="20" r="1.5" />
                        <circle cx="18" cy="20" r="1.5" />
                        <path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 7H6" />
                      </svg>
                    </span>
                    <div>
                      <b>E-Commerce Development</b>
                      <span>High-conversion scalable online stores</span>
                    </div>
                    <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>

                  <Link
                    className="dcs-item"
                    href="/services/video-motion"
                    style={itemStyle('/services/video-motion')}
                  >
                    <span className="dcs-ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="2" y="6" width="14" height="12" rx="2" />
                        <path d="m16 10 6-3v10l-6-3" />
                      </svg>
                    </span>
                    <div>
                      <b>Video &amp; Motion Graphics</b>
                      <span>Cinematic post-production &amp; reels</span>
                    </div>
                    <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>

                  <Link
                    className="dcs-item"
                    href="/services/graphic-design"
                    style={itemStyle('/services/graphic-design')}
                  >
                    <span className="dcs-ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <circle cx="13.5" cy="6.5" r="1" />
                        <circle cx="17.5" cy="10.5" r="1" />
                        <circle cx="8.5" cy="7.5" r="1" />
                        <circle cx="6.5" cy="12.5" r="1" />
                        <path d="M12 2a10 10 0 0 0 0 20c1 0 1.7-.8 1.7-1.7 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.8-1.7 1.7-1.7h2A5.6 5.6 0 0 0 22 13.9C22 7.3 17.5 2 12 2z" />
                      </svg>
                    </span>
                    <div>
                      <b>Graphic Design &amp; Branding</b>
                      <span>Visual identities &amp; modern UI/UX</span>
                    </div>
                    <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </div>

                {/* Promo Card */}
                <div className="dcs-promo">
                  <span className="lbl">✦ All-in-one solution</span>
                  <h5>Business Startup Package</h5>
                  <p>Everything needed to launch securely: brand, web, cloud &amp; compliance in 21 days.</p>
                  <div className="chips">
                    <span>Branding</span>
                    <span>Fast Web</span>
                    <span>Domain/SSL</span>
                    <span>Cloud Setup</span>
                    <span>Audit</span>
                  </div>
                  <Link className="go" href="/contact?type=quote&service=startup-package">
                    Claim startup package
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M7 17 17 7M8 7h9v9" />
                    </svg>
                  </Link>
                </div>

                {/* Panel Footer Strip */}
                <div className="dcs-strip">
                  <span>
                    <b>Not sure what you need?</b> Our consultants reply within 2–4 business hours.
                  </span>
                  <Link href="/services">
                    Explore all services
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </li>

          {/* ACADEMY */}
          <li role="none">
            <button
              type="button"
              className={`dcs-link ${isAcademy ? 'current' : ''}`}
              aria-expanded={activeMenu === 'academy'}
              aria-controls="m-academy"
              onMouseEnter={(e) => handleTriggerMouseEnter(e, 'academy')}
              onClick={(e) => handleTriggerClick(e, 'academy')}
              onFocus={(e) => movePill(e.currentTarget)}
            >
              Academy
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            <div
              className={`dcs-mega ${activeMenu === 'academy' ? 'open' : ''}`}
              id="m-academy"
              onMouseEnter={handleMegaMouseEnter}
            >
              <div className="dcs-panel dcs-cols-3">
                {/* Col 1 */}
                <div className="dcs-col">
                  <h6>Specialized Engineering</h6>
                  <Link
                    className="dcs-item"
                    href="/courses/ai-automation"
                    style={itemStyle('/courses/ai-automation')}
                  >
                    <span className="dcs-ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="4" y="8" width="16" height="12" rx="3" />
                        <path d="M12 8V4M9 13v1M15 13v1M2 14h2M20 14h2" />
                      </svg>
                    </span>
                    <div>
                      <b>
                        AI Automation &amp; Agents <em className="tag-hot">HOT</em>
                      </b>
                      <span>LLM workflows, agents &amp; n8n</span>
                      <span>
                        <em className="tag-wk">10 WEEKS</em>
                      </span>
                    </div>
                    <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>

                  <Link
                    className="dcs-item"
                    href="/courses/web-development"
                    style={itemStyle('/courses/web-development')}
                  >
                    <span className="dcs-ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="m8 9-4 3 4 3M16 9l4 3-4 3M13 6l-2 12" />
                      </svg>
                    </span>
                    <div>
                      <b>
                        Enterprise Web Dev <em className="tag-career">CAREER</em>
                      </b>
                      <span>Full-stack React, Next.js &amp; APIs</span>
                      <span>
                        <em className="tag-wk">14 WEEKS</em>
                      </span>
                    </div>
                    <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </div>

                {/* Col 2 */}
                <div className="dcs-col">
                  <h6>Creative &amp; Foundations</h6>
                  <Link
                    className="dcs-item"
                    href="/courses/video-editing-graphic-design"
                    style={itemStyle('/courses/video-editing-graphic-design')}
                  >
                    <span className="dcs-ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="2" y="6" width="14" height="12" rx="2" />
                        <path d="m16 10 6-3v10l-6-3" />
                      </svg>
                    </span>
                    <div>
                      <b>Video Editing &amp; Design</b>
                      <span>Premiere Pro, After Effects &amp; 3D</span>
                      <span>
                        <em className="tag-wk">8 WEEKS</em>
                      </span>
                    </div>
                    <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>

                  <Link
                    className="dcs-item"
                    href="/courses/computer-basics"
                    style={itemStyle('/courses/computer-basics')}
                  >
                    <span className="dcs-ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M22 10 12 5 2 10l10 5 10-5z" />
                        <path d="M6 12v5c3 2 9 2 12 0v-5" />
                      </svg>
                    </span>
                    <div>
                      <b>Computer Basics &amp; Office</b>
                      <span>Digital literacy &amp; cyber hygiene</span>
                      <span>
                        <em className="tag-wk">6 WEEKS</em>
                      </span>
                    </div>
                    <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </div>

                {/* Promo Card */}
                <div className="dcs-promo">
                  <span className="lbl">🎓 DCS Skill Academy</span>
                  <h5>Learn &amp; Earn Guarantee</h5>
                  <p>Hands-on corporate labs, certified professional mentors, verified diploma &amp; direct internship access.</p>
                  <div className="chips">
                    <span>Live Labs</span>
                    <span>Mentors</span>
                    <span>Diploma</span>
                    <span>Internship</span>
                  </div>
                  <Link className="go" href="/courses">
                    View all programs
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M7 17 17 7M8 7h9v9" />
                    </svg>
                  </Link>
                </div>

                {/* Panel Footer Strip */}
                <div className="dcs-strip">
                  <span>
                    <b>Next batch enrolling.</b> Online &amp; offline classes at our Lahore campus.
                  </span>
                  <Link href="/contact?type=admission">
                    Contact for details
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </li>

          {/* COMPANY */}
          <li role="none">
            <button
              type="button"
              className={`dcs-link ${isCompany ? 'current' : ''}`}
              aria-expanded={activeMenu === 'company'}
              aria-controls="m-company"
              onMouseEnter={(e) => handleTriggerMouseEnter(e, 'company')}
              onClick={(e) => handleTriggerClick(e, 'company')}
              onFocus={(e) => movePill(e.currentTarget)}
            >
              Company
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            <div
              className={`dcs-mega sm ${activeMenu === 'company' ? 'open' : ''}`}
              id="m-company"
              style={{ left: smOffsets.company ? `${smOffsets.company}px` : undefined }}
              onMouseEnter={handleMegaMouseEnter}
            >
              <div className="dcs-panel dcs-cols-1">
                <div className="dcs-col" style={{ paddingBottom: '4px' }}>
                  <Link
                    className="dcs-item"
                    href="/about"
                    style={itemStyle('/about')}
                  >
                    <span className="dcs-ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z" />
                      </svg>
                    </span>
                    <div>
                      <b>About Our Firm</b>
                      <span>Our mission, security standards &amp; leadership</span>
                    </div>
                    <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>

                  <Link
                    className="dcs-item"
                    href="/team"
                    style={itemStyle('/team')}
                  >
                    <span className="dcs-ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
                      </svg>
                    </span>
                    <div>
                      <b>Leadership &amp; Team</b>
                      <span>Certified cybersecurity architects &amp; engineers</span>
                    </div>
                    <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </div>

                <div className="dcs-strip">
                  <span>
                    <b>We’re hiring.</b> Join our team
                  </span>
                  <Link href="/team#careers">
                    Careers
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </li>

          {/* INSIGHTS */}
          <li role="none">
            <button
              type="button"
              className={`dcs-link ${isInsights ? 'current' : ''}`}
              aria-expanded={activeMenu === 'insights'}
              aria-controls="m-insights"
              onMouseEnter={(e) => handleTriggerMouseEnter(e, 'insights')}
              onClick={(e) => handleTriggerClick(e, 'insights')}
              onFocus={(e) => movePill(e.currentTarget)}
            >
              Insights
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            <div
              className={`dcs-mega sm ${activeMenu === 'insights' ? 'open' : ''}`}
              id="m-insights"
              style={{ left: smOffsets.insights ? `${smOffsets.insights}px` : undefined }}
              onMouseEnter={handleMegaMouseEnter}
            >
              <div className="dcs-panel dcs-cols-1">
                <div className="dcs-col" style={{ paddingBottom: '4px' }}>
                  <Link
                    className="dcs-item"
                    href="/portfolio"
                    style={itemStyle('/portfolio')}
                  >
                    <span className="dcs-ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="2" y="7" width="20" height="14" rx="2" />
                        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                      </svg>
                    </span>
                    <div>
                      <b>Delivered Portfolio</b>
                      <span>Real-world enterprise client case studies</span>
                    </div>
                    <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>

                  <Link
                    className="dcs-item"
                    href="/videos"
                    style={itemStyle('/videos')}
                  >
                    <span className="dcs-ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="3" y="3" width="18" height="18" rx="3" />
                        <path d="m10 8 6 4-6 4z" />
                      </svg>
                    </span>
                    <div>
                      <b>Video Gallery</b>
                      <span>Tech showreels, demonstrations &amp; demos</span>
                    </div>
                    <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>

                  <Link
                    className="dcs-item"
                    href="/blog"
                    style={itemStyle('/blog')}
                  >
                    <span className="dcs-ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <path d="M14 2v6h6M16 13H8M16 17H8" />
                      </svg>
                    </span>
                    <div>
                      <b>Threat Advisories &amp; Blog</b>
                      <span>Latest cybersecurity insights &amp; updates</span>
                    </div>
                    <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>

                  <Link
                    className="dcs-item"
                    href="/faq"
                    style={itemStyle('/faq')}
                  >
                    <span className="dcs-ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01" />
                      </svg>
                    </span>
                    <div>
                      <b>Knowledgebase &amp; FAQ</b>
                      <span>Answers to common corporate questions</span>
                    </div>
                    <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </li>

          {/* CONTACT */}
          <li role="none">
            <Link
              href="/contact"
              role="menuitem"
              className={`dcs-link ${isContact ? 'current' : ''}`}
              onMouseEnter={handleLinkMouseEnter}
              onFocus={(e) => movePill(e.currentTarget)}
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* Action Buttons */}
        <div className="dcs-actions">
          <a
            className="dcs-btn dcs-btn-ghost"
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
          >
            <FaWhatsapp className="dcs-wa-icon" size={17} />
            <span>WhatsApp</span>
          </a>

          <Link className="dcs-btn dcs-btn-main" href="/contact">
            <span className="dot" />
            Consult Security
          </Link>

          <button
            type="button"
            className="dcs-burger"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={(e) => {
              e.stopPropagation();
              setMobileOpen((prev) => !prev);
            }}
          >
            <i />
            <i />
            <i />
          </button>
        </div>

        {/* Mobile Drawer */}
        <nav className="dcs-drawer" aria-label="Mobile">
          <Link
            href="/"
            className="top"
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>

          {/* Mobile Services */}
          <details
            open={openDetails === 'services'}
            onToggle={(e) => {
              const isOpen = (e.currentTarget as HTMLDetailsElement).open;
              if (isOpen) setOpenDetails('services');
              else if (openDetails === 'services') setOpenDetails(null);
            }}
          >
            <summary>
              Services
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </summary>
            <div className="sub">
              <Link
                className="dcs-item"
                href="/services/cybersecurity"
                onClick={() => setMobileOpen(false)}
                style={itemStyle('/services/cybersecurity')}
              >
                <span className="dcs-ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z" />
                  </svg>
                </span>
                <div>
                  <b>Cybersecurity Services</b>
                  <span>VAPT, SOC monitoring &amp; defense</span>
                </div>
                <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>

              <Link
                className="dcs-item"
                href="/services/web-development"
                onClick={() => setMobileOpen(false)}
                style={itemStyle('/services/web-development')}
              >
                <span className="dcs-ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="m8 9-4 3 4 3M16 9l4 3-4 3M13 6l-2 12" />
                  </svg>
                </span>
                <div>
                  <b>Web Design &amp; Development</b>
                  <span>High-performance secure web systems</span>
                </div>
                <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>

              <Link
                className="dcs-item"
                href="/services/software-development"
                onClick={() => setMobileOpen(false)}
                style={itemStyle('/services/software-development')}
              >
                <span className="dcs-ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="m12 2 10 5-10 5L2 7z" />
                    <path d="m2 17 10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </span>
                <div>
                  <b>Software &amp; App Development</b>
                  <span>Bespoke enterprise software &amp; APIs</span>
                </div>
                <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>

              <Link
                className="dcs-item"
                href="/services/cloud-devops"
                onClick={() => setMobileOpen(false)}
                style={itemStyle('/services/cloud-devops')}
              >
                <span className="dcs-ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M17.5 19H8a6 6 0 1 1 5.7-8H15a4.5 4.5 0 0 1 2.5 8z" />
                  </svg>
                </span>
                <div>
                  <b>Cloud &amp; DevOps Solutions</b>
                  <span>Zero-trust architecture &amp; CI/CD</span>
                </div>
                <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>

              <Link
                className="dcs-item"
                href="/services/ai-automation"
                onClick={() => setMobileOpen(false)}
                style={itemStyle('/services/ai-automation')}
              >
                <span className="dcs-ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="4" y="8" width="16" height="12" rx="3" />
                    <path d="M12 8V4M9 13v1M15 13v1M2 14h2M20 14h2" />
                  </svg>
                </span>
                <div>
                  <b>AI Automation &amp; Chatbots</b>
                  <span>LLM agents &amp; workflows</span>
                </div>
                <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>

              <Link
                className="dcs-item"
                href="/services/ecommerce"
                onClick={() => setMobileOpen(false)}
                style={itemStyle('/services/ecommerce')}
              >
                <span className="dcs-ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="9" cy="20" r="1.5" />
                    <circle cx="18" cy="20" r="1.5" />
                    <path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 7H6" />
                  </svg>
                </span>
                <div>
                  <b>E-Commerce Development</b>
                  <span>High-conversion online stores</span>
                </div>
                <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>

              <Link
                className="dcs-item"
                href="/services/video-motion"
                onClick={() => setMobileOpen(false)}
                style={itemStyle('/services/video-motion')}
              >
                <span className="dcs-ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="2" y="6" width="14" height="12" rx="2" />
                    <path d="m16 10 6-3v10l-6-3" />
                  </svg>
                </span>
                <div>
                  <b>Video &amp; Motion Graphics</b>
                  <span>Cinematic post-production</span>
                </div>
                <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>

              <Link
                className="dcs-item"
                href="/services/graphic-design"
                onClick={() => setMobileOpen(false)}
                style={itemStyle('/services/graphic-design')}
              >
                <span className="dcs-ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="13.5" cy="6.5" r="1" />
                    <circle cx="17.5" cy="10.5" r="1" />
                    <circle cx="8.5" cy="7.5" r="1" />
                    <circle cx="6.5" cy="12.5" r="1" />
                    <path d="M12 2a10 10 0 0 0 0 20c1 0 1.7-.8 1.7-1.7 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.8-1.7 1.7-1.7h2A5.6 5.6 0 0 0 22 13.9C22 7.3 17.5 2 12 2z" />
                  </svg>
                </span>
                <div>
                  <b>Graphic Design &amp; Branding</b>
                  <span>Visual identities &amp; modern UI/UX</span>
                </div>
                <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>

              <Link
                className="dcs-btn dcs-btn-main"
                href="/contact?type=quote&service=startup-package"
                onClick={() => setMobileOpen(false)}
                style={{ margin: '6px 12px 10px', display: 'flex', justifyContent: 'center' }}
              >
                Claim startup package
              </Link>
            </div>
          </details>

          {/* Mobile Academy */}
          <details
            open={openDetails === 'academy'}
            onToggle={(e) => {
              const isOpen = (e.currentTarget as HTMLDetailsElement).open;
              if (isOpen) setOpenDetails('academy');
              else if (openDetails === 'academy') setOpenDetails(null);
            }}
          >
            <summary>
              Academy
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </summary>
            <div className="sub">
              <Link
                className="dcs-item"
                href="/courses/ai-automation"
                onClick={() => setMobileOpen(false)}
                style={itemStyle('/courses/ai-automation')}
              >
                <span className="dcs-ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="4" y="8" width="16" height="12" rx="3" />
                    <path d="M12 8V4M9 13v1M15 13v1M2 14h2M20 14h2" />
                  </svg>
                </span>
                <div>
                  <b>
                    AI Automation &amp; Agents <em className="tag-hot">HOT</em>
                  </b>
                  <span>LLM workflows, agents &amp; n8n</span>
                  <span>
                    <em className="tag-wk">10 WEEKS</em>
                  </span>
                </div>
                <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>

              <Link
                className="dcs-item"
                href="/courses/web-development"
                onClick={() => setMobileOpen(false)}
                style={itemStyle('/courses/web-development')}
              >
                <span className="dcs-ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="m8 9-4 3 4 3M16 9l4 3-4 3M13 6l-2 12" />
                  </svg>
                </span>
                <div>
                  <b>
                    Enterprise Web Dev <em className="tag-career">CAREER</em>
                  </b>
                  <span>Full-stack React, Next.js &amp; APIs</span>
                  <span>
                    <em className="tag-wk">14 WEEKS</em>
                  </span>
                </div>
                <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>

              <Link
                className="dcs-item"
                href="/courses/video-editing-graphic-design"
                onClick={() => setMobileOpen(false)}
                style={itemStyle('/courses/video-editing-graphic-design')}
              >
                <span className="dcs-ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="2" y="6" width="14" height="12" rx="2" />
                    <path d="m16 10 6-3v10l-6-3" />
                  </svg>
                </span>
                <div>
                  <b>Video Editing &amp; Design</b>
                  <span>Premiere Pro, After Effects &amp; 3D</span>
                  <span>
                    <em className="tag-wk">8 WEEKS</em>
                  </span>
                </div>
                <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>

              <Link
                className="dcs-item"
                href="/courses/computer-basics"
                onClick={() => setMobileOpen(false)}
                style={itemStyle('/courses/computer-basics')}
              >
                <span className="dcs-ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M22 10 12 5 2 10l10 5 10-5z" />
                    <path d="M6 12v5c3 2 9 2 12 0v-5" />
                  </svg>
                </span>
                <div>
                  <b>Computer Basics &amp; Office</b>
                  <span>Digital literacy &amp; cyber hygiene</span>
                  <span>
                    <em className="tag-wk">6 WEEKS</em>
                  </span>
                </div>
                <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>

              <Link
                className="dcs-btn dcs-btn-main"
                href="/courses"
                onClick={() => setMobileOpen(false)}
                style={{ margin: '6px 12px 10px', display: 'flex', justifyContent: 'center' }}
              >
                View all programs
              </Link>
            </div>
          </details>

          {/* Mobile Company */}
          <details
            open={openDetails === 'company'}
            onToggle={(e) => {
              const isOpen = (e.currentTarget as HTMLDetailsElement).open;
              if (isOpen) setOpenDetails('company');
              else if (openDetails === 'company') setOpenDetails(null);
            }}
          >
            <summary>
              Company
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </summary>
            <div className="sub">
              <Link
                className="dcs-item"
                href="/about"
                onClick={() => setMobileOpen(false)}
                style={itemStyle('/about')}
              >
                <span className="dcs-ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z" />
                  </svg>
                </span>
                <div>
                  <b>About Our Firm</b>
                  <span>Our mission, security standards &amp; leadership</span>
                </div>
                <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>

              <Link
                className="dcs-item"
                href="/team"
                onClick={() => setMobileOpen(false)}
                style={itemStyle('/team')}
              >
                <span className="dcs-ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
                  </svg>
                </span>
                <div>
                  <b>Leadership &amp; Team</b>
                  <span>Certified cybersecurity architects &amp; engineers</span>
                </div>
                <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>

              <Link
                className="dcs-item"
                href="/team#careers"
                onClick={() => setMobileOpen(false)}
              >
                <span className="dcs-ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  </svg>
                </span>
                <div>
                  <b>Careers</b>
                  <span>We’re hiring. Join our growing team</span>
                </div>
                <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </details>

          {/* Mobile Insights */}
          <details
            open={openDetails === 'insights'}
            onToggle={(e) => {
              const isOpen = (e.currentTarget as HTMLDetailsElement).open;
              if (isOpen) setOpenDetails('insights');
              else if (openDetails === 'insights') setOpenDetails(null);
            }}
          >
            <summary>
              Insights
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </summary>
            <div className="sub">
              <Link
                className="dcs-item"
                href="/portfolio"
                onClick={() => setMobileOpen(false)}
                style={itemStyle('/portfolio')}
              >
                <span className="dcs-ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  </svg>
                </span>
                <div>
                  <b>Delivered Portfolio</b>
                  <span>Real-world client case studies</span>
                </div>
                <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>

              <Link
                className="dcs-item"
                href="/videos"
                onClick={() => setMobileOpen(false)}
                style={itemStyle('/videos')}
              >
                <span className="dcs-ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <path d="m10 8 6 4-6 4z" />
                  </svg>
                </span>
                <div>
                  <b>Video Gallery</b>
                  <span>Showreels &amp; tech demos</span>
                </div>
                <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>

              <Link
                className="dcs-item"
                href="/blog"
                onClick={() => setMobileOpen(false)}
                style={itemStyle('/blog')}
              >
                <span className="dcs-ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6M16 13H8M16 17H8" />
                  </svg>
                </span>
                <div>
                  <b>Threat Advisories &amp; Blog</b>
                  <span>Latest insights &amp; articles</span>
                </div>
                <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>

              <Link
                className="dcs-item"
                href="/faq"
                onClick={() => setMobileOpen(false)}
                style={itemStyle('/faq')}
              >
                <span className="dcs-ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01" />
                  </svg>
                </span>
                <div>
                  <b>Knowledgebase &amp; FAQ</b>
                  <span>Answers to common questions</span>
                </div>
                <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </details>

          <Link
            href="/contact"
            className="top"
            onClick={() => setMobileOpen(false)}
          >
            Contact
          </Link>

          {/* Quick Action CTAs */}
          <div className="cta">
            <a
              className="dcs-btn dcs-wa"
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp size={17} style={{ marginRight: '6px' }} />
              <span>WhatsApp</span>
            </a>
            <Link
              className="dcs-btn dcs-btn-main"
              href="/contact"
              onClick={() => setMobileOpen(false)}
            >
              <span className="dot" />
              Consult Security
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
