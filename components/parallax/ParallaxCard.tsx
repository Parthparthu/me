'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { PARALLAX_CONFIG } from '@/lib/parallax-config';

interface ParallaxCardProps {
  children: React.ReactNode;
  index: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ParallaxCard
 * Provides alternating depth offsets on grid cards (odd cards slightly lead,
 * even cards slightly lag) to create natural visual layering while scrolling.
 */
export function ParallaxCard({
  children,
  index,
  className = '',
  style = {},
}: ParallaxCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Alternating depth offset: odd leads by +5%, even lags by -4%
  const isOdd = index % 2 === 1;
  const baseRate = isOdd ? PARALLAX_CONFIG.cards.oddRate : PARALLAX_CONFIG.cards.evenRate;
  const effectiveRate = shouldReduceMotion
    ? 0
    : baseRate * (isMobile ? PARALLAX_CONFIG.mobileScale : 1.0);

  // Offset distance in pixels across the viewport transit
  const maxOffset = 24 * (effectiveRate / 0.05);
  const y = useTransform(scrollYProgress, [0, 1], [maxOffset, -maxOffset]);

  return (
    <div ref={ref} className={className} style={style}>
      <motion.div
        style={{
          y,
          willChange: shouldReduceMotion ? 'auto' : 'transform',
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
