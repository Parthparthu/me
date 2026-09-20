import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Award, BrainCircuit, Medal, Sparkles, BookOpen, GitBranch } from 'lucide-react';
import { achievementsData } from '../../data/achievements';
import { SpotlightCard } from '../common/SpotlightCard';

export const AchievementsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.05 });
  const memoryAchievement = achievementsData.find((a) => a.id === 'wmc-bronze');
  const secondaryAchievements = achievementsData.filter((a) => a.id !== 'wmc-bronze');

  return (
    <section
      id="achievements"
      ref={sectionRef}
      className="section"
      aria-labelledby="achievements-title"
    >
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-label">
            <Award size={14} style={{ color: 'var(--neon-gold)' }} aria-hidden="true" />
            <span className="animate-rainbow-text font-bold">Cognitive Discipline &amp; Honors</span>
          </div>
          <h2 id="achievements-title" className="section-title">
            Distinctions &amp; Mental Discipline
          </h2>
          <p className="section-subtitle">
            High-intensity cognitive training, academic rigor, and verifiable engineering track record.
          </p>
        </motion.div>

        {/* Featured Spotlight: World Memory Championship Bronze Medal */}
        {memoryAchievement && (
          <SpotlightCard
            spotlightColor="rgba(251, 191, 36, 0.28)"
            borderColor="rgba(251, 191, 36, 0.65)"
            className="memory-spotlight-card"
            style={{ marginBottom: 'var(--space-8)' }}
          >
            <div className="spotlight-left">
              <div className="spotlight-badge-row">
                <motion.span
                  className="badge badge-neon-amber spotlight-medal-badge"
                  animate={{ boxShadow: ['0 0 10px rgba(251,191,36,0.3)', '0 0 28px rgba(251,191,36,0.7)', '0 0 10px rgba(251,191,36,0.3)'] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Medal size={15} style={{ color: '#fbbf24' }} aria-hidden="true" />
                  <span>World Memory Championship · Bronze Medalist</span>
                </motion.span>
                <span className="spotlight-year">2021 International Competition</span>
              </div>

              <h3 className="spotlight-title">{memoryAchievement.title}</h3>
              <p className="spotlight-org" style={{ color: 'var(--neon-gold)' }}>{memoryAchievement.organization}</p>
              <p className="spotlight-summary">{memoryAchievement.summary}</p>

              <div className="spotlight-pillars">
                <div className="pillar-item">
                  <span className="pillar-name" style={{ color: '#fbbf24' }}>Spatial Indexing</span>
                  <span className="pillar-desc">Method of Loci (Memory Palaces) for structured mental storage</span>
                </div>
                <div className="pillar-item">
                  <span className="pillar-name" style={{ color: '#fbbf24' }}>Sustained Bandwidth</span>
                  <span className="pillar-desc">High-speed cognitive retention under timed competitive pressure</span>
                </div>
              </div>
            </div>

            <div className="spotlight-right">
              <div className="spotlight-relevance-box">
                <div className="relevance-box-header">
                  <BrainCircuit size={17} style={{ color: 'var(--neon-gold)' }} aria-hidden="true" />
                  <span style={{ color: 'var(--neon-gold)' }}>Engineering Relevance</span>
                </div>
                <p className="relevance-box-text">
                  Memory sports demand rigorous structural discipline, spatial data indexing, rapid error-checking, and sustained high-bandwidth concentration—the exact cognitive attributes required for holding complex, multi-service architectures and algorithmic state transitions clearly in mind during deep debugging sessions.
                </p>
              </div>
            </div>
          </SpotlightCard>
        )}

        {/* Secondary Achievements Grid with Bento Spotlight */}
        <div className="secondary-achievements-grid">
          {secondaryAchievements.map((item, i) => (
            <SpotlightCard
              key={item.id}
              spotlightColor={i % 2 === 0 ? 'rgba(0, 240, 255, 0.2)' : 'rgba(168, 85, 247, 0.2)'}
              borderColor={i % 2 === 0 ? 'rgba(0, 240, 255, 0.45)' : 'rgba(168, 85, 247, 0.45)'}
              className="secondary-achieve-card"
            >
              <div className="secondary-achieve-header">
                <div
                  className="secondary-achieve-icon"
                  style={{
                    color: i % 2 === 0 ? 'var(--neon-cyan)' : 'var(--neon-purple)',
                    backgroundColor: i % 2 === 0 ? 'rgba(0, 240, 255, 0.12)' : 'rgba(168, 85, 247, 0.12)',
                    boxShadow: i % 2 === 0 ? '0 0 16px rgba(0, 240, 255, 0.25)' : '0 0 16px rgba(168, 85, 247, 0.25)',
                  }}
                  aria-hidden="true"
                >
                  {item.id === 'academic-merit' ? <BookOpen size={16} /> : <GitBranch size={16} />}
                </div>
                <span className="secondary-achieve-year">{item.year}</span>
              </div>

              <h4 className="secondary-achieve-title">{item.title}</h4>
              <p className="secondary-achieve-org">{item.organization}</p>
              <p className="secondary-achieve-summary">{item.summary}</p>

              <div className="secondary-achieve-footer">
                <Sparkles size={12} style={{ color: 'var(--neon-cyan)' }} aria-hidden="true" />
                <span>{item.engineeringRelevance}</span>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>

      <style>{`
        .memory-spotlight-card {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-8);
          padding: clamp(var(--space-6), 4vw, var(--space-8));
          background: radial-gradient(ellipse 80% 60% at 0% 0%, rgba(251, 191, 36, 0.12) 0%, var(--bg-surface) 65%);
          border-radius: var(--radius-2xl);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6), 0 0 35px rgba(251, 191, 36, 0.15);
        }

        @media (min-width: 960px) {
          .memory-spotlight-card {
            grid-template-columns: 1.2fr 0.8fr;
            align-items: center;
          }
        }

        .spotlight-badge-row {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          flex-wrap: wrap;
          margin-bottom: var(--space-3);
        }

        .spotlight-medal-badge {
          display: inline-flex;
          align-items: center;
          gap: var(--space-1-5);
          font-weight: 700;
          font-size: var(--text-xs);
          padding: var(--space-1) var(--space-3-5);
          border-radius: var(--radius-full);
        }

        .spotlight-year {
          font-size: var(--text-xs);
          font-family: var(--font-mono);
          color: var(--text-muted);
        }

        .spotlight-title {
          font-size: clamp(var(--text-xl), 2.5vw, var(--text-2xl));
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: var(--tracking-tight);
          margin-bottom: var(--space-1);
        }

        .spotlight-org {
          font-size: var(--text-xs);
          font-weight: 600;
          margin-bottom: var(--space-3);
        }

        .spotlight-summary {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          line-height: var(--leading-relaxed);
          margin-bottom: var(--space-6);
        }

        .spotlight-pillars {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
          gap: var(--space-3);
        }

        .pillar-item {
          background-color: var(--bg-app);
          border: 1px solid rgba(251, 191, 36, 0.2);
          border-radius: var(--radius-md);
          padding: var(--space-2-5, 0.625rem) var(--space-3);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .pillar-name {
          font-size: 11px;
          font-weight: 700;
        }

        .pillar-desc {
          font-size: 10px;
          color: var(--text-tertiary);
          line-height: 1.35;
        }

        .spotlight-relevance-box {
          background-color: var(--bg-surface-elevated);
          border: 1px solid rgba(251, 191, 36, 0.3);
          border-left: 3px solid var(--neon-gold);
          border-radius: var(--radius-lg);
          padding: var(--space-6);
          box-shadow: 0 0 25px rgba(251, 191, 36, 0.08);
        }

        .relevance-box-header {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-xs);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: var(--tracking-wider);
          margin-bottom: var(--space-2);
        }

        .relevance-box-text {
          font-size: var(--text-xs);
          color: var(--text-secondary);
          line-height: var(--leading-relaxed);
          margin: 0;
        }

        .secondary-achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
          gap: var(--space-6);
        }

        .secondary-achieve-card {
          display: flex;
          flex-direction: column;
          padding: var(--space-5);
          background-color: var(--bg-surface);
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-subtle);
        }

        .secondary-achieve-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-3);
        }

        .secondary-achieve-icon {
          width: 34px;
          height: 34px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .secondary-achieve-year {
          font-size: var(--text-xs);
          font-family: var(--font-mono);
          color: var(--text-muted);
        }

        .secondary-achieve-title {
          font-size: var(--text-base);
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: var(--space-1);
        }

        .secondary-achieve-org {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
          margin-bottom: var(--space-2);
        }

        .secondary-achieve-summary {
          font-size: var(--text-xs);
          color: var(--text-secondary);
          line-height: var(--leading-relaxed);
          margin-bottom: var(--space-4);
          flex: 1;
        }

        .secondary-achieve-footer {
          display: flex;
          align-items: flex-start;
          gap: var(--space-2);
          font-size: 11px;
          color: var(--text-tertiary);
          border-top: 1px solid var(--border-subtle);
          padding-top: var(--space-3);
          line-height: var(--leading-normal);
        }
      `}</style>
    </section>
  );
};

export default AchievementsSection;
