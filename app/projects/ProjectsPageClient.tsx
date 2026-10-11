/**
 * ProjectsPageClient: Full catalog of all projects with Liquid Glass styling.
 * Features:
 * - Real-time category and tier filtering with animated layout transitions
 * - Card 3D tilt and light response
 * - Expanded media & architectural inspection modal
 * - Zero em dashes and zero emojis
 */
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ArrowUpRight, Github, ArrowRight, Maximize2, Layers, CheckCircle2 } from 'lucide-react';
import { projects } from '@/data/projects';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { POINTER_REACTIVE_3D } from '@/lib/config';
import { cn } from '@/lib/utils';
import type { Project } from '@/types/project';

const CATEGORIES = [
  'All',
  'Web / PWA',
  'Full-Stack / Systems',
  'Real-Time / Financial',
  'Software / Tools',
  'Algorithms',
];

const TIERS = ['All', 'Tier A', 'Tier B'];

const SPRING = { type: 'spring', stiffness: 280, damping: 28 } as const;

export default function ProjectsPageClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTier, setSelectedTier] = useState('All');
  const [expandedProject, setExpandedProject] = useState<Project | null>(null);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        project.name.toLowerCase().includes(query) ||
        project.tagline.toLowerCase().includes(query) ||
        project.shortDescription.toLowerCase().includes(query) ||
        project.technologies.some((t) => t.toLowerCase().includes(query));

      const matchesCategory =
        selectedCategory === 'All' || project.category === selectedCategory;
      const matchesTier =
        selectedTier === 'All' || project.tier === selectedTier;

      return matchesSearch && matchesCategory && matchesTier;
    });
  }, [searchQuery, selectedCategory, selectedTier]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-28 pb-24">
      {/* Header */}
      <div className="flex flex-col gap-8 mb-12">
        <div className="flex flex-col gap-3">
          <span className="section-label">
            <span aria-hidden="true">#</span>
            Catalog
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-[var(--text-primary)] tracking-tight">
            All Projects
          </h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl leading-relaxed">
            A comprehensive catalog of production systems, offline-first PWAs, distributed architectures, and algorithms.
          </p>
        </div>

        {/* Filter bar */}
        <div
          style={{
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--separator)',
            boxShadow: 'var(--shadow-sm)',
          }}
          className="p-4 md:p-5 flex flex-col gap-4"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full lg:max-w-md">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--label-tertiary)]"
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder="Search projects, technologies…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--bg-grouped)] border border-[var(--separator)] rounded-[var(--radius-sm)] py-2.5 pl-10 pr-9 text-sm text-[var(--label-primary)] placeholder:text-[var(--label-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] min-h-[44px]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--label-tertiary)] hover:text-[var(--label-primary)] p-1 min-h-[32px] min-w-[32px] flex items-center justify-center rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Tier Segmented Control */}
            <div className="inline-flex p-1 rounded-[var(--radius-sm)] bg-[var(--bg-grouped)] border border-[var(--separator)]">
              {TIERS.map((tier) => (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={cn(
                    'relative px-3 py-1.5 text-xs font-medium rounded-[var(--radius-xs)] transition-colors min-h-[36px]',
                    selectedTier === tier
                      ? 'text-[var(--label-primary)]'
                      : 'text-[var(--label-secondary)] hover:text-[var(--label-primary)]'
                  )}
                >
                  {selectedTier === tier && (
                    <motion.span
                      layoutId="tier-pill"
                      className="absolute inset-0 bg-[var(--bg-secondary)] border border-[var(--separator-strong)] rounded-[var(--radius-xs)] shadow-sm"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{tier}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category Segmented Control with smooth scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-medium text-[var(--label-tertiary)] flex-shrink-0 mr-1">
              Category:
            </span>
            <div className="inline-flex p-1 rounded-[var(--radius-sm)] bg-[var(--bg-grouped)] border border-[var(--separator)]">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'relative px-3.5 py-1.5 text-xs font-medium rounded-[var(--radius-xs)] transition-colors whitespace-nowrap min-h-[36px]',
                    selectedCategory === cat
                      ? 'text-[var(--label-primary)] font-semibold'
                      : 'text-[var(--label-secondary)] hover:text-[var(--label-primary)]'
                  )}
                >
                  {selectedCategory === cat && (
                    <motion.span
                      layoutId="category-pill"
                      className="absolute inset-0 bg-[var(--bg-secondary)] border border-[var(--separator-strong)] rounded-[var(--radius-xs)] shadow-sm"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-xs font-mono text-[var(--text-muted)]">
          Showing <strong className="text-[var(--text-primary)]">{filteredProjects.length}</strong> of{' '}
          {projects.length} projects
        </div>
      </div>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={SPRING}
              key={project.id}
            >
              <LiquidGlass
                elevation={3}
                tint="neutral"
                radius={14}
                dynamicLight={POINTER_REACTIVE_3D}
                className="h-full p-6 md:p-7 flex flex-col justify-between group hover:border-[var(--border-strong)] transition-colors"
              >
                <div>
                  <div className="flex justify-between items-center gap-2 mb-4 font-mono">
                    <span className="badge">{project.category}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setExpandedProject(project)}
                        className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
                        aria-label={`Inspect ${project.name}`}
                      >
                        <Maximize2 size={13} aria-hidden="true" />
                      </button>
                      <span className="px-2 py-0.5 rounded-sm text-[10px] font-semibold bg-[var(--bg-surface-active)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
                        {project.tier}
                      </span>
                    </div>
                  </div>

                  <h2 className="text-xl font-display font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-primary)] transition-colors leading-snug">
                    {project.name}
                  </h2>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-6 font-medium">
                    {project.tagline}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6 font-mono">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] px-2 py-0.5 rounded-sm bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)]"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="text-[11px] px-2 py-0.5 rounded-sm bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)] p-1 rounded"
                  >
                    <span>Read Case Study</span>
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </Link>

                  <div className="flex items-center gap-2">
                    {project.repositoryUrl && (
                      <a
                        href={project.repositoryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
                        aria-label={`GitHub repo for ${project.name}`}
                      >
                        <Github size={16} aria-hidden="true" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
                        aria-label={`Live site for ${project.name}`}
                      >
                        <ArrowUpRight size={16} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
              </LiquidGlass>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-20 text-[var(--text-muted)]">
          No projects found matching your criteria.
        </div>
      )}

      {/* Expanded Modal */}
      <AnimatePresence>
        {expandedProject && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${expandedProject.name} inspection preview`}
            className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpandedProject(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={SPRING}
              className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-medium)] shadow-2xl p-6 md:p-8"
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <span className="badge mb-2">{expandedProject.category}</span>
                  <h2 className="text-2xl font-display font-bold text-[var(--text-primary)]">
                    {expandedProject.name}
                  </h2>
                  <p className="text-xs text-[var(--accent-primary)] font-mono mt-1">
                    {expandedProject.tagline}
                  </p>
                </div>
                <button
                  onClick={() => setExpandedProject(null)}
                  className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)] min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Close dialog"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>

              {/* Architecture schematic box */}
              <div className="rounded-xl p-4 mb-5 border border-[var(--border-subtle)] bg-[var(--bg-surface-active)]">
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] uppercase mb-2">
                  <Layers size={13} className="text-[var(--accent-primary)]" aria-hidden="true" />
                  <span>Architecture Pipeline</span>
                </div>
                <p className="text-xs font-mono text-[var(--text-secondary)] leading-relaxed">
                  {expandedProject.caseStudy.architecture}
                </p>
              </div>

              {/* Highlights */}
              <div className="space-y-3 mb-6 text-xs text-[var(--text-secondary)] leading-relaxed">
                <p><strong>Problem:</strong> {expandedProject.caseStudy.problem}</p>
                <p><strong>Solution:</strong> {expandedProject.caseStudy.solution}</p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
                <Link
                  href={`/projects/${expandedProject.slug}`}
                  onClick={() => setExpandedProject(null)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-[var(--text-on-accent)] text-xs font-semibold hover:bg-[var(--accent-hover)] transition-colors min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
                >
                  <span>Full Case Study</span>
                  <ArrowRight size={13} aria-hidden="true" />
                </Link>
                {expandedProject.liveUrl && (
                  <a
                    href={expandedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors min-h-[44px]"
                  >
                    <span>Live App</span>
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
