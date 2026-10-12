'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { PARALLAX_CONFIG } from '@/lib/parallax-config';

interface ContactSettlingProps {
  children: React.ReactNode;
  side: 'left' | 'right';
  className?: string;
}

/**
 * ContactSettling
 * Elements gently converge into their resting alignment as the user scrolls
 * into the contact section at the bottom of the page.
 */
export function ContactSettling({
  children,
  side,
  className = '',
}: ContactSettlingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  });

  const dist = shouldReduceMotion ? 0 : PARALLAX_CONFIG.contact.convergeDistance;
  const initialX = side === 'left' ? -dist : dist;
  const initialY = dist * 0.75;

  const x = useTransform(scrollYProgress, [0, 1], [initialX, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [initialY, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.4, 1], [0.6, 0.9, 1]);

  return (
    <motion.div
      ref={ref}
      style={{
        x,
        y,
        opacity,
        willChange: shouldReduceMotion ? 'auto' : 'transform',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
