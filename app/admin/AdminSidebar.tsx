'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Icon from '@/components/Icon';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Defense-in-depth: Never render sidebar on login page
  if (pathname === '/admin/login') {
    return null;
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: 'layout' },
    { href: '/admin/inquiries', label: 'Inquiries Inbox', icon: 'inbox' },
    { href: '/admin/services', label: 'Core Services', icon: 'shield' },
    { href: '/admin/courses', label: 'Academy Courses', icon: 'award' },
    { href: '/admin/portfolio', label: 'Portfolio Works', icon: 'briefcase' },
    { href: '/admin/videos', label: 'Video Gallery', icon: 'video' },
    { href: '/admin/posts', label: 'News & Advisories', icon: 'file-text' },
    { href: '/admin/team', label: 'Team Profiles', icon: 'users' },
    { href: '/admin/faqs', label: 'FAQ Database', icon: 'help-circle' },
    { href: '/admin/landing-pages', label: 'Campaign Pages', icon: 'trending-up' },
    { href: '/admin/home-content', label: 'Home Page Editor', icon: 'layout' },
    { href: '/admin/settings', label: 'Global Settings & SEO', icon: 'settings' },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      {/* Mobile Top Header (Visible only on screens < 992px) */}
      <header className="admin-mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            className="admin-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Drawer"
          >
            <Icon name="menu" size={24} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--accent-cyan)' }}><Icon name="shield-check" size={20} /></span>
            <span style={{ fontWeight: 800, color: '#fff', fontSize: '1rem', letterSpacing: '0.5px' }}>DCS CONTROL</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            href="/"
            target="_blank"
            style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <Icon name="external-link" size={14} />
            <span className="hidden-xs">Public Site</span>
          </Link>
          <button
            onClick={handleLogout}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff7b7b', fontSize: '0.85rem' }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="admin-mobile-backdrop"
          onClick={closeMobileMenu}
        />
      )}

      {/* Desktop & Mobile Drawer Sidebar */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
          {/* Brand Logo Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', padding: '0 0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: 'var(--accent-cyan)' }}><Icon name="shield-check" size={24} /></span>
              <span style={{ fontWeight: 800, color: '#fff', fontSize: '1.15rem', letterSpacing: '0.5px' }}>DCS CONTROL</span>
            </div>
            {/* Close button inside mobile drawer */}
            <button
              className="admin-drawer-close-btn"
              onClick={closeMobileMenu}
              aria-label="Close Drawer"
            >
              &times;
            </button>
          </div>

          {/* Navigation Items */}
          <nav style={{ flex: 1 }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`admin-nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon name={item.icon} size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', marginTop: '1.5rem' }}>
            <Link
              href="/"
              target="_blank"
              className="admin-nav-item"
              style={{ color: 'var(--accent-cyan)' }}
              onClick={closeMobileMenu}
            >
              <Icon name="external-link" size={16} />
              <span>View Public Portal</span>
            </Link>
            <button
              onClick={handleLogout}
              className="admin-nav-item"
              style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: '#ff7b7b' }}
            >
              <Icon name="user" size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
