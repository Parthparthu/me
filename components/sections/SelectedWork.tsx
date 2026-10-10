/**
 * SelectedWork: Featured project showcase with liquid-glass cards.
 * Each project includes architectural summaries, technologies used, and direct case study links.
 */
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ExternalLink, Github, ArrowRight, Eye } from 'lucide-react';
import { projects } from '@/data/projects';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { cn } from '@/lib/utils';

// Project visual color palettes using slate and technical accents
const PROJECT_GRADIENTS: Record<string, { from: string; to: string; accent: string }> = {
  oweo: { from: '#064e3b', to: '#065f46', accent: '#10b981' },
  numora: { from: '#0f172a', to: '#1e293b', accent: '#0ea5e9' },
  insidertracker: { from: '#451a03', to: '#78350f', accent: '#f59e0b' },
  'codeclash-ai': { from: '#0c1445', to: '#1e3a8a', accent: '#38bdf8' },
  stockscreener: { from: '#0f172a', to: '#1e293b', accent: '#0284c7' },
};

const STATUS_STYLES: Record<string, string> = {
  Production: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Prototype: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Product Concept': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Active Development': 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  Completed: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

const SPRING = { type: 'spring', stiffness: 280, damping: 28 } as const;

export function SelectedWork() {
  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <section
      id="selected-work"
      className="relative py-28 px-4 md:px-8 w-full scroll-mt-24"
      aria-label="Selected work"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={SPRING}
          className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <span className="section-label">
              <span aria-hidden="true">#</span>
              Selected Work
            </span>
            <h2 className="section-title text-white mt-1">
              Featured Projects
            </h2>
            <p className="section-subtitle mt-2">
              Production-grade applications designed with a focus on architecture, performance, and real-world constraints.
            </p>
          </div>

          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-white transition-colors whitespace-nowrap p-1 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
          >
            <span>View All {projects.length} Projects</span>
            <ArrowRight
              size={15}
              className="group-hover:translate-x-1 transition-transform duration-200"
              aria-hidden="true"
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ ...SPRING, delay: index * 0.08 }}
              >
                <div className="group">
                  <LiquidGlass
                    elevation={3}
                    tint="neutral"
                    radius={14}
                    dynamicLight={false}
                    className="overflow-hidden border border-white/10"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                      {/* Visual area */}
                      <div
                        className="lg:col-span-5 aspect-video lg:aspect-auto min-h-[180px] lg:min-h-[240px] relative overflow-hidden bg-slate-900"
                        aria-hidden="true"
                      >
                        <div
                          className="absolute inset-0 transition-transform duration-500 group-hover:scale-102"
                          style={{
                            background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
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

                        {/* Tier badge: 6px radius */}
                        <div className="absolute top-4 right-4">
                          <span
                            className="px-2 py-0.5 rounded-sm text-[10px] font-bold font-mono tracking-wider"
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
                      <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between">
                        <div>
                          {/* Category and status */}
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="badge">
                              {project.category}
                            </span>
                            <span
                              className={cn(
                                'px-2.5 py-0.5 rounded-sm text-xs font-semibold border font-mono',
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
                          <p className="text-[var(--text-tertiary)] text-sm mb-5 line-clamp-2 leading-relaxed">
                            {project.shortDescription}
                          </p>
                        </div>

                        <div>
                          {/* Tech stack */}
                          <div className="flex flex-wrap gap-1.5 mb-5">
                            {project.technologies.slice(0, 5).map((tech) => (
                              <span
                                key={tech}
                                className="px-2 py-0.5 rounded-sm text-xs font-mono text-[var(--text-secondary)] bg-white/5 border border-white/8"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.technologies.length > 5 && (
                              <span className="px-2 py-0.5 rounded-sm text-xs font-mono text-[var(--text-muted)]">
                                +{project.technologies.length - 5}
                              </span>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap items-center gap-3">
                            <Link
                              href={`/projects/${project.slug}`}
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100 transition-colors min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
                            >
                              <Eye size={15} aria-hidden="true" />
                              <span>Case Study</span>
                              <ArrowRight size={14} aria-hidden="true" />
                            </Link>

                            {project.repositoryUrl && (
                              <a
                                href={project.repositoryUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`View ${project.name} source repository on GitHub`}
                                className="p-2.5 rounded-lg border border-white/10 text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
                              >
                                <Github size={18} aria-hidden="true" />
                              </a>
                            )}

                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Open ${project.name} live deployment`}
                                className="p-2.5 rounded-lg border border-white/10 text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
                              >
                                <ExternalLink size={18} aria-hidden="true" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </LiquidGlass>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View all button */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/12 text-sm text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-colors min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
          >
            <span>Browse all {projects.length} projects</span>
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
