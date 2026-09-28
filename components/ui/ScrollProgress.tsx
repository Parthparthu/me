'use client';

import { useEffect, useState } from 'react';

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) { setProgress(0); return; }
      setProgress(Math.min(window.scrollY / scrollHeight, 1));
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (progress <= 0.01) return null;

  return (
    <div
      className="fixed top-0 left-0 h-[2px] z-[var(--z-header,50)]" 
      style={{
        width: `${progress * 100}%`,
        background: 'var(--gradient-brand)',
        transition: 'width 100ms linear',
      }}
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page scroll progress"
    />
  );
}
