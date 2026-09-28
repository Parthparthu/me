/**
 * HeroSection — Cinematic hero with content overlaying the 3D canvas.
 *
 * The 3D sculpture (HeroRoom) is rendered by SceneCanvas behind this DOM layer.
 * This component provides the typography, status badge, CTAs, and scroll indicator.
 *
 * Entrance: elements assemble from blur+scale(0.9) after preloader completes.
 * Scroll: opacity fades out as user scrolls into Work section.
 */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, ArrowRight, Sparkles } from 'lucide-react';
import { profile } from '@/data/profile';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { GlassButton } from '@/components/glass/GlassVariants';
import { useSceneStore } from '@/store/useSceneStore';
import { cn } from '@/lib/utils';

const ROLES = [
  'Software Developer',
  'AI/ML Engineer',
  'Full-Stack Architect',
  'Product Builder',
];

const TECH_BADGES = ['React', 'TypeScript', 'Python', 'Next.js', 'Three.js', 'FastAPI'];

// Spring config for entrance animations
const SPRING = { type: 'spring', stiffness: 280, damping: 28 } as const;

// Staggered entrance container
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)', scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    scale: 1,
    transition: SPRING,
  },
};

function RoleCycler({ active }: { active: boolean }) {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="h-10 md:h-12 overflow-hidden flex items-center justify-center relative">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={roleIndex}
          initial={{ y: 16, opacity: 0, filter: 'blur(6px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -16, opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="text-xl md:text-2xl font-sans text-[var(--text-secondary)] font-light inline-block"
        >
          {ROLES[roleIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const preloaderDone = useSceneStore((s) => s.preloaderDone);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden scroll-margin-top-20"
      aria-label="Hero section"
    >
      {/* Aurora background gradient — behind the canvas, animating color shifts */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <motion.div
          animate={{
            background: [
              'radial-gradient(ellipse 80% 70% at 20% 50%, rgba(99,102,241,0.18) 0%, transparent 65%)',
              'radial-gradient(ellipse 80% 70% at 80% 50%, rgba(56,189,248,0.15) 0%, transparent 65%)',
              'radial-gradient(ellipse 80% 70% at 50% 30%, rgba(129,140,248,0.16) 0%, transparent 65%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute inset-0"
        />
      </div>

      {/* Main content layer — floats over the 3D canvas */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto w-full pt-24 pb-16"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={preloaderDone ? 'visible' : 'hidden'}
          className="flex flex-col items-center gap-6"
        >
          {/* Status badge */}
          <motion.div variants={itemVariants}>
            <LiquidGlass
              elevation={2}
              tint="neutral"
              radius={999}
              dynamicLight
              className="inline-flex items-center gap-2.5 px-5 py-2"
            >
              <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-emerald)] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--accent-emerald)]" />
              </span>
              <span className="text-sm font-medium text-[var(--text-secondary)]">
                Open to&nbsp;Internships
              </span>
            </LiquidGlass>
          </motion.div>

          {/* Name */}
          <motion.h1
            variants={itemVariants}
            className={cn(
              'font-display font-bold tracking-tighter text-white',
              'text-[clamp(3.5rem,10vw,8rem)] leading-none',
            )}
          >
            {/* Split into spans for per-letter shimmer possibility */}
            <span className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, #ffffff 20%, #c7d2fe 55%, #818cf8 80%, #38bdf8 100%)',
                backgroundSize: '200% auto',
                animation: 'gradient-x 5s linear infinite',
              }}
            >
              Pradyumna
            </span>
          </motion.h1>

          {/* Role cycler */}
          <motion.div variants={itemVariants}>
            <RoleCycler active={preloaderDone} />
          </motion.div>

          {/* Tagline */}
          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg text-[var(--text-tertiary)] max-w-xl mx-auto leading-relaxed"
          >
            {profile.tagline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3 items-center justify-center mt-2"
          >
            <GlassButton
              elevation={3}
              tint="violet"
              variant="primary"
              className="text-white"
              onClick={() => {
                document
                  .getElementById('selected-work')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Sparkles size={16} />
              View Projects
              <ArrowRight size={16} />
            </GlassButton>

            <Link href="/#contact">
              <GlassButton elevation={2} tint="neutral" variant="secondary">
                Get in Touch
              </GlassButton>
            </Link>
          </motion.div>

          {/* Floating tech badges */}
          <motion.div
            variants={itemVariants}
            className="hidden md:flex flex-wrap justify-center gap-2 mt-4"
            aria-label="Technologies"
          >
            {TECH_BADGES.map((badge, i) => (
              <motion.div
                key={badge}
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 2.5 + i * 0.3,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                  delay: i * 0.15,
                }}
              >
                <LiquidGlass
                  elevation={1}
                  tint="neutral"
                  radius={999}
                  dynamicLight={false}
                  className="px-3 py-1.5"
                >
                  <span className="text-xs font-medium text-[var(--text-secondary)]">
                    {badge}
                  </span>
                </LiquidGlass>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: preloaderDone ? 1 : 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--text-muted)] z-10"
        aria-hidden="true"
      >
        <span className="text-[10px] tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
}
