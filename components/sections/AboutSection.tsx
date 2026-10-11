/**
 * AboutSection: Biography, World Memory Championship recognition, and core technical focus areas.
 */
'use client';

import { motion } from 'framer-motion';
import { Trophy, Brain, Code2, TrendingUp, Award, MapPin, type LucideIcon } from 'lucide-react';
import { profile } from '@/data/profile';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { GlassCard as GlassCardVariant } from '@/components/glass/GlassVariants';

const SPRING = { type: 'spring', stiffness: 280, damping: 28 } as const;

const ICON_MAP: Record<string, LucideIcon> = {
  Code2,
  TrendingUp,
  Brain,
  Trophy,
};

const FOCUS_COLORS = [
  { tint: 'cyan', icon: Code2, accent: '#0ea5e9' },
  { tint: 'amber', icon: TrendingUp, accent: '#f59e0b' },
  { tint: 'cyan', icon: Brain, accent: '#0284c7' },
  { tint: 'amber', icon: Trophy, accent: '#d97706' },
] as const;

export function AboutSection() {
  return (
    <section
      id="about"
      className="py-24 px-4 md:px-8 max-w-7xl mx-auto w-full scroll-mt-24"
      aria-label="About Pradyumna"
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={SPRING}
        className="mb-14"
      >
        <span className="section-label">
          <span aria-hidden="true">#</span>
          About
        </span>
        <h2 className="section-title text-[var(--text-primary)] mt-1">
          Background and Engineering Focus
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Bio column */}
        <motion.div
          className="lg:col-span-7 flex flex-col gap-5"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={SPRING}
        >
          {/* WMC Bronze Medal card */}
          <LiquidGlass
            elevation={3}
            tint="amber"
            radius={20}
            className="p-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-[var(--radius-sm)] bg-[var(--accent-amber-subtle)] border border-[var(--accent-amber-border)] flex items-center justify-center">
                <Trophy size={22} className="text-[var(--accent-amber)]" aria-hidden="true" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold tracking-wider uppercase font-mono text-[var(--accent-amber)]">
                    World Memory Championship: 2023
                  </span>
                  <Award size={14} className="text-[var(--accent-amber)]" aria-hidden="true" />
                </div>
                <p className="text-[var(--text-primary)] font-semibold text-base leading-snug">
                  Bronze Medalist: Applying systematic spatial loci, speed recall, and pattern recognition directly to system architecture, debugging, and data modeling.
                </p>
              </div>
            </div>
          </LiquidGlass>

          {/* Bio paragraphs */}
          <GlassCardVariant radius={20} className="p-7">
            <div className="space-y-4 text-[var(--text-secondary)] text-sm md:text-base leading-relaxed">
              {profile.fullBio.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {/* Education and status */}
            <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] flex flex-wrap gap-4 text-xs md:text-sm text-[var(--text-muted)] font-mono">
              <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                <Brain size={14} className="text-[var(--accent-primary)]" aria-hidden="true" />
                <span>{profile.education.degree} ({profile.education.year})</span>
              </span>
              <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                <MapPin size={14} className="text-[var(--accent-primary)]" aria-hidden="true" />
                <span>{profile.education.institution}, {profile.education.location}</span>
              </span>
            </div>
          </GlassCardVariant>
        </motion.div>

        {/* Focus areas column */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {profile.focusAreas.map((area, index) => {
            const cfg = FOCUS_COLORS[index % FOCUS_COLORS.length];
            const Icon = ICON_MAP[area.icon] || Code2;

            return (
              <motion.div
                key={area.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ ...SPRING, delay: index * 0.06 }}
              >
                <LiquidGlass
                  elevation={2}
                  tint={cfg.tint as 'cyan' | 'amber'}
                  radius={20}
                  className="p-5 h-full flex flex-col gap-3"
                >
                  <div
                    className="w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center"
                    style={{
                      background: `${cfg.accent}15`,
                      border: `1px solid ${cfg.accent}30`,
                    }}
                  >
                    <Icon
                      size={20}
                      style={{ color: cfg.accent }}
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-1">
                      {area.label}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {area.description}
                    </p>
                  </div>
                </LiquidGlass>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
