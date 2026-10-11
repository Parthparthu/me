/**
 * JourneySection: Chronological engineering path with liquid glass milestone cards.
 * Traces the evolution of skills, competitive achievements, and production builds.
 */
'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Calendar, ChevronRight } from 'lucide-react';
import { milestones, type Milestone } from '@/data/journey';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { cn } from '@/lib/utils';

const BADGE_TINTS: Record<string, 'cyan' | 'amber' | 'emerald' | 'neutral'> = {
  emerald: 'emerald',
  accent: 'cyan',
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
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={SPRING}
        className="mb-16"
      >
        <span className="section-label">
          <span aria-hidden="true">#</span>
          Journey
        </span>
        <h2 className="section-title text-[var(--text-primary)] mt-1">
          The Path So Far
        </h2>
        <p className="section-subtitle mt-2">
          Milestones shaping my engineering discipline, problem-solving mindset, and systems work.
        </p>
      </motion.div>

      <div ref={containerRef} className="relative">
        {/* Timeline spine */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-[var(--border-subtle)] -translate-x-1/2">
          <motion.div
            className="absolute top-0 w-full bg-[var(--accent-primary)] origin-top"
            style={{ scaleY, height: '100%' }}
          />
        </div>

        <div className="space-y-12 md:space-y-16">
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
                {/* Timeline node */}
                <div
                  className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full -translate-x-1/2 mt-3.5 z-10 border border-[var(--border-strong)] bg-[var(--accent-primary)]"
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
                    initial={{ opacity: 0, x: isEven ? 16 : -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={SPRING}
                    className="flex items-center gap-2"
                  >
                    <Calendar size={15} className="text-[var(--text-muted)]" aria-hidden="true" />
                    <span className="text-lg font-bold font-mono tracking-tight text-[var(--text-primary)]">
                      {milestone.year}
                    </span>
                  </motion.div>
                </div>

                {/* Milestone Glass Card */}
                <div className={cn('w-full md:w-1/2', isEven ? 'md:pl-12' : 'md:pr-12')}>
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ ...SPRING, delay: 0.05 }}
                  >
                    <LiquidGlass
                      elevation={3}
                      tint={tint}
                      radius={14}
                      className="p-6 md:p-7 relative group"
                    >
                      {/* Top info row */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 font-mono">
                        {milestone.badge && (
                          <span
                            className="px-2.5 py-0.5 text-xs font-semibold rounded-sm border"
                            style={{
                              backgroundColor: tint === 'amber' ? 'var(--accent-amber-subtle)' : 'var(--accent-primary-subtle)',
                              borderColor: tint === 'amber' ? 'var(--accent-amber-border)' : 'var(--accent-primary-border)',
                              color: tint === 'amber' ? 'var(--accent-amber)' : 'var(--accent-primary)',
                            }}
                          >
                            {milestone.badge.label}
                          </span>
                        )}
                        <span className="md:hidden text-xs text-[var(--text-muted)] flex items-center gap-1">
                          <Calendar size={12} aria-hidden="true" />
                          <span>{milestone.year}</span>
                        </span>
                      </div>

                      {/* Title and Subtitle */}
                      <h3 className="text-xl font-display font-bold text-[var(--label-primary)] mb-1 leading-snug">
                        {milestone.title}
                      </h3>
                      <p className="text-sm font-medium text-[var(--accent)] mb-3">
                        {milestone.subtitle}
                      </p>

                      {/* Description */}
                      <p className="text-sm text-[var(--label-secondary)] leading-relaxed mb-4">
                        {milestone.description}
                      </p>

                      {/* Highlights */}
                      {milestone.highlights && milestone.highlights.length > 0 && (
                        <div className="pt-3 border-t border-[var(--separator)] space-y-2">
                          {milestone.highlights.map((highlight: string, i: number) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-[var(--label-secondary)] leading-relaxed">
                              <ChevronRight size={14} className="text-[var(--accent)] mt-0.5 flex-shrink-0" aria-hidden="true" />
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
