import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ExternalLink,
  Cpu,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Compass,
  Scale,
} from 'lucide-react';
import { GithubIcon } from '../common/Icons';
import { Project } from '../../types/project';

interface CaseStudyViewProps {
  project: Project;
}

export const CaseStudyView: React.FC<CaseStudyViewProps> = ({ project }) => {
  const { caseStudy } = project;

  return (
    <article className="container" style={{ paddingTop: 'var(--space-10)', paddingBottom: 'var(--space-20)' }}>
      {/* Back to Projects Navigation */}
      <nav aria-label="Breadcrumbs" style={{ marginBottom: 'var(--space-8)' }}>
        <motion.div whileHover={{ x: -3 }} whileTap={{ scale: 0.97 }} style={{ display: 'inline-flex' }}>
          <Link
            to="/projects"
            className="btn btn-ghost"
            style={{ padding: '0 var(--space-3)', minHeight: '36px', gap: 'var(--space-2)' }}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Back to All Projects</span>
          </Link>
        </motion.div>
      </nav>

      {/* Header / Hero */}
      <header style={{ marginBottom: 'var(--space-12)' }}>
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-3)',
            alignItems: 'center',
            marginBottom: 'var(--space-4)',
            flexWrap: 'wrap',
          }}
        >
          <span className="badge badge-accent">{project.category}</span>
          <span className="badge">{project.status}</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            Date: {project.date}
          </span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            Role: {project.role}
          </span>
        </div>

        <h1
          style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-4)', color: 'var(--text-primary)' }}
        >
          {project.name}
        </h1>

        <p
          style={{
            fontSize: 'var(--text-xl)',
            color: 'var(--text-secondary)',
            maxWidth: 'var(--max-w-prose)',
            lineHeight: 'var(--leading-relaxed)',
            marginBottom: 'var(--space-6)',
          }}
        >
          {project.tagline}
        </p>

        {/* Links & Quick Actions */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <ExternalLink size={16} aria-hidden="true" />
              <span>Launch Live Application</span>
            </a>
          )}
          <a
            href={project.repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            <GithubIcon size={16} aria-hidden="true" />
            <span>Explore Source Code</span>
          </a>
        </div>
      </header>

      {/* High-Level Metrics (if available) */}
      {caseStudy.metrics && caseStudy.metrics.length > 0 && (
        <section style={{ marginBottom: 'var(--space-12)' }} aria-label="Key Project Metrics">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 'var(--space-4)',
            }}
          >
            {caseStudy.metrics.map((m) => (
              <div
                key={m.label}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-5)',
                }}
              >
                <div
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-tertiary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: 'var(--space-1)',
                  }}
                >
                  {m.label}
                </div>
                <div
                  style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--accent-primary)' }}
                >
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main Case Study Body Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: 'var(--space-10)',
        }}
      >
        {/* Left Column: Problem & Solution & Architecture */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
          {/* Problem */}
          <section>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-3)',
              }}
            >
              <AlertCircle size={20} style={{ color: 'var(--accent-amber)' }} aria-hidden="true" />
              <h2 style={{ fontSize: 'var(--text-xl)' }}>Problem &amp; Motivation</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
              {caseStudy.problem}
            </p>
          </section>

          {/* Solution */}
          <section>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-3)',
              }}
            >
              <CheckCircle2 size={20} style={{ color: 'var(--accent-emerald)' }} aria-hidden="true" />
              <h2 style={{ fontSize: 'var(--text-xl)' }}>The Solution</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
              {caseStudy.solution}
            </p>
          </section>

          {/* Architecture */}
          <section>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-3)',
              }}
            >
              <Cpu size={20} style={{ color: 'var(--accent-primary)' }} aria-hidden="true" />
              <h2 style={{ fontSize: 'var(--text-xl)' }}>System Architecture</h2>
            </div>
            <p
              style={{
                color: 'var(--text-secondary)',
                lineHeight: 'var(--leading-relaxed)',
                marginBottom: 'var(--space-4)',
              }}
            >
              {caseStudy.architecture}
            </p>

            {/* Tech stack pills — staggered entrance */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-4)',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
              }}
            >
              <span style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 'var(--text-2xs)' }}>
                Primary Technologies:&nbsp;
              </span>
              <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 'var(--space-1-5)', marginTop: 'var(--space-2)' }}>
                {project.technologies.map((tech, i) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.04, type: 'spring' }}
                    style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-xs)',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--accent-primary)',
                    }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </span>
            </div>
          </section>

          {/* Key Features */}
          <section>
            <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>
              Core Architectural Features
            </h2>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {caseStudy.keyFeatures.map((feat, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--accent-primary)',
                      marginTop: '9px',
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: 'var(--text-sm)',
                      lineHeight: 'var(--leading-relaxed)',
                    }}
                  >
                    {feat}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right Column: Engineering Decisions & Tradeoffs, Challenges, Lessons, Future */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
          {/* Engineering Decisions & Trade-offs */}
          {caseStudy.engineeringDecisions && caseStudy.engineeringDecisions.length > 0 && (
            <section>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  marginBottom: 'var(--space-3)',
                }}
              >
                <Scale size={20} style={{ color: 'var(--accent-primary)' }} aria-hidden="true" />
                <h2 style={{ fontSize: 'var(--text-xl)' }}>Engineering Trade-offs</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {caseStudy.engineeringDecisions.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-4)',
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-primary)',
                        marginBottom: 'var(--space-1)',
                      }}
                    >
                      {item.decision}
                    </div>
                    <p
                      style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--text-secondary)',
                        marginBottom: item.tradeoff ? 'var(--space-2)' : 0,
                      }}
                    >
                      <strong>Rationale:</strong> {item.rationale}
                    </p>
                    {item.tradeoff && (
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                        <strong>Trade-off:</strong> {item.tradeoff}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Challenges Overcome */}
          <section>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-3)',
              }}
            >
              <AlertCircle size={20} style={{ color: 'var(--accent-rose)' }} aria-hidden="true" />
              <h2 style={{ fontSize: 'var(--text-xl)' }}>Challenges &amp; Bottlenecks</h2>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {caseStudy.challenges.map((c, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--accent-rose)',
                      marginTop: '9px',
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: 'var(--text-sm)',
                      lineHeight: 'var(--leading-relaxed)',
                    }}
                  >
                    {c}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Lessons Learned */}
          <section>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-3)',
              }}
            >
              <Lightbulb size={20} style={{ color: 'var(--accent-amber)' }} aria-hidden="true" />
              <h2 style={{ fontSize: 'var(--text-xl)' }}>Lessons Learned</h2>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {caseStudy.lessonsLearned.map((l, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--accent-amber)',
                      marginTop: '9px',
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: 'var(--text-sm)',
                      lineHeight: 'var(--leading-relaxed)',
                    }}
                  >
                    {l}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Future Plans */}
          <section>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-3)',
              }}
            >
              <Compass size={20} style={{ color: 'var(--accent-cyan)' }} aria-hidden="true" />
              <h2 style={{ fontSize: 'var(--text-xl)' }}>Future Roadmap</h2>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {caseStudy.futurePlans.map((f, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--accent-cyan)',
                      marginTop: '9px',
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: 'var(--text-sm)',
                      lineHeight: 'var(--leading-relaxed)',
                    }}
                  >
                    {f}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </article>
  );
};
