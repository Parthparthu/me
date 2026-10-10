/**
 * AchievementsSection: Competitive milestones and verifiable recognitions.
 * Features the World Memory Championship Bronze Medal (2023).
 */
'use client';

import { motion } from 'framer-motion';
import { Trophy, GraduationCap, Github, Medal, Star, Brain, type LucideIcon } from 'lucide-react';
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
      className="py-24 px-4 md:px-8 max-w-6xl mx-auto w-full scroll-mt-24"
      aria-label="Achievements and Recognition"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={SPRING}
        className="mb-14"
      >
        <span className="section-label">
          <span aria-hidden="true">#</span>
          Recognition
        </span>
        <h2 className="section-title text-white mt-1">
          Milestones &amp; Recognition
        </h2>
        <p className="section-subtitle mt-2">
          Competitive honours and engineering milestones verified through practical performance.
        </p>
      </motion.div>

      {/* Featured: World Memory Championship Bronze Medal */}
      {featured && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={SPRING}
          className="mb-8"
        >
          <LiquidGlass
            elevation={4}
            tint="amber"
            radius={14}
            dynamicLight={false}
            className="p-7 md:p-9 relative overflow-hidden"
          >
            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
              {/* Trophy Icon Badge: 8px radius */}
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                }}
              >
                <FeaturedIcon size={28} className="text-amber-400" aria-hidden="true" />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2.5 mb-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-xs font-mono font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                    Competitive Honor
                  </span>
                  <span className="text-xs font-mono font-bold text-white/60 tabular-nums">
                    {featured.year}
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 leading-tight">
                  {featured.title}
                </h3>
                <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed mb-4">
                  {featured.description}
                </p>

                {featured.details && (
                  <div className="p-3.5 rounded-lg bg-white/5 border border-amber-500/20 text-xs font-mono text-amber-200/90 flex items-start gap-2.5">
                    <Brain size={16} className="text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
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
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ ...SPRING, delay: index * 0.06 }}
            >
              <LiquidGlass
                elevation={2}
                tint="neutral"
                radius={14}
                dynamicLight={false}
                className="h-full p-6 flex items-start gap-4"
              >
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--accent-primary)] flex-shrink-0">
                  <Icon size={20} aria-hidden="true" />
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
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
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
