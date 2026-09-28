/**
 * AboutSection — Bio, WMC achievement story, and focus areas with glass cards.
 * WMC Bronze medal is prominently featured as a key personality differentiator.
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
  { tint: 'cyan', icon: Code2, accent: '#38bdf8' },
  { tint: 'amber', icon: TrendingUp, accent: '#f59e0b' },
  { tint: 'violet', icon: Brain, accent: '#818cf8' },
  { tint: 'violet', icon: Trophy, accent: '#6366f1' },
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
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={SPRING}
        className="mb-14"
      >
        <span className="section-label">
          <span aria-hidden="true">◈</span>
          About
        </span>
        <h2 className="section-title text-white mt-1">
          Who I&nbsp;Am
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Bio column */}
        <motion.div
          className="lg:col-span-7 flex flex-col gap-5"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={SPRING}
        >
          {/* WMC Bronze Medal highlight card */}
          <LiquidGlass
            elevation={4}
            tint="amber"
            radius={20}
            dynamicLight
            className="p-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                <Trophy size={22} className="text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold tracking-widest uppercase text-amber-400">
                    World Memory Championship · 2021
                  </span>
                  <Award size={12} className="text-amber-400" />
                </div>
                <p className="text-white font-semibold text-base leading-snug">
                  Bronze Medalist — applying systematic spatial loci, speed recall, and pattern recognition to every engineering challenge.
                </p>
              </div>
            </div>
          </LiquidGlass>

          {/* Bio paragraphs */}
          <GlassCardVariant className="p-7">
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              {profile.fullBio.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {/* Education + location */}
            <div className="mt-6 pt-5 border-t border-white/8 flex flex-wrap gap-4 text-sm text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5">
                <Brain size={14} className="text-[var(--accent-primary)]" />
                {profile.education.degree}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-[var(--accent-cyan)]" />
                {profile.education.institution}, {profile.education.location}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                {profile.currentStatus}
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ ...SPRING, delay: index * 0.08 }}
              >
                <LiquidGlass
                  elevation={2}
                  tint={cfg.tint as 'cyan' | 'amber' | 'violet'}
                  radius={20}
                  dynamicLight
                  className="p-5 h-full flex flex-col gap-3"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: `${cfg.accent}18`,
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
                    <h4 className="font-semibold text-sm text-white mb-1">
                      {area.label}
                    </h4>
                    <p className="text-xs text-[var(--text-tertiary)] leading-relaxed">
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
