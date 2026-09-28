'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, Sparkles, Brain } from 'lucide-react';

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export function EasterEgg() {
  const [inputIndex, setInputIndex] = useState(0);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const expectedKey = KONAMI_CODE[inputIndex];
      if (e.key === expectedKey || e.key.toLowerCase() === expectedKey) {
        const nextIndex = inputIndex + 1;
        if (nextIndex === KONAMI_CODE.length) {
          setActivated(true);
          setInputIndex(0);
        } else {
          setInputIndex(nextIndex);
        }
      } else {
        setInputIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputIndex]);

  return (
    <AnimatePresence>
      {activated && (
        <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivated(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-specular)] shadow-2xl z-10 text-center overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-[var(--brand-cobalt)]/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[var(--brand-cyan)]/30 rounded-full blur-3xl pointer-events-none" />

            <button
              onClick={() => setActivated(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div className="inline-flex p-4 rounded-2xl bg-[var(--accent-primary-subtle)] border border-[var(--accent-primary-border)] text-[var(--accent-primary)] mb-6 shadow-[var(--shadow-glow)]">
              <Trophy size={40} />
            </div>

            <div className="flex items-center justify-center gap-2 mb-2 text-xs font-mono uppercase tracking-widest text-[var(--accent-cyan)] font-bold">
              <Brain size={14} />
              Memory Palace Protocol
            </div>

            <h3 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-3">
              World Memory Championship Bronze Mode
            </h3>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
              You found the secret cognitive Easter egg! In 2021, Pradyumna competed at the World Memory Championship and secured a Bronze Medal — applying systematic spatial loci, speed recall, and pattern recognition to engineering challenges.
            </p>

            <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--brand-cyan)] text-left mb-6 space-y-1">
              <div>&gt; Mnemonic loci: ACTIVE</div>
              <div>&gt; Spatial mapping: 100%</div>
              <div>&gt; Pattern recall latency: &lt;12ms</div>
              <div>&gt; Cognitive engineering unlocked.</div>
            </div>

            <button
              onClick={() => setActivated(false)}
              className="btn btn-primary w-full"
            >
              <Sparkles size={16} />
              Return to Matrix
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
