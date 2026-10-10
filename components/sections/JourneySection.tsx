'use client';

import React from 'react';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { milestones, type Milestone } from '@/data/journey';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { cn } from '@/lib/utils';

export function JourneySection() {
  return (
    <section
      id="journey"
      className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full relative scroll-mt-24"
      aria-label="Engineering Journey"
    >
      <div className="mb-14">
        <span className="section-label">Journey</span>
        <h2 className="section-title text-[var(--text-primary)] mt-1">
          Chronology and Milestones
        </h2>
        <p className="section-subtitle mt-2">
          Key stages shaping technical problem-solving, cognitive training, and software architecture.
        </p>
      </div>

      <div className="relative">
        {/* Subtle timeline track */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-[var(--border-subtle)] -translate-x-1/2" aria-hidden="true" />

        <div className="space-y-12 md:space-y-16">
          {milestones.map((milestone: Milestone, index: number) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={milestone.id}
                className={cn(
                  'relative flex flex-col md:flex-row items-start pl-10 md:pl-0',
                  isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                )}
              >
                {/* Timeline node marker (Softly rounded 4px square) */}
                <div
                  className="absolute left-4 md:left-1/2 w-3 h-3 rounded-sm -translate-x-1/2 mt-4 z-10 bg-[var(--accent-primary)] border border-[var(--bg-app)]"
                  aria-hidden="true"
                />

                {/* Year display for desktop */}
                <div
                  className={cn(
                    'hidden md:flex w-1/2 items-center',
                    isEven ? 'pr-12 justify-end text-right' : 'pl-12 justify-start text-left'
                  )}
                >
                  <div className="flex items-center gap-2 font-mono text-sm text-[var(--text-muted)] font-bold">
                    <Calendar size={14} className="text-[var(--accent-primary)]" />
                    <span>{milestone.year}</span>
                  </div>
                </div>

                {/* Card Container */}
                <div className={cn('w-full md:w-1/2', isEven ? 'md:pl-12' : 'md:pr-12')}>
                  <LiquidGlass
                    elevation={2}
                    tint="neutral"
                    radius={12}
                    className="p-6 md:p-7 border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                      {milestone.badge && (
                        <span className="px-2.5 py-0.5 text-xs font-mono font-medium rounded-md bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                          {milestone.badge.label}
                        </span>
                      )}
                      <span className="md:hidden text-xs font-mono text-[var(--text-muted)] flex items-center gap-1">
                        <Calendar size={12} />
                        {milestone.year}
                      </span>
                    </div>

                    <h3 className="text-lg font-display font-bold text-[var(--text-primary)] mb-1 leading-snug">
                      {milestone.title}
                    </h3>
                    <p className="text-xs font-mono text-[var(--accent-primary)] mb-3">
                      {milestone.subtitle}
                    </p>

                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                      {milestone.description}
                    </p>

                    {milestone.highlights && milestone.highlights.length > 0 && (
                      <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2">
                        {milestone.highlights.map((highlight: string, i: number) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-[var(--text-muted)] leading-relaxed">
                            <CheckCircle2 size={13} className="text-[var(--accent-primary)] mt-0.5 shrink-0" />
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </LiquidGlass>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
