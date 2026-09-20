import React, { useRef } from 'react';
import { Activity, Zap } from 'lucide-react';
import { motion, useInView } from 'motion/react';

interface ActiveInitiative {
  title: string;
  focus: string;
  description: string;
  status: string;
  technologies: string[];
}

const activeInitiatives: ActiveInitiative[] = [
  {
    title: 'CodeClash AI — Evaluator Microservice',
    focus: 'Execution Guardrails',
    description: 'Refining the FastAPI evaluation service with execution timeout limits, resource constraints, and structured test evaluation payloads for competitive coding matches.',
    status: 'Iterating',
    technologies: ['FastAPI', 'Python', 'Supabase', 'Next.js']
  },
  {
    title: 'Numora PWA — Batch Analysis Engine',
    focus: 'Client-Side Performance',
    description: 'Exploring Web Worker offloading for bulk 10-digit number scanning, keeping the main UI thread responsive during multi-number pattern evaluation.',
    status: 'Exploring',
    technologies: ['TypeScript', 'Web Workers', 'PWA', 'Vitest']
  },
  {
    title: 'Algorithmic Problem Solving (NeetCode 150)',
    focus: 'Algorithms & Complexity',
    description: 'Systematic implementation of core algorithmic patterns in Python, focusing on optimal time/space complexity across graphs, dynamic programming, and heaps.',
    status: 'Active Practice',
    technologies: ['Python', 'Data Structures', 'Algorithms', 'Complexity Analysis']
  }
];

export const CurrentlyBuilding: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.05 });

  return (
    <section
      id="building"
      ref={sectionRef}
      className="section"
      style={{ backgroundColor: 'var(--bg-surface)' }}
      aria-labelledby="building-title"
    >
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, type: 'spring', stiffness: 240, damping: 24 }}
        >
          <div className="section-label" style={{ color: 'var(--accent-emerald)' }}>
            <Activity size={14} aria-hidden="true" />
            <span>Active Initiatives</span>
          </div>
          <h2 id="building-title" className="section-title">Currently Building</h2>
          <p className="section-subtitle">
            What I am actively shipping and exploring this month — a live signal of technical depth and momentum.
          </p>
        </motion.div>

        <div className="building-grid">
          {activeInitiatives.map((item, i) => (
            <motion.div
              key={i}
              className="building-card card-surface"
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + (i + 1) * 0.08, type: 'spring', stiffness: 240, damping: 24 }}
            >
              <div className="building-card-header">
                <motion.span
                  className="badge badge-emerald"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span
                    className="animate-status-pulse"
                    style={{ width: '6px', height: '6px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--accent-emerald)', flexShrink: 0 }}
                    aria-hidden="true"
                  />
                  {item.status}
                </motion.span>
                <span className="building-focus">{item.focus}</span>
              </div>

              <h3 className="building-title">{item.title}</h3>
              <p className="building-desc">{item.description}</p>

              <div className="building-tech" aria-label="Technologies">
                <Zap size={11} style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
                {item.technologies.map((t) => (
                  <span key={t} className="building-tech-pill">{t}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .building-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
          gap: var(--space-5);
        }

        .building-card {
          display: flex;
          flex-direction: column;
          padding: var(--space-5);
          background-color: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xl);
          transition: transform var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out);
        }

        .building-card:hover {
          border-color: var(--border-medium);
          transform: translateY(-3px);
          box-shadow: var(--shadow-spatial);
        }

        .building-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-3);
          gap: var(--space-2);
          flex-wrap: wrap;
        }

        .building-focus {
          font-size: var(--text-2xs);
          font-weight: 600;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: var(--tracking-wider);
          font-family: var(--font-mono);
        }

        .building-title {
          font-size: var(--text-lg);
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: var(--tracking-tight);
          margin-bottom: var(--space-2);
          line-height: var(--leading-snug);
        }

        .building-desc {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          line-height: var(--leading-relaxed);
          flex: 1;
          margin-bottom: var(--space-4);
        }

        .building-tech {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--space-1-5);
          border-top: 1px solid var(--border-subtle);
          padding-top: var(--space-4);
        }

        .building-tech-pill {
          font-size: var(--text-2xs);
          font-family: var(--font-mono);
          padding: 2px 7px;
          border-radius: var(--radius-xs);
          background-color: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
        }
      `}</style>
    </section>
  );
};
