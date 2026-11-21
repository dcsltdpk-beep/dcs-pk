'use client';

import React, { useState, useEffect } from 'react';
import IntroOverlay from './IntroOverlay';

interface SiteRevealWrapperProps {
  children: React.ReactNode;
}

export default function SiteRevealWrapper({ children }: SiteRevealWrapperProps) {
  const [siteShown, setSiteShown] = useState<boolean>(false);

  useEffect(() => {
    try {
      const alreadyPlayed = sessionStorage.getItem('dcs_intro_played');
      const prefersReducedMotion =
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (alreadyPlayed === 'true' || prefersReducedMotion) {
        setSiteShown(true);
        document.documentElement.classList.add('intro-skipped');
      }
    } catch {
      setSiteShown(true);
    }
  }, []);

  const handleIntroComplete = () => {
    setSiteShown(true);
  };

  return (
    <>
      <IntroOverlay onComplete={handleIntroComplete} />
      <div id="site" className={siteShown ? 'show' : ''}>
        {children}
      </div>
    </>
  );
}
