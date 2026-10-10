/**
 * InstagramSection: Visual snapshots, developer workspace, and student journey.
 * Mirrors GitHubSection in structure with liquid-glass cards and direct profile integration.
 */
'use client';

import { motion } from 'framer-motion';
import { Instagram, ArrowUpRight, Camera, Laptop, MapPin, Trophy, Sparkles, Code, Brain } from 'lucide-react';
import { LiquidGlass } from '@/components/glass/LiquidGlass';

const SPRING = { type: 'spring', stiffness: 280, damping: 28 } as const;

interface InstagramStory {
  id: string;
  category: string;
  location: string;
  title: string;
  description: string;
  tags: string[];
  icon: typeof Camera;
}

const INSTAGRAM_STORIES: InstagramStory[] = [
  {
    id: 'wmc-ceremony',
    category: 'Competition & Honour',
    location: 'Navi Mumbai',
    title: 'World Memory Championship 2023 Ceremony',
    description: 'Documenting the award ceremony at Cidco Exhibition Centre, receiving the bronze medal and certificate for the Amateur Category alongside arbiters and fellow competitors.',
    tags: ['WMC 2023', 'Bronze Medal', 'Memory Sports'],
    icon: Trophy,
  },
  {
    id: 'developer-workspace',
    category: 'Engineering Rig',
    location: 'Noida Workspace',
    title: 'Dual-Monitor Setup & Late Night Sprints',
    description: 'Workspace layout tuned for productivity: dual dark mode monitors, mechanical keyboard, terminal debugging sessions, and local Three.js canvas testing.',
    tags: ['Workspace', 'Code Sprints', 'Three.js'],
    icon: Laptop,
  },
  {
    id: 'campus-gl-bajaj',
    category: 'Campus Life',
    location: 'Greater Noida',
    title: 'GL Bajaj ITM Academic Routine',
    description: 'Everyday campus life in Greater Noida: computer science laboratory sessions, lecture notes on algorithms and discrete structures, and campus technical discussions.',
    tags: ['GL Bajaj ITM', 'CSE AI/ML', 'College Life'],
    icon: MapPin,
  },
  {
    id: 'numora-ui-design',
    category: 'Project Ship',
    location: 'Design Lab',
    title: 'Numora PWA Interface Architecture',
    description: 'Behind-the-scenes snapshots of prototyping liquid-glass surfaces, dark themes, and spatial 3D visualization layers for the Numora mobile-number utility.',
    tags: ['UI Design', 'Numora', 'PWA Release'],
    icon: Code,
  },
  {
    id: 'memory-drills',
    category: 'Mental Athletics',
    location: 'Daily Practice',
    title: 'Speed Cards and Loci System Drills',
    description: 'Daily training routines involving speed cards, random digit sequences, and spatial memory loci that build cognitive focus and analytical discipline.',
    tags: ['Cognitive Drills', 'Memory Palace', 'Focus'],
    icon: Brain,
  },
  {
    id: 'coding-roots-2019',
    category: 'Milestones',
    location: 'Origin Story',
    title: 'Coding Foundations Since 2019',
    description: 'Archival memories tracing back to early WhiteHat Jr certifications in 2020 through to modern full-stack application development in Next.js and Python.',
    tags: ['Since 2019', 'WhiteHat Jr', 'Evolution'],
    icon: Camera,
  },
];

export function InstagramSection() {
  const profileUrl = 'https://www.instagram.com/pradyumna_in_/';

  return (
    <section
      id="instagram"
      className="py-24 px-4 md:px-8 max-w-6xl mx-auto w-full scroll-mt-24"
      aria-label="Instagram Feed and Visual Journey"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={SPRING}
        >
          <span className="section-label">
            <span aria-hidden="true">#</span>
            Behind The Code
          </span>
          <h2 className="section-title text-white mt-1">
            Instagram Feed &amp; Journey
          </h2>
          <p className="section-subtitle mt-2">
            Visual dispatches from daily engineering sprints, college campus, memory sports training, and workspace setups.
          </p>
        </motion.div>

        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/12 text-sm text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-colors w-fit min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
          aria-label="Visit Pradyuma's Instagram profile"
        >
          <Instagram size={16} className="text-[#e1306c]" aria-hidden="true" />
          <span>@pradyumna_in_</span>
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>

      {/* Profile highlights row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {[
          {
            icon: Camera,
            label: 'Visual Journal',
            value: '@pradyumna_in_',
            sub: 'Developer Life &middot; Tech &middot; Campus',
            color: '#e1306c',
          },
          {
            icon: Code,
            label: 'Origins',
            value: 'Since 2019',
            sub: 'Early Foundations to Full-Stack Web',
            color: 'var(--accent-primary)',
          },
          {
            icon: Trophy,
            label: 'Memory Sports',
            value: 'IAM 2023',
            sub: 'World Memory Championship Highlights',
            color: '#f59e0b',
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ ...SPRING, delay: i * 0.06 }}
            >
              <LiquidGlass
                elevation={2}
                tint="neutral"
                radius={14}
                dynamicLight={false}
                className="p-5 text-center"
              >
                <Icon
                  size={20}
                  className="mx-auto mb-2"
                  style={{ color: stat.color }}
                  aria-hidden="true"
                />
                <div className="text-xl md:text-2xl font-bold font-mono text-white truncate">
                  {stat.value}
                </div>
                <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-semibold font-mono mt-1">
                  {stat.label}
                </div>
                <div
                  className="text-[11px] text-[var(--text-muted)] font-mono mt-1.5"
                  dangerouslySetInnerHTML={{ __html: stat.sub }}
                />
              </LiquidGlass>
            </motion.div>
          );
        })}
      </div>

      {/* Curated visual stories grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {INSTAGRAM_STORIES.map((item, i) => {
          const Icon = item.icon;

          return (
            <motion.a
              key={item.id}
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ ...SPRING, delay: i * 0.05 }}
              className="group block"
              aria-label={`View Instagram highlight: ${item.title}`}
            >
              <LiquidGlass
                elevation={2}
                tint="neutral"
                radius={14}
                dynamicLight={false}
                className="p-5 h-full flex flex-col justify-between hover:border-white/20 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono font-medium text-[var(--accent-primary)] px-2 py-0.5 rounded-sm bg-white/5 border border-white/8">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] flex items-center gap-1">
                      <MapPin size={10} aria-hidden="true" />
                      <span>{item.location}</span>
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-2 mb-2 mt-2">
                    <h3 className="font-semibold text-white group-hover:text-[var(--accent-primary)] transition-colors text-sm md:text-base leading-snug">
                      {item.title}
                    </h3>
                    <ArrowUpRight
                      size={14}
                      className="text-[var(--text-muted)] group-hover:text-white transition-colors flex-shrink-0 mt-1"
                      aria-hidden="true"
                    />
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/8 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[var(--text-muted)]">
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-1.5 py-0.5 rounded-xs bg-white/4 text-[var(--text-tertiary)] border border-white/6"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className="text-[11px] text-[var(--text-muted)] group-hover:text-[#e1306c] flex items-center gap-1 transition-colors">
                    <Instagram size={11} aria-hidden="true" />
                    <span>View Story</span>
                  </span>
                </div>
              </LiquidGlass>
            </motion.a>
          );
        })}
      </div>
    </section>
  );
}
