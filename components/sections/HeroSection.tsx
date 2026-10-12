/**
 * HeroSection: Clear, direct introduction with Apple-style restrained surfaces.
 * States plainly who I am, what I do, and what I am looking for.
 */
'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { GlassButton } from '@/components/glass/GlassVariants';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useScrollStore } from '@/store/useScrollStore';
import { PARALLAX_CONFIG } from '@/lib/parallax-config';
import { POINTER_REACTIVE_3D } from '@/lib/config';
import { cn } from '@/lib/utils';

const TECH_BADGES = ['React', 'TypeScript', 'Python', 'Next.js', 'Three.js', 'FastAPI', 'PostgreSQL'];

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Layer 1: Atmosphere / far radial glow (0.18x scroll rate)
  const bgRate = shouldReduceMotion ? 0 : PARALLAX_CONFIG.hero.layer1FarBg.rate;
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 160 * bgRate]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.8], [0.85, 0.15]);

  // Layer 2: Midground geometric contours & coordinate nodes (0.35x scroll rate)
  const midRate = shouldReduceMotion ? 0 : PARALLAX_CONFIG.hero.layer2MidField.rate;
  const midY = useTransform(scrollYProgress, [0, 1], [0, 180 * midRate]);
  const midOpacity = useTransform(scrollYProgress, [0, 0.7], [0.65, 0.1]);

  // Layer 4: Foreground typography, badges & actions (0.88x scroll rate with exit scale)
  const fgRate = shouldReduceMotion ? 0 : PARALLAX_CONFIG.hero.layer4Foreground.rate;
  const fgY = useTransform(scrollYProgress, [0, 1], [0, 90 * fgRate]);
  const fgOpacity = useTransform(scrollYProgress, [0, 0.75, 1], [1, 0.85, 0]);
  const fgScale = useTransform(
    scrollYProgress,
    [0, 0.85, 1],
    [1, 1, shouldReduceMotion ? 1 : (PARALLAX_CONFIG.hero.layer4Foreground.exitScaleMin || 0.96)]
  );

  const { scrollTo } = useSmoothScroll();

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-28 pb-16"
      aria-label="Hero introduction"
    >
      {/* Parallax Layer 1: Far Atmosphere Radial Glow (0.18x) */}
      <motion.div
        style={{
          y: bgY,
          opacity: bgOpacity,
          willChange: shouldReduceMotion ? 'auto' : 'transform',
        }}
        className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="w-[580px] h-[580px] rounded-full blur-[110px] opacity-40 dark:opacity-30 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.24) 0%, rgba(3, 105, 161, 0.10) 60%, transparent 80%)',
          }}
        />
      </motion.div>

      {/* Parallax Layer 2: Mid Field Geometric Contours & Coordinates (0.35x) */}
      <motion.div
        style={{
          y: midY,
          opacity: midOpacity,
          willChange: shouldReduceMotion ? 'auto' : 'transform',
        }}
        className="absolute inset-0 pointer-events-none z-0 flex items-center justify-between px-6 sm:px-12 max-w-6xl mx-auto"
        aria-hidden="true"
      >
        <div className="hidden lg:flex flex-col gap-1.5 font-mono text-[10px] text-[var(--label-quaternary)] tracking-widest opacity-60">
          <span>SYSTEM: ONLINE</span>
          <span>DISCIPLINE: MEMORY &amp; CODING</span>
        </div>
        {/* Subtle geometric wireframe accent */}
        <div className="hidden md:block w-32 h-32 border border-[var(--separator)] rounded-full opacity-20 -mr-16" />
        <div className="hidden lg:flex flex-col gap-1.5 font-mono text-[10px] text-[var(--label-quaternary)] tracking-widest opacity-60 text-right">
          <span>VIEWPORT: RESPONSIVE</span>
          <span>SPECIALIZATION: CSE (AI/ML)</span>
        </div>
      </motion.div>

      {/* Parallax Layer 4: Foreground Typography & Actions (0.88x with exit scale) */}
      <motion.div
        style={{
          y: fgY,
          opacity: fgOpacity,
          scale: fgScale,
          willChange: shouldReduceMotion ? 'auto' : 'transform',
        }}
        className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto w-full"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-6"
        >

          {/* Status badge: 8px radius with emerald liquid glass */}
          <LiquidGlass
            elevation={2}
            tint="emerald"
            radius={8}
            dynamicLight={POINTER_REACTIVE_3D}
            className="p-0 border border-[var(--success-border)]"
          >
            <div className="relative z-10 inline-flex items-center gap-2.5 px-3.5 py-1.5">
              <span className="relative flex h-2 w-2 shrink-0 items-center justify-center" aria-hidden="true">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: 'var(--success)' }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ backgroundColor: 'var(--success)' }}
                />
              </span>
              <span
                className="text-xs font-medium leading-none"
                style={{ color: 'var(--success)' }}
              >
                Open to Internships: Greater Noida, Noida, Delhi NCR &amp; Remote
              </span>
            </div>
          </LiquidGlass>

          {/* Name */}
          <h1
            className={cn(
              'font-display font-bold',
              'text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none'
            )}
            style={{
              color: 'var(--label-primary)',
              letterSpacing: '-0.04em',
              textWrap: 'balance',
            }}
          >
            Pradyumna
          </h1>

          {/* Role */}
          <p
            className="text-base md:text-lg font-medium font-mono"
            style={{ color: 'var(--accent)' }}
          >
            B.Tech CSE (AI/ML) &middot; Software &amp; Web Developer
          </p>

          {/* Bio */}
          <p
            className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--label-secondary)' }}
          >
            First-year Computer Science and Engineering (AI/ML) student at GL Bajaj ITM,
            Greater Noida (graduating 2030), programming since 2019. Building practical web
            applications, data tools, and progressive web apps.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mt-2">
            <GlassButton
              variant="primary"
              className="group"
              onClick={() => {
                useScrollStore.getState().lockActiveRoom('work', 3000);
                scrollTo('selected-work', {
                  offset: -80,
                  duration: 1.25,
                  onComplete: () => {
                    useScrollStore.getState().unlockActiveRoom();
                    window.history.pushState(null, '', '/#selected-work');
                  },
                });
              }}
            >
              <span>View Projects</span>
              <ArrowRight
                size={15}
                className="shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </GlassButton>

            <GlassButton
              variant="secondary"
              onClick={() => {
                useScrollStore.getState().lockActiveRoom('contact', 3000);
                scrollTo('contact', {
                  offset: -80,
                  duration: 1.25,
                  onComplete: () => {
                    useScrollStore.getState().unlockActiveRoom();
                    window.history.pushState(null, '', '/#contact');
                  },
                });
              }}
            >
              Get in Touch
            </GlassButton>
          </div>

          {/* Tech badges: 6px radius liquid glass */}
          <div
            className="hidden md:flex flex-wrap justify-center gap-2 mt-4"
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
                <span className="text-xs font-mono text-[var(--label-secondary)]">
                  {badge}
                </span>
              </LiquidGlass>
            ))}
          </div>

        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10"
        style={{ color: 'var(--label-quaternary)' }}
        aria-hidden="true"
      >
        <span className="text-[10px] tracking-widest uppercase font-mono">Scroll</span>
        <ChevronDown size={14} />
      </div>
    </section>
  );
}
