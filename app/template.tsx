'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Animated route transition template.
 * Smooth liquid-spring transition (450ms) between page routes.
 * Fully interruptible and never blocks browser navigation or back button.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <motion.div
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
      transition={{
        duration: reducedMotion ? 0.15 : 0.45,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="w-full flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
}
