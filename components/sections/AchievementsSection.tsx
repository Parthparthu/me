'use client';

import { Trophy, GraduationCap, Github, type LucideIcon } from 'lucide-react';
import { achievements } from '@/data/achievements';
import { LiquidGlass } from '@/components/glass/LiquidGlass';

const ICON_MAP: Record<string, LucideIcon> = {
  Trophy,
  GraduationCap,
  Github,
};

export function AchievementsSection() {
  const featured = achievements.find((a) => a.highlight) || achievements[0];
  const secondary = achievements.filter((a) => a.id !== featured?.id);
  const FeaturedIcon = featured ? ICON_MAP[featured.icon] || Trophy : Trophy;

  return (
    <section
      id="achievements"
      className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full scroll-mt-24"
      aria-label="Achievements and Recognition"
    >
      <div className="mb-14">
        <span className="section-label">Recognition</span>
        <h2 className="section-title text-[var(--text-primary)] mt-1">
          Honours and Academic Standing
        </h2>
        <p className="section-subtitle mt-2">
          Competitive benchmarks and academic milestones that demonstrate dedication to rigorous problem-solving.
        </p>
      </div>

      {/* Featured: World Memory Championship */}
      {featured && (
        <div className="mb-8">
          <LiquidGlass
            elevation={3}
            tint="amber"
            radius={12}
            className="p-6 sm:p-8 border border-amber-500/25 relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0 bg-amber-500/15 border border-amber-500/30 text-amber-400"
              >
                <FeaturedIcon size={28} />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                    Competitive Memory
                  </span>
                  <span className="text-xs font-mono font-bold text-[var(--text-muted)] tabular-nums">
                    {featured.year}
                  </span>
                </div>

                <h3 className="text-xl font-display font-bold text-[var(--text-primary)]">
                  {featured.title}
                </h3>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {featured.description}
                </p>

                {featured.details && (
                  <p className="text-xs font-mono text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]">
                    Disciplines: {featured.details.replace('Disciplines included: ', '')}
                  </p>
                )}
              </div>
            </div>
          </LiquidGlass>
        </div>
      )}

      {/* Secondary Achievements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {secondary.map((item) => {
          const Icon = ICON_MAP[item.icon] || Trophy;

          return (
            <div key={item.id}>
              <LiquidGlass
                elevation={2}
                tint="neutral"
                radius={12}
                className="p-6 border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-colors h-full flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] text-[var(--accent-primary)]">
                      <Icon size={18} />
                    </div>
                    <span className="text-xs font-mono text-[var(--text-muted)] tabular-nums">
                      {item.year}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[var(--text-primary)]">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </LiquidGlass>
            </div>
          );
        })}
      </div>
    </section>
  );
}
