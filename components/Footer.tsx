'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa6';
import FloatingActions from './FloatingActions';

interface FooterProps {
  whatsappNumber?: string;
  whatsappMessage?: string;
  companyEmail?: string;
  companyPhone?: string;
  companyAddress?: string;
  services?: Array<{ title: string; slug: string }>;
  courses?: Array<{ title: string; slug: string }>;
}

export default function Footer({
  whatsappNumber = '923165478855',
  whatsappMessage = 'Hello Dream Cyber Security Pakistan, I have an inquiry.',
  companyEmail = 'info@dreamcybersecurity.pk',
  companyPhone = '+92 316 5478855',
  companyAddress = 'Lahore, Pakistan',
  services,
  courses,
}: FooterProps) {
  // Newsletter subscription state
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid corporate or personal email address.');
      return;
    }

    try {
      setStatus('loading');
      setMessage('');

      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Subscription failed.');
      }

      setStatus('success');
      setMessage(data.message || 'Thank you for subscribing to our intelligence briefings!');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Unable to subscribe right now. Please try again.');
    }
  };

  return (
    <>
      {/* Floating Action Buttons (WhatsApp + Scroll Up) */}
      <FloatingActions
        whatsappNumber={whatsappNumber}
        whatsappMessage={whatsappMessage}
      />

      {/* Main Site Footer */}
      <footer className="site-footer">
        <div className="container">
          {/* ========================================================
              NEWSLETTER SECTION
              ======================================================== */}
          <div className="footer-newsletter-wrap">
            <div className="footer-newsletter-grid">
              <div className="footer-newsletter-info">
                <span className="footer-newsletter-tag">
                  <i /> NEWSLETTER &amp; BRIEFINGS
                </span>
                <h3 className="footer-newsletter-heading">
                  Stay Ahead with Enterprise Intelligence
                </h3>
                <p className="footer-newsletter-sub">
                  Subscribe to receive weekly cybersecurity bulletins, zero-trust engineering insights, and professional academy updates.
                </p>
              </div>

              <div className="footer-newsletter-form-col">
                <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
                  <div className="footer-newsletter-input-box">
                    <Mail size={18} className="footer-newsletter-icon" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter corporate email address..."
                      required
                      disabled={status === 'loading'}
                    />
                    <button
                      type="submit"
                      className="footer-newsletter-btn"
                      disabled={status === 'loading'}
                    >
                      <span>{status === 'loading' ? 'Joining...' : 'Subscribe'}</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                  {message && (
                    <div className={`footer-newsletter-status ${status}`}>
                      {status === 'success' ? (
                        <CheckCircle2 size={15} />
                      ) : (
                        <AlertCircle size={15} />
                      )}
                      <span>{message}</span>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>

          {/* ========================================================
              MAIN 4-COLUMN FOOTER (Matching Mockup Exactly)
              ======================================================== */}
          <div className="footer-main-grid">
            {/* Column 1: Brand & Socials */}
            <div className="footer-col footer-col-brand">
              <Link href="/" className="footer-brand-header">
                <img
                  src="/logo.png"
                  alt="Dream Cyber Security Pakistan"
                  className="footer-brand-logo-img"
                  width={42}
                  height={42}
                  style={{ objectFit: 'contain' }}
                />
                <div className="footer-brand-text">
                  <span className="footer-brand-line1">DREAM CYBER</span>
                  <span className="footer-brand-line2">
                    SECURITY <small className="footer-brand-pill">PAKISTAN</small>
                  </span>
                </div>
              </Link>

              <p className="footer-brand-desc">
                Cyber Defense &amp; IT Solutions — enterprise cybersecurity, software engineering and digital growth.
              </p>

              {/* 4 Brand Rounded Social Buttons */}
              <div className="footer-social-wrap">
                <a
                  href="https://www.facebook.com/profile.php?id=61595891767697"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <FaFacebookF size={15} />
                </a>
                <a
                  href="https://www.instagram.com/dreamcybersecurityltd/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <FaInstagram size={16} />
                </a>
                <a
                  href="https://www.linkedin.com/company/dream-cyber-security-ltd/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <FaLinkedinIn size={15} />
                </a>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  aria-label="WhatsApp"
                  title="WhatsApp"
                >
                  <FaWhatsapp size={17} />
                </a>
              </div>
            </div>

            {/* Column 2: Corporate Services */}
            <div className="footer-col">
              <h4 className="footer-heading">Corporate Services</h4>
              <ul className="footer-link-list">
                <li>
                  <Link href="/services/cybersecurity-services" className="footer-nav-link">
                    Cybersecurity
                  </Link>
                </li>
                <li>
                  <Link href="/services/web-design-development" className="footer-nav-link">
                    Web Development
                  </Link>
                </li>
                <li>
                  <Link href="/services/ai-automation-chatbot-development" className="footer-nav-link">
                    AI Automation
                  </Link>
                </li>
                <li>
                  <Link href="/services/software-application-development" className="footer-nav-link">
                    Software &amp; Apps
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="footer-nav-link">
                    Digital Marketing
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Training Academy */}
            <div className="footer-col">
              <h4 className="footer-heading">Training Academy</h4>
              <ul className="footer-link-list">
                {Array.isArray(courses) && courses.length > 0 ? (
                  courses.map((c) => {
                    const slug = (c.slug || '').replace(/^\/courses\/?/, '');
                    return (
                      <li key={slug || c.title}>
                        <Link href={`/courses/${slug}`} className="footer-nav-link">
                          {c.title}
                        </Link>
                      </li>
                    );
                  })
                ) : (
                  <>
                    <li>
                      <Link href="/courses/ai-automation" className="footer-nav-link">
                        AI Automation &amp; Agents
                      </Link>
                    </li>
                    <li>
                      <Link href="/courses/web-development" className="footer-nav-link">
                        Enterprise Web Dev
                      </Link>
                    </li>
                    <li>
                      <Link href="/courses/graphic-designing-with-ai" className="footer-nav-link">
                        Graphic Designing with AI
                      </Link>
                    </li>
                    <li>
                      <Link href="/courses/video-editing-graphic-design" className="footer-nav-link">
                        Video Editing with AI
                      </Link>
                    </li>
                    <li>
                      <Link href="/courses/computer-basics" className="footer-nav-link">
                        Computer Basics &amp; Office
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Column 4: Headquarters & Desk */}
            <div className="footer-col">
              <h4 className="footer-heading">Headquarters &amp; Desk</h4>
              <ul className="footer-link-list footer-contact-links">
                <li>
                  <span className="footer-nav-plain">
                    {companyAddress}
                  </span>
                </li>
                <li>
                  <a href={`mailto:${companyEmail}`} className="footer-nav-link">
                    {companyEmail}
                  </a>
                </li>
                <li>
                  <a href={`tel:${companyPhone.replace(/\s+/g, '')}`} className="footer-nav-link">
                    {companyPhone}
                  </a>
                </li>
                <li>
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-nav-link footer-wa-desk"
                  >
                    WhatsApp Desk
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* ========================================================
              FOOTER BOTTOM BAR
              ======================================================== */}
          <div className="footer-bottom">
            <div className="footer-copyright">
              &copy; {new Date().getFullYear()} Dream Cyber Security Pakistan. All Rights Reserved.
            </div>
            <div className="footer-legal-links">
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/faq">FAQ</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
