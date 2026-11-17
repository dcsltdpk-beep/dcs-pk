'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Complete progress on pathname or searchParams change
  useEffect(() => {
    if (loading) {
      setProgress(100);
      const timer = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Intercept click on <a> tags for internal routes
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      const targetAttr = target.getAttribute('target');

      // Ignore external, hash-only, mailto, tel, or new tab links
      if (
        !href ||
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#') ||
        targetAttr === '_blank' ||
        e.ctrlKey ||
        e.metaKey
      ) {
        return;
      }

      // If navigating to the same URL, don't trigger
      const currentUrl = window.location.pathname + window.location.search;
      if (href === currentUrl) return;

      // Start top loader
      setLoading(true);
      setProgress(25);
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  // Animate progress while loading
  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) return prev;
        const step = Math.max(1, (85 - prev) * 0.2);
        return Math.min(85, prev + step);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [loading]);

  if (!loading && progress === 0) return null;

  return (
    <div
      className="top-progress-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '3px',
        zIndex: 999999,
        pointerEvents: 'none',
      }}
    >
      <div
        className="top-progress-bar"
        style={{
          width: `${progress}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #FBAE43 0%, #FCCD7B 50%, #B9DDEB 100%)',
          boxShadow: '0 0 14px rgba(251, 174, 67, 0.9), 0 0 6px rgba(185, 221, 235, 0.7)',
          transition: progress === 100 ? 'width 0.15s ease-out, opacity 0.2s ease-out' : 'width 0.25s ease',
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  );
}
