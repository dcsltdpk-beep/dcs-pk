import React from 'react';
import Link from 'next/link';
import { MapPin, Mail, Phone, MessageCircle, ArrowRight } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa6';
import FloatingActions from './FloatingActions';

interface FooterProps {
  whatsappNumber?: string;
  whatsappMessage?: string;
  companyEmail?: string;
  companyPhone?: string;
  companyAddress?: string;
  services?: Array<{ title: string; slug: string }>;
}

export default function Footer({
  whatsappNumber = '923165478855',
  whatsappMessage = 'Hello Dream Cyber Security Pakistan, I have an inquiry.',
  companyEmail = 'dcsltd.pk@gmail.com',
  companyPhone = '0316 5478855',
  companyAddress = 'Lahore, Pakistan',
  services = [
    { title: 'Web Design & Development', slug: 'web-design-development' },
    { title: 'E-commerce Development', slug: 'ecommerce-development' },
    { title: 'Cybersecurity Services', slug: 'cybersecurity-services' },
    { title: 'AI Automation & Chatbots', slug: 'ai-automation-chatbot-development' },
    { title: 'Video Editing & Motion', slug: 'video-editing-motion-graphics' },
    { title: 'Software Development', slug: 'software-application-development' },
  ],
}: FooterProps) {
  const encodedMsg = encodeURIComponent(whatsappMessage);

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
          <div className="footer-main-grid">
            {/* Col 1: About Firm */}
            <div className="footer-col footer-col-brand">
              <div className="brand-logo footer-brand-logo">
                <img
                  src="/logo.png"
                  alt="Dream Cyber Security Pakistan"
                  style={{ width: '38px', height: '38px', objectFit: 'contain', borderRadius: '50%' }}
                />
                <div className="brand-text-wrap">
                  <span className="brand-dream">DREAM</span>
                  <span className="brand-cyber">CYBER</span>
                  <span className="brand-security">SECURITY</span>
                  <span className="brand-badge">Pakistan</span>
                </div>
              </div>
              <p className="footer-brand-desc">
                Premier technology and security solutions provider in Pakistan, empowering modern enterprises and cultivating next-generation digital leaders.
              </p>

              {/* Proper Lucide & Brand Social Media Icons */}
              <div className="footer-social-wrap">
                <a
                  href="https://www.facebook.com/profile.php?id=61595891767697"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  aria-label="Follow Dream Cyber Security on Facebook"
                  title="Facebook"
                >
                  <FaFacebookF size={16} />
                </a>
                <a
                  href="https://www.instagram.com/dreamcybersecurityltd/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  aria-label="Follow Dream Cyber Security on Instagram"
                  title="Instagram"
                >
                  <FaInstagram size={17} />
                </a>
                <a
                  href="https://www.linkedin.com/company/dream-cyber-security-ltd/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  aria-label="Connect with Dream Cyber Security on LinkedIn"
                  title="LinkedIn"
                >
                  <FaLinkedinIn size={16} />
                </a>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  aria-label="Chat with Dream Cyber Security on WhatsApp"
                  title="WhatsApp"
                >
                  <FaWhatsapp size={18} />
                </a>
              </div>
            </div>

            {/* Nav Columns Group: Services & Academy */}
            <div className="footer-nav-columns">
              {/* Col 2: Core Services */}
              <div className="footer-col footer-col-services">
                <h4 className="footer-heading">Corporate Services</h4>
                <ul className="footer-link-list">
                  {services.map((s) => (
                    <li key={s.slug}>
                      <Link href={`/services/${s.slug}`} className="footer-nav-link">
                        <span className="footer-bullet">▸</span> {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 3: Academy Training */}
              <div className="footer-col footer-col-academy">
                <h4 className="footer-heading">Training Academy</h4>
                <ul className="footer-link-list">
                  <li>
                    <Link href="/courses/ai-automation" className="footer-nav-link">
                      <span className="footer-bullet">▸</span> AI Automation
                    </Link>
                  </li>
                  <li>
                    <Link href="/courses/web-development" className="footer-nav-link">
                      <span className="footer-bullet">▸</span> Web Engineering
                    </Link>
                  </li>
                  <li>
                    <Link href="/courses/video-editing-graphic-design" className="footer-nav-link">
                      <span className="footer-bullet">▸</span> Video & Design
                    </Link>
                  </li>
                  <li>
                    <Link href="/courses/computer-basics" className="footer-nav-link">
                      <span className="footer-bullet">▸</span> Computer Basics
                    </Link>
                  </li>
                  <li style={{ marginTop: '0.35rem' }}>
                    <Link href="/courses" className="footer-view-all-link">
                      View All Courses <ArrowRight size={13} />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Col 4: Contact & Location */}
            <div className="footer-col footer-col-contact">
              <h4 className="footer-heading">Headquarters & Desk</h4>
              <ul className="footer-contact-list">
                <li className="footer-contact-item">
                  <span className="footer-contact-icon text-sky"><MapPin size={16} /></span>
                  <span>{companyAddress}</span>
                </li>
                <li className="footer-contact-item">
                  <span className="footer-contact-icon text-sky"><Mail size={16} /></span>
                  <a href={`mailto:${companyEmail}`}>{companyEmail}</a>
                </li>
                <li className="footer-contact-item">
                  <span className="footer-contact-icon text-sky"><Phone size={16} /></span>
                  <a href={`tel:${companyPhone.replace(/\s+/g, '')}`}>{companyPhone}</a>
                </li>
                <li className="footer-contact-item footer-whatsapp-item">
                  <span className="footer-contact-icon text-green" style={{ color: '#25d366' }}>
                    {/* <MessageCircle size={16} /> */}
                    <FaWhatsapp size={16} />
                  </span>
                  <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer">
                    {/* Official WhatsApp Desk */}
                    +{whatsappNumber}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="footer-copyright">
              &copy; {new Date().getFullYear()} Dream Cyber Security Pakistan. All Rights Reserved. Built to Enterprise Standards.
            </div>
            <div className="footer-legal-links">
              <Link href="/privacy">Privacy Policy</Link>
              <span className="footer-legal-sep">&bull;</span>
              <Link href="/terms">Terms of Service</Link>
              <span className="footer-legal-sep">&bull;</span>
              <Link href="/faq">FAQ</Link>
              <span className="footer-legal-sep">&bull;</span>
              <Link href="/admin">Admin Portal</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
