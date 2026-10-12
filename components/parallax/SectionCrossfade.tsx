'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollStore, type RoomId } from '@/store/useScrollStore';

// Ambient gradient maps per section (sky, cyan, and navy tones strictly: zero purple/magenta)
const AMBIENT_MAP: Record<RoomId, { x: string; y: string; color: string; scale: number }> = {
  hero: {
    x: '50%',
    y: '25%',
    color: 'radial-gradient(circle, rgba(34, 211, 238, 0.08) 0%, rgba(6, 11, 24, 0) 70%)',
    scale: 1.0,
  },
  work: {
    x: '70%',
    y: '45%',
    color: 'radial-gradient(circle, rgba(14, 165, 233, 0.07) 0%, rgba(6, 11, 24, 0) 70%)',
    scale: 1.15,
  },
  about: {
    x: '30%',
    y: '50%',
    color: 'radial-gradient(circle, rgba(56, 189, 248, 0.06) 0%, rgba(6, 11, 24, 0) 70%)',
    scale: 1.05,
  },
  skills: {
    x: '50%',
    y: '60%',
    color: 'radial-gradient(circle, rgba(34, 211, 238, 0.08) 0%, rgba(6, 11, 24, 0) 70%)',
    scale: 1.2,
  },
  journey: {
    x: '40%',
    y: '65%',
    color: 'radial-gradient(circle, rgba(14, 165, 233, 0.07) 0%, rgba(6, 11, 24, 0) 70%)',
    scale: 1.1,
  },
  contact: {
    x: '50%',
    y: '80%',
    color: 'radial-gradient(circle, rgba(34, 211, 238, 0.09) 0%, rgba(6, 11, 24, 0) 70%)',
    scale: 1.25,
  },
};

/**
 * SectionCrossfade
 * Smooth atmospheric background transitions as sections enter the viewport.
 */
export function SectionCrossfade() {
  const activeRoom = useScrollStore((s) => s.activeRoom);
  const current = AMBIENT_MAP[activeRoom] || AMBIENT_MAP.hero;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeRoom}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: current.scale }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full transition-all"
          style={{
            background: current.color,
            backgroundPosition: `${current.x} ${current.y}`,
          }}
        />
      </AnimatePresence>
    </div>
  );
}
