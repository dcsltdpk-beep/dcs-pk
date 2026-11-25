'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa6';
import { ChevronUp, PhoneCall } from 'lucide-react';

interface FloatingActionsProps {
  whatsappNumber?: string;
  whatsappMessage?: string;
}

export default function FloatingActions({
  whatsappNumber = '923165478855',
  whatsappMessage = 'Hello Dream Cyber Security Pakistan, I have an inquiry.',
}: FloatingActionsProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(false);

  useEffect(() => {
    let ticking = false;
    let isVisible = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const shouldShow = window.scrollY > 280;
        if (shouldShow !== isVisible) {
          isVisible = shouldShow;
          setShowScrollTop(shouldShow);
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Use passive IntersectionObserver on footer to avoid scroll height reflows
    let footerObserver: IntersectionObserver | null = null;
    try {
      const footer = document.querySelector('footer.site-footer');
      if (footer) {
        footerObserver = new IntersectionObserver(
          ([entry]) => {
            setIsNearBottom(entry.isIntersecting);
          },
          { rootMargin: '200px 0px 0px 0px' }
        );
        footerObserver.observe(footer);
      }
    } catch {
      // safe fallback
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      footerObserver?.disconnect();
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const encodedMsg = encodeURIComponent(whatsappMessage);

  return (
    <>
      {/* Vertical Contact Us Tab - Middle of Left Edge */}
      <Link
        href="/contact"
        className="vertical-contact-tab"
        aria-label="Contact Us"
        title="Contact Dream Cyber Security Pakistan"
      >
        <span className="v-pulse-dot" aria-hidden="true" />
        <PhoneCall size={14} className="v-icon" aria-hidden="true" />
        <span className="v-text">Contact Us</span>
      </Link>

      <div className="floating-actions-container" aria-label="Quick Actions">
        {/* Floating WhatsApp Action Button */}
        <a
          href={`https://wa.me/${whatsappNumber}?text=${encodedMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="floating-whatsapp"
          aria-label="Chat on WhatsApp"
          title="Chat with Dream Cyber Security on WhatsApp"
        >
          <FaWhatsapp size={20} />
          <span>WhatsApp Us</span>
        </a>

        {/* Scroll Up Button - Positioned Below WhatsApp */}
        <button
          type="button"
          onClick={scrollToTop}
          className={`scroll-to-top-btn ${showScrollTop ? 'visible' : ''} ${isNearBottom ? 'near-bottom' : ''}`}
          aria-label="Scroll back to top"
          title="Scroll to top"
        >
          <ChevronUp size={22} strokeWidth={2.5} />
        </button>
      </div>
    </>
  );
}
