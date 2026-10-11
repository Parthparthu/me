'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSceneStore } from '@/store/useSceneStore';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { PRELOADER_CONFIG } from '@/lib/config';

export function Preloader() {
  const [phase, setPhase] = useState<'loading' | 'enter' | 'done'>('loading');
  const [progress, setProgress] = useState(0);
  const [shouldRender, setShouldRender] = useState(false);
  const setPreloaderDone = useSceneStore((s) => s.setPreloaderDone);

  useEffect(() => {
    try {
      const seen = sessionStorage.getItem(PRELOADER_CONFIG.sessionKey);
      if (seen || !PRELOADER_CONFIG.enabled) {
        setPhase('done');
        setPreloaderDone(true);
        return;
      }
    } catch {
      // sessionStorage unavailable
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
    try { sessionStorage.setItem(PRELOADER_CONFIG.sessionKey, '1'); } catch {}
    setPhase('done');
    setTimeout(() => {
      setPreloaderDone(true);
      setShouldRender(false);
    }, 600);
  }, [setPreloaderDone]);

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
          className="fixed inset-0 z-[var(--z-toast)] flex items-center justify-center"
          style={{ backgroundColor: 'var(--bg-primary)' }}
          aria-live="polite"
          aria-label="Loading portfolio"
        >
          {/* Subtle ambient background */}
          <div
            aria-hidden="true"
            className="absolute inset-0 overflow-hidden pointer-events-none"
          >
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl"
              style={{
                background: 'radial-gradient(circle, var(--accent-subtle) 0%, transparent 70%)',
              }}
            />
          </div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 px-4 w-full max-w-sm"
          >
            <LiquidGlass
              elevation={4}
              tint="neutral"
              radius={28}
              dynamicLight={false}
              className="w-full px-8 py-10 flex flex-col items-center text-center border border-[var(--separator-strong)]"
            >
              {/* Monogram */}
              <div
                style={{
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--accent-subtle)',
                  border: '1px solid var(--accent-border)',
                }}
                className="w-14 h-14 flex items-center justify-center mb-5 text-2xl font-display font-bold text-[var(--label-primary)]"
                aria-hidden="true"
              >
                P<span style={{ color: 'var(--accent)' }}>.</span>
              </div>

              <div
                role="heading"
                aria-level={2}
                className="text-xl font-display font-bold text-[var(--label-primary)] mb-1"
                style={{ letterSpacing: '-0.025em' }}
              >
                Pradyuma
              </div>
              <p className="text-xs text-[var(--label-tertiary)] font-mono tracking-wider uppercase mb-6">
                {phase === 'loading' ? 'Loading Experience\u2026' : 'Ready'}
              </p>

              {/* Progress bar */}
              <div
                style={{
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'var(--bg-hover)',
                }}
                className="w-full h-1.5 mb-6 overflow-hidden"
              >
                <motion.div
                  className="h-full scroll-progress-bar"
                  style={{
                    borderRadius: 'var(--radius-xs)',
                    width: `${progress}%`,
                  }}
                  transition={{ duration: 0.03 }}
                />
              </div>

              {/* Enter / skip */}
              <div className="w-full min-h-[44px] flex items-center justify-center">
                {phase === 'enter' ? (
                  <motion.button
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={handleEnter}
                    style={{
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--accent)',
                      border: '1px solid var(--accent)',
                      color: '#ffffff',
                    }}
                    className="w-full min-h-[44px] py-2.5 px-4 font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] flex items-center justify-center"
                  >
                    Enter Site
                  </motion.button>
                ) : (
                  <button
                    onClick={handleEnter}
                    className="text-[11px] font-mono text-[var(--label-tertiary)] hover:text-[var(--label-primary)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] p-2 min-h-[44px] flex items-center justify-center"
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
