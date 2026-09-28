/**
 * QualityToggle — User-facing GPU quality tier selector.
 * Floats in the bottom-right corner on desktop.
 * Shows current quality and allows override.
 */
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, ChevronDown } from 'lucide-react';
import { useSceneStore, type QualityTier } from '@/store/useSceneStore';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { cn } from '@/lib/utils';

const TIERS: { value: QualityTier; label: string; description: string }[] = [
  {
    value: 'high',
    label: 'High',
    description: 'Full 3D, post-processing, particles',
  },
  {
    value: 'medium',
    label: 'Medium',
    description: 'Simplified 3D, no post-processing',
  },
  { value: 'low', label: 'Low', description: 'CSS glass only, no WebGL' },
  { value: 'none', label: 'Off', description: 'Static, no animations' },
];

export function QualityToggle() {
  const { quality, setQuality, setQualityOverride } = useSceneStore();
  const [open, setOpen] = useState(false);

  const handleSelect = (tier: QualityTier) => {
    setQuality(tier);
    setQualityOverride(tier);
    setOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[var(--z-sticky)] hidden md:block">
      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={`Quality: ${quality}. Click to change.`}
          aria-expanded={open}
          aria-haspopup="listbox"
          className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)] rounded-full"
        >
          <LiquidGlass elevation={2} tint="neutral" radius={999} dynamicLight={false}>
            <div className="flex items-center gap-2 px-3 py-1.5">
              <Monitor size={12} className="text-[var(--text-muted)]" />
              <span className="text-[11px] font-mono text-[var(--text-muted)] capitalize">
                {quality}
              </span>
              <ChevronDown
                size={10}
                className={cn(
                  'text-[var(--text-muted)] transition-transform duration-200',
                  open && 'rotate-180'
                )}
              />
            </div>
          </LiquidGlass>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.96 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-full right-0 mb-2 w-52"
              role="listbox"
              aria-label="Quality tier options"
            >
              <LiquidGlass elevation={4} tint="neutral" radius={16}>
                <div className="py-1.5">
                  {TIERS.map((tier) => (
                    <button
                      key={tier.value}
                      role="option"
                      aria-selected={quality === tier.value}
                      onClick={() => handleSelect(tier.value)}
                      className={cn(
                        'w-full flex flex-col px-4 py-2.5 text-left transition-colors',
                        quality === tier.value
                          ? 'text-[var(--accent-primary)] bg-[var(--accent-primary-subtle)]'
                          : 'text-[var(--text-primary)] hover:bg-white/5'
                      )}
                    >
                      <span className="text-sm font-semibold">{tier.label}</span>
                      <span className="text-[11px] text-[var(--text-muted)] mt-0.5">
                        {tier.description}
                      </span>
                    </button>
                  ))}
                </div>
              </LiquidGlass>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
