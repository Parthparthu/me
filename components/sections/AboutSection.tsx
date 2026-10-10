'use client';

import { motion } from 'framer-motion';
import { Trophy, Brain, Code2, TrendingUp, Award, MapPin, type LucideIcon } from 'lucide-react';
import { profile } from '@/data/profile';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { GlassCard } from '@/components/glass/GlassVariants';

const ICON_MAP: Record<string, LucideIcon> = {
  Code2,
  TrendingUp,
  Brain,
  Trophy,
};

const FOCUS_COLORS = [
  { icon: Code2, accent: 'var(--accent-primary)' },
  { icon: TrendingUp, accent: '#f59e0b' },
  { icon: Brain, accent: 'var(--accent-primary)' },
  { icon: Trophy, accent: '#f59e0b' },
] as const;

export function AboutSection() {
  return (
    <section
      id="about"
      className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full scroll-mt-24"
      aria-label="About Pradyumna"
    >
      <div className="mb-14">
        <span className="section-label">About</span>
        <h2 className="section-title text-[var(--text-primary)] mt-1">
          Background and Engineering Philosophy
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Bio & Education */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* WMC Card */}
          <LiquidGlass
            elevation={3}
            tint="amber"
            radius={12}
            className="p-6 border border-amber-500/20"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                <Trophy size={20} className="text-amber-400" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold tracking-wider uppercase text-amber-400">
                    World Memory Championship · 2021
                  </span>
                  <Award size={13} className="text-amber-400" />
                </div>
                <p className="text-[var(--text-primary)] font-semibold text-sm leading-snug">
                  Bronze Medalist: applying structured spatial mapping, pattern recognition, and methodical debugging to complex systems architecture.
                </p>
              </div>
            </div>
          </LiquidGlass>

          {/* Bio Card */}
          <GlassCard className="p-6 sm:p-8" radius={12}>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              {profile.fullBio.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {/* Education Summary */}
            <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] flex flex-col gap-2 text-xs font-mono text-[var(--text-muted)]">
              <div className="flex items-center gap-2">
                <Brain size={14} className="text-[var(--accent-primary)] shrink-0" />
                <span>{profile.education.degree} in {profile.education.field}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[var(--accent-primary)] shrink-0" />
                <span>{profile.education.institution}, {profile.education.location} ({profile.education.period})</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right column: Focus Areas */}
        <div className="lg:col-span-5 grid grid-cols-1 gap-4">
          <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-1">
            Core Disciplines
          </p>
          {profile.focusAreas.map((area, index) => {
            const cfg = FOCUS_COLORS[index % FOCUS_COLORS.length];
            const Icon = ICON_MAP[area.icon] || Code2;

            return (
              <GlassCard
                key={area.label}
                radius={12}
                className="p-5 border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)]"
                  >
                    <Icon size={18} style={{ color: cfg.accent }} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                      {area.label}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {area.description}
                    </p>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
