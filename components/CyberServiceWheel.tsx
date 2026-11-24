'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { services as defaultServices, Service } from '@/lib/services';

/* ---------- Stage is designed at the image native size (1920×1080) and scaled to fit ---------- */
const W = 1920;
const H = 1080;
const CX = 960;
const CY = 1000;
const R = 700; // dial follows the metallic arch in bg.jpg
const NODE = 48; // node radius (px)

// Reduced card size & shifted up so it NEVER overlaps the person's head (head is at y >= 810)
const PANEL = { x: 960, y: 470, w: 480, h: 220 };
const GOLD = '#f9ac43';

const toWorld = (x: number, y: number) => new THREE.Vector3(x - W / 2, H / 2 - y, 0);
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

function roundedRect(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

interface CyberServiceWheelProps {
  services?: any[];
}

export default function CyberServiceWheel({ services: propServices }: CyberServiceWheelProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasHost = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const popupRef = useRef<HTMLDivElement>(null);

  // Merge prop services with rich metadata from lib/services.ts
  const services: Service[] = useMemo(() => {
    if (!propServices || propServices.length === 0) {
      return defaultServices;
    }
    return defaultServices.map((defSvc) => {
      const match = propServices.find(
        (p: any) =>
          (p.slug && p.slug === defSvc.slug) ||
          (p.title && p.title.toLowerCase().includes(defSvc.short.toLowerCase())) ||
          (p.title && defSvc.title.toLowerCase().includes(p.title.toLowerCase()))
      );
      if (match) {
        return {
          ...defSvc,
          title: match.title || defSvc.title,
          desc: match.summary || match.description || defSvc.desc,
          slug: match.slug || defSvc.slug,
        };
      }
      return defSvc;
    });
  }, [propServices]);

  const N = services.length;
  const STEP = (Math.PI * 2) / N;

  // Motion state lives in refs for 60fps/120fps performance without React re-render per frame
  const target = useRef(0);
  const current = useRef(0);
  const dragging = useRef(false);
  const lastInput = useRef(0);
  const isScrollingControlled = useRef(false);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  const go = useCallback((d: number) => {
    target.current = Math.round(target.current) + d;
    lastInput.current = performance.now();
  }, []);

  const goTo = useCallback(
    (i: number) => {
      const base = Math.round(target.current);
      const diff = ((((i - base) % N) + N + N / 2) % N) - N / 2;
      go(diff);
    },
    [N, go]
  );

  /* ---------- Fit 1920×1080 stage into the viewport (whole image always visible without cropping) ---------- */
  useEffect(() => {
    const fit = () => {
      if (!viewportRef.current || !stageRef.current) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Account for the sticky navbar height (72px on mobile, 75px on desktop)
      const navH = vw < 768 ? 72 : 75;
      const availableH = Math.max(320, vh - navH);

      const isMobile = vw < 768;
      const isTablet = vw >= 768 && vw < 1024;

      let s: number;
      let stageTop: number;

      if (isMobile) {
        // Mobile (< 768px):
        // Arch interactive span is 1496px. Scale so the entire arch and all rotating icons fit within phone width
        // (94% of vw) with zero cropping. Stage width (1920 * s) covers the mobile width edge-to-edge.
        const targetArchWidth = Math.min(vw * 0.94, 380);
        s = Math.max(0.22, Math.min(0.28, targetArchWidth / 1496));
        // Vertically center the arch in the available space below the header
        stageTop = navH + availableH * 0.50;
      } else if (isTablet) {
        // Tablet (768px - 1023px):
        // Scale so the entire arch fits comfortably across tablet width without any cropping
        const targetArchWidth = Math.min(vw * 0.92, 740);
        s = Math.max(0.42, Math.min(0.52, targetArchWidth / 1496));
        stageTop = navH + availableH * 0.50;
      } else {
        // Desktop / Laptop (>= 1024px):
        // To guarantee the cyber room background NEVER letterboxes or crops on any laptop aspect ratio (16:10, 16:9, etc.):
        // We ensure the cyber room fills the available screen while the arch remains completely visible.
        const fitScale = Math.min(vw / 1496, availableH / 900);
        const coverScale = Math.max(vw / W, availableH / H);
        s = Math.min(coverScale, Math.max(0.55, fitScale));
        stageTop = navH + availableH / 2;
      }

      stageRef.current.style.top = `${stageTop}px`;
      stageRef.current.style.transform = `translate(-50%, -50%) scale(${s})`;
      stageRef.current.style.setProperty('--stage-scale', String(s));
      window.dispatchEvent(new CustomEvent('stage-scale', { detail: s }));
    };

    fit();
    window.addEventListener('resize', fit, { passive: true });
    return () => window.removeEventListener('resize', fit);
  }, []);

  /* ---------- High-Performance Three.js 3D WebGL Scene ---------- */
  useEffect(() => {
    const host = canvasHost.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      console.warn('WebGL initialization fallback:', e);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    // Cap pixel ratio to 1.5 to prevent GPU bottleneck on Retina screens and eliminate scroll lag
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(W, H, false);
    renderer.domElement.style.cssText = `width:${W}px;height:${H}px;display:block;position:absolute;inset:0;pointer-events:none;`;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, -2000, 2000);
    camera.position.z = 1000;

    let pmrem: THREE.PMREMGenerator | null = null;
    try {
      pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    } catch (e) {
      console.warn('PMREM environment generation warning:', e);
    }

    // Background image as an opaque plane
    const tex = new THREE.TextureLoader().load('/bg.jpg');
    tex.colorSpace = THREE.SRGBColorSpace;
    const bg = new THREE.Mesh(
      new THREE.PlaneGeometry(W, H),
      new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })
    );
    bg.position.z = -600;
    scene.add(bg);

    const key = new THREE.DirectionalLight('#ffffff', 2.0);
    key.position.set(-300, 600, 800);
    scene.add(key);

    const warm = new THREE.PointLight(GOLD, 3.5, 0, 0);
    warm.position.set(500, 300, 400);
    scene.add(warm);

    // Optimized high-performance liquid glass material (fast 120fps rendering)
    const glass = (tint: string, extra: Partial<THREE.MeshPhysicalMaterialParameters> = {}) =>
      new THREE.MeshPhysicalMaterial({
        roughness: 0.08,
        metalness: 0.1,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
        specularIntensity: 1,
        color: new THREE.Color(tint),
        envMapIntensity: 1.2,
        transparent: true,
        opacity: 0.82,
        ...extra,
      } as THREE.MeshPhysicalMaterialParameters);

    // Liquid-glass spherical lenses for each service node on the wheel
    const lensGeo = new THREE.SphereGeometry(NODE, 32, 24);
    const nodes = services.map((s) => {
      const m = new THREE.Mesh(lensGeo, glass(s.hue));
      m.scale.z = 0.45;
      scene.add(m);
      return m;
    });

    // Gold 3D torus ring highlighting the 12 o'clock active slot
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(NODE * 1.38, 3, 20, 96),
      new THREE.MeshPhysicalMaterial({
        color: GOLD,
        metalness: 0.9,
        roughness: 0.2,
        emissive: GOLD,
        emissiveIntensity: 0.5,
      })
    );
    ring.position.copy(toWorld(CX, CY - R));
    ring.position.z = 40;
    scene.add(ring);

    // Compact 3D liquid-glass slab in front of the person
    const panelGeo = new THREE.ExtrudeGeometry(roundedRect(PANEL.w, PANEL.h, 36), {
      depth: 16,
      bevelEnabled: true,
      bevelThickness: 14,
      bevelSize: 14,
      bevelSegments: 8,
      curveSegments: 20,
    });
    panelGeo.center();
    const panelMat = glass('#28245f', { roughness: 0.1, opacity: 0.85 });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    scene.add(panel);
    const panelHome = toWorld(PANEL.x, PANEL.y);
    const topSlot = toWorld(CX, CY - R);

    // Spring physics & animation loop
    let open = 0;
    let openV = 0;
    let settledAt = 0;
    const tint = new THREE.Color();
    let raf = 0;
    let prev = performance.now();

    // Viewport visibility tracking: pause WebGL when off-screen to guarantee 120fps smooth scrolling for the rest of the site
    let isVisible = true;
    let observer: IntersectionObserver | null = null;
    try {
      observer = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
          if (isVisible && !raf) {
            prev = performance.now();
            raf = requestAnimationFrame(loop);
          }
        },
        { rootMargin: '300px 0px 300px 0px' }
      );
      if (trackRef.current) observer.observe(trackRef.current);
    } catch {
      isVisible = true;
    }

    const loop = (now: number) => {
      if (!isVisible) {
        raf = 0;
        return;
      }

      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;

      // Auto-advance when user is idle for more than 7 seconds (only if not scrolling page)
      if (!dragging.current && !isScrollingControlled.current && now - lastInput.current > 7000) {
        target.current = Math.round(target.current) + 1;
        lastInput.current = now;
      }

      // Ultra-smooth 120fps critically-damped follow rate (instant & crisp follow during scroll)
      const followRate = isScrollingControlled.current ? 22.0 : 10.0;
      current.current += (target.current - current.current) * (1 - Math.exp(-dt * followRate));
      const cur = current.current;
      const idx = ((Math.round(cur) % N) + N) % N;
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }

      // Exact angular distance of closest service from the 12 o'clock active circle
      const distFromCircle = Math.abs(cur - Math.round(cur));
      // Strict threshold: service node MUST actually be inside the 12 o'clock highlight circle
      const isInCircle = distFromCircle <= 0.14;
      // Proximity factor: 1.0 when perfectly centered in circle, drops strictly to 0 when exiting the circle
      const circleProximity = Math.max(0, Math.min(1, (0.14 - distFromCircle) / 0.08));

      // After user pauses scrolling on a touchpad, magnetically snap to the nearest full service slot
      if (isScrollingControlled.current && now - lastInput.current > 130) {
        const nearestSlot = Math.round(target.current);
        if (Math.abs(target.current - nearestSlot) > 0.005) {
          target.current += (nearestSlot - target.current) * (1 - Math.exp(-dt * 14.0));
        }
      }

      const settled = !dragging.current && Math.abs(target.current - cur) < 0.03 && isInCircle;
      if (settled) {
        if (!settledAt) settledAt = now;
      } else {
        settledAt = 0;
      }
      const wantOpen = settledAt && now - settledAt > 60 && isInCircle ? 1 : 0;

      // Jelly spring for popup opening (only if actually in circle)
      if (!isInCircle) {
        open = Math.max(0, open - dt * 18.0);
        openV = 0;
      } else {
        openV += ((wantOpen - open) * 190 - openV * (wantOpen ? 16 : 24)) * dt;
        open = Math.max(0, open + openV * dt);
      }

      for (let i = 0; i < N; i++) {
        const a = wrap((i - cur) * STEP); // 0 = 12 o'clock top slot
        const x = CX + Math.sin(a) * R;
        const y = CY - Math.cos(a) * R;
        const vis = Math.abs(a) <= Math.PI / 2 + 0.35;
        const near = Math.max(0, 1 - Math.abs(a) / (STEP * 0.9));
        const sc = 0.82 + near * 0.36;

        const m = nodes[i];
        if (m) {
          m.visible = vis;
          m.position.copy(toWorld(x, y));
          m.position.z = near * 26;
          m.scale.set(sc, sc, 0.45 * sc);
        }

        const el = iconRefs.current[i];
        if (el) {
          el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${sc})`;
          el.style.opacity = vis ? String(Math.min(1, 1.6 - Math.abs(a) / 1.35)) : '0';
          el.style.pointerEvents = vis ? 'auto' : 'none';
          el.classList.toggle('is-top', near > 0.85);
        }
      }

      ring.scale.setScalar(0.92 + Math.min(open, 1) * 0.08);
      ring.rotation.z += dt * 0.5;

      // Panel smoothly rises into place in front of the person only when a service is inside the active circle
      const o = Math.max(0, open);
      panel.visible = o > 0.01 && circleProximity > 0.05;
      panelMat.opacity = Math.max(0, Math.min(0.85, 0.85 * o * circleProximity));
      panel.position.lerpVectors(topSlot, panelHome, Math.min(o, 1));
      panel.position.z = -40;

      // Adapt 3D glass slab dimensions to match responsive card on mobile/tablet/desktop
      const vw = window.innerWidth;
      const isMob = vw < 768;
      const isTab = vw >= 768 && vw < 1024;
      const cardSx = isMob ? 2.58 : isTab ? 1.41 : 1.0;
      const cardSy = isMob ? 2.45 : isTab ? 1.41 : 1.0;
      panel.scale.set(
        Math.max(0.05, o * cardSx),
        Math.max(0.05, o * (0.92 + 0.08 * o) * cardSy),
        1
      );

      if (services[idx]) {
        tint.set(services[idx].hue).lerp(new THREE.Color('#28245f'), 0.55);
        panelMat.color.lerp(tint, 0.1);
      }

      const p = popupRef.current;
      if (p) {
        // Multiplier: 1.0 when dead center in circle, drops strictly to 0 when exiting the circle
        const t = Math.min(1, Math.max(0, (o - 0.35) / 0.65)) * circleProximity;
        p.style.opacity = String(t);
        p.style.transform = `translate(-50%, -50%) translateY(${(1 - t) * 14}px) scale(${0.94 + 0.06 * t})`;
        p.style.pointerEvents = t > 0.85 ? 'auto' : 'none';
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        if (m.material) {
          (Array.isArray(m.material) ? m.material : [m.material]).forEach((mm) => mm?.dispose());
        }
      });
      tex.dispose();
      pmrem?.dispose();
      renderer.dispose();
      if (host.contains(renderer.domElement)) {
        host.removeChild(renderer.domElement);
      }
    };
  }, [N, STEP, services]);

  /* ---------- Page Scroll Pinning & Wheel Rotation Integration ---------- */
  useEffect(() => {
    let scrollTicking = false;

    const handleWindowScroll = () => {
      if (!trackRef.current || scrollTicking) return;
      scrollTicking = true;

      requestAnimationFrame(() => {
        if (!trackRef.current) {
          scrollTicking = false;
          return;
        }
        const track = trackRef.current;
        const rect = track.getBoundingClientRect();
        const vh = window.innerHeight || 800;
        const totalScrollable = rect.height - vh;

        if (totalScrollable <= 0) {
          scrollTicking = false;
          return;
        }

        const scrollDist = -rect.top;
        const rawProgress = scrollDist / totalScrollable;
        const clamped = Math.max(0, Math.min(1, rawProgress));

        // Is the section actively pinned on screen?
        const isPinned = rect.top <= 5 && rect.bottom >= vh - 5;
        if (isPinned) {
          isScrollingControlled.current = true;
          lastInput.current = performance.now();
          target.current = clamped * (N - 1);
        } else {
          isScrollingControlled.current = false;
        }
        scrollTicking = false;
      });
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    handleWindowScroll();

    return () => {
      window.removeEventListener('scroll', handleWindowScroll);
    };
  }, [N]);

  /* ---------- Interactive Input: Touch Drag, Pointer, Keys ---------- */
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    let dragX = 0;
    let dragStart = 0;
    let moved = false;

    const scale = () => Math.min(window.innerWidth / W, window.innerHeight / H);

    const down = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('.popup, .controls, .icon, a, button')) return;
      dragging.current = true;
      moved = false;
      dragX = e.clientX;
      dragStart = target.current;
      lastInput.current = performance.now();
    };

    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = (e.clientX - dragX) / Math.max(0.2, scale());
      if (Math.abs(dx) > 6) moved = true;
      target.current = dragStart - dx / 200;
      lastInput.current = performance.now();
    };

    const up = () => {
      if (!dragging.current) return;
      dragging.current = false;
      target.current = Math.round(target.current);
    };

    const click = (e: MouseEvent) => {
      if (moved) {
        e.stopPropagation();
        e.preventDefault();
        moved = false;
      }
    };

    const key = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };

    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    el.addEventListener('click', click, true);
    window.addEventListener('keydown', key);

    return () => {
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      el.removeEventListener('click', click, true);
      window.removeEventListener('keydown', key);
    };
  }, [go]);

  const svc = services[active] || services[0];

  // Track height provides comfortable scroll distance to step through all services
  const trackHeightVh = Math.max(280, 100 + (N - 1) * 32);

  return (
    <section
      ref={trackRef}
      className="cyber-wheel-track services-dial-section"
      id="services-wheel"
      style={{
        height: `${trackHeightVh}vh`,
        position: 'relative',
        background: '#070718',
      }}
    >
      {/* Sticky Pinned Viewport Container */}
      <div ref={viewportRef} className="cyber-wheel-viewport services-dial-viewport">
        {/* Ambient Full-Bleed Cyber Room Background Layer */}
        <div className="services-dial-bg" aria-hidden="true" />

        {/* Section Heading: Placed with Direct Viewport Spacing Below Sticky Navbar */}
        <header className="services-dial-hero">
          <span className="eyebrow">Dream Cyber Security</span>
          <h2 className="services-dial-hero-title">
            Our <em>Services</em>
          </h2>
        </header>

        {/* Uniformly Scaled 1920×1080 Stage */}
        <div ref={stageRef} className="stage services-dial-stage" style={{ ['--accent' as any]: svc.hue }}>
          {/* Three.js Canvas Host */}
          <div ref={canvasHost} className="gl services-dial-gl" />

          {/* Wheel Nodes: Circular Buttons Arranged Along the Vault Arch */}
          {services.map((s, i) => {
            const IconComponent = s.icon;
            return (
              <button
                key={s.title}
                ref={(el) => {
                  iconRefs.current[i] = el;
                }}
                className="icon services-dial-node-btn"
                onClick={() => goTo(i)}
                aria-label={s.title}
                style={{ ['--h' as any]: s.hue }}
                type="button"
              >
                <IconComponent size={32} strokeWidth={1.8} />
                <span className="label services-dial-node-label">{s.short}</span>
              </button>
            );
          })}

          {/* Active Service Glass Card (Compact, Placed with Generous Clearance Above Person's Head) */}
          <div
            ref={popupRef}
            className="popup services-dial-popup"
            style={{
              left: PANEL.x,
              top: PANEL.y,
              width: PANEL.w,
              height: PANEL.h,
            }}
          >
            <div className="popup-inner services-dial-card-glass">
              {/* Top Meta: Index & Active Capability Indicator */}
              <div className="services-dial-card-meta">
                {/* <span className="num">
                  {String(active + 1).padStart(2, '0')} // {String(N).padStart(2, '0')}
                </span> */}
                <span className="services-dial-live-pill">
                  <span className="services-dial-live-dot" />
                  <span>ACTIVE CAPABILITY</span>
                </span>
              </div>

              {/* Service Title */}
              <h3 className="services-dial-card-title">{svc.title}</h3>

              {/* High-Contrast Readable Description */}
              <p className="services-dial-card-desc">{svc.desc}</p>

              {/* Feature Points & Action CTA */}
              <div className="row services-dial-card-row">
                <ul className="services-dial-points-list">
                  {svc.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>

                <div className="services-dial-btn-group">
                  <Link
                    href={`/services/${svc.slug}`}
                    className="cta services-dial-cta-btn"
                    title={`Explore ${svc.title}`}
                  >
                    <span>Explore Capability</span>
                    <ArrowUpRight size={15} />
                  </Link>

                  <Link href="/contact" className="services-dial-ghost-link" title="Request Consultation">
                    <span>Get a Quote</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom HUD Navigation Controls: Positioned Centered at Viewport Bottom */}
        <div className="services-dial-controls">
          <button
            onClick={() => go(-1)}
            aria-label="Previous Service"
            type="button"
            className="services-dial-ctrl-btn"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="services-dial-dots-row">
            {services.map((s, i) => (
              <button
                key={s.title}
                type="button"
                className={`services-dial-dot ${i === active ? 'on' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Jump to ${s.title}`}
              />
            ))}
          </div>

          <button
            onClick={() => go(1)}
            aria-label="Next Service"
            type="button"
            className="services-dial-ctrl-btn"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
