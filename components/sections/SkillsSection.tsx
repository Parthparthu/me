'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink,
  Terminal,
  Layout,
  Server,
  Database,
  Brain,
  Wrench,
  Layers,
  type LucideIcon,
} from 'lucide-react';
import { skillCategories, type SkillCategory, type Skill } from '@/data/skills';
import { SkillIcon } from '@/components/icons/SkillIcons';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { ParallaxCard } from '@/components/parallax';
import { POINTER_REACTIVE_3D } from '@/lib/config';
import { cn } from '@/lib/utils';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  languages: Terminal,
  'frameworks-libraries': Layout,
  'backend-systems': Server,
  'storage-state': Database,
  'academic-learning': Brain,
  'tools-workflow': Wrench,
};

const SPRING = { type: 'spring', stiffness: 320, damping: 30 } as const;

export function SkillsSection() {
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const tabsListRef = useRef<HTMLDivElement>(null);

  const categoriesWithAll = [
    { id: 'all', title: 'All Skills', subtitle: 'Complete technical stack', icon: 'Layers', skills: [] },
    ...skillCategories,
  ];

  const activeCategory =
    activeCategoryId === 'all'
      ? null
      : skillCategories.find((c) => c.id === activeCategoryId);

  // Keyboard navigation for tablist per WAI-ARIA APG
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = -1;
    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % categoriesWithAll.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + categoriesWithAll.length) % categoriesWithAll.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = categoriesWithAll.length - 1;
    }

    if (nextIndex >= 0) {
      e.preventDefault();
      const nextCategory = categoriesWithAll[nextIndex];
      setActiveCategoryId(nextCategory.id);
      const tabElements = tabsListRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
      tabElements?.[nextIndex]?.focus();
    }
  };

  return (
    <section
      id="skills"
      className="py-24 px-4 md:px-8 max-w-7xl mx-auto w-full scroll-mt-24"
      aria-label="Technical skills and documentation"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={SPRING}
        className="mb-10"
      >
        <span className="section-label">
          <span aria-hidden="true">#</span>
          Skills &amp; Technologies
        </span>
        <h2 className="section-title text-[var(--text-primary)] mt-1">
          Technologies &amp; Verified Implementations
        </h2>
        <p className="section-subtitle mt-2 max-w-2xl">
          Classified by direct codebase implementation and academic coursework. Each tile links to its official documentation.
        </p>
      </motion.div>

      {/* Segmented Control (Sliding rounded rectangle highlight) */}
      <div className="mb-10">
        <div
          ref={tabsListRef}
          role="tablist"
          aria-label="Skill categories"
          className="flex flex-wrap sm:inline-flex p-1.5 rounded-[var(--radius-lg)] bg-[var(--bg-secondary)] border border-[var(--separator)] gap-1 max-w-full overflow-x-auto"
        >
          {categoriesWithAll.map((cat, i) => {
            const isSelected = activeCategoryId === cat.id;
            const Icon = cat.id === 'all' ? Layers : CATEGORY_ICONS[cat.id] || Terminal;

            return (
              <button
                key={cat.id}
                role="tab"
                id={`skill-tab-${cat.id}`}
                aria-selected={isSelected}
                aria-controls={`skill-panel-${cat.id}`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setActiveCategoryId(cat.id)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className={cn(
                  'relative min-h-[44px] px-3.5 py-2 rounded-[var(--radius-md)] text-xs md:text-sm font-medium transition-colors flex items-center gap-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]',
                  isSelected
                    ? 'text-[var(--text-primary)] font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                )}
              >
                {/* Sliding indicator */}
                {isSelected && (
                  <motion.div
                    layoutId="skills-segmented-indicator"
                    className="absolute inset-0 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--separator-strong)] shadow-sm"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    style={{ zIndex: 0 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon size={15} aria-hidden="true" className={isSelected ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'} />
                  <span>{cat.title}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Skills Display Panel */}
      <div
        id={`skill-panel-${activeCategoryId}`}
        role="tabpanel"
        aria-labelledby={`skill-tab-${activeCategoryId}`}
        tabIndex={0}
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] rounded-xl"
      >
        {activeCategoryId === 'all' ? (
          /* Clean multi-category grid on large screens */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillCategories.map((category, idx) => (
              <ParallaxCard key={category.id} index={idx} className="h-full">
                <SkillCategoryCard category={category} />
              </ParallaxCard>
            ))}
          </div>
        ) : activeCategory ? (
          /* Focused single-category view */
          <div className="space-y-6">
            <div className="p-4 rounded-[var(--radius-md)] bg-[var(--bg-secondary)] border border-[var(--separator)]">
              <h3 className="text-base font-bold text-[var(--text-primary)]">{activeCategory.title}</h3>
              <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">{activeCategory.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeCategory.skills.map((skill, idx) => (
                <ParallaxCard key={skill.name} index={idx}>
                  <SkillTile skill={skill} />
                </ParallaxCard>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function SkillCategoryCard({ category }: { category: SkillCategory }) {
  const Icon = CATEGORY_ICONS[category.id] || Terminal;

  return (
    <LiquidGlass
      elevation={2}
      tint="neutral"
      radius={16}
      dynamicLight={POINTER_REACTIVE_3D}
      className="p-5 flex flex-col h-full border border-[var(--separator)]"
    >
      {/* Category Title Header */}
      <div className="flex items-center gap-2.5 pb-3 mb-3 border-b border-[var(--separator)]">
        <div className="w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center bg-[var(--accent-subtle)] border border-[var(--accent-border)] text-[var(--accent)] flex-shrink-0">
          <Icon size={16} aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[var(--text-primary)] leading-tight">{category.title}</h3>
          <p className="text-[11px] text-[var(--text-muted)] font-mono">{category.subtitle}</p>
        </div>
      </div>

      {/* Skills list with self-hosted icons & doc links */}
      <div className="flex flex-col gap-2 flex-1">
        {category.skills.map((skill) => (
          <SkillTile key={skill.name} skill={skill} compact />
        ))}
      </div>
    </LiquidGlass>
  );
}

function SkillTile({ skill, compact = false }: { skill: Skill; compact?: boolean }) {
  return (
    <a
      href={skill.docUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group relative flex items-center justify-between p-3 rounded-[var(--radius-md)] bg-[var(--bg-secondary)] border border-[var(--separator)] hover:border-[var(--accent-border)] hover:bg-[var(--bg-hover)] transition-all min-h-[44px]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]'
      )}
      aria-label={`${skill.name} (opens official documentation)`}
    >
      <div className="flex items-center gap-3 min-w-0 pr-2">
        <div className="w-7 h-7 rounded-[var(--radius-xs)] bg-[var(--bg-grouped)] border border-[var(--separator)] flex items-center justify-center text-[var(--accent)] flex-shrink-0 group-hover:scale-105 transition-transform">
          <SkillIcon name={skill.name} size={15} aria-hidden="true" />
        </div>
        <div className="min-w-0 truncate">
          <div className="text-xs font-semibold text-[var(--text-primary)] font-mono truncate">
            {skill.name}
          </div>
          <div className="text-[11px] text-[var(--text-muted)] font-sans truncate">
            {skill.context}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        {skill.verifiedIn && skill.verifiedIn.length > 0 && (
          <span className="hidden sm:inline-block text-[9px] px-1.5 py-0.5 rounded-[var(--radius-xs)] bg-[var(--bg-grouped)] text-[var(--text-secondary)] border border-[var(--separator)] font-mono">
            {skill.verifiedIn[0]}
          </span>
        )}
        <ExternalLink
          size={12}
          className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors shrink-0"
          aria-hidden="true"
        />
      </div>
    </a>
  );
}
