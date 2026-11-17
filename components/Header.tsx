'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Icon from './Icon';

interface HeaderProps {
  siteName?: string;
}

export default function Header({ siteName = 'Dream Cyber Security Pakistan' }: HeaderProps) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/services', label: 'Services' },
    { href: '/courses', label: 'Academy' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/videos', label: 'Videos' },
    { href: '/team', label: 'Our Team' },
    { href: '/blog', label: 'Updates' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand-logo" aria-label={siteName}>
          <Image
            src="/logo.png"
            alt={siteName}
            width={36}
            height={36}
            style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '50%' }}
            priority
          />
          <span style={{ color: 'var(--accent-cyan)', fontWeight: 900, marginLeft: '6px' }}>DREAM</span>
          <span>CYBER</span>
          <span className="brand-badge">Pakistan</span>
        </Link>

        {/* Mobile Nav Toggle */}
        <input type="checkbox" id="nav-toggle" className="nav-toggle-checkbox" />
        <label htmlFor="nav-toggle" className="nav-toggle-label" aria-label="Toggle Navigation Menu">
          <span></span>
          <span></span>
          <span></span>
        </label>

        {/* Desktop & Mobile Navigation Links */}
        <nav className="main-nav">
          <ul>
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <li key={link.href}>
                  <Link href={link.href} className={isActive ? 'active' : ''}>
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right CTA Action */}
        <div className="header-actions">
          <Link href="/contact" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.88rem' }}>
            Consult Security
          </Link>
        </div>
      </div>
    </header>
  );
}
