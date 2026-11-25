'use client';

import React, { useEffect, useRef, useState } from 'react';

const CELEBRATION_EVENT = 'companio:celebrate';

export function triggerCelebration(label?: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent(CELEBRATION_EVENT, {
      detail: { label },
    })
  );
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vRot: number;
  color: string;
  alpha: number;
  shape: 'rect' | 'circle';
}

const PALETTE = ['#D4F7A5', '#FDE047', '#FF7AC6', '#C4B5FD', '#34D399', '#38BDF8'];

export function CelebrationOverlay() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const [bannerText, setBannerText] = useState<string | null>(null);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | null = null;

    const handleCelebrate = (e: Event) => {
      const custom = e as CustomEvent<{ label?: string }>;
      if (custom.detail?.label) {
        setBannerText(custom.detail.label);
        if (hideTimer) clearTimeout(hideTimer);
        hideTimer = setTimeout(() => setBannerText(null), 2600);
      }

      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const particles: Particle[] = [];
      const count = width < 640 ? 55 : 90;

      for (let i = 0; i < count; i++) {
        const fromLeft = i % 2 === 0;
        const originX = fromLeft ? width * 0.25 : width * 0.75;
        const originY = height * 0.42;
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.45;
        const speed = 5 + Math.random() * 8;

        particles.push({
          x: originX + (Math.random() - 0.5) * 60,
          y: originY + (Math.random() - 0.5) * 40,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          size: 5 + Math.random() * 6,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.18,
          color: PALETTE[i % PALETTE.length],
          alpha: 1,
          shape: i % 3 === 0 ? 'circle' : 'rect',
        });
      }

      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }

      const start = performance.now();
      const duration = 2400;

      const tick = (now: number) => {
        const elapsed = now - start;
        ctx.clearRect(0, 0, width, height);

        let alive = false;
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.24; // gentle gravity
          p.vx *= 0.99;
          p.rotation += p.vRot;

          if (elapsed > duration * 0.55) {
            p.alpha = Math.max(0, 1 - (elapsed - duration * 0.55) / (duration * 0.45));
          }

          if (p.alpha > 0.02 && p.y < height + 40) {
            alive = true;
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = p.color;
            ctx.strokeStyle = '#141414';
            ctx.lineWidth = 1;
            if (p.shape === 'circle') {
              ctx.beginPath();
              ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();
            } else {
              ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.65);
              ctx.strokeRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.65);
            }
            ctx.restore();
          }
        }

        if (alive && elapsed < duration + 200) {
          animRef.current = requestAnimationFrame(tick);
        } else {
          ctx.clearRect(0, 0, width, height);
          animRef.current = null;
        }
      };

      animRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener(CELEBRATION_EVENT, handleCelebrate);
    return () => {
      window.removeEventListener(CELEBRATION_EVENT, handleCelebrate);
      if (hideTimer) clearTimeout(hideTimer);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100]">
      <canvas ref={canvasRef} className="h-full w-full block" />
      {bannerText && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 animate-in fade-in zoom-in-95 duration-300">
          <div className="rounded-full border-2 border-ink bg-[#D4F7A5] px-5 py-2 font-display text-xs sm:text-sm font-black text-ink shadow-brutal">
            {bannerText}
          </div>
        </div>
      )}
    </div>
  );
}
