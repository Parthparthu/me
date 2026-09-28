/**
 * 404 — Not Found page with Liquid Glass styling and refractive card.
 */
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Folder } from 'lucide-react';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { GlassButton } from '@/components/glass/GlassVariants';

const SPRING = { type: 'spring', stiffness: 280, damping: 28 } as const;

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Background aurora */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(56,189,248,0.2) 50%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={SPRING}
        className="w-full max-w-lg"
      >
        <LiquidGlass
          elevation={4}
          tint="violet"
          radius={32}
          dynamicLight
          className="p-10 md:p-12 text-center flex flex-col items-center"
        >
          {/* Glass numeral */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.1 }}
            className="text-7xl md:text-8xl font-display font-bold text-white tracking-tighter mb-4"
            style={{
              textShadow: '0 0 40px rgba(99,102,241,0.5)',
            }}
          >
            404
          </motion.div>

          <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
            Coordinate Lost in Space
          </h1>

          <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed mb-8 max-w-sm">
            The page or asset you requested has either moved or exists in an alternate dimension.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
            <Link href="/" className="w-full sm:w-auto">
              <GlassButton variant="primary" className="w-full">
                <Home size={16} />
                <span>Return to Showroom</span>
              </GlassButton>
            </Link>

            <Link href="/projects" className="w-full sm:w-auto">
              <GlassButton variant="secondary" className="w-full">
                <Folder size={16} />
                <span>Explore Projects</span>
              </GlassButton>
            </Link>
          </div>
        </LiquidGlass>
      </motion.div>
    </div>
  );
}
