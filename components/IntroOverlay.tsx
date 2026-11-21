'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import GlobeScene from './GlobeScene';

interface IntroOverlayProps {
  onComplete?: () => void;
}

export default function IntroOverlay({ onComplete }: IntroOverlayProps) {
  // Start visible unless determined otherwise
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isFading, setIsFading] = useState<boolean>(false);
  const finishedRef = useRef<boolean>(false);

  const finishIntro = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    try {
      sessionStorage.setItem('dcs_intro_played', 'true');
    } catch {
      // In case sessionStorage is blocked
    }

    setIsFading(true);
    document.body.classList.remove('intro-active');

    if (onComplete) {
      onComplete();
    }

    // After fade-out transition (1s), completely remove overlay from DOM to free CPU
    setTimeout(() => {
      setIsVisible(false);
    }, 1100);
  }, [onComplete]);

  useEffect(() => {
    try {
      const alreadyPlayed = sessionStorage.getItem('dcs_intro_played');
      const prefersReducedMotion =
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (alreadyPlayed === 'true' || prefersReducedMotion) {
        setIsVisible(false);
        document.body.classList.remove('intro-active');
        if (onComplete) onComplete();
        return;
      }
    } catch {
      // Fallback
    }

    document.body.classList.add('intro-active');

    // Auto finish fallback timer matching reference (7.6s)
    const timer = setTimeout(() => {
      finishIntro();
    }, 7600);

    return () => {
      clearTimeout(timer);
      document.body.classList.remove('intro-active');
    };
  }, [finishIntro, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      id="intro"
      className={isFading ? 'hide' : ''}
      role="dialog"
      aria-label="Welcome Intro Animation"
    >
      <GlobeScene
        mode="intro"
        onFinish={finishIntro}
        className="intro-canvas-element"
      />
      <button
        id="skipBtn"
        type="button"
        onClick={finishIntro}
        aria-label="Skip introduction animation"
      >
        Skip &rarr;
      </button>
    </div>
  );
}
