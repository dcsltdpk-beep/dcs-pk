'use client';

import React, { useEffect, useRef } from 'react';

export type GlobeSceneMode = 'intro' | 'hero';

interface GlobeSceneProps {
  mode?: GlobeSceneMode;
  onFinish?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const BLUE = [79, 180, 255];
const GOLD = [249, 171, 63];
const mix = (a: number[], b: number[], t: number) =>
  a.map((v, i) => Math.round(v + (b[i] - v) * t));
const rgba = (c: number[], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (t: number) => 1 - Math.pow(1 - clamp(t), 3);

export default function GlobeScene({
  mode = 'hero',
  onFinish,
  className,
  style,
}: GlobeSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rawCtx = canvas.getContext('2d');
    if (!rawCtx) return;
    const ctx: CanvasRenderingContext2D = rawCtx;

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Load DCS logo
    const logoImg = new Image();
    logoImg.src = '/logo.png';

    let W = 0;
    let H = 0;
    let dpr = 1;
    let R = 0;
    let cx = 0;
    let cy = 0;

    interface NodeItem {
      ang?: number;
      r?: number;
      delay: number;
      size: number;
      sky: boolean;
      sx?: number;
      sy?: number;
    }

    interface LinkItem {
      a: number;
      b: number;
      delay: number;
      long?: boolean;
      curve?: {
        A: { x: number; y: number; edge?: number };
        B: { x: number; y: number; edge?: number };
        mx: number;
        my: number;
        c: number[];
        fade: number;
      };
    }

    interface StarItem {
      x: number;
      y: number;
      r: number;
      p: number;
    }

    interface PulseItem {
      l: LinkItem;
      u: number;
    }

    let nodes: NodeItem[] = [];
    let links: LinkItem[] = [];
    let stars: StarItem[] = [];
    let pulses: PulseItem[] = [];

    const start = performance.now();
    let running = true;
    let animId = 0;
    let rot = 0;

    function nodePos(n: NodeItem) {
      if (n.sky) return { x: n.sx!, y: n.sy! };
      let a = (n.ang || 0) + rot;
      const span = 0.75;
      const rel = (((a + Math.PI / 2 + span) % (2 * span)) + 2 * span) % (2 * span) - span;
      a = -Math.PI / 2 + rel;
      return {
        x: cx + Math.cos(a) * (n.r || R),
        y: cy + Math.sin(a) * (n.r || R),
        edge: Math.abs(rel) / span,
      };
    }

    function setup() {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth || 300;
      H = canvas.clientHeight || 300;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Earth geometry
      if (mode === 'intro') {
        R = Math.max(W, H) * 0.85;
        cx = W / 2;
        cy = H + R * 0.62;
      } else {
        R = Math.min(W, H) * 0.95;
        cx = W / 2;
        cy = H + R * 0.45;
      }

      // Stars
      stars = Array.from({ length: mode === 'intro' ? 160 : 70 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H * 0.8,
        r: Math.random() * 1.3 + 0.2,
        p: Math.random() * Math.PI * 2,
      }));

      // Network nodes on visible cap + sky
      nodes = [];
      const count = mode === 'intro' ? 70 : 45;
      for (let i = 0; i < count; i++) {
        const ang = -Math.PI / 2 + (Math.random() - 0.5) * 1.5;
        const depth = Math.pow(Math.random(), 1.6) * 0.32;
        const r = R * (1 - depth);
        nodes.push({ ang, r, delay: Math.random(), size: Math.random() * 2 + 1.2, sky: false });
      }
      for (let i = 0; i < count * 0.25; i++) {
        nodes.push({
          sx: Math.random() * W,
          sy: Math.random() * (cy - R) * 0.9 + 20,
          delay: Math.random(),
          size: Math.random() * 1.5 + 1,
          sky: true,
        });
      }

      // Links: connect nearest neighbors
      links = [];
      const pos = nodes.map(nodePos);
      nodes.forEach((_, i) => {
        const near = pos
          .map((p, j) => ({ j, d: Math.hypot(p.x - pos[i].x, p.y - pos[i].y) }))
          .filter((o) => o.j !== i)
          .sort((a, b) => a.d - b.d)
          .slice(0, 2);

        near.forEach((o) => {
          if (o.d < W * 0.35 && i < o.j) {
            links.push({ a: i, b: o.j, delay: Math.random() });
          }
        });
      });

      // Global long arcs
      const longArcCount = mode === 'intro' ? 14 : 8;
      for (let k = 0; k < longArcCount; k++) {
        const a = Math.floor(Math.random() * count);
        const b = Math.floor(Math.random() * count);
        if (a !== b) links.push({ a, b, delay: Math.random(), long: true });
      }
    }

    function state(t: number) {
      if (mode === 'hero' || prefersReducedMotion) {
        return { rise: 1, net: 1, logo: 1, wave: 9999 };
      }
      return {
        rise: ease(t / 1.8),
        net: clamp((t - 1.2) / 2),
        logo: ease((t - 3.0) / 2),
        wave: Math.max(0, (t - 4.8) / 2.2) * Math.max(W, H) * 1.3,
      };
    }

    function logoBox(s: { logo: number }, t: number) {
      const size = mode === 'intro' ? Math.min(W, H) * 0.32 : Math.min(W, H) * 0.42;
      const restY = cy - R - size * (mode === 'intro' ? 1.12 : 1.08);
      const startY = cy - R + size * 0.6; // hidden behind earth
      const float = mode === 'hero' ? Math.sin(t * 1.5) * 8 : 0;
      const y = startY + (restY - startY) * s.logo + float;
      return { x: cx - size / 2, y, size, c: { x: cx, y: y + size / 2 } };
    }

    let finishFired = false;

    function draw(now: number) {
      if (!running) return;
      const t = Math.max(0, (now - start) / 1000);

      // Handle intro completion notification at 7.6s
      if (mode === 'intro' && !finishFired && t >= 7.6) {
        finishFired = true;
        if (onFinish) onFinish();
      }

      const s = state(t);
      rot += mode === 'hero' ? 0.0006 : 0.0004;

      ctx.clearRect(0, 0, W, H);
      const lift = (1 - s.rise) * H * 0.6; // earth starts lower
      ctx.save();
      ctx.translate(0, lift);

      // Stars
      stars.forEach((st) => {
        ctx.fillStyle = `rgba(200,220,255,${(0.3 + 0.4 * Math.sin(t * 2 + st.p)) * s.rise})`;
        ctx.beginPath();
        ctx.arc(st.x, st.y - lift, st.r, 0, Math.PI * 2);
        ctx.fill();
      });

      const L = logoBox(s, t);
      const goldAmt = (p: { x: number; y: number }) => {
        if (s.wave <= 0) return 0;
        const d = Math.hypot(p.x - L.c.x, p.y - L.c.y);
        return clamp((s.wave - d) / 160);
      };

      // 1. Logo glow + logo (drawn BEHIND earth so body occludes it)
      if (s.logo > 0) {
        const g = ctx.createRadialGradient(L.c.x, L.c.y, 0, L.c.x, L.c.y, L.size);
        const glowA = 0.35 * s.logo * (mode === 'hero' ? 0.8 + 0.2 * Math.sin(t * 2) : 1);
        g.addColorStop(0, rgba(GOLD, glowA));
        g.addColorStop(1, rgba(GOLD, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(L.c.x, L.c.y, L.size, 0, Math.PI * 2);
        ctx.fill();

        if (logoImg.complete && logoImg.naturalWidth > 0) {
          ctx.drawImage(logoImg, L.x, L.y, L.size, L.size);
        }
      }

      // 2. Earth body (covers logo while it is behind)
      const body = ctx.createRadialGradient(cx, cy - R * 0.9, R * 0.1, cx, cy, R);
      body.addColorStop(0, '#0d2a66');
      body.addColorStop(0.6, '#061536');
      body.addColorStop(1, '#030b22');
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      // 3. Atmosphere rim glow
      const rimGold = goldAmt({ x: cx, y: cy - R });
      const rimC = mix(BLUE, GOLD, rimGold * 0.7);
      for (let i = 0; i < 4; i++) {
        ctx.strokeStyle = rgba(rimC, 0.5 / (i + 1));
        ctx.lineWidth = 2 + i * 6;
        ctx.shadowColor = rgba(rimC, 0.9);
        ctx.shadowBlur = 40;
        ctx.beginPath();
        ctx.arc(cx, cy, R + i * 3, Math.PI, 2 * Math.PI);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // Horizon flare
      const flare = ctx.createRadialGradient(cx, cy - R, 0, cx, cy - R, W * 0.35);
      flare.addColorStop(0, rgba(rimC, 0.45 * s.rise));
      flare.addColorStop(1, rgba(rimC, 0));
      ctx.fillStyle = flare;
      ctx.fillRect(0, 0, W, H);

      // 4. Network links
      const pos = nodes.map(nodePos);
      links.forEach((l) => {
        const vis = clamp((s.net - l.delay * 0.6) / 0.4);
        if (vis <= 0) return;
        const A = pos[l.a];
        const B = pos[l.b];
        const mx = (A.x + B.x) / 2;
        const my =
          (A.y + B.y) / 2 - Math.hypot(A.x - B.x, A.y - B.y) * (l.long ? 0.45 : 0.25);
        const gA = goldAmt({ x: mx, y: my });
        const c = mix(BLUE, GOLD, gA);
        const fade = 1 - Math.max(A.edge || 0, B.edge || 0) ** 4;
        ctx.strokeStyle = rgba(c, (l.long ? 0.45 : 0.35) * vis * fade);
        ctx.lineWidth = l.long ? 1.1 : 0.8;
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);

        // Draw partial arc while appearing
        const steps = 24;
        const n = Math.floor(steps * vis);
        for (let k = 1; k <= n; k++) {
          const u = k / steps;
          ctx.lineTo(
            (1 - u) * (1 - u) * A.x + 2 * (1 - u) * u * mx + u * u * B.x,
            (1 - u) * (1 - u) * A.y + 2 * (1 - u) * u * my + u * u * B.y
          );
        }
        ctx.stroke();
        l.curve = { A, B, mx, my, c, fade };
      });

      // 5. Data pulses travelling along arcs
      if (s.net > 0.8 && Math.random() < 0.12 && links.length) {
        pulses.push({ l: links[Math.floor(Math.random() * links.length)], u: 0 });
      }
      pulses = pulses.filter((p) => (p.u += 0.012) < 1 && p.l.curve);
      pulses.forEach((p) => {
        if (!p.l.curve) return;
        const { A, B, mx, my, c, fade } = p.l.curve;
        const u = p.u;
        const x = (1 - u) * (1 - u) * A.x + 2 * (1 - u) * u * mx + u * u * B.x;
        const y = (1 - u) * (1 - u) * A.y + 2 * (1 - u) * u * my + u * u * B.y;
        ctx.fillStyle = rgba(c, fade);
        ctx.shadowColor = rgba(c, 1);
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // 6. Nodes
      nodes.forEach((n, i) => {
        const vis = clamp((s.net - n.delay * 0.5) / 0.5);
        if (vis <= 0) return;
        const p = pos[i];
        const g = goldAmt(p);
        const c = mix(BLUE, GOLD, g);
        const fade = 1 - (p.edge || 0) ** 4;
        const tw = 0.7 + 0.3 * Math.sin(t * 3 + i);
        ctx.fillStyle = rgba(c, vis * fade * tw);
        ctx.shadowColor = rgba(c, 1);
        ctx.shadowBlur = 10 + g * 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, n.size * (1 + g * 0.4), 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // 7. Energy wave ring from logo (intro)
      if (mode === 'intro' && s.wave > 0 && s.wave < Math.max(W, H) * 1.3) {
        const waveR = Math.max(0, s.wave);
        ctx.strokeStyle = rgba(GOLD, 0.5 * (1 - waveR / (Math.max(W, H) * 1.3)));
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(L.c.x, L.c.y, waveR, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 8. Periodic gold ripple from logo (hero mode, every ~3s)
      if (mode === 'hero') {
        const rp = Math.max(0, Math.min(1, ((t % 3) + 3) % 3 / 3));
        const rippleR = Math.max(0, L.size * 0.5 + rp * W * 0.5);
        ctx.strokeStyle = rgba(GOLD, 0.35 * (1 - rp));
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(L.c.x, L.c.y, rippleR, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();

      if (running) {
        animId = requestAnimationFrame(draw);
      }
    }

    setup();
    window.addEventListener('resize', setup);
    animId = requestAnimationFrame(draw);

    return () => {
      running = false;
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', setup);
    };
  }, [mode, onFinish]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        ...style,
      }}
    />
  );
}
