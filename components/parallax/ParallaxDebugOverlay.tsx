'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useScrollStore } from '@/store/useScrollStore';
import { useReducedMotion } from 'framer-motion';

/**
 * ParallaxDebugOverlay
 * Real-time HUD displaying scroll percentage, active section, FPS, and layer offsets.
 * Activated only when `?parallax-debug=true` is present in the URL.
 */
export function ParallaxDebugOverlay() {
  const [enabled, setEnabled] = useState(false);
  const [fps, setFps] = useState(60);
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const activeRoom = useScrollStore((s) => s.activeRoom);
  const shouldReduceMotion = useReducedMotion();

  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('parallax-debug') === 'true') {
      setEnabled(true);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let animId: number;

    const measure = (now: number) => {
      frameCount.current++;
      const delta = now - lastTime.current;
      if (delta >= 500) {
        setFps(Math.round((frameCount.current * 1000) / delta));
        frameCount.current = 0;
        lastTime.current = now;
      }

      setScrollY(window.scrollY);
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(maxScroll > 0 ? Math.round((window.scrollY / maxScroll) * 100) : 0);

      animId = requestAnimationFrame(measure);
    };

    animId = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(animId);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <aside
      aria-label="Parallax Debug HUD"
      className="fixed bottom-20 left-4 z-[9999] p-3.5 rounded-[var(--radius-md)] bg-[#060B18]/90 border border-[var(--accent)] text-xs font-mono text-[var(--label-primary)] shadow-2xl backdrop-blur-md pointer-events-auto max-w-xs"
    >
      <div className="flex items-center justify-between border-b border-[var(--separator)] pb-1.5 mb-2">
        <span className="font-bold text-[var(--accent)] flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
          PARALLAX HUD
        </span>
        <span
          className={`px-1.5 py-0.5 rounded text-[10px] ${
            fps >= 55 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
          }`}
        >
          {fps} FPS
        </span>
      </div>

      <div className="space-y-1 text-[11px]">
        <div className="flex justify-between">
          <span className="text-[var(--label-tertiary)]">Scroll Y:</span>
          <span>{scrollY}px</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--label-tertiary)]">Progress:</span>
          <span>{scrollProgress}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--label-tertiary)]">Active Section:</span>
          <span className="text-[var(--accent)]">{activeRoom}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--label-tertiary)]">Reduced Motion:</span>
          <span>{shouldReduceMotion ? 'ON (0x)' : 'OFF (Active)'}</span>
        </div>
        <div className="border-t border-[var(--separator)] pt-1 mt-1 text-[10px] text-[var(--label-quaternary)]">
          Hero: 0.18x / 0.35x / Canvas / 0.88x<br />
          Cards: Odd +5% / Even -4%
        </div>
      </div>
    </aside>
  );
}
