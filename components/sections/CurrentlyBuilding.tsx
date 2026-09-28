/**
 * CurrentlyBuilding — Live active status modules for projects in active development.
 * Displayed in liquid glass tiles with pulsating emerald indicators and repository links.
 */
'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Hammer, Laptop, Terminal, type LucideIcon } from 'lucide-react';
import { LiquidGlass } from '@/components/glass/LiquidGlass';

interface CurrentProject {
  id: string;
  name: string;
  task: string;
  status: string;
  icon: LucideIcon;
  url: string;
}

const CURRENT_PROJECTS: CurrentProject[] = [
  {
    id: 'oweo',
    name: 'Oweo',
    task: 'Implementing recurring expense templates & biometric authentication',
    status: 'Active Development',
    icon: Laptop,
    url: 'https://github.com/Parthparthu/Oweo',
  },
  {
    id: 'codeclash',
    name: 'CodeClash AI',
    task: 'Integrating real-time Monaco WebSocket collaborative sandbox',
    status: 'Active Development',
    icon: Terminal,
    url: 'https://github.com/Parthparthu/CodeClash-AI',
  },
  {
    id: 'portfolio-v2',
    name: 'Portfolio v2',
    task: 'Liquid Glass design system & persistent WebGL R3F canvas architecture',
    status: 'In Progress',
    icon: Hammer,
    url: 'https://github.com/Parthparthu',
  },
];

const SPRING = { type: 'spring', stiffness: 280, damping: 28 } as const;

export function CurrentlyBuilding() {
  return (
    <section
      id="now"
      className="py-24 px-4 md:px-8 max-w-6xl mx-auto w-full scroll-mt-24"
      aria-label="Currently Building"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={SPRING}
        className="mb-12"
      >
        <span className="section-label">
          <span aria-hidden="true">◈</span>
          Now
        </span>
        <h2 className="section-title text-white mt-1">
          Currently Building
        </h2>
        <p className="section-subtitle mt-2">
          Active engineering tasks, architectural experiments, and commits in progress.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {CURRENT_PROJECTS.map((project, index) => {
          const Icon = project.icon;

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ ...SPRING, delay: index * 0.1 }}
              whileHover={{ y: -4, transition: SPRING }}
            >
              <LiquidGlass
                elevation={2}
                tint="neutral"
                radius={22}
                dynamicLight
                className="h-full p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 rounded-xl bg-white/6 border border-white/10 text-[var(--accent-cyan)]">
                      <Icon size={20} />
                    </div>
                    {project.url !== '#' && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-[var(--text-tertiary)] hover:text-white hover:bg-white/5 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                        aria-label={`View ${project.name} on GitHub`}
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                    {project.name}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                    {project.task}
                  </p>
                </div>

                {/* Status indicator */}
                <div className="flex items-center gap-2 pt-4 border-t border-white/8">
                  <div className="relative flex h-2.5 w-2.5" aria-hidden="true">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </div>
                  <span className="text-xs font-medium text-[var(--text-secondary)]">
                    {project.status}
                  </span>
                </div>
              </LiquidGlass>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
