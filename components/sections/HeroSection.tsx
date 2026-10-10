/**
 * HeroSection: Clear, direct introduction with restrained liquid-glass elements.
 * States plainly who I am, what I do, and what I am looking for.
 */
'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { GlassButton } from '@/components/glass/GlassVariants';
import { cn } from '@/lib/utils';

const TECH_BADGES = ['React', 'TypeScript', 'Python', 'Next.js', 'Three.js', 'FastAPI', 'PostgreSQL'];

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-28 pb-16"
      aria-label="Hero introduction"
    >
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto w-full"
      >
        <div className="flex flex-col items-center gap-6">
          {/* Status badge: 8px radius */}
          <LiquidGlass
            elevation={2}
            tint="neutral"
            radius={8}
            dynamicLight={false}
            className="border border-emerald-500/20 bg-emerald-500/5 p-0"
          >
            <div className="relative z-10 inline-flex items-center gap-2.5 px-3.5 py-1.5">
              <span className="relative flex h-2 w-2 shrink-0 items-center justify-center" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-medium leading-none text-emerald-400">
                Open to Internships: Greater Noida, Noida, Delhi NCR &amp; Remote
              </span>
            </div>
          </LiquidGlass>

          {/* Name: Crisp high-contrast display */}
          <h1
            className={cn(
              'font-display font-bold tracking-tight text-white',
              'text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none'
            )}
          >
            Pradyuma
          </h1>

          {/* Role and Identity */}
          <p className="text-lg md:text-xl font-medium text-[var(--accent-primary)] font-mono">
            B.Tech CSE (AI/ML) &middot; Software &amp; Web Developer
          </p>

          {/* Concrete Hero Copy */}
          <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            First-year Computer Science and Engineering (AI/ML) student at GL Bajaj ITM, Greater Noida (graduating 2030), programming since 2019. Building practical web applications, data tools, and progressive web apps.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mt-2">
            <GlassButton
              elevation={2}
              tint="cyan"
              variant="primary"
              className="group"
              onClick={() => {
                document
                  .getElementById('selected-work')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>View Projects</span>
              <ArrowRight
                size={15}
                className="shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </GlassButton>

            <Link href="/#contact">
              <GlassButton elevation={2} tint="neutral" variant="secondary">
                Get in Touch
              </GlassButton>
            </Link>
          </div>

          {/* Tech badges: 6px radius, static for battery and clarity */}
          <div
            className="hidden md:flex flex-wrap justify-center gap-2 mt-6"
            aria-label="Core technologies"
          >
            {TECH_BADGES.map((badge) => (
              <LiquidGlass
                key={badge}
                elevation={1}
                tint="neutral"
                radius={6}
                dynamicLight={false}
                className="px-2.5 py-1"
              >
                <span className="text-xs font-mono text-[var(--text-secondary)]">
                  {badge}
                </span>
              </LiquidGlass>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-[var(--text-muted)] z-10"
        aria-hidden="true"
      >
        <span className="text-[10px] tracking-widest uppercase font-mono">Scroll</span>
        <ChevronDown size={14} />
      </div>
    </section>
  );
}
