import React, { useRef } from 'react';
import { motion, useInView, useScroll, useSpring } from 'motion/react';
import { Milestone, Sparkles } from 'lucide-react';
import { journeyData } from '../../data/journey';
import { SpotlightCard } from '../common/SpotlightCard';

export const JourneySection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.05 });

  // Real-time scroll-driven laser progress line
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 65%', 'end 85%'],
  });
  const spineScale = useSpring(scrollYProgress, { stiffness: 180, damping: 28 });

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="section"
      style={{ backgroundColor: 'var(--bg-surface)' }}
      aria-labelledby="journey-title"
    >
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-label">
            <Milestone size={14} style={{ color: 'var(--brand-sky)' }} aria-hidden="true" />
            <span className="animate-rainbow-text font-bold">Growth &amp; Trajectory</span>
          </div>
          <h2 id="journey-title" className="section-title">Engineering Journey</h2>
          <p className="section-subtitle">
            A transparent evolution — from early interactive simulations to distributed backends, applied ML, and B.Tech CSE (AI/ML) studies.
          </p>
        </motion.div>

        <div className="journey-timeline" aria-label="Engineering timeline">
          {/* Static Background Rail */}
          <div
            aria-hidden="true"
            className="journey-spine-rail"
            style={{
              position: 'absolute',
              left: '11px',
              top: '8px',
              bottom: '8px',
              width: '3px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '2px',
            }}
          />

          {/* Animated Glowing Laser Spine driven directly by Scroll Progress */}
          <motion.div
            aria-hidden="true"
            className="journey-spine-track"
            style={{
              position: 'absolute',
              left: '11px',
              top: '8px',
              bottom: '8px',
              width: '3px',
              background: 'linear-gradient(to bottom, #38bdf8 0%, #6366f1 60%, #818cf8 100%)',
              borderRadius: '2px',
              transformOrigin: 'top',
              scaleY: spineScale,
              boxShadow: '0 0 16px rgba(56, 189, 248, 0.6), 0 0 32px rgba(99, 102, 241, 0.4)',
            }}
          >
            {/* Travelling Neon Laser Pulse */}
            <div className="journey-laser-pulse" />
          </motion.div>

          {journeyData.map((milestone, i) => (
            <motion.div
              key={milestone.id}
              className="journey-item"
              initial={{ opacity: 0, x: -35 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{
                delay: 0.28 + i * 0.12,
                type: 'spring',
                stiffness: 220,
                damping: 24,
              }}
            >
              {/* Marker with Concentric Radar Wave */}
              <div className="journey-marker" aria-hidden="true">
                <div className="journey-radar-ring" />
                <motion.div
                  className="journey-dot"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: 0.35 + i * 0.12, type: 'spring', stiffness: 450, damping: 18 }}
                />
              </div>

              {/* Journey Content Card wrapped in SpotlightCard */}
              <SpotlightCard
                spotlightColor="rgba(0, 240, 255, 0.16)"
                borderColor="rgba(79, 107, 255, 0.42)"
                className="journey-card-wrapper"
              >
                {/* Date header */}
                <div className="journey-meta">
                  <span className="journey-year">{milestone.year}</span>
                  <span className="badge badge-cyan">{milestone.period}</span>
                </div>

                <h3 className="journey-title-text">{milestone.title}</h3>
                <p className="journey-desc">{milestone.description}</p>

                <div className="journey-takeaway">
                  <Sparkles size={13} style={{ color: 'var(--neon-cyan)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span className="journey-takeaway-label">Core Takeaway: </span>
                    <span>{milestone.keyOutcome}</span>
                  </div>
                </div>

                <div className="journey-tech" aria-label="Technologies">
                  {milestone.technologies.map((tech) => (
                    <motion.span
                      key={tech}
                      className="journey-tech-pill"
                      whileHover={{ scale: 1.1, color: '#38bdf8', borderColor: '#38bdf8' }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .journey-timeline {
          position: relative;
          max-width: 820px;
          display: flex;
          flex-direction: column;
          gap: var(--space-10);
        }

        .journey-timeline::before {
          display: none;
        }

        .journey-laser-pulse {
          position: absolute;
          top: 0;
          left: -2px;
          width: 7px;
          height: 90px;
          background: linear-gradient(to bottom, transparent, #ffffff, #38bdf8, transparent);
          border-radius: var(--radius-full);
          filter: blur(1px);
          animation: laser-beam 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .journey-item {
          display: flex;
          gap: var(--space-5);
          position: relative;
        }

        .journey-marker {
          flex-shrink: 0;
          display: flex;
          align-items: flex-start;
          padding-top: 18px;
          position: relative;
          z-index: 2;
        }

        .journey-radar-ring {
          position: absolute;
          top: 14px;
          left: -4px;
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          background-color: rgba(0, 240, 255, 0.2);
          animation: radar-pulse-multi 2.4s cubic-bezier(0.16, 1, 0.3, 1) infinite;
          pointer-events: none;
        }

        .journey-dot {
          width: 24px;
          height: 24px;
          border-radius: var(--radius-full);
          background-color: var(--bg-surface);
          border: 3px solid var(--neon-cyan);
          box-shadow: 0 0 14px var(--neon-cyan);
          position: relative;
          z-index: 3;
        }

        .journey-card-wrapper {
          flex: 1;
          padding: var(--space-6);
          background-color: var(--bg-surface-elevated);
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-subtle);
          box-shadow: var(--shadow-sm);
        }

        .journey-meta {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-bottom: var(--space-2);
          flex-wrap: wrap;
        }

        .journey-year {
          font-size: var(--text-base);
          font-weight: 800;
          color: var(--neon-cyan);
          font-family: var(--font-mono);
          text-shadow: 0 0 12px rgba(0, 240, 255, 0.4);
        }

        .journey-title-text {
          font-size: var(--text-xl);
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: var(--tracking-tight);
          margin-bottom: var(--space-2);
        }

        .journey-desc {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          line-height: var(--leading-relaxed);
          margin-bottom: var(--space-4);
        }

        .journey-takeaway {
          display: flex;
          align-items: flex-start;
          gap: var(--space-2-5);
          font-size: var(--text-xs);
          color: var(--text-secondary);
          background-color: var(--bg-app);
          border: 1px solid var(--border-subtle);
          border-left: 3px solid var(--neon-cyan);
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
          padding: var(--space-2-5) var(--space-3-5);
          margin-bottom: var(--space-4);
          line-height: var(--leading-snug);
        }

        .journey-takeaway-label {
          font-weight: 700;
          color: var(--neon-cyan);
        }

        .journey-tech {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-1-5);
        }

        .journey-tech-pill {
          font-size: var(--text-2xs);
          font-family: var(--font-mono);
          padding: 3px 9px;
          border-radius: var(--radius-xs);
          background-color: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          color: var(--text-tertiary);
          cursor: default;
          transition: border-color 0.2s, color 0.2s;
        }
      `}</style>
    </section>
  );
};

export default JourneySection;
