import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { GithubIcon } from '../common/Icons';
import { Project } from '../../types/project';

interface ProjectCardProps {
  project: Project;
  featuredLayout?: boolean;
}

const STATUS_MAP: Record<string, { color: string; label: string }> = {
  'Production':         { color: 'var(--accent-emerald)', label: 'Production' },
  'Active Development': { color: 'var(--accent-cyan)',    label: 'Active Dev' },
  'MVP':               { color: 'var(--accent-amber)',    label: 'MVP' },
  'Archived':          { color: 'var(--text-muted)',      label: 'Archived' },
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, featuredLayout = false }) => {
  const status = STATUS_MAP[project.status] ?? { color: 'var(--text-muted)', label: project.status };

  return (
    <article className={`project-card${featuredLayout ? ' project-card--featured' : ''} card-surface hover-lift`}>
      {/* Top bar: category + status */}
      <div className="project-card-topbar">
        <span className="badge badge-accent">{project.category}</span>
        <div className="project-card-status">
          <span
            className="project-card-status-dot"
            style={{ backgroundColor: status.color }}
            aria-hidden="true"
          />
          <span>{status.label}</span>
        </div>
      </div>

      <div className="project-card-body">
        {/* Title */}
        <h3 className={`project-card-title${featuredLayout ? ' project-card-title--lg' : ''}`}>
          <Link
            to={`/projects/${project.slug}`}
            className="project-card-title-link"
            aria-label={`Read case study: ${project.name}`}
          >
            {project.name}
          </Link>
        </h3>

        {/* Tagline */}
        <p className="project-card-tagline">{project.tagline}</p>

        {/* Short description */}
        <p className="project-card-desc">{project.shortDescription}</p>

        {/* Tech stack */}
        <div className="project-card-tech" aria-label="Technologies used">
          {project.technologies.slice(0, featuredLayout ? 7 : 5).map((tech) => (
            <span key={tech} className="project-card-tech-pill">{tech}</span>
          ))}
          {project.technologies.length > (featuredLayout ? 7 : 5) && (
            <span className="project-card-tech-more" aria-label={`${project.technologies.length - (featuredLayout ? 7 : 5)} more technologies`}>
              +{project.technologies.length - (featuredLayout ? 7 : 5)}
            </span>
          )}
        </div>
      </div>

      {/* Footer actions */}
      <div className="project-card-footer">
        <Link
          to={`/projects/${project.slug}`}
          className="project-card-cta"
          aria-label={`Open case study for ${project.name}`}
        >
          <span>Case Study</span>
          <ArrowRight size={15} aria-hidden="true" />
        </Link>

        <div className="project-card-links">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card-icon-link"
              aria-label={`Live demo of ${project.name}`}
              title="Live demo"
            >
              <ExternalLink size={14} />
            </a>
          )}
          <a
            href={project.repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="project-card-icon-link"
            aria-label={`GitHub repo for ${project.name}`}
            title="Source code on GitHub"
          >
            <GithubIcon size={14} />
          </a>
        </div>
      </div>

      <style>{`
        .project-card {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: var(--space-5);
          gap: 0;
        }

        .project-card-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-4);
          gap: var(--space-2);
          flex-wrap: wrap;
        }

        .project-card-status {
          display: inline-flex;
          align-items: center;
          gap: var(--space-1-5);
          font-size: var(--text-xs);
          color: var(--text-tertiary);
          font-weight: 500;
          font-family: var(--font-mono);
        }

        .project-card-status-dot {
          width: 6px;
          height: 6px;
          border-radius: var(--radius-full);
          flex-shrink: 0;
        }

        .project-card-body {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .project-card-title {
          font-size: var(--text-xl);
          font-weight: 700;
          letter-spacing: var(--tracking-tight);
          margin-bottom: var(--space-1-5);
          line-height: var(--leading-tight);
        }

        .project-card-title--lg {
          font-size: var(--text-2xl);
        }

        .project-card-title-link {
          color: var(--text-primary);
          text-decoration: none;
          transition: color var(--duration-fast) var(--ease-standard);
        }

        .project-card-title-link:hover {
          color: var(--accent-primary);
        }

        .project-card-tagline {
          font-size: var(--text-sm);
          color: var(--text-tertiary);
          font-weight: 500;
          margin-bottom: var(--space-3);
          line-height: var(--leading-snug);
        }

        .project-card-desc {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          line-height: var(--leading-relaxed);
          margin-bottom: var(--space-5);
          flex: 1;
        }

        .project-card-tech {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-1-5);
          margin-bottom: var(--space-5);
        }

        .project-card-tech-pill {
          font-size: var(--text-2xs);
          font-family: var(--font-mono);
          padding: 2px 8px;
          border-radius: var(--radius-xs);
          background-color: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .project-card-tech-more {
          font-size: var(--text-2xs);
          color: var(--text-muted);
          align-self: center;
          font-family: var(--font-mono);
        }

        .project-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--border-subtle);
          padding-top: var(--space-4);
          gap: var(--space-3);
        }

        .project-card-cta {
          display: inline-flex;
          align-items: center;
          gap: var(--space-1-5);
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--accent-primary);
          text-decoration: none;
          min-height: 36px;
          transition: gap var(--duration-fast) var(--ease-standard), color var(--duration-fast);
        }

        .project-card-cta:hover {
          gap: var(--space-2-5, 0.625rem);
          color: var(--accent-primary-hover);
        }

        .project-card-links {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .project-card-icon-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
          background-color: var(--bg-surface-elevated);
          color: var(--text-tertiary);
          text-decoration: none;
          transition:
            border-color var(--duration-fast),
            color var(--duration-fast),
            background-color var(--duration-fast);
        }

        .project-card-icon-link:hover {
          border-color: var(--border-medium);
          color: var(--text-primary);
          background-color: var(--bg-surface-hover);
        }
      `}</style>
    </article>
  );
};
