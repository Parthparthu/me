'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { PARALLAX_CONFIG } from '@/lib/parallax-config';

interface ParallaxImageProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

/**
 * ParallaxImage
 * Wraps media inside an overflow-hidden frame and applies a subtle counter-scroll
 * transform (at ~0.88x speed) to create optical depth within project cards.
 */
export function ParallaxImage({
  children,
  className = '',
  containerClassName = '',
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
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
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const scale = shouldReduceMotion ? 1.0 : PARALLAX_CONFIG.cardImages.overflowScale;
  const travelDistance = shouldReduceMotion ? 0 : (isMobile ? 10 : 20);

  const y = useTransform(scrollYProgress, [0, 1], [-travelDistance, travelDistance]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden relative ${containerClassName}`}
    >
      <motion.div
        style={{
          y,
          scale,
          willChange: shouldReduceMotion ? 'auto' : 'transform',
        }}
        className={`w-full h-full ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
}
