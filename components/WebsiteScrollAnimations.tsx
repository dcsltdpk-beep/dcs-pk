'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function WebsiteScrollAnimations() {
  const pathname = usePathname();
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let isDestroyed = false;
    let scrollRafId: number | null = null;
    let cardObserver: IntersectionObserver | null = null;
    let mutationObserver: MutationObserver | null = null;

    // Smooth ease-out cubic function matching the video's natural deceleration
    const easeOutCubic = (x: number): number => 1 - Math.pow(1 - Math.max(0, Math.min(1, x)), 3);

    // ========================================================
    // 1. PAGE SCROLL ANIMATION (Layered Section Stacking)
    // ========================================================
    const setupPageScrollAnimation = () => {
      if (prefersReducedMotion) return () => {};

      const main = document.querySelector('main') || document.body;

      // Select all top-level sections across any page (including pinned tracks for smooth layered ordering)
      const directSections = Array.from(
        main.querySelectorAll<HTMLElement>('section.section, section.hero-section, section.cyber-wheel-track, section')
      ).filter((sec) => {
        return !sec.parentElement?.closest('section');
      });

      // Include site footer as the final layered curtain
      const footer = document.querySelector<HTMLElement>('footer.site-footer');
      const allSections = [...directSections];
      if (footer && !allSections.includes(footer)) {
        allSections.push(footer);
      }

      if (allSections.length <= 1) return () => {};

      // Dynamically calculate sticky top per section so no content is ever cut off
      const updateStickyTops = () => {
        const vh = window.innerHeight || 800;
        const isMobileOrTablet = window.innerWidth <= 992;

        allSections.forEach((sec) => {
          if (isMobileOrTablet) {
            // Natural flow on mobile and tablets guarantees complete visibility of all stacked elements
            sec.style.position = 'relative';
            sec.style.top = 'auto';
            sec.style.transform = '';
            sec.style.opacity = '1';
            sec.style.visibility = 'visible';
            sec.style.filter = '';
            sec.style.pointerEvents = 'auto';
          } else if (sec.classList.contains('cyber-wheel-track')) {
            // Pinned wheel tracks manage their own internal sticky viewport
            sec.style.position = 'relative';
            sec.style.top = 'auto';
          } else {
            // If section height exceeds viewport, stick only after the entire bottom is scrolled into view
            const secHeight = sec.offsetHeight;
            const stickyTop = Math.min(0, vh - secHeight);
            sec.style.position = 'sticky';
            sec.style.top = `${stickyTop}px`;
          }
        });
      };

      // Assign stacking context and base layer styling
      allSections.forEach((sec, idx) => {
        sec.classList.add('layered-scroll-section');
        const z = 10 + idx * 5;
        sec.style.setProperty('--layer-index', String(z));
        sec.style.zIndex = String(z);

        if (idx > 0) {
          sec.classList.add('layered-covering-section');
        }
      });

      updateStickyTops();

      // Update layered depth transition on scroll
      const updateLayers = () => {
        if (isDestroyed) return;

        // Pause scroll effects while initial site intro sequence is playing
        if (
          document.documentElement.classList.contains('intro-active') ||
          document.body.classList.contains('intro-active')
        ) {
          return;
        }

        const vh = window.innerHeight || 800;
        const isMobileOrTablet = window.innerWidth <= 992;

        if (isMobileOrTablet) {
          allSections.forEach((sec) => {
            sec.style.transform = '';
            sec.style.opacity = '1';
            sec.style.visibility = 'visible';
            sec.style.filter = '';
            sec.style.pointerEvents = 'auto';
          });
          return;
        }

        const maxTuckTranslate = 16;

        for (let i = 0; i < allSections.length; i++) {
          const sec = allSections[i];

          // Check if section i is being covered by section i + 1
          if (i < allSections.length - 1) {
            const nextSec = allSections[i + 1];
            const nextRect = nextSec.getBoundingClientRect();

            if (nextRect.top < vh && nextRect.top > 0) {
              // Section i is actively being covered by Section i + 1 as user scrolls down
              // In reverse scroll, this smoothly uncovers Section i as Section i + 1 slides down
              const p = 1 - Math.max(0, Math.min(1, nextRect.top / vh));
              const eased = easeOutCubic(p);

              sec.style.transform = `scale(${1 - eased * 0.04}) translate3d(0, ${eased * maxTuckTranslate}px, 0)`;
              sec.style.transformOrigin = 'center top';

              // Pure compositor-accelerated opacity fade without expensive filter repaints
              const fadeProgress = Math.max(0, Math.min(1, (p - 0.45) / 0.55));
              const opacity = 1 - fadeProgress;
              sec.style.opacity = String(opacity);
              sec.style.visibility = opacity <= 0.02 ? 'hidden' : 'visible';
              sec.style.pointerEvents = opacity <= 0.1 ? 'none' : 'auto';
            } else if (nextRect.top <= 0) {
              // Section i + 1 has fully covered Section i: completely hide to eliminate background clutter
              sec.style.transform = `scale(0.96) translate3d(0, ${maxTuckTranslate}px, 0)`;
              sec.style.transformOrigin = 'center top';
              sec.style.opacity = '0';
              sec.style.visibility = 'hidden';
              sec.style.pointerEvents = 'none';
            } else {
              // Section i + 1 is below viewport; Section i is fully uncovered and interactive
              sec.style.transform = 'scale(1) translate3d(0, 0, 0)';
              sec.style.opacity = '1';
              sec.style.visibility = 'visible';
              sec.style.pointerEvents = 'auto';
            }
          } else {
            // Last section (Footer) stays at resting position once reached
            sec.style.transform = 'scale(1) translate3d(0, 0, 0)';
            sec.style.opacity = '1';
            sec.style.visibility = 'visible';
            sec.style.pointerEvents = 'auto';
            sec.style.filter = 'none';
          }
        }
      };

      const onScroll = () => {
        if (scrollRafId !== null) return;
        scrollRafId = requestAnimationFrame(() => {
          updateLayers();
          scrollRafId = null;
        });
      };

      const onResize = () => {
        updateStickyTops();
        onScroll();
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize, { passive: true });

      // Run initial check
      updateLayers();

      return () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
        if (scrollRafId !== null) {
          cancelAnimationFrame(scrollRafId);
          scrollRafId = null;
        }
        allSections.forEach((sec) => {
          sec.style.transform = '';
          sec.style.opacity = '';
          sec.style.visibility = '';
          sec.style.pointerEvents = '';
          sec.style.filter = '';
          sec.style.boxShadow = '';
          sec.style.zIndex = '';
          sec.classList.remove('layered-scroll-section', 'layered-covering-section');
        });
      };
    };

    // ========================================================
    // 2. CARD ENTRANCE ANIMATION (Directional & Staggered)
    // Replicating the video: Left from left, Right from right,
    // Center scales up + fade-in, sequential stagger delays
    // ========================================================
    const setupCardEntranceAnimation = () => {
      const cardNodes = Array.from(
        document.querySelectorAll<HTMLElement>(
          '.card, .stat-item, .video-card-compact'
        )
      ).filter((el) => {
        return (
          !el.closest('.mega-dropdown-menu') &&
          !el.closest('.mobile-drawer') &&
          !el.closest('.cyber-wheel-track')
        );
      });

      if (cardNodes.length === 0) return () => {};

      if (prefersReducedMotion) {
        cardNodes.forEach((card) => {
          card.classList.add('card-animate-settled');
        });
        return () => {};
      }

      const isMobile = window.innerWidth <= 992;

      // Group cards by parent container
      const containerGroups = new Map<HTMLElement, HTMLElement[]>();
      cardNodes.forEach((card) => {
        const parent = (card.parentElement as HTMLElement) || document.body;
        if (!containerGroups.has(parent)) {
          containerGroups.set(parent, []);
        }
        containerGroups.get(parent)!.push(card);
      });

      // Classify each card: Left, Center, or Right
      containerGroups.forEach((cards, parent) => {
        const hasGrid3 = parent.classList.contains('grid-3');
        const hasGrid2 = parent.classList.contains('grid-2');
        const hasGrid4 = parent.classList.contains('grid-4') || parent.closest('.stats-bar') !== null;

        cards.forEach((card, idx) => {
          let position: 'left' | 'center' | 'right' = 'center';

          if (isMobile) {
            // Single column on mobile -> center scale up
            position = 'center';
          } else if (hasGrid3) {
            // 3-column grid (e.g. Services, Features, Blog, Pricing in video)
            const col = idx % 3;
            if (col === 0) position = 'left';
            else if (col === 1) position = 'center';
            else position = 'right';
          } else if (hasGrid2) {
            // 2-column grid (e.g. Academy, Portfolio, Contact)
            const col = idx % 2;
            position = col === 0 ? 'left' : 'right';
          } else if (hasGrid4) {
            // 4-column grid (e.g. Stats bar)
            const col = idx % 4;
            if (col === 0) position = 'left';
            else if (col === 1 || col === 2) position = 'center';
            else position = 'right';
          } else {
            // Fallback: single card or custom container
            if (cards.length === 1) {
              position = 'center';
            } else {
              const col = idx % 3;
              if (col === 0) position = 'left';
              else if (col === 1) position = 'center';
              else position = 'right';
            }
          }

          // Staggered timing matching video: ~130ms between cards in row + 80ms per row
          const colIndex = hasGrid3 ? idx % 3 : hasGrid2 ? idx % 2 : idx % 4;
          const rowIndex = Math.floor(idx / (hasGrid3 ? 3 : hasGrid2 ? 2 : 4));
          const staggerDelay = colIndex * 130 + rowIndex * 80;

          card.setAttribute('data-card-pos', position);
          card.classList.add('card-animate-init', `card-pos-${position}`);
          card.style.setProperty('--card-stagger-delay', `${staggerDelay}ms`);
          card.style.transitionDelay = `${staggerDelay}ms`;
        });
      });

      // Intersection Observer to trigger entrance animation when cards enter viewport
      cardObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const card = entry.target as HTMLElement;
              card.classList.add('card-in-view');
              cardObserver?.unobserve(card);

              // After entrance animation completes, settle so native hover translateY(-5px) works flawlessly
              const delayAttr = card.style.transitionDelay || '0ms';
              const delayMs = parseInt(delayAttr, 10) || 0;
              setTimeout(() => {
                if (!isDestroyed) {
                  card.classList.remove('card-animate-init');
                  card.classList.add('card-animate-settled');
                  card.style.transitionDelay = '';
                  card.style.willChange = 'auto';
                }
              }, 850 + delayMs);
            }
          });
        },
        {
          threshold: 0.08,
          rootMargin: '0px 0px -20px 0px',
        }
      );

      cardNodes.forEach((card) => {
        cardObserver?.observe(card);
      });

      return () => {
        if (cardObserver) {
          cardObserver.disconnect();
          cardObserver = null;
        }
        cardNodes.forEach((card) => {
          card.classList.remove(
            'card-animate-init',
            'card-in-view',
            'card-animate-settled',
            'card-pos-left',
            'card-pos-center',
            'card-pos-right'
          );
          card.style.transitionDelay = '';
          card.removeAttribute('data-card-pos');
        });
      };
    };

    // Initialize both animations safely
    const init = () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }

      let cleanupScroll: (() => void) | undefined;
      let cleanupCards: (() => void) | undefined;

      try {
        cleanupScroll = setupPageScrollAnimation();
      } catch (err) {
        console.warn('Page scroll animation error:', err);
      }

      try {
        cleanupCards = setupCardEntranceAnimation();
      } catch (err) {
        console.warn('Card entrance animation error:', err);
      }

      cleanupRef.current = () => {
        if (cleanupScroll) cleanupScroll();
        if (cleanupCards) cleanupCards();
      };
    };

    // If initial intro is active on home page, wait until it completes
    if (
      document.documentElement.classList.contains('intro-active') ||
      document.body.classList.contains('intro-active')
    ) {
      mutationObserver = new MutationObserver(() => {
        if (
          !document.documentElement.classList.contains('intro-active') &&
          !document.body.classList.contains('intro-active')
        ) {
          mutationObserver?.disconnect();
          mutationObserver = null;
          setTimeout(init, 120);
        }
      });

      mutationObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });
      mutationObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ['class'],
      });

      const timer = setTimeout(init, 2600);
      return () => {
        clearTimeout(timer);
        mutationObserver?.disconnect();
        if (cleanupRef.current) cleanupRef.current();
      };
    } else {
      init();
    }

    return () => {
      isDestroyed = true;
      mutationObserver?.disconnect();
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [pathname]);

  return null;
}
