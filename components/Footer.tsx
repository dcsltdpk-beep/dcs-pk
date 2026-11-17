import React from 'react';
import Link from 'next/link';
import { MapPin, Mail, Phone, MessageCircle, ArrowRight } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa6';

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
      {/* Floating WhatsApp Action Button */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=${encodedMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-whatsapp"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp size={20} />
        <span>WhatsApp Us</span>
      </a>

      {/* Main Site Footer */}
      <footer className="site-footer">
        <div className="container">
          <div className="grid grid-4">
            {/* Col 1: About Firm */}
            <div>
              <div className="brand-logo" style={{ marginBottom: '1.25rem' }}>
                <img
                  src="/logo.png"
                  alt="Dream Cyber Security Pakistan"
                  style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '50%' }}
                />
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 900, marginLeft: '6px' }}>DREAM</span>
                <span>CYBER</span>
                <span className="brand-badge">Pakistan</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                Your premier technology and security solutions provider, empowering businesses and cultivating next-generation digital leaders.
              </p>
              
              {/* Proper Lucide & Brand Social Media Icons */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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

            {/* Col 2: Core Services */}
            <div>
              <h4 style={{ marginBottom: '1.25rem', color: '#fff', fontSize: '1.15rem' }}>Corporate Services</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`} style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: 'var(--accent-cyan)', fontSize: '0.75rem' }}>▸</span> {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Academy Training */}
            <div>
              <h4 style={{ marginBottom: '1.25rem', color: '#fff', fontSize: '1.15rem' }}>Training Academy</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li>
                  <Link href="/courses/ai-automation" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: 'var(--accent-cyan)', fontSize: '0.75rem' }}>▸</span> AI Automation & Agents
                  </Link>
                </li>
                <li>
                  <Link href="/courses/web-development" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: 'var(--accent-cyan)', fontSize: '0.75rem' }}>▸</span> Full-Stack Web Engineering
                  </Link>
                </li>
                <li>
                  <Link href="/courses/video-editing-graphic-design" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: 'var(--accent-cyan)', fontSize: '0.75rem' }}>▸</span> Video Editing & Graphic Design
                  </Link>
                </li>
                <li>
                  <Link href="/courses/computer-basics" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: 'var(--accent-cyan)', fontSize: '0.75rem' }}>▸</span> Computer Basics & Productivity
                  </Link>
                </li>
                <li style={{ marginTop: '0.25rem' }}>
                  <Link href="/courses" style={{ color: 'var(--accent-cyan)', fontSize: '0.9rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    View All Academy Courses <ArrowRight size={14} />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Contact & Location */}
            <div>
              <h4 style={{ marginBottom: '1.25rem', color: '#fff', fontSize: '1.15rem' }}>Contact & Headquarters</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: 'var(--accent-cyan)', marginTop: '3px' }}><MapPin size={17} /></span>
                  <span>{companyAddress}</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: 'var(--accent-cyan)' }}><Mail size={17} /></span>
                  <a href={`mailto:${companyEmail}`} style={{ color: 'var(--text-muted)' }}>{companyEmail}</a>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: 'var(--accent-cyan)' }}><Phone size={17} /></span>
                  <a href={`tel:${companyPhone.replace(/\s+/g, '')}`} style={{ color: 'var(--text-muted)' }}>{companyPhone}</a>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#25d366' }}><MessageCircle size={17} /></span>
                  <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" style={{ color: '#25d366', fontWeight: 600 }}>
                    Official WhatsApp Desk
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div>
              &copy; {new Date().getFullYear()} Dream Cyber Security Pakistan. All Rights Reserved. Built to International Standards.
            </div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <Link href="/privacy" style={{ color: 'var(--text-muted)' }}>Privacy Policy</Link>
              <Link href="/terms" style={{ color: 'var(--text-muted)' }}>Terms of Service</Link>
              <Link href="/faq" style={{ color: 'var(--text-muted)' }}>FAQ</Link>
              <Link href="/admin" style={{ color: 'var(--text-muted)' }}>Admin Portal</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
