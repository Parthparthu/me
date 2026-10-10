'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, X, ArrowUpRight, Github, ArrowRight } from 'lucide-react';
import { projects } from '@/data/projects';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl pt-28 pb-24">
      {/* Header */}
      <div className="flex flex-col gap-6 mb-12">
        <div className="flex flex-col gap-2">
          <span className="section-label">Archive</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-[var(--text-primary)]">
            All Projects
          </h1>
          <p className="text-[var(--text-secondary)] text-base max-w-2xl leading-relaxed">
            Technical index of production systems, offline-first progressive web applications, financial pipelines, and algorithmic problem-solving.
          </p>
        </div>

        {/* Filter Bar */}
        <LiquidGlass elevation={2} tint="neutral" radius={12} className="p-4 sm:p-5 border border-[var(--border-subtle)]">
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
                className="w-full bg-[var(--bg-app)] border border-[var(--border-subtle)] rounded-md py-2.5 pl-10 pr-9 text-base text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] min-h-[44px]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 min-h-[32px] min-w-[32px] flex items-center justify-center"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Selects */}
            <div className="flex flex-wrap gap-4 items-center w-full lg:w-auto">
              <div className="flex items-center gap-2">
                <label htmlFor="cat-select" className="text-xs font-mono text-[var(--text-secondary)]">
                  Category:
                </label>
                <select
                  id="cat-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-[var(--bg-app)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-md px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] min-h-[44px]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="tier-select" className="text-xs font-mono text-[var(--text-secondary)]">
                  Tier:
                </label>
                <select
                  id="tier-select"
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="bg-[var(--bg-app)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-md px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] min-h-[44px]"
                >
                  {TIERS.map((tier) => (
                    <option key={tier} value={tier} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
                      {tier}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </LiquidGlass>

        <div className="text-xs font-mono text-[var(--text-muted)]">
          Showing <strong className="text-[var(--text-primary)]">{filteredProjects.length}</strong> of{' '}
          {projects.length} projects
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id}>
            <LiquidGlass
              elevation={2}
              tint="neutral"
              radius={12}
              className="h-full p-6 flex flex-col justify-between border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-colors"
            >
              <div>
                <div className="flex justify-between items-center gap-2 mb-4">
                  <span className="badge">{project.category}</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
                    {project.tier}
                  </span>
                </div>

                <h2 className="text-lg font-display font-bold text-[var(--text-primary)] mb-2 leading-snug">
                  {project.name}
                </h2>

                <p className="text-xs text-[var(--accent-primary)] font-medium mb-3">
                  {project.tagline}
                </p>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-6 line-clamp-3">
                  {project.shortDescription}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] text-[var(--text-muted)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-primary)] hover:underline min-h-[44px]"
                >
                  <span>Case Study</span>
                  <ArrowRight size={13} aria-hidden="true" />
                </Link>

                <div className="flex items-center gap-2">
                  {project.repositoryUrl && (
                    <a
                      href={project.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
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
                      className="p-2 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      aria-label={`Live site for ${project.name}`}
                    >
                      <ArrowUpRight size={16} />
                    </a>
                  )}
                </div>
              </div>
            </LiquidGlass>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-20 text-sm font-mono text-[var(--text-muted)]">
          No projects found matching the filter criteria.
        </div>
      )}
    </div>
  );
}
