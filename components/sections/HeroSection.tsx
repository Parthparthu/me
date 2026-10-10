'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import { profile } from '@/data/profile';
import { HeroGlassPrism } from '@/components/3d/HeroGlassPrism';

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative w-full min-h-[90vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
      aria-label="Hero introduction"
    >
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Plain-words introduction */}
        <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-secondary)]">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-sm bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-sm h-2 w-2 bg-emerald-500" />
            </span>
            <span>Open to Software Engineering Internships</span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-[var(--text-primary)] tracking-tight">
              {profile.name}
            </h1>
            <p className="text-sm sm:text-base font-mono text-[var(--accent-primary)] font-medium">
              {profile.title}
            </p>
          </div>

          {/* Plain, concrete summary */}
          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl">
            {profile.tagline}
          </p>

          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed max-w-xl">
            World Memory Championship Bronze Medalist (2021). Currently studying at GL Bajaj ITM (2023 to 2027) and designing software systems with an emphasis on offline resilience, transparent architecture, and measurable performance.
          </p>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/#selected-work"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[var(--accent-primary)] text-white text-sm font-semibold hover:bg-[var(--accent-primary-hover)] transition-colors min-h-[44px]"
            >
              <span>View Selected Work</span>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>

            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-medium)] text-[var(--text-primary)] text-sm font-semibold hover:bg-white/5 transition-colors min-h-[44px]"
            >
              <Mail size={15} aria-hidden="true" />
              <span>Contact Me</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Single Refined 3D Glass Object */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <HeroGlassPrism />
        </div>
      </div>
    </section>
  );
}
