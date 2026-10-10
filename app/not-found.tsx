/**
 * 404: Not Found page with liquid-glass styling.
 */
'use client';

import Link from 'next/link';
import { Home, Folder } from 'lucide-react';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { GlassButton } from '@/components/glass/GlassVariants';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      <div className="w-full max-w-lg">
        <LiquidGlass
          elevation={3}
          tint="neutral"
          radius={12}
          className="p-10 md:p-12 text-center flex flex-col items-center"
        >
          <div className="text-7xl md:text-8xl font-display font-bold text-white tracking-tighter mb-4 text-[var(--accent-cyan)]">
            404
          </div>

          <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
            Page Not Found
          </h1>

          <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed mb-8 max-w-sm">
            The requested page does not exist or has been moved to a different URL.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
            <Link href="/" className="w-full sm:w-auto">
              <GlassButton variant="primary" className="w-full">
                <Home size={16} />
                <span>Return Home</span>
              </GlassButton>
            </Link>

            <Link href="/projects" className="w-full sm:w-auto">
              <GlassButton variant="secondary" className="w-full">
                <Folder size={16} />
                <span>View Projects</span>
              </GlassButton>
            </Link>
          </div>
        </LiquidGlass>
      </div>
    </div>
  );
}
