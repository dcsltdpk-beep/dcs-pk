'use client';

import React, { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa6';
import { ChevronUp } from 'lucide-react';

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
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const shouldShow = scrollY > 280;
        setShowScrollTop((prev) => (prev !== shouldShow ? shouldShow : prev));

        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const nearBottom = scrollY + windowHeight >= documentHeight - 600;
        setIsNearBottom((prev) => (prev !== nearBottom ? nearBottom : prev));
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
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
  );
}
