/**
 * 404: Page Not Found.
 */
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Folder } from 'lucide-react';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { GlassButton } from '@/components/glass/GlassVariants';

const SPRING = { type: 'spring', stiffness: 280, damping: 28 } as const;

export default function NotFound() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (!path.endsWith('/') && !path.includes('.')) {
        window.location.replace(`${path}/` + window.location.search + window.location.hash);
      }
    }
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={SPRING}
        className="w-full max-w-lg"
      >
        <LiquidGlass
          elevation={4}
          tint="neutral"
          radius={14}
          className="p-8 md:p-10 text-center flex flex-col items-center"
        >
          <div
            className="text-6xl md:text-7xl font-display font-bold text-[var(--text-primary)] tracking-tighter mb-4 font-mono"
          >
            404
          </div>

          <h1 className="text-xl md:text-2xl font-display font-bold text-[var(--text-primary)] mb-2">
            Page Not Found
          </h1>

          <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed mb-8 max-w-sm">
            The requested page does not exist or has been moved. Check the URL or navigate back to the main site.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
            <Link href="/" className="w-full sm:w-auto">
              <GlassButton variant="primary" className="w-full">
                <Home size={16} aria-hidden="true" />
                <span>Return Home</span>
              </GlassButton>
            </Link>

            <Link href="/projects" className="w-full sm:w-auto">
              <GlassButton variant="secondary" className="w-full">
                <Folder size={16} aria-hidden="true" />
                <span>Explore Projects</span>
              </GlassButton>
            </Link>
          </div>
        </LiquidGlass>
      </motion.div>
    </div>
  );
}
