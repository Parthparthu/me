import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';
import { motion, useInView, useScroll, useTransform } from 'motion/react';
import { projectsData } from '../../data/projects';
import { Project } from '../../types/project';
import { ProjectPanelHorizontal } from '../projects/ProjectPanelHorizontal';
import { SpotlightCard } from '../common/SpotlightCard';

const PANEL_SPOTLIGHTS = [
  { spotlight: 'rgba(79, 107, 255, 0.2)', border: 'rgba(79, 107, 255, 0.45)' },
  { spotlight: 'rgba(0, 240, 255, 0.2)', border: 'rgba(0, 240, 255, 0.45)' },
  { spotlight: 'rgba(129, 140, 248, 0.2)', border: 'rgba(129, 140, 248, 0.45)' },
];

interface ParallaxProjectCardProps {
  project: Project;
  reverse: boolean;
  theme: { spotlight: string; border: string };
}

const ParallaxProjectCard: React.FC<ParallaxProjectCardProps> = ({ project, reverse, theme }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  // 3D perspective dynamic tilt & entrance transforms during page scroll
  const rotateX = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [6, 0, 0, -4]);
  const scale = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [0.95, 1, 1, 0.97]);
  const y = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [50, 0, 0, -35]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.85, 1], [0.6, 1, 1, 0.7]);

  return (
    <motion.div
      ref={cardRef}
      style={{
        perspective: 1400,
        rotateX,
        scale,
        y,
        opacity,
        transformStyle: 'preserve-3d',
        marginBottom: 'var(--space-10)',
      }}
    >
      <SpotlightCard
        spotlightColor={theme.spotlight}
        borderColor={theme.border}
        className="spatial-project-panel-wrapper"
      >
        <ProjectPanelHorizontal project={project} reverse={reverse} />
      </SpotlightCard>
    </motion.div>
  );
};

export const SelectedWork: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.05 });
  const flagshipProjects = projectsData.filter((p) => p.tier === 'Tier A');

  // Subtle header scroll parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const headerY = useTransform(scrollYProgress, [0, 0.3], [30, 0]);

  return (
    <section id="projects" ref={sectionRef} className="section" aria-labelledby="selected-work-title">
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="section-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-12)',
            y: headerY,
          }}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, type: 'spring', stiffness: 240, damping: 24 }}
        >
          <div>
            <div className="section-label">
              <Layers size={14} style={{ color: '#00f0ff' }} aria-hidden="true" />
              <span className="animate-rainbow-text font-bold">Flagship Engineering</span>
            </div>
            <h2 id="selected-work-title" className="section-title">
              Selected Work
            </h2>
            <p className="section-subtitle">
              Production systems, client-side PWA engines, and real-time financial pipelines. Each project represents an authentic solution to a concrete problem.
            </p>
          </div>

          <Link
            to="/projects"
            className="btn btn-ghost hero-btn-secondary"
            style={{ flexShrink: 0, gap: 'var(--space-2)' }}
          >
            <Sparkles size={14} style={{ color: '#00f0ff' }} aria-hidden="true" />
            <span>All {projectsData.length} projects</span>
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </motion.div>

        {/* Spatial Horizontal Panels with Bento Spotlight Interaction & 3D Scroll Parallax */}
        <div className="spatial-panels-list">
          {flagshipProjects.map((project, i) => {
            const theme = PANEL_SPOTLIGHTS[i % PANEL_SPOTLIGHTS.length];
            return (
              <ParallaxProjectCard
                key={project.id}
                project={project}
                reverse={i % 2 === 1}
                theme={theme}
              />
            );
          })}
        </div>
      </div>

      <style>{`
        .spatial-project-panel-wrapper {
          border-radius: var(--radius-2xl);
          border: 1px solid var(--border-subtle);
          background-color: var(--bg-surface);
          box-shadow: var(--shadow-spatial);
          overflow: hidden;
        }

        .spatial-project-panel-wrapper:hover {
          box-shadow: 0 24px 60px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 240, 255, 0.15);
        }
      `}</style>
    </section>
  );
};

export default SelectedWork;
