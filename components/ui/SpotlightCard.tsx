'use client';

import { useRef, useState, useCallback, type ReactNode, type MouseEvent } from 'react';

// Fallback utility if cn is not present
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
  as?: 'div' | 'article' | 'section';
}

export function SpotlightCard({
  children,
  className,
  spotlightColor = 'rgba(14, 165, 233, 0.08)',
  as: Component = 'div',
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const ticking = useRef(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => {
    if (cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
    setIsHovered(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!cardRef.current || ticking.current) return;
    if (!rectRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
    ticking.current = true;
    const clientX = e.clientX;
    const clientY = e.clientY;

    requestAnimationFrame(() => {
      if (cardRef.current && rectRef.current) {
        const x = clientX - rectRef.current.left;
        const y = clientY - rectRef.current.top;
        cardRef.current.style.setProperty('--spotlight-x', `${x}px`);
        cardRef.current.style.setProperty('--spotlight-y', `${y}px`);
      }
      ticking.current = false;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    rectRef.current = null;
    setIsHovered(false);
  }, []);

  return (
    <Component
      ref={cardRef as any}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn('card-surface relative overflow-hidden', className)}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), ${spotlightColor}, transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </Component>
  );
}
