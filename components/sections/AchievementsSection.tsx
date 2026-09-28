/**
 * AchievementsSection — Milestones & Recognition.
 * Showcases the World Memory Championship Bronze Medal (2021) in an amber-tinted
 * elevation-4 glass card with mnemonic protocol tags and cognitive engineering highlights.
 */
'use client';

import { motion } from 'framer-motion';
import { Trophy, GraduationCap, Github, Medal, Star, Sparkles, Brain, type LucideIcon } from 'lucide-react';
import { achievements } from '@/data/achievements';
import { LiquidGlass } from '@/components/glass/LiquidGlass';

const ICON_MAP: Record<string, LucideIcon> = {
  Trophy,
  GraduationCap,
  Github,
  Medal,
  Star,
};

const SPRING = { type: 'spring', stiffness: 280, damping: 28 } as const;

export function AchievementsSection() {
  const featured = achievements.find((a) => a.highlight) || achievements[0];
  const secondary = achievements.filter((a) => a.id !== featured?.id);
  const FeaturedIcon = featured ? ICON_MAP[featured.icon] || Trophy : Trophy;

  return (
    <section
      id="achievements"
      className="py-28 px-4 md:px-8 max-w-6xl mx-auto w-full scroll-mt-24"
      aria-label="Achievements and Recognition"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={SPRING}
        className="mb-14"
      >
        <span className="section-label">
          <span aria-hidden="true">◈</span>
          Recognition
        </span>
        <h2 className="section-title text-white mt-1">
          Milestones & Recognition
        </h2>
        <p className="section-subtitle mt-2">
          Competitive honours and engineering benchmarks that demonstrate rigorous dedication to craft.
        </p>
      </motion.div>

      {/* Featured: World Memory Championship Bronze Medal */}
      {featured && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={SPRING}
          className="mb-8"
        >
          <LiquidGlass
            elevation={4}
            tint="amber"
            radius={28}
            dynamicLight
            className="p-8 md:p-10 relative overflow-hidden"
          >
            {/* Subtle amber aura background */}
            <div
              className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 70%)' }}
              aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col md:flex-row gap-7 items-start md:items-center">
              {/* Trophy Icon Badge */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(245,158,11,0.25) 0%, rgba(217,119,6,0.15) 100%)',
                  border: '1px solid rgba(245,158,11,0.4)',
                  boxShadow: '0 0 20px rgba(245,158,11,0.25)',
                }}
              >
                <FeaturedIcon size={32} className="text-amber-400" />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                    <Sparkles size={12} />
                    High Priority Differentiator
                  </span>
                  <span className="text-xs font-mono font-bold text-white/60 tabular-nums">
                    {featured.year}
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 leading-tight">
                  {featured.title}
                </h3>
                <p className="text-base text-[var(--text-secondary)] leading-relaxed mb-4">
                  {featured.description}
                </p>

                {featured.details && (
                  <div className="p-4 rounded-xl bg-white/5 border border-amber-500/20 text-xs font-mono text-amber-200/90 flex items-start gap-2.5">
                    <Brain size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>{featured.details}</span>
                  </div>
                )}
              </div>
            </div>
          </LiquidGlass>
        </motion.div>
      )}

      {/* Secondary achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {secondary.map((achievement, index) => {
          const Icon = ICON_MAP[achievement.icon] || Star;

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ ...SPRING, delay: index * 0.08 }}
              whileHover={{ y: -4, transition: SPRING }}
            >
              <LiquidGlass
                elevation={2}
                tint="neutral"
                radius={22}
                dynamicLight
                className="h-full p-6 flex items-start gap-4"
              >
                <div className="p-3 rounded-xl bg-white/6 border border-white/10 text-[var(--accent-cyan)] flex-shrink-0">
                  <Icon size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <h4 className="text-base font-bold text-white leading-tight">
                      {achievement.title}
                    </h4>
                    <span className="text-xs font-mono text-[var(--text-muted)] tabular-nums">
                      {achievement.year}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-tertiary)] leading-relaxed">
                    {achievement.description}
                  </p>
                </div>
              </LiquidGlass>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
