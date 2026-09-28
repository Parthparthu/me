/**
 * SelectedWork — Featured project showcase with floating glass cards.
 *
 * Each Tier-A project is displayed in a GlassCard with:
 * - Gradient visual area (placeholder, swappable for real screenshots)
 * - Project name, tagline, tech stack, status badge
 * - Case study link + GitHub/live links
 * - Hover: lift, specular sweep, shadow depth increase (CSS + Framer Motion)
 *
 * The Framer Motion layoutId="project-{slug}" enables the card → case study
 * liquid expansion transition on navigation.
 */
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ExternalLink, Github, ArrowRight, Eye } from 'lucide-react';
import { projects } from '@/data/projects';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { cn } from '@/lib/utils';

// Project gradient palettes — swappable for real screenshots
const PROJECT_GRADIENTS: Record<string, { from: string; to: string; accent: string }> = {
  oweo: { from: '#064e3b', to: '#065f46', accent: '#10b981' },
  numora: { from: '#1e1b4b', to: '#312e81', accent: '#818cf8' },
  insidertracker: { from: '#451a03', to: '#78350f', accent: '#f59e0b' },
  'codeclash-ai': { from: '#0c1445', to: '#1e3a8a', accent: '#38bdf8' },
  stockscreener: { from: '#1e1b4b', to: '#2e1065', accent: '#6366f1' },
};

const STATUS_STYLES: Record<string, string> = {
  Production: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Prototype: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Active Development': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Completed: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

const SPRING = { type: 'spring', stiffness: 280, damping: 28 } as const;

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { ...SPRING, delay: i * 0.1 },
  }),
};

export function SelectedWork() {
  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <section
      id="selected-work"
      className="relative py-28 px-4 md:px-8 w-full scroll-mt-24"
      aria-label="Selected work"
    >
      {/* Section background — subtle gradient to differentiate from hero */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 80% 50%, rgba(56,189,248,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={SPRING}
          className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <span className="section-label">
              <span aria-hidden="true">◈</span>
              Selected Work
            </span>
            <h2 className="section-title text-white mt-1">
              Featured Projects
            </h2>
            <p className="section-subtitle mt-2">
              Production-grade applications built with a focus on architecture,
              performance, and real-world constraints.
            </p>
          </div>

          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] transition-colors whitespace-nowrap"
          >
            View All {projects.length} Projects
            <ArrowRight
              size={15}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>
        </motion.div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 gap-6">
          {featuredProjects.map((project, index) => {
            const gradient =
              PROJECT_GRADIENTS[project.slug] ||
              PROJECT_GRADIENTS.oweo;

            return (
              <motion.div
                key={project.slug}
                layoutId={`project-card-${project.slug}`}
                custom={index}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
              >
                <motion.div
                  whileHover={{ y: -6, transition: SPRING }}
                  className="group"
                >
                  <LiquidGlass
                    elevation={3}
                    tint="neutral"
                    radius={24}
                    dynamicLight
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                      {/* Visual area */}
                      <div
                        className="lg:col-span-5 aspect-video lg:aspect-auto min-h-[200px] lg:min-h-[260px] relative overflow-hidden"
                        aria-hidden="true"
                      >
                        {/* Gradient placeholder */}
                        <div
                          className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                          style={{
                            background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
                          }}
                        />

                        {/* Accent glow */}
                        <div
                          className="absolute inset-0 opacity-40"
                          style={{
                            background: `radial-gradient(ellipse 60% 60% at 30% 40%, ${gradient.accent}30 0%, transparent 70%)`,
                          }}
                        />

                        {/* Project number */}
                        <div className="absolute top-4 left-4">
                          <span
                            className="font-mono text-xs font-bold"
                            style={{ color: gradient.accent }}
                          >
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>

                        {/* Bottom glass info strip */}
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                        {/* Tier badge */}
                        <div className="absolute top-4 right-4">
                          <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider"
                            style={{
                              background: `${gradient.accent}20`,
                              color: gradient.accent,
                              border: `1px solid ${gradient.accent}40`,
                            }}
                          >
                            {project.tier}
                          </span>
                        </div>
                      </div>

                      {/* Content area */}
                      <div className="lg:col-span-7 p-7 md:p-9 flex flex-col justify-between">
                        <div>
                          {/* Category + status */}
                          <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className="badge">
                              {project.category}
                            </span>
                            <span
                              className={cn(
                                'px-2.5 py-0.5 rounded-full text-xs font-semibold border',
                                STATUS_STYLES[project.status] ??
                                  STATUS_STYLES.Completed
                              )}
                            >
                              {project.status}
                            </span>
                          </div>

                          {/* Name */}
                          <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-1.5 leading-tight">
                            {project.name}
                          </h3>

                          {/* Tagline */}
                          <p className="text-[var(--text-secondary)] text-sm mb-3 leading-relaxed">
                            {project.tagline}
                          </p>

                          {/* Short description */}
                          <p className="text-[var(--text-tertiary)] text-sm mb-6 line-clamp-2 leading-relaxed">
                            {project.shortDescription}
                          </p>
                        </div>

                        <div>
                          {/* Tech stack */}
                          <div className="flex flex-wrap gap-1.5 mb-6">
                            {project.technologies.slice(0, 5).map((tech) => (
                              <span
                                key={tech}
                                className="px-2.5 py-0.5 rounded-md text-xs text-[var(--text-secondary)] bg-white/5 border border-white/8"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.technologies.length > 5 && (
                              <span className="px-2.5 py-0.5 rounded-md text-xs text-[var(--text-muted)]">
                                +{project.technologies.length - 5}
                              </span>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap items-center gap-3">
                            <Link
                              href={`/projects/${project.slug}`}
                              className="group/btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#0a0b10] text-sm font-semibold hover:bg-white/90 transition-colors min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
                            >
                              <Eye size={15} />
                              Case Study
                              <ArrowRight
                                size={14}
                                className="group-hover/btn:translate-x-0.5 transition-transform"
                              />
                            </Link>

                            {project.repositoryUrl && (
                              <a
                                href={project.repositoryUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`View ${project.name} source on GitHub`}
                                className="p-2.5 rounded-xl border border-white/10 text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
                              >
                                <Github size={18} />
                              </a>
                            )}

                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Visit ${project.name} live site`}
                                className="p-2.5 rounded-xl border border-white/10 text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
                              >
                                <ExternalLink size={18} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </LiquidGlass>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* View all CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={SPRING}
          className="mt-12 flex justify-center"
        >
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/12 text-sm text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-all min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
          >
            Browse all {projects.length} projects
            <ArrowRight
              size={15}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
