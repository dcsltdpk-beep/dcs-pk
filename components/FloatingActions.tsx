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
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Show when scrolled down more than 280px
      setShowScrollTop(scrollY > 280);

      // Check if near bottom of page (within 600px of page bottom)
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      if (scrollY + windowHeight >= documentHeight - 600) {
        setIsNearBottom(true);
      } else {
        setIsNearBottom(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
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
