'use client';

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
    task: 'Implementing recurring expense templates and biometric authentication for offline PWA',
    status: 'Active Development',
    icon: Laptop,
    url: 'https://github.com/Parthparthu/Oweo',
  },
  {
    id: 'codeclash',
    name: 'CodeClash AI',
    task: 'Integrating real-time Monaco WebSocket collaborative sandbox and ELO matchmaking',
    status: 'Active Development',
    icon: Terminal,
    url: 'https://github.com/Parthparthu/CodeClash-AI',
  },
  {
    id: 'portfolio',
    name: 'Portfolio Systems',
    task: 'Refined liquid-glass architectural surfaces and verified accessibility protocol',
    status: 'In Progress',
    icon: Hammer,
    url: 'https://github.com/Parthparthu',
  },
];

export function CurrentlyBuilding() {
  return (
    <section
      id="now"
      className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full scroll-mt-24"
      aria-label="Currently Building"
    >
      <div className="mb-12">
        <span className="section-label">Active Focus</span>
        <h2 className="section-title text-[var(--text-primary)] mt-1">
          Currently Building
        </h2>
        <p className="section-subtitle mt-2">
          Active engineering tasks, architectural implementations, and commits in progress.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CURRENT_PROJECTS.map((project) => {
          const Icon = project.icon;

          return (
            <div key={project.id}>
              <LiquidGlass
                elevation={2}
                tint="neutral"
                radius={12}
                className="h-full p-6 flex flex-col justify-between border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-colors"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] text-[var(--accent-primary)]">
                      <Icon size={18} />
                    </div>
                    {project.url !== '#' && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                        aria-label={`View ${project.name} on GitHub`}
                      >
                        <ExternalLink size={15} />
                      </a>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-[var(--text-primary)] mb-2 leading-tight">
                    {project.name}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-6">
                    {project.task}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-[var(--border-subtle)]">
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-sm bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-sm h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-xs font-mono font-medium text-[var(--text-muted)]">
                    {project.status}
                  </span>
                </div>
              </LiquidGlass>
            </div>
          );
        })}
      </div>
    </section>
  );
}
