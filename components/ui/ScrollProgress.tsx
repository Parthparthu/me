'use client';

import { useEffect, useRef } from 'react';

/**
 * ScrollProgress: Thin progress bar at the very top of the viewport.
 * Uses the --gradient-brand token (sky-accent gradient).
 * Uses compositor-friendly scaleX without React re-renders.
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    function handleScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (barRef.current) {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const p = scrollHeight > 0 ? Math.min(Math.max(window.scrollY / scrollHeight, 0), 1) : 0;
            barRef.current.style.transform = `scaleX(${p})`;
            barRef.current.style.opacity = p > 0.005 ? '1' : '0';
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 right-0 h-[2px] z-[var(--z-header)] pointer-events-none origin-left transition-opacity duration-200"
      style={{
        transform: 'scaleX(0)',
        opacity: 0,
        background: 'var(--gradient-brand)',
      }}
      role="progressbar"
      aria-label="Page scroll progress"
    />
  );
}
