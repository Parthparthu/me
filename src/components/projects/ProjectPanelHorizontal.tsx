import React, { useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { GithubIcon } from '../common/Icons';
import { Project } from '../../types/project';
import { ProjectVisualizer } from './ProjectVisualizer';
import { LiveDemoModal } from './LiveDemoModal';

interface ProjectPanelHorizontalProps {
  project: Project;
  reverse?: boolean;
}

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  'Production':         { color: 'var(--accent-emerald)', label: 'Production' },
  'Active Development': { color: 'var(--accent-cyan)',    label: 'Active Dev' },
  'Completed':          { color: 'var(--accent-violet)',  label: 'Shipped' },
  'Archived':           { color: 'var(--text-muted)',     label: 'Archived' },
};

export const ProjectPanelHorizontal: React.FC<ProjectPanelHorizontalProps> = ({ project, reverse = false }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // ─── Motion values for zero re-render tilt ──────────────────────────────
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const shineX = useMotionValue(50);
  const shineY = useMotionValue(50);

  // Spring-smooth the tilt for a premium physical feel
  const springTiltX = useSpring(tiltX, { damping: 26, stiffness: 200 });
  const springTiltY = useSpring(tiltY, { damping: 26, stiffness: 200 });

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const el = panelRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    tiltX.set(-((y - rect.height / 2) / rect.height) * 3.5);
    tiltY.set(((x - rect.width / 2) / rect.width) * 3.5);
    shineX.set((x / rect.width) * 100);
    shineY.set((y / rect.height) * 100);
  }, [prefersReducedMotion, tiltX, tiltY, shineX, shineY]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    tiltX.set(0);
    tiltY.set(0);
    shineX.set(50);
    shineY.set(50);
  }, [tiltX, tiltY, shineX, shineY]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const status = STATUS_CONFIG[project.status] ?? { color: 'var(--text-muted)', label: project.status };

  return (
    <motion.article
      ref={panelRef as React.RefObject<HTMLDivElement>}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-cursor-label="OPEN"
      className={`spatial-project-panel${reverse ? ' is-reversed' : ''}`}
      style={{
        perspective: 1200,
        rotateX: springTiltX,
        rotateY: springTiltY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ y: -4 }}
      transition={{ y: { duration: 0.22, ease: 'easeOut' } }}
      aria-labelledby={`panel-title-${project.slug}`}
    >
      {/* Specular Spotlight on Hover — driven by motion values */}
      <motion.div
        className="spatial-panel-shine"
        style={{
          background: isHovered
            ? `radial-gradient(circle 380px at ${shineX.get()}% ${shineY.get()}%, rgba(79, 124, 255, 0.1), transparent 70%)`
            : 'none',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.25s ease',
        }}
        aria-hidden="true"
      />

      {/* Hover border accent */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          border: '1px solid transparent',
          backgroundImage: isHovered
            ? 'linear-gradient(var(--bg-surface), var(--bg-surface)), linear-gradient(135deg, rgba(99,102,241,0.45), rgba(56,189,248,0.35))'
            : 'none',
          backgroundClip: 'padding-box, border-box',
          backgroundOrigin: 'padding-box, border-box',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Left / Editorial Content Column */}
      <div className="spatial-panel-content">
        {/* Meta Bar */}
        <div className="spatial-panel-meta">
          <span className="badge badge-accent">{project.category}</span>
          <span className="spatial-status-pill">
            <span
              className="animate-status-pulse"
              style={{
                width: '6px',
                height: '6px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: status.color,
                display: 'inline-block'
              }}
              aria-hidden="true"
            />
            <span>{status.label}</span>
          </span>
          <span className="spatial-role-tag">{project.role}</span>
        </div>

        {/* Title & Tagline */}
        <h3 id={`panel-title-${project.slug}`} className="spatial-panel-title">
          {project.name}
        </h3>
        <p className="spatial-panel-tagline">
          {project.tagline}
        </p>

        {/* Short Architectural Description */}
        <p className="spatial-panel-desc">
          {project.shortDescription}
        </p>

        {/* Key Metrics Chips (if available) */}
        {project.caseStudy?.metrics && project.caseStudy.metrics.length > 0 && (
          <div className="spatial-metrics-strip" aria-label="Key project metrics">
            {project.caseStudy.metrics.slice(0, 3).map((m) => (
              <div key={m.label} className="spatial-metric-chip">
                <span className="metric-chip-label">{m.label}</span>
                <strong className="metric-chip-val">{m.value}</strong>
              </div>
            ))}
          </div>
        )}

        {/* Technologies Pills */}
        <div className="spatial-panel-tech" aria-label="Technologies used">
          {project.technologies.slice(0, 6).map((tech) => (
            <span key={tech} className="spatial-tech-pill">{tech}</span>
          ))}
          {project.technologies.length > 6 && (
            <span className="spatial-tech-more">+{project.technologies.length - 6} more</span>
          )}
        </div>

        {/* Action CTAs */}
        <div className="spatial-panel-actions">
          {project.liveUrl && (
            <button
              type="button"
              onClick={() => setShowLiveModal(true)}
              data-cursor-label="DEMO"
              className="btn btn-primary"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 600,
                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
                gap: 'var(--space-2)',
              }}
            >
              <Play size={14} fill="currentColor" aria-hidden="true" />
              <span>Live Demo</span>
            </button>
          )}

          <Link
            to={`/projects/${project.slug}`}
            data-cursor-label="READ"
            className="btn btn-secondary spatial-btn-study"
          >
            <span>Case Study</span>
            <ArrowRight size={15} aria-hidden="true" />
          </Link>

          <a
            href={project.repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            aria-label={`View ${project.name} source code on GitHub`}
          >
            <GithubIcon size={15} aria-hidden="true" />
            <span>Code</span>
          </a>
        </div>
      </div>

      {/* Right / Visualizer Column */}
      <div className="spatial-panel-visual">
        <div className="spatial-visual-inner">
          <ProjectVisualizer slug={project.slug} />
        </div>
      </div>

      {/* Interactive Live Demo Modal */}
      {project.liveUrl && (
        <LiveDemoModal
          isOpen={showLiveModal}
          onClose={() => setShowLiveModal(false)}
          title={project.name}
          url={project.liveUrl}
        />
      )}
    </motion.article>
  );
};
