/**
 * JourneySection — Scroll-linked 3D timeline with liquid glass milestone cards.
 * Traces Pradyumna's path from 2020 First Principles to WMC Bronze, B.Tech, and Flagship Architecture.
 */
'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Sparkles, Calendar } from 'lucide-react';
import { milestones, type Milestone } from '@/data/journey';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { cn } from '@/lib/utils';

const BADGE_TINTS: Record<string, 'cyan' | 'amber' | 'violet' | 'neutral'> = {
  emerald: 'cyan',
  accent: 'violet',
  amber: 'amber',
  default: 'neutral',
};

const SPRING = { type: 'spring', stiffness: 280, damping: 28 } as const;

export function JourneySection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <section
      id="journey"
      className="py-28 px-4 md:px-8 max-w-6xl mx-auto w-full relative scroll-mt-24"
      aria-label="Engineering Journey"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={SPRING}
        className="mb-16"
      >
        <span className="section-label">
          <span aria-hidden="true">◈</span>
          Journey
        </span>
        <h2 className="section-title text-white mt-1">
          The Path So Far
        </h2>
        <p className="section-subtitle mt-2">
          Milestones shaping my engineering discipline, problem-solving mindset, and flagship builds.
        </p>
      </motion.div>

      <div ref={containerRef} className="relative">
        {/* Glowing laser spine */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2">
          <motion.div
            className="absolute top-0 w-full bg-gradient-to-b from-[var(--brand-cobalt)] via-[var(--brand-cyan)] to-[var(--brand-violet)] origin-top shadow-[0_0_16px_rgba(99,102,241,0.6)]"
            style={{ scaleY, height: '100%' }}
          />
        </div>

        <div className="space-y-12 md:space-y-20">
          {milestones.map((milestone: Milestone, index: number) => {
            const isEven = index % 2 === 0;
            const variantKey = milestone.badge?.variant || 'default';
            const tint = BADGE_TINTS[variantKey] || 'neutral';

            return (
              <div
                key={milestone.id}
                className={cn(
                  'relative flex flex-col md:flex-row items-start pl-12 md:pl-0',
                  isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                )}
              >
                {/* Timeline node orb */}
                <div
                  className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full -translate-x-1/2 mt-3 z-10"
                  style={{
                    backgroundColor: variantKey === 'amber' ? '#f59e0b' : 'var(--accent-primary)',
                    boxShadow: variantKey === 'amber'
                      ? '0 0 12px rgba(245,158,11,0.8), inset 0 1px 2px rgba(255,255,255,0.8)'
                      : '0 0 12px rgba(99,102,241,0.8), inset 0 1px 2px rgba(255,255,255,0.8)',
                    border: '2px solid rgba(255,255,255,0.4)',
                  }}
                  aria-hidden="true"
                />

                {/* Year Label (Desktop) */}
                <div
                  className={cn(
                    'hidden md:flex w-1/2 items-center',
                    isEven ? 'pr-12 justify-end text-right' : 'pl-12 justify-start text-left'
                  )}
                >
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 20 : -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={SPRING}
                    className="flex items-center gap-2"
                  >
                    <Calendar size={15} className="text-[var(--text-muted)]" />
                    <span className="text-xl font-bold font-mono tracking-tight text-white/80">
                      {milestone.year}
                    </span>
                  </motion.div>
                </div>

                {/* Milestone Glass Card */}
                <div className={cn('w-full md:w-1/2', isEven ? 'md:pl-12' : 'md:pr-12')}>
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ ...SPRING, delay: 0.05 }}
                    whileHover={{ y: -4, transition: SPRING }}
                  >
                    <LiquidGlass
                      elevation={3}
                      tint={tint}
                      radius={22}
                      dynamicLight
                      className="p-6 md:p-7 relative group"
                    >
                      {/* Top info row */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                        {milestone.badge && (
                          <span
                            className="px-3 py-0.5 text-xs font-semibold rounded-full border"
                            style={{
                              backgroundColor: tint === 'amber' ? 'rgba(245,158,11,0.15)' : 'rgba(99,102,241,0.15)',
                              borderColor: tint === 'amber' ? 'rgba(245,158,11,0.35)' : 'rgba(99,102,241,0.35)',
                              color: tint === 'amber' ? '#fbbf24' : '#a5b4fc',
                            }}
                          >
                            {milestone.badge.label}
                          </span>
                        )}
                        <span className="md:hidden text-xs font-mono text-[var(--text-muted)] flex items-center gap-1">
                          <Calendar size={12} />
                          {milestone.year}
                        </span>
                      </div>

                      {/* Title & Subtitle */}
                      <h3 className="text-xl font-display font-bold text-white mb-1 leading-snug">
                        {milestone.title}
                      </h3>
                      <p className="text-sm font-medium text-[var(--accent-cyan)] mb-3">
                        {milestone.subtitle}
                      </p>

                      {/* Description */}
                      <p className="text-sm text-[var(--text-tertiary)] leading-relaxed mb-4">
                        {milestone.description}
                      </p>

                      {/* Highlights */}
                      {milestone.highlights && milestone.highlights.length > 0 && (
                        <div className="pt-3 border-t border-white/8 space-y-2">
                          {milestone.highlights.map((highlight: string, i: number) => (
                            <div key={i} className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)] leading-relaxed">
                              <Sparkles size={13} className="text-[var(--accent-primary)] mt-0.5 flex-shrink-0" />
                              <span>{highlight}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </LiquidGlass>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
