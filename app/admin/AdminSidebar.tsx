'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Icon from '@/components/Icon';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

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

  return (
    <aside className="admin-sidebar">
      <div>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', padding: '0 0.5rem' }}>
          <span style={{ color: 'var(--accent-cyan)' }}><Icon name="shield-check" size={24} /></span>
          <span style={{ fontWeight: 800, color: '#fff', fontSize: '1.1rem' }}>DCS CONTROL</span>
        </div>

        {/* Navigation Items */}
        <nav>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
        <Link
          href="/"
          target="_blank"
          className="admin-nav-item"
          style={{ color: 'var(--accent-cyan)' }}
        >
          <Icon name="external-link" size={16} />
          <span>View Public Site</span>
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
    </aside>
  );
}
