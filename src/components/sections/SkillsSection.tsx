import React, { useState, useRef } from 'react';
import { Cpu, Terminal, Globe, Server, Wrench, CheckCircle2 } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import { SpotlightCard } from '../common/SpotlightCard';

interface StratumTheme {
  spotlight: string;
  border: string;
  accent: string;
  bgSubtle: string;
}

const STRATA_THEMES: Record<string, StratumTheme> = {
  languages: {
    spotlight: 'rgba(56, 189, 248, 0.18)',
    border: 'rgba(56, 189, 248, 0.45)',
    accent: '#38bdf8',
    bgSubtle: 'rgba(56, 189, 248, 0.10)',
  },
  frontend: {
    spotlight: 'rgba(99, 102, 241, 0.18)',
    border: 'rgba(99, 102, 241, 0.45)',
    accent: '#6366f1',
    bgSubtle: 'rgba(99, 102, 241, 0.10)',
  },
  backend: {
    spotlight: 'rgba(129, 140, 248, 0.18)',
    border: 'rgba(129, 140, 248, 0.45)',
    accent: '#818cf8',
    bgSubtle: 'rgba(129, 140, 248, 0.10)',
  },
  tooling: {
    spotlight: 'rgba(16, 185, 129, 0.18)',
    border: 'rgba(16, 185, 129, 0.45)',
    accent: '#10b981',
    bgSubtle: 'rgba(16, 185, 129, 0.10)',
  },
};

const TECH_STRATA = [
  {
    id: 'languages',
    title: 'Languages & Computing Logic',
    icon: <Terminal size={15} aria-hidden="true" />,
    items: [
      { name: 'Python', role: 'Backend & Data Pipelines', verifiedIn: 'InsiderTracker, StockScreener, NeetCode 150' },
      { name: 'TypeScript', role: 'Type-Safe Systems & PWA', verifiedIn: 'Numora, CodeClash AI, Oweo' },
      { name: 'JavaScript (ESNext)', role: 'Web & Visuals', verifiedIn: 'BreakoutScanner, Canvas simulations' },
      { name: 'C / C++', role: 'Systems Coursework & Memory', verifiedIn: 'Academic DSA & Low-Level Labs' },
      { name: 'SQL', role: 'Relational Schemas & Indexing', verifiedIn: 'SQLite, Supabase PostgreSQL' },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend & Client-Side Engines',
    icon: <Globe size={15} aria-hidden="true" />,
    items: [
      { name: 'React 19 / 18', role: 'Concurrent UI Architecture', verifiedIn: 'Numora, Portfolio, Oweo' },
      { name: 'Next.js (App Router)', role: 'Server Components & SSR', verifiedIn: 'CodeClash AI (MVP), AURA Storefront' },
      { name: 'Three.js / WebGL', role: '3D Coordinate Visualizations', verifiedIn: 'Portfolio 3D Core, BreakoutScanner' },
      { name: 'Progressive Web Apps (PWA)', role: 'Offline-First & Caching', verifiedIn: 'Numora PWA, Oweo PWA' },
      { name: 'Tailwind CSS', role: 'Design Tokens & Responsive Layouts', verifiedIn: 'Numora, InsiderTracker, AURA' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend, APIs & Real-Time',
    icon: <Server size={15} aria-hidden="true" />,
    items: [
      { name: 'FastAPI (Python)', role: 'High-Concurrency Async APIs', verifiedIn: 'InsiderTracker, CodeClash Evaluator' },
      { name: 'WebSockets', role: 'Sub-Second Streaming Protocols', verifiedIn: 'Real-Time StockScreener' },
      { name: 'Node.js & Express', role: 'API Proxies & In-Memory Caches', verifiedIn: 'BreakoutScanner Backend' },
      { name: 'Supabase Realtime', role: 'Real-Time Match Synchronization', verifiedIn: 'CodeClash AI 1v1 Arena' },
      { name: 'SQLite / PostgreSQL', role: 'Embedded & Relational Storage', verifiedIn: 'BilingSystem, Supabase' },
    ],
  },
  {
    id: 'tooling',
    title: 'Tooling, Testing & Verification',
    icon: <Wrench size={15} aria-hidden="true" />,
    items: [
      { name: 'Vitest / Unit Testing', role: 'Test-Driven Calculation Engines', verifiedIn: 'Numora Core Engine (100% Spec)' },
      { name: 'Git & GitHub', role: 'Transparent Version Control', verifiedIn: '52 Public Repositories (@Parthparthu)' },
      { name: 'Vite / Rollup', role: 'Module Bundling & Chunk Splitting', verifiedIn: 'Modern SPA Build Tooling' },
      { name: 'Zod / Data Contracts', role: 'Strict Schema Validation', verifiedIn: 'Contact Forms & API Schemas' },
    ],
  },
];

export const SkillsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.05 });
  const [activeTech, setActiveTech] = useState<string | null>(null);

  return (
    <section id="skills" ref={sectionRef} className="section" aria-labelledby="skills-title">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-label">
            <Cpu size={14} style={{ color: 'var(--neon-cyan)' }} aria-hidden="true" />
            <span className="animate-rainbow-text font-bold">Technical Schematic Map</span>
          </div>
          <h2 id="skills-title" className="section-title">
            Skills &amp; Architecture Map
          </h2>
          <p className="section-subtitle">
            An interactive schematic of verified technical capabilities. Every technology maps to public, inspectable code on GitHub.
          </p>
        </motion.div>

        {/* Spatial Architecture Schematic Grid with Bento Spotlight Cards */}
        <motion.div
          className="schematic-map-grid"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {TECH_STRATA.map((stratum) => {
            const theme = STRATA_THEMES[stratum.id] || {
              spotlight: 'rgba(99, 102, 241, 0.2)',
              border: 'rgba(99, 102, 241, 0.5)',
              accent: '#6366f1',
              bgSubtle: 'rgba(99, 102, 241, 0.12)',
            };

            return (
              <motion.div
                key={stratum.id}
                variants={{
                  hidden: { opacity: 0, y: 32, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 220, damping: 24 } },
                }}
                style={{ height: '100%' }}
              >
                <SpotlightCard
                  spotlightColor={theme.spotlight}
                  borderColor={theme.border}
                  className="schematic-stratum"
                  style={{ height: '100%' }}
                >
                {/* Stratum Header */}
                <div className="stratum-header">
                  <div
                    className="stratum-icon-wrap"
                    style={{
                      backgroundColor: theme.bgSubtle,
                      color: theme.accent,
                      boxShadow: `0 0 16px ${theme.bgSubtle}`,
                    }}
                    aria-hidden="true"
                  >
                    {stratum.icon}
                  </div>
                  <h3 className="stratum-title">{stratum.title}</h3>
                  <span className="stratum-count" style={{ color: theme.accent }}>
                    {stratum.items.length} skills
                  </span>
                </div>

                {/* Stratum Nodes List */}
                <div className="stratum-nodes">
                  {stratum.items.map((tech) => {
                    const isSelected = activeTech === tech.name;
                    return (
                      <motion.div
                        key={tech.name}
                        onMouseEnter={() => setActiveTech(tech.name)}
                        onMouseLeave={() => setActiveTech(null)}
                        onFocus={() => setActiveTech(tech.name)}
                        onBlur={() => setActiveTech(null)}
                        tabIndex={0}
                        className={`schematic-node-card${isSelected ? ' is-active' : ''}`}
                        whileHover={{ y: -2, x: 2, borderColor: theme.accent, boxShadow: `0 4px 20px ${theme.bgSubtle}` }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                      >
                        <div className="node-card-top">
                          <span className="node-name" style={{ color: isSelected ? theme.accent : undefined }}>
                            {tech.name}
                          </span>
                          <motion.span
                            className="node-badge"
                            style={{
                              backgroundColor: theme.bgSubtle,
                              color: theme.accent,
                              borderColor: `${theme.accent}50`,
                            }}
                            animate={isSelected ? { scale: [1, 1.15, 1] } : {}}
                            transition={{ duration: 0.4, repeat: isSelected ? Infinity : 0, repeatDelay: 1.2 }}
                          >
                            <CheckCircle2 size={11} aria-hidden="true" />
                            <span>verified</span>
                          </motion.span>
                        </div>
                        <div className="node-role">{tech.role}</div>
                        <div className="node-proof">
                          <span className="proof-label" style={{ color: theme.accent }}>
                            Proof:
                          </span>{' '}
                          {tech.verifiedIn}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </SpotlightCard>
            </motion.div>
          );
        })}
        </motion.div>
      </div>

      <style>{`
        .schematic-map-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 270px), 1fr));
          gap: var(--space-6);
        }

        .schematic-stratum {
          display: flex;
          flex-direction: column;
          padding: var(--space-5);
          background-color: var(--bg-surface);
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-subtle);
          box-shadow: var(--shadow-sm);
        }

        .stratum-header {
          display: flex;
          align-items: center;
          gap: var(--space-2-5, 0.625rem);
          padding-bottom: var(--space-4);
          margin-bottom: var(--space-4);
          border-bottom: 1px solid var(--border-subtle);
        }

        .stratum-icon-wrap {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }

        .schematic-stratum:hover .stratum-icon-wrap {
          transform: scale(1.1);
        }

        .stratum-title {
          font-size: var(--text-sm);
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: var(--tracking-snug);
          flex: 1;
        }

        .stratum-count {
          font-size: 11px;
          font-family: var(--font-mono);
          font-weight: 600;
        }

        .stratum-nodes {
          display: flex;
          flex-direction: column;
          gap: var(--space-2-5, 0.625rem);
        }

        .schematic-node-card {
          padding: var(--space-3);
          background-color: var(--bg-app);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 3px;
          cursor: pointer;
          outline: none;
          transition:
            background-color var(--duration-fast),
            border-color var(--duration-fast),
            box-shadow var(--duration-fast);
        }

        .schematic-node-card:hover,
        .schematic-node-card:focus-visible,
        .schematic-node-card.is-active {
          background-color: var(--bg-surface-elevated);
        }

        .schematic-node-card:focus-visible {
          outline: 2px solid var(--border-focus);
        }

        .node-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-2);
        }

        .node-name {
          font-size: var(--text-xs);
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: var(--tracking-snug);
          transition: color 0.2s ease;
        }

        .node-badge {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 10px;
          font-family: var(--font-mono);
          padding: 1px 6px;
          border-radius: var(--radius-xs);
          border: 1px solid transparent;
          font-weight: 600;
        }

        .node-role {
          font-size: 11px;
          color: var(--text-secondary);
          line-height: var(--leading-normal);
        }

        .node-proof {
          font-size: 10px;
          color: var(--text-tertiary);
          font-family: var(--font-mono);
          line-height: 1.3;
          margin-top: 2px;
        }

        .proof-label {
          font-weight: 600;
        }
      `}</style>
    </section>
  );
};

export default SkillsSection;
