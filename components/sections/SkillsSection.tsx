/**
 * SkillsSection — Glass-styled skill category cards with proficiency indicators.
 * 6 categories with animated skill level bars and project proof tags.
 */
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Layout, Server, Database, Brain, Wrench, type LucideIcon } from 'lucide-react';
import { skillCategories } from '@/data/skills';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, LucideIcon> = {
  Terminal,
  Layout,
  Server,
  Database,
  Brain,
  Wrench,
};

const CATEGORY_ACCENTS = [
  '#6366f1', // Core Languages — indigo
  '#38bdf8', // Frontend — cyan
  '#10b981', // Backend — emerald
  '#f59e0b', // Databases — amber
  '#818cf8', // AI/ML — violet
  '#a78bfa', // DevTools — purple
];

const LEVEL_LABELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const SPRING = { type: 'spring', stiffness: 280, damping: 28 } as const;

export function SkillsSection() {
  return (
    <section
      id="skills"
      className="py-24 px-4 md:px-8 max-w-7xl mx-auto w-full scroll-mt-24"
      aria-label="Technical skills"
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
          Skills
        </span>
        <h2 className="section-title text-white mt-1">
          Technical Stack
        </h2>
        <p className="section-subtitle mt-2">
          30+ technologies across full-stack development, AI/ML, and systems programming.
        </p>
      </motion.div>

      {/* Category grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {skillCategories.map((category, catIndex) => {
          const Icon = ICON_MAP[category.icon] || Terminal;
          const accent = CATEGORY_ACCENTS[catIndex % CATEGORY_ACCENTS.length];

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ ...SPRING, delay: catIndex * 0.08 }}
              whileHover={{ y: -4, transition: SPRING }}
            >
              <LiquidGlass
                elevation={3}
                tint="neutral"
                radius={22}
                dynamicLight
                className="h-full p-6 flex flex-col"
              >
                {/* Category header */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `${accent}18`,
                      border: `1px solid ${accent}30`,
                    }}
                  >
                    <Icon
                      size={20}
                      aria-hidden="true"
                      style={{ color: accent }}
                    />
                  </div>
                  <h3 className="text-base font-bold text-white">{category.title}</h3>
                </div>

                {/* Skills list */}
                <div className="flex flex-col gap-3">
                  {category.skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-[var(--text-secondary)]">
                          {skill.name}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                          {LEVEL_LABELS[(skill.level || 1) - 1]}
                        </span>
                      </div>

                      {/* Proficiency bar */}
                      <div
                        className="w-full h-1 rounded-full bg-white/8 overflow-hidden"
                        role="progressbar"
                        aria-valuenow={skill.level}
                        aria-valuemin={1}
                        aria-valuemax={4}
                        aria-label={`${skill.name}: ${LEVEL_LABELS[(skill.level || 1) - 1]}`}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${((skill.level || 1) / 4) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: catIndex * 0.05, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${accent}, ${accent}80)` }}
                        />
                      </div>

                      {/* Project proof tags */}
                      {skill.verifiedIn && skill.verifiedIn.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {skill.verifiedIn.slice(0, 2).map((proj) => (
                            <span
                              key={proj}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-white/6 text-[var(--text-muted)] border border-white/6"
                            >
                              {proj}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </LiquidGlass>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
