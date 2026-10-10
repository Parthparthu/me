'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { useSceneStore } from '@/store/useSceneStore';
import { PRELOADER_CONFIG } from '@/lib/config';

export function Preloader() {
  const [phase, setPhase] = useState<'loading' | 'enter' | 'done'>('loading');
  const [progress, setProgress] = useState(0);
  const [shouldRender, setShouldRender] = useState(false);
  const setPreloaderDone = useSceneStore((s) => s.setPreloaderDone);

  useEffect(() => {
    // Check if user has already seen preloader in this session
    try {
      const seen = sessionStorage.getItem(PRELOADER_CONFIG.sessionKey);
      if (seen || !PRELOADER_CONFIG.enabled) {
        setPhase('done');
        setPreloaderDone(true);
        return;
      }
    } catch {
      // sessionStorage unavailable (e.g. private mode restrictions)
    }

    setShouldRender(true);
    setPreloaderDone(false);

    const duration = PRELOADER_CONFIG.maxDurationMs;
    const interval = 25;
    const steps = duration / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const p = 1 - Math.pow(1 - step / steps, 3);
      setProgress(Math.min(p * 100, 100));

      if (step >= steps) {
        clearInterval(timer);
        setPhase('enter');
      }
    }, interval);

    return () => clearInterval(timer);
  }, [setPreloaderDone]);

  const handleEnter = useCallback(() => {
    try {
      sessionStorage.setItem(PRELOADER_CONFIG.sessionKey, '1');
    } catch {}
    setPhase('done');
    setTimeout(() => {
      setPreloaderDone(true);
      setShouldRender(false);
    }, 600);
  }, [setPreloaderDone]);

  // Keyboard shortcut: Enter or Space to skip/enter
  useEffect(() => {
    if (!shouldRender || phase === 'done') return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleEnter();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [shouldRender, phase, handleEnter]);

  if (!shouldRender) return null;

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[var(--z-toast)] flex items-center justify-center bg-[var(--bg-app)]"
          aria-live="polite"
          aria-label="Loading portfolio"
        >
          {/* Subtle cyan ambient background glow */}
          <div
            aria-hidden="true"
            className="absolute inset-0 overflow-hidden pointer-events-none"
          >
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(14,165,233,0.3) 0%, rgba(2,132,199,0.15) 50%, transparent 70%)',
              }}
            />
          </div>

          {/* Liquid Glass Card */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 px-4 w-full max-w-sm"
          >
            <LiquidGlass
              elevation={4}
              tint="cyan"
              radius={16}
              className="w-full px-8 py-10 flex flex-col items-center text-center border border-[var(--border-subtle)] shadow-2xl"
            >
              {/* Monogram Badge */}
              <div
                className="w-14 h-14 rounded-xl border border-[var(--border-medium)] flex items-center justify-center mb-5 text-2xl font-display font-bold text-[var(--text-primary)] shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, rgba(14,165,233,0.25), rgba(2,132,199,0.15))',
                }}
                aria-hidden="true"
              >
                P<span className="text-[var(--accent-primary)]">.</span>
              </div>

              <div role="heading" aria-level={2} className="text-xl font-display font-bold text-[var(--text-primary)] mb-1 tracking-tight">
                Pradyuma
              </div>
              <p className="text-xs text-[var(--text-tertiary)] font-mono tracking-wider uppercase mb-6">
                {phase === 'loading' ? 'Loading Experience…' : 'Ready'}
              </p>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-sm bg-[var(--bg-surface-active)] mb-6 overflow-hidden">
                <motion.div
                  className="h-full rounded-sm"
                  style={{
                    background: 'linear-gradient(90deg, #0284c7, #38bdf8)',
                    width: `${progress}%`,
                  }}
                  transition={{ duration: 0.03 }}
                />
              </div>

              {/* Enter Button (rounded-xl, NOT a pill) */}
              <div className="w-full min-h-[44px] flex items-center justify-center">
                {phase === 'enter' ? (
                  <motion.button
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={handleEnter}
                    className="w-full min-h-[44px] py-2.5 px-4 rounded-xl font-semibold text-xs text-[var(--text-on-accent)] bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] transition-all shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)] flex items-center justify-center"
                  >
                    Enter Site
                  </motion.button>
                ) : (
                  <button
                    onClick={handleEnter}
                    className="text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)] p-2 min-h-[44px] flex items-center justify-center"
                  >
                    Press Space to Skip
                  </button>
                )}
              </div>
            </LiquidGlass>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
