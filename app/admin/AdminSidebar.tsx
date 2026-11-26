'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Icon from '@/components/Icon';
import { AdminModule, AuthenticatedAdmin, hasModuleAccess } from '@/lib/rbac';
import { useAdmin } from './AdminContext';

interface NavItemDef {
  href: string;
  label: string;
  icon: string;
  module: AdminModule;
}

export default function AdminSidebar({ admin: propAdmin }: { admin?: AuthenticatedAdmin | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const contextAdmin = useAdmin();
  const admin = propAdmin || contextAdmin;

  // Defense-in-depth: Never render sidebar on login page
  if (pathname === '/admin/login') {
    return null;
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const allNavItems: NavItemDef[] = [
    { href: '/admin', label: 'Dashboard', icon: 'layout', module: 'dashboard' },
    { href: '/admin/sub-admins', label: 'Sub-Admins & RBAC', icon: 'shield-check', module: 'sub-admins' },
    { href: '/admin/inquiries', label: 'Inquiries Inbox', icon: 'inbox', module: 'inquiries' },
    { href: '/admin/services', label: 'Core Services', icon: 'shield', module: 'services' },
    { href: '/admin/courses', label: 'Academy Courses', icon: 'award', module: 'courses' },
    { href: '/admin/portfolio', label: 'Portfolio Works', icon: 'briefcase', module: 'portfolio' },
    { href: '/admin/videos', label: 'Video Gallery', icon: 'video', module: 'videos' },
    { href: '/admin/posts', label: 'News & Advisories', icon: 'file-text', module: 'posts' },
    { href: '/admin/team', label: 'Team Profiles', icon: 'users', module: 'team' },
    { href: '/admin/faqs', label: 'FAQ Database', icon: 'help-circle', module: 'faqs' },
    { href: '/admin/landing-pages', label: 'Campaign Pages', icon: 'trending-up', module: 'landing-pages' },
    { href: '/admin/home-content', label: 'Home Page Editor', icon: 'layout', module: 'home-content' },
    { href: '/admin/settings', label: 'Global Settings & SEO', icon: 'settings', module: 'settings' },
  ];

  // RBAC Navigation Filtering: Only show modules the current admin is authorized to view
  const visibleNavItems = allNavItems.filter((item) => {
    if (!admin) return true;
    return hasModuleAccess(admin, item.module);
  });

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
            <img
              src="/logo.png"
              alt="DCS Control"
              style={{ width: '24px', height: '24px', objectFit: 'contain', borderRadius: '50%' }}
            />
            <span style={{ fontWeight: 800, color: '#fff', fontSize: '1rem', letterSpacing: '0.5px' }}>
              DCS CONTROL
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {admin && (
            <span
              style={{
                fontSize: '0.72rem',
                padding: '2px 8px',
                borderRadius: '12px',
                backgroundColor: admin.isSuperAdmin
                  ? 'rgba(192, 132, 252, 0.15)'
                  : 'rgba(0, 245, 255, 0.12)',
                color: admin.isSuperAdmin ? '#c084fc' : 'var(--accent-cyan)',
                border: `1px solid ${
                  admin.isSuperAdmin ? 'rgba(192, 132, 252, 0.3)' : 'rgba(0, 245, 255, 0.3)'
                }`,
                fontWeight: 600,
              }}
            >
              {admin.isSuperAdmin ? 'Super Admin' : 'Sub-Admin'}
            </span>
          )}
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
        <div className="admin-mobile-backdrop" onClick={closeMobileMenu} />
      )}

      {/* Desktop & Mobile Drawer Sidebar */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', justifyContent: 'space-between' }}>
          <div>
            {/* Brand Logo Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', padding: '0 0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img
                  src="/logo.png"
                  alt="DCS Control"
                  style={{ width: '28px', height: '28px', objectFit: 'contain', borderRadius: '50%' }}
                />
                <span style={{ fontWeight: 800, color: '#fff', fontSize: '1.15rem', letterSpacing: '0.5px' }}>
                  DCS CONTROL
                </span>
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

            {/* Authenticated Admin Identity Badge */}
            {admin && (
              <div
                style={{
                  margin: '0 0.25rem 1.5rem',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: admin.isSuperAdmin
                      ? 'rgba(192, 132, 252, 0.2)'
                      : 'rgba(0, 245, 255, 0.15)',
                    border: `1px solid ${
                      admin.isSuperAdmin ? '#c084fc' : 'var(--accent-cyan)'
                    }`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: admin.isSuperAdmin ? '#c084fc' : 'var(--accent-cyan)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    flexShrink: 0,
                  }}
                >
                  {admin.name ? admin.name.charAt(0).toUpperCase() : admin.username.charAt(0).toUpperCase()}
                </div>
                <div style={{ overflow: 'hidden', flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      color: '#fff',
                      fontSize: '0.85rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {admin.name || admin.username}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#34d399',
                        boxShadow: '0 0 6px #34d399',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '0.7rem',
                        color: admin.isSuperAdmin ? '#c084fc' : 'var(--accent-cyan)',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {admin.isSuperAdmin ? 'Super Admin' : 'Sub-Admin'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Items */}
            <nav>
              {visibleNavItems.map((item) => {
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
          </div>

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
