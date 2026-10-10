'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ExternalLink, Github, ArrowRight, Eye, Terminal } from 'lucide-react';
import { projects } from '@/data/projects';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<string, string> = {
  Production: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Prototype: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Active Development': 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  Completed: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

export function SelectedWork() {
  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <section
      id="selected-work"
      className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full scroll-mt-24"
      aria-label="Selected work"
    >
      <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="section-label">Selected Work</span>
          <h2 className="section-title text-[var(--text-primary)] mt-1">
            Featured Projects
          </h2>
          <p className="section-subtitle mt-2">
            Production-grade systems and applications developed with an emphasis on offline resilience, performance, and clean architecture.
          </p>
        </div>

        <Link
          href="/projects"
          className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors whitespace-nowrap min-h-[44px]"
        >
          View All {projects.length} Projects
          <ArrowRight
            size={15}
            className="group-hover:translate-x-1 transition-transform duration-200"
          />
        </Link>
      </div>

      {/* Projects List */}
      <div className="space-y-8">
        {featuredProjects.map((project, index) => (
          <div key={project.slug}>
            <LiquidGlass
              elevation={2}
              tint="neutral"
              radius={12}
              className="overflow-hidden border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-colors duration-200"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Visual / Architecture Overview Frame */}
                <div
                  className="lg:col-span-4 bg-[var(--bg-surface-2)] p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[var(--border-subtle)]"
                  aria-hidden="true"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-[var(--accent-primary)] font-bold">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
                      {project.tier}
                    </span>
                  </div>

                  <div className="space-y-3 my-4">
                    <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
                      <Terminal size={14} className="text-[var(--accent-primary)]" />
                      <span>{project.primaryLanguage}</span>
                    </div>
                    <div className="p-3 rounded-md bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-[11px] text-[var(--text-tertiary)] leading-tight overflow-hidden">
                      <code>{project.slug} / architecture: {project.caseStudy?.architecture ? 'verified' : 'modular'}</code>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]">
                    {project.date}
                  </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div>
                    {/* Category & Status */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="badge">
                        {project.category}
                      </span>
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-md text-xs font-medium border',
                          STATUS_STYLES[project.status] ?? STATUS_STYLES.Completed
                        )}
                      >
                        {project.status}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-[var(--text-primary)] mb-2">
                      {project.name}
                    </h3>

                    {/* Tagline */}
                    <p className="text-sm font-medium text-[var(--accent-primary)] mb-3">
                      {project.tagline}
                    </p>

                    {/* Description */}
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {project.shortDescription}
                    </p>
                  </div>

                  <div>
                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.technologies.slice(0, 6).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 rounded-md text-xs text-[var(--text-secondary)] bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 6 && (
                        <span className="px-2 py-1 rounded-md text-xs text-[var(--text-muted)] font-mono">
                          +{project.technologies.length - 6}
                        </span>
                      )}
                    </div>

                    {/* Action Links */}
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--accent-primary)] text-white text-xs font-semibold hover:bg-[var(--accent-primary-hover)] transition-colors min-h-[44px]"
                      >
                        <Eye size={14} aria-hidden="true" />
                        <span>Read Case Study</span>
                      </Link>

                      {project.repositoryUrl && (
                        <a
                          href={project.repositoryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--bg-surface)] border border-[var(--border-medium)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-semibold hover:bg-white/5 transition-colors min-h-[44px]"
                        >
                          <Github size={14} aria-hidden="true" />
                          <span>Code Repository</span>
                        </a>
                      )}

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--bg-surface)] border border-[var(--border-medium)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-semibold hover:bg-white/5 transition-colors min-h-[44px]"
                        >
                          <ExternalLink size={14} aria-hidden="true" />
                          <span>Live Deployment</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </LiquidGlass>
          </div>
        ))}
      </div>
    </section>
  );
}
