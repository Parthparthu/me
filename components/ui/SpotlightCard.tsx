'use client';

import { useRef, useState, type ReactNode, type MouseEvent } from 'react';

// Fallback utility if cn is not present, though assuming it might be created later
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
  spotlightColor = 'rgba(99, 102, 241, 0.08)',
  as: Component = 'div',
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove(e: MouseEvent) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  return (
    <Component
      ref={cardRef as any}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn('card-surface relative overflow-hidden', className)}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </Component>
  );
}
