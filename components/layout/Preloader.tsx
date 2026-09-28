/**
 * Preloader — Branded "Loading → Enter" experience.
 * Shows a glass panel with animated logo text, progress bar, and
 * an "Enter" button that dissolves into the hero on click.
 *
 * Skippable via keyboard (Enter/Space) after minimum 600ms.
 * Marks preloaderDone in Zustand so sections can animate in.
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { useSceneStore } from '@/store/useSceneStore';

export function Preloader() {
  const [phase, setPhase] = useState<'loading' | 'enter' | 'done'>('loading');
  const [progress, setProgress] = useState(0);
  const setPreloaderDone = useSceneStore((s) => s.setPreloaderDone);

  // Simulate loading progress
  useEffect(() => {
    if (phase !== 'loading') return;

    const duration = 1400; // ms
    const interval = 30;
    const steps = duration / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      // Ease-out progress curve
      const p = 1 - Math.pow(1 - step / steps, 3);
      setProgress(Math.min(p * 100, 100));

      if (step >= steps) {
        clearInterval(timer);
        setPhase('enter');
      }
    }, interval);

    return () => clearInterval(timer);
  }, [phase]);

  const handleEnter = useCallback(() => {
    setPhase('done');
    setTimeout(() => setPreloaderDone(true), 700);
  }, [setPreloaderDone]);

  // Keyboard: Enter or Space to proceed when "enter" phase
  useEffect(() => {
    if (phase !== 'enter') return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleEnter();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase, handleEnter]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[var(--z-cursor)] flex items-center justify-center"
          style={{ background: '#05060a' }}
          aria-live="polite"
          aria-label="Loading portfolio"
        >
          {/* Aurora background */}
          <div
            aria-hidden="true"
            className="absolute inset-0 overflow-hidden pointer-events-none"
          >
            <motion.div
              animate={{
                background: [
                  'radial-gradient(ellipse at 30% 60%, rgba(99,102,241,0.25) 0%, transparent 60%)',
                  'radial-gradient(ellipse at 70% 40%, rgba(56,189,248,0.2) 0%, transparent 60%)',
                  'radial-gradient(ellipse at 50% 50%, rgba(129,140,248,0.22) 0%, transparent 60%)',
                ],
              }}
              transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
              className="absolute inset-0"
            />
          </div>

          {/* Glass card */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <LiquidGlass
              elevation={4}
              tint="violet"
              radius={28}
              className="w-[340px] px-10 py-12 flex flex-col items-center text-center"
            >
              {/* Monogram */}
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className="w-14 h-14 rounded-full border border-[var(--border-specular)] flex items-center justify-center mb-6 text-2xl font-display font-bold text-white"
                style={{
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(56,189,248,0.2))',
                }}
                aria-hidden="true"
              >
                P
              </motion.div>

              <h1 className="text-lg font-display font-bold text-white mb-1 tracking-tight">
                Pradyumna
              </h1>
              <p className="text-xs text-[var(--text-tertiary)] tracking-widest uppercase mb-8">
                {phase === 'loading' ? 'Loading…' : 'Ready'}
              </p>

              {/* Progress bar */}
              <div className="w-full h-[2px] rounded-full bg-white/10 mb-8 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #6366f1, #38bdf8)',
                    width: `${progress}%`,
                  }}
                  transition={{ duration: 0.03 }}
                />
              </div>

              {/* Enter button */}
              <AnimatePresence>
                {phase === 'enter' && (
                  <motion.button
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    onClick={handleEnter}
                    className="btn btn-primary w-full rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
                  >
                    Enter Site
                  </motion.button>
                )}
              </AnimatePresence>
            </LiquidGlass>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
