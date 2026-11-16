import React from 'react';
import Link from 'next/link';
import Icon from './Icon';

interface FooterProps {
  whatsappNumber?: string;
  whatsappMessage?: string;
  companyEmail?: string;
  companyPhone?: string;
  companyAddress?: string;
  services?: Array<{ title: string; slug: string }>;
}

export default function Footer({
  whatsappNumber = '923001234567',
  whatsappMessage = 'Hello Dream Cyber Security Pakistan, I have an inquiry.',
  companyEmail = 'info@dreamcyber.pk',
  companyPhone = '+92 300 1234567',
  companyAddress = 'Level 4, IT Tower, Hali Road, Gulberg III, Lahore, Pakistan',
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
        <Icon name="whatsapp" size={18} />
        <span>WhatsApp Us</span>
      </a>

      {/* Main Site Footer */}
      <footer className="site-footer">
        <div className="container">
          <div className="grid grid-4">
            {/* Col 1: About Firm */}
            <div>
              <div className="brand-logo" style={{ marginBottom: '1.25rem' }}>
                <span style={{ color: 'var(--accent-cyan)', display: 'inline-flex', alignItems: 'center' }}>
                  <Icon name="shield-check" size={24} />
                </span>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 900, marginLeft: '6px' }}>DREAM</span>
                <span>CYBER</span>
                <span className="brand-badge">Pakistan</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                International-standard cyber defense, custom software engineering, AI workflow automations, and enterprise technology solutions for forward-looking organizations.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <a href="https://facebook.com/dreamcybersecurity" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>FB</a>
                <a href="https://linkedin.com/company/dreamcybersecurity" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>IN</a>
                <a href="https://twitter.com/dreamcyberpk" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>X</a>
                <a href="https://youtube.com/@dreamcybersecurity" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>YT</a>
              </div>
            </div>

            {/* Col 2: Core Services */}
            <div>
              <h4 style={{ marginBottom: '1.25rem', color: '#fff' }}>Corporate Services</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`} style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Academy Training */}
            <div>
              <h4 style={{ marginBottom: '1.25rem', color: '#fff' }}>Training Academy</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li>
                  <Link href="/courses/ai-automation" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    AI Automation & Agents
                  </Link>
                </li>
                <li>
                  <Link href="/courses/web-development" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Full-Stack Web Engineering
                  </Link>
                </li>
                <li>
                  <Link href="/courses/video-editing-graphic-design" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Video Editing & Graphic Design
                  </Link>
                </li>
                <li>
                  <Link href="/courses/computer-basics" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Computer Basics & Productivity
                  </Link>
                </li>
                <li>
                  <Link href="/courses" style={{ color: 'var(--accent-cyan)', fontSize: '0.9rem', fontWeight: 600 }}>
                    View All Academy Courses &rarr;
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Contact & Location */}
            <div>
              <h4 style={{ marginBottom: '1.25rem', color: '#fff' }}>Contact & Headquarters</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: 'var(--accent-cyan)' }}><Icon name="server" size={16} /></span>
                  <span>{companyAddress}</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: 'var(--accent-cyan)' }}><Icon name="mail" size={16} /></span>
                  <a href={`mailto:${companyEmail}`} style={{ color: 'var(--text-muted)' }}>{companyEmail}</a>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: 'var(--accent-cyan)' }}><Icon name="phone" size={16} /></span>
                  <a href={`tel:${companyPhone.replace(/\s+/g, '')}`} style={{ color: 'var(--text-muted)' }}>{companyPhone}</a>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#25d366' }}><Icon name="whatsapp" size={16} /></span>
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
