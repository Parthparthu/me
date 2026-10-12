'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { PARALLAX_CONFIG } from '@/lib/parallax-config';

interface ParallaxLayerProps {
  children: React.ReactNode;
  rate?: number;
  direction?: 'up' | 'down';
  opacityRange?: [number, number];
  scaleRange?: [number, number];
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ParallaxLayer
 * Composite-only scroll transform driven by Framer Motion.
 * Guarantees zero layout shifts and strictly honors prefers-reduced-motion.
 */
export function ParallaxLayer({
  children,
  rate = 0.2,
  direction = 'up',
  opacityRange,
  scaleRange,
  className = '',
  style = {},
}: ParallaxLayerProps) {
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

  // Calculate distance based on rate and device scaling
  const effectiveRate = shouldReduceMotion
    ? 0
    : rate * (isMobile ? PARALLAX_CONFIG.mobileScale : 1.0);

  const travelDistance = 120 * effectiveRate;
  const yStart = direction === 'up' ? travelDistance : -travelDistance;
  const yEnd = direction === 'up' ? -travelDistance : travelDistance;

  const y = useTransform(scrollYProgress, [0, 1], [yStart, yEnd]);

  const targetOpacityRange = opacityRange ?? [1, 1];
  const transformedOpacity = useTransform(scrollYProgress, [0, 1], targetOpacityRange);
  const opacity = opacityRange ? transformedOpacity : undefined;

  const targetScaleRange = scaleRange ?? [1, 1];
  const transformedScale = useTransform(scrollYProgress, [0, 1], targetScaleRange);
  const scale = scaleRange ? transformedScale : undefined;

  return (
    <div ref={ref} className={`relative ${className}`} style={style}>
      <motion.div
        style={{
          y,
          opacity,
          scale,
          willChange: shouldReduceMotion ? 'auto' : 'transform',
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
