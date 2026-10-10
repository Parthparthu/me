'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Layout, Server, Database, Brain, Wrench, type LucideIcon } from 'lucide-react';
import { skillCategories } from '@/data/skills';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { POINTER_REACTIVE_3D } from '@/lib/config';

const ICON_MAP: Record<string, LucideIcon> = {
  Terminal,
  Layout,
  Server,
  Database,
  Brain,
  Wrench,
};

const CATEGORY_ACCENTS = [
  '#0ea5e9', // Languages: sky
  '#0284c7', // Frameworks: blue
  '#10b981', // Backend: emerald
  '#f59e0b', // Storage: amber
  '#0ea5e9', // Academic: sky
  '#64748b', // Tools: slate
];

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
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={SPRING}
        className="mb-14"
      >
        <span className="section-label">
          <span aria-hidden="true">#</span>
          Skills
        </span>
        <h2 className="section-title text-white mt-1">
          Technologies Used in Projects
        </h2>
        <p className="section-subtitle mt-2">
          Classified by direct implementation evidence across codebases, academic coursework, and active study.
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
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ ...SPRING, delay: catIndex * 0.05 }}
            >
              <LiquidGlass
                elevation={3}
                tint="neutral"
                radius={14}
                dynamicLight={POINTER_REACTIVE_3D}
                className="h-full p-6 flex flex-col group hover:border-white/20 transition-colors"
              >
                {/* Category header */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `${accent}15`,
                      border: `1px solid ${accent}30`,
                    }}
                  >
                    <Icon
                      size={20}
                      aria-hidden="true"
                      style={{ color: accent }}
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{category.title}</h3>
                    <p className="text-[11px] text-[var(--text-muted)] font-mono">{category.subtitle}</p>
                  </div>
                </div>

                {/* Skills list */}
                <div className="flex flex-col gap-3 mt-2">
                  {category.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="p-2.5 rounded-lg bg-white/4 border border-white/6 hover:border-white/12 transition-colors"
                    >
                      <div className="flex justify-between items-baseline gap-2 mb-1">
                        <span className="text-xs font-semibold text-white font-mono">
                          {skill.name}
                        </span>
                        <span className="text-[10px] text-[var(--text-tertiary)] font-sans text-right">
                          {skill.context}
                        </span>
                      </div>

                      {/* Project evidence tags */}
                      {skill.verifiedIn && skill.verifiedIn.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {skill.verifiedIn.map((proj) => (
                            <span
                              key={proj}
                              className="text-[9px] px-1.5 py-0.5 rounded-xs bg-white/5 text-[var(--text-secondary)] font-mono border border-white/6"
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
