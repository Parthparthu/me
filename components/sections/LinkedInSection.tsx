/**
 * LinkedInSection: Professional updates, engineering case studies, and network activity.
 * Mirrors GitHubSection in structure with liquid-glass cards, verifiable milestones, and direct profile integration.
 */
'use client';

import { motion } from 'framer-motion';
import { Linkedin, ArrowUpRight, GraduationCap, Briefcase, Award, Sparkles, Code2, Database, Brain, Globe, MessageSquare } from 'lucide-react';
import { LiquidGlass } from '@/components/glass/LiquidGlass';

const SPRING = { type: 'spring', stiffness: 280, damping: 28 } as const;

interface LinkedInHighlight {
  id: string;
  category: string;
  topic: string;
  title: string;
  summary: string;
  tags: string[];
  icon: typeof Code2;
}

const LINKEDIN_HIGHLIGHTS: LinkedInHighlight[] = [
  {
    id: 'numora-case-study',
    category: 'Engineering Architecture',
    topic: 'Web / PWA',
    title: 'Numora: Pure TypeScript Mobile-Number Reduction Engine',
    summary: 'Case study on architecting an offline-first progressive web app with custom recursive digit-sum reduction, configurable forbidden pair rules, and interactive Three.js spatial fields.',
    tags: ['React 19', 'TypeScript', 'Three.js', 'PWA'],
    icon: Code2,
  },
  {
    id: 'wmc-achievement',
    category: 'Competitive Honour',
    topic: 'World Memory Championship',
    title: 'World Memory Championship 2023: Bronze Medal (Amateur)',
    summary: 'Reflection on competing at Cidco Exhibition Centre, Navi Mumbai, and applying systematic spatial loci, speed recall, and structured pattern recognition to software debugging and data modeling.',
    tags: ['IAM Sanctioned', 'Cognitive Discipline', '2023'],
    icon: Award,
  },
  {
    id: 'insider-tracker',
    category: 'Data Engineering',
    topic: 'Financial Systems',
    title: 'InsiderTracker: SEC EDGAR Form 4 Real-Time Pipeline',
    summary: 'Building an automated pipeline in FastAPI and Python to poll SEC EDGAR XML filings, extract insider trading records, and deliver structured notifications with sub-minute latency.',
    tags: ['FastAPI', 'Python', 'SEC EDGAR', 'XML'],
    icon: Database,
  },
  {
    id: 'academic-gl-bajaj',
    category: 'Academic Milestone',
    topic: 'Undergraduate Study',
    title: 'B.Tech in CSE (AI/ML) at GL Bajaj ITM',
    summary: 'Commenced undergraduate engineering curriculum specializing in Artificial Intelligence and Machine Learning at GL Bajaj Institute of Technology & Management, Greater Noida (2026 - 2030).',
    tags: ['CSE (AI/ML)', 'GL Bajaj ITM', '2026 - 2030'],
    icon: GraduationCap,
  },
  {
    id: 'oweo-indexeddb',
    category: 'Client-Side Systems',
    topic: 'Offline-First App',
    title: 'Oweo: IndexedDB Persistence for Personal Finances',
    summary: 'Technical breakdown of building a zero-tracking personal finance PWA utilizing native browser IndexedDB, responsive budget analytics, and zero external analytical scripts.',
    tags: ['Next.js', 'IndexedDB', 'PWA', 'Tailwind'],
    icon: Globe,
  },
  {
    id: 'internship-search',
    category: 'Career Focus',
    topic: 'Opportunities',
    title: 'Seeking Software Engineering & Web Internships',
    summary: 'Actively connecting with engineering teams and startup founders for software development and web internships across Greater Noida, Noida, Delhi NCR, and remote environments.',
    tags: ['Internship', 'Delhi NCR', 'Remote', 'Frontend & Backend'],
    icon: Briefcase,
  },
];

export function LinkedInSection() {
  const profileUrl = 'https://www.linkedin.com/in/pradyumna05';

  return (
    <section
      id="linkedin"
      className="py-24 px-4 md:px-8 max-w-6xl mx-auto w-full scroll-mt-24"
      aria-label="LinkedIn Professional Activity"
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
            Professional Network
          </span>
          <h2 className="section-title text-white mt-1">
            LinkedIn Activity
          </h2>
          <p className="section-subtitle mt-2">
            Engineering case studies, project announcements, academic updates, and internship availability.
          </p>
        </motion.div>

        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/12 text-sm text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-colors w-fit min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
          aria-label="Visit Pradyuma's LinkedIn profile"
        >
          <Linkedin size={16} className="text-[#0ea5e9]" aria-hidden="true" />
          <span>in/pradyumna05</span>
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>

      {/* Profile highlights row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {[
          {
            icon: GraduationCap,
            label: 'Academic Standing',
            value: 'Batch 2030',
            sub: 'B.Tech CSE (AI/ML) &middot; GL Bajaj ITM',
            color: 'var(--accent-primary)',
          },
          {
            icon: Briefcase,
            label: 'Internship Status',
            value: 'Available',
            sub: 'Greater Noida, Noida, Delhi NCR &amp; Remote',
            color: 'var(--accent-primary)',
          },
          {
            icon: Award,
            label: 'Competitive Credential',
            value: 'WMC Bronze',
            sub: 'World Memory Championship 2023',
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
                <div className="text-2xl md:text-3xl font-bold font-mono text-white tabular-nums">
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

      {/* Curated posts and updates grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {LINKEDIN_HIGHLIGHTS.map((item, i) => {
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
              aria-label={`Read discussion: ${item.title}`}
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
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">
                      {item.topic}
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
                    {item.summary}
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

                  <span className="text-[11px] text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] flex items-center gap-1 transition-colors">
                    <Linkedin size={11} aria-hidden="true" />
                    <span>View Post</span>
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
