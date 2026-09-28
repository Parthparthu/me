/**
 * ProjectsPageClient — Full catalog of all 9 projects with Liquid Glass styling.
 * Supports real-time search, category filtering, and tier segmentation.
 */
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ArrowUpRight, Github, ArrowRight } from 'lucide-react';
import { projects } from '@/data/projects';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { GlassPill } from '@/components/glass/GlassVariants';
import { cn } from '@/lib/utils';

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
            <span aria-hidden="true">◈</span>
            Archive
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
            All Projects
          </h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl leading-relaxed">
            A comprehensive catalog of production systems, offline-first PWAs, distributed architectures, and algorithms.
          </p>
        </div>

        {/* Filter bar */}
        <LiquidGlass elevation={2} tint="neutral" radius={24} className="p-4 md:p-5">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full lg:max-w-md">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />
              <input
                type="text"
                placeholder="Search projects, technologies…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-9 text-sm text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] min-h-[44px]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white p-1 min-h-[32px] min-w-[32px] flex items-center justify-center"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Selects */}
            <div className="flex flex-wrap gap-4 items-center w-full lg:w-auto">
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-[var(--text-muted)]" />
                <label htmlFor="cat-select" className="text-xs font-medium text-[var(--text-secondary)]">
                  Category:
                </label>
                <select
                  id="cat-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-black/50 border border-white/12 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] min-h-[38px]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#0e121b] text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="tier-select" className="text-xs font-medium text-[var(--text-secondary)]">
                  Tier:
                </label>
                <select
                  id="tier-select"
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="bg-black/50 border border-white/12 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] min-h-[38px]"
                >
                  {TIERS.map((tier) => (
                    <option key={tier} value={tier} className="bg-[#0e121b] text-white">
                      {tier}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </LiquidGlass>

        <div className="text-xs font-mono text-[var(--text-muted)]">
          Showing <strong className="text-white">{filteredProjects.length}</strong> of{' '}
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
                radius={24}
                dynamicLight
                className="h-full p-6 md:p-7 flex flex-col justify-between group hover:border-white/25 transition-colors"
              >
                <div>
                  <div className="flex justify-between items-center gap-2 mb-4">
                    <span className="badge">{project.category}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-white/6 border border-white/10 text-[var(--text-muted)]">
                      {project.tier}
                    </span>
                  </div>

                  <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-[var(--accent-cyan)] transition-colors leading-snug">
                    {project.name}
                  </h3>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-6">
                    {project.tagline}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/8 text-[var(--text-muted)]"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/8 text-[var(--text-muted)]">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/8">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-white group-hover:text-[var(--accent-cyan)] transition-colors min-h-[44px]"
                  >
                    <span>Read Case Study</span>
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  <div className="flex items-center gap-2">
                    {project.repositoryUrl && (
                      <a
                        href={project.repositoryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/5 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
                        aria-label={`GitHub repo for ${project.name}`}
                      >
                        <Github size={16} />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/5 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
                        aria-label={`Live site for ${project.name}`}
                      >
                        <ArrowUpRight size={16} />
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
    </div>
  );
}
