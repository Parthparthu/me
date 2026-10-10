'use client';

import React from 'react';
import { Terminal, Layout, Server, Database, Brain, Wrench, type LucideIcon } from 'lucide-react';
import { skillCategories } from '@/data/skills';
import { LiquidGlass } from '@/components/glass/LiquidGlass';

const ICON_MAP: Record<string, LucideIcon> = {
  Terminal,
  Layout,
  Server,
  Database,
  Brain,
  Wrench,
};

export function SkillsSection() {
  return (
    <section
      id="skills"
      className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full scroll-mt-24"
      aria-label="Technical skills"
    >
      <div className="mb-14">
        <span className="section-label">Skills</span>
        <h2 className="section-title text-[var(--text-primary)] mt-1">
          Technical Stack and Applied Tooling
        </h2>
        <p className="section-subtitle mt-2">
          Tools, frameworks, and protocols applied across production builds, data systems, and algorithmic problem-solving.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillCategories.map((category) => {
          const Icon = ICON_MAP[category.icon] || Terminal;

          return (
            <div key={category.id}>
              <LiquidGlass
                elevation={2}
                tint="neutral"
                radius={12}
                className="h-full p-6 flex flex-col justify-between border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-colors"
              >
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] text-[var(--accent-primary)]">
                      <Icon size={18} aria-hidden="true" />
                    </div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)]">
                      {category.title}
                    </h3>
                  </div>

                  <ul className="space-y-3" role="list">
                    {category.skills.map((skill) => (
                      <li key={skill.name} className="flex flex-col gap-1 pb-2 border-b border-[var(--border-subtle)] last:border-0 last:pb-0">
                        <span className="text-xs font-semibold text-[var(--text-primary)]">
                          {skill.name}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {skill.verifiedIn.map((item) => (
                            <span
                              key={item}
                              className="px-1.5 py-0.5 rounded-md text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-surface-raised)]"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </LiquidGlass>
            </div>
          );
        })}
      </div>
    </section>
  );
}
