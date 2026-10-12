'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from 'framer-motion';

/**
 * SectionSpine
 * Continuous vertical accent thread along the viewport edge that tracks overall
 * scroll progress with an animated path and glowing position node.
 */
export function SectionSpine() {
  const spineRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 32,
    restDelta: 0.001,
  });

  const progress = shouldReduceMotion ? scrollYProgress : smoothProgress;
  const dotTop = useTransform(progress, [0, 1], ['40px', 'calc(100vh - 40px)']);
  const pathHeight = useTransform(progress, [0, 1], ['0%', '100%']);

  return (
    <div
      ref={spineRef}
      aria-hidden="true"
      className="hidden xl:flex fixed left-7 top-0 bottom-0 z-20 pointer-events-none flex-col items-center justify-center w-6"
    >
      {/* Background Track Line */}
      <div className="absolute top-10 bottom-10 w-[1.5px] bg-[var(--separator)] rounded-full overflow-hidden">
        {/* Active Progress Fill */}
        <motion.div
          className="w-full bg-gradient-to-b from-[var(--accent)] via-[var(--accent-hover)] to-[var(--accent)] origin-top rounded-full"
          style={{ height: pathHeight }}
        />
      </div>

      {/* Glowing Tracker Dot */}
      <motion.div
        className="absolute w-3.5 h-3.5 rounded-full flex items-center justify-center"
        style={{
          top: dotTop,
          willChange: shouldReduceMotion ? 'auto' : 'transform',
        }}
      >
        <span className="absolute inset-0 rounded-full bg-[var(--accent)] opacity-40 animate-ping" />
        <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
      </motion.div>
    </div>
  );
}
