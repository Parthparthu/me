import React, { useRef } from 'react';
import { User, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import { profileData } from '../../data/profile';
import { SpotlightCard } from '../common/SpotlightCard';

export const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const quoteText =
    '\u201cBuilding software from first principles\u2014understanding how data flows at the protocol level, while obsessing over client performance, accessibility, and intuitive interaction.\u201d';
  const words = quoteText.split(' ');

  return (
    <section
      id="about"
      ref={sectionRef}
      className="about-spatial-section section"
      aria-labelledby="about-title"
    >
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-label">
            <User size={14} style={{ color: 'var(--neon-pink)' }} aria-hidden="true" />
            <span className="animate-rainbow-text font-bold">Identity &amp; Engineering Philosophy</span>
          </div>
          <h2 id="about-title" className="section-title">
            About Pradyumna
          </h2>
          <p className="about-editorial-lead" style={{ overflow: 'hidden' }}>
            {words.map((word, i) => (
              <motion.span
                key={i}
                style={{ display: 'inline-block', marginRight: '0.3em' }}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  delay: 0.2 + i * 0.03,
                  type: 'spring',
                  stiffness: 250,
                  damping: 25,
                }}
              >
                {word}
              </motion.span>
            ))}
          </p>
        </motion.div>

        <div className="about-spatial-grid">
          {/* Main Narrative Column */}
          <motion.div
            className="about-narrative"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {profileData.fullBio.map((para, i) => (
              <p key={i} className="narrative-paragraph">
                {para}
              </p>
            ))}
          </motion.div>

          {/* Side Focus Column with Bento Spotlight Cards */}
          <div className="about-meta-column">
            {/* Education Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 25 }}
            >
              <SpotlightCard
                spotlightColor="rgba(0, 240, 255, 0.2)"
                borderColor="rgba(0, 240, 255, 0.45)"
                className="about-info-card"
              >
                <div className="info-card-header">
                  <BookOpen size={16} style={{ color: 'var(--neon-cyan)' }} aria-hidden="true" />
                  <h3 className="info-card-title">Academic Foundation</h3>
                </div>
                <div className="edu-degree">{profileData.education.degree}</div>
                <div className="edu-major" style={{ color: 'var(--neon-cyan)' }}>{profileData.education.major}</div>
                <div className="edu-institution">
                  {profileData.education.institution} &middot; {profileData.education.location}
                </div>
                <p className="edu-description">{profileData.education.description}</p>
              </SpotlightCard>
            </motion.div>

            {/* Active Focus Areas */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.45, type: 'spring', stiffness: 200, damping: 25 }}
            >
              <SpotlightCard
                spotlightColor="rgba(16, 185, 129, 0.2)"
                borderColor="rgba(16, 185, 129, 0.45)"
                className="about-info-card"
              >
                <div className="info-card-header">
                  <Layers size={16} style={{ color: 'var(--neon-emerald)' }} aria-hidden="true" />
                  <h3 className="info-card-title">Architectural Focus</h3>
                </div>
                <ul className="focus-list" aria-label="Core engineering focus areas">
                  {profileData.focusAreas.map((area, i) => (
                    <li key={i} className="focus-item">
                      <CheckCircle2 size={14} style={{ color: 'var(--neon-emerald)', flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        .about-spatial-section {
          background-color: var(--bg-surface);
          border-top: 1px solid var(--border-subtle);
          border-bottom: 1px solid var(--border-subtle);
        }

        .about-editorial-lead {
          font-size: clamp(var(--text-base), 1.6vw, var(--text-xl));
          color: var(--text-primary);
          font-weight: 500;
          font-style: italic;
          max-width: 65ch;
          line-height: var(--leading-relaxed);
          margin-top: var(--space-3);
          border-left: 2px solid var(--neon-cyan);
          padding-left: var(--space-4);
        }

        .about-spatial-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-8);
        }

        @media (min-width: 900px) {
          .about-spatial-grid {
            grid-template-columns: 1.15fr 0.85fr;
            align-items: flex-start;
            gap: var(--space-10);
          }
        }

        .about-narrative {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .narrative-paragraph {
          font-size: var(--text-base);
          line-height: var(--leading-relaxed);
          color: var(--text-secondary);
          margin: 0;
        }

        .about-meta-column {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        .about-info-card {
          padding: var(--space-6);
          border-radius: var(--radius-xl);
          background-color: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
        }

        .info-card-header {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-3);
          padding-bottom: var(--space-2);
          border-bottom: 1px solid var(--border-subtle);
        }

        .info-card-title {
          font-size: var(--text-sm);
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: var(--tracking-snug);
        }

        .edu-degree {
          font-size: var(--text-sm);
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 2px;
        }

        .edu-major {
          font-size: var(--text-xs);
          font-weight: 600;
          margin-bottom: var(--space-1);
        }

        .edu-institution {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
          margin-bottom: var(--space-3);
        }

        .edu-description {
          font-size: var(--text-xs);
          color: var(--text-secondary);
          line-height: var(--leading-relaxed);
          margin: 0;
        }

        .focus-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-2-5, 0.625rem);
        }

        .focus-item {
          display: flex;
          align-items: flex-start;
          gap: var(--space-2);
          font-size: var(--text-xs);
          color: var(--text-secondary);
          line-height: var(--leading-normal);
        }
      `}</style>
    </section>
  );
};

export default AboutSection;
