/**
 * SelectedWork: Featured project showcase with interactive 3D liquid-glass cards.
 * Features:
 * - 3D card perspective tilt with light sweeps (respecting POINTER_REACTIVE_3D)
 * - Dynamic media/architecture preview revealed on hover
 * - Modal for expanded architectural inspection
 * - Accessible keyboard navigation and ARIA semantics
 */
'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ExternalLink, Github, ArrowRight, Eye, Maximize2, X, Cpu, Layers, CheckCircle2 } from 'lucide-react';
import { projects } from '@/data/projects';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { POINTER_REACTIVE_3D } from '@/lib/config';
import { cn } from '@/lib/utils';
import type { Project } from '@/types/project';

// Project visual color palettes using slate, cyan, emerald, amber (no purple)
const PROJECT_ACCENTS: Record<string, { from: string; to: string; accent: string; pattern: string }> = {
  numora: {
    from: '#07162c',
    to: '#0c2e4e',
    accent: '#38bdf8',
    pattern: 'radial-gradient(circle at 70% 30%, rgba(56,189,248,0.2) 0%, transparent 60%)',
  },
  oweo: {
    from: '#052e16',
    to: '#064e3b',
    accent: '#10b981',
    pattern: 'radial-gradient(circle at 70% 30%, rgba(16,185,129,0.2) 0%, transparent 60%)',
  },
  insidertracker: {
    from: '#2e1905',
    to: '#451a03',
    accent: '#f59e0b',
    pattern: 'radial-gradient(circle at 70% 30%, rgba(245,158,11,0.2) 0%, transparent 60%)',
  },
  'codeclash-ai': {
    from: '#082f49',
    to: '#0f172a',
    accent: '#0ea5e9',
    pattern: 'radial-gradient(circle at 70% 30%, rgba(14,165,233,0.2) 0%, transparent 60%)',
  },
  stockscreener: {
    from: '#0b1d3a',
    to: '#0f172a',
    accent: '#0284c7',
    pattern: 'radial-gradient(circle at 70% 30%, rgba(2,132,199,0.2) 0%, transparent 60%)',
  },
};

const STATUS_STYLES: Record<string, string> = {
  Production: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Prototype: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Product Concept': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Active Development': 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  Completed: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

const SPRING = { type: 'spring', stiffness: 280, damping: 28 } as const;

interface TiltCardProps {
  project: Project;
  index: number;
  onExpand: (project: Project) => void;
}

function ProjectTiltCard({ project, index, onExpand }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const style = PROJECT_ACCENTS[project.slug] || PROJECT_ACCENTS.numora;

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!POINTER_REACTIVE_3D || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setRotateX((y - 0.5) * -8);
    setRotateY((x - 0.5) * 8);
  }, []);

  const handlePointerLeave = useCallback(() => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ ...SPRING, delay: index * 0.08 }}
      className="perspective-1000"
    >
      <div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={handlePointerLeave}
        style={{
          transform: POINTER_REACTIVE_3D && isHovered
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`
            : 'rotateX(0deg) rotateY(0deg) translateZ(0px)',
          transition: isHovered ? 'transform 120ms ease-out' : 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="group relative"
      >
        <LiquidGlass
          elevation={3}
          tint="neutral"
          radius={20}
          dynamicLight={POINTER_REACTIVE_3D}
          className="overflow-hidden border border-[var(--separator)] group-hover:border-[var(--accent-border)] transition-[border-color,box-shadow] duration-[var(--dur-base)]"
          style={{ boxShadow: 'var(--shadow-sm)' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Visual preview column */}
            <div
              className="lg:col-span-5 aspect-video lg:aspect-auto min-h-[200px] lg:min-h-[280px] relative overflow-hidden bg-slate-950 flex flex-col justify-between p-6"
              style={{
                background: `linear-gradient(135deg, ${style.from} 0%, ${style.to} 100%)`,
              }}
            >
              {/* Atmospheric pattern */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-60"
                style={{ background: style.pattern }}
              />

              {/* Top metadata tags */}
              <div className="relative z-10 flex items-center justify-between">
                <span
                  className="font-mono text-xs font-bold px-2 py-0.5 rounded-sm bg-black/40 border border-white/10"
                  style={{ color: style.accent }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                <span
                  className="px-2 py-0.5 rounded-sm text-[10px] font-bold font-mono tracking-wider"
                  style={{
                    background: `${style.accent}20`,
                    color: style.accent,
                    border: `1px solid ${style.accent}40`,
                  }}
                >
                  {project.tier}
                </span>
              </div>

              {/* Center interactive architectural wireframe */}
              <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center">
                <div
                  className="w-16 h-16 rounded-xl border border-white/15 flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `${style.accent}15`,
                    boxShadow: isHovered ? `0 0 24px ${style.accent}30` : 'none',
                  }}
                >
                  <Cpu size={28} style={{ color: style.accent }} aria-hidden="true" />
                </div>
                <span className="text-[11px] font-mono text-slate-300 uppercase tracking-wider">
                  {project.primaryLanguage} Architecture
                </span>
              </div>

              {/* Bottom quick actions */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">
                  {project.date}
                </span>

                <button
                  type="button"
                  onClick={() => onExpand(project)}
                  className="inline-flex items-center gap-1.5 text-[11px] font-mono text-white/90 hover:text-white px-3 py-2 rounded bg-black/40 border border-white/10 hover:border-white/20 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)] min-h-[44px] min-w-[44px]"
                  aria-label={`Open expanded preview for ${project.name}`}
                >
                  <Maximize2 size={12} aria-hidden="true" />
                  <span>Inspect</span>
                </button>
              </div>
            </div>

            {/* Content Details Column */}
            <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between">
              <div>
                {/* Category and status */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="badge">{project.category}</span>
                  <span
                    className={cn(
                      'px-2.5 py-0.5 rounded-sm text-xs font-semibold border font-mono',
                      STATUS_STYLES[project.status] ?? STATUS_STYLES.Completed
                    )}
                  >
                    {project.status}
                  </span>
                </div>

                {/* Name */}
                <h3 className="text-xl md:text-2xl font-display font-bold text-[var(--label-primary)] mb-2 leading-tight group-hover:text-[var(--accent)]">
                  {project.name}
                </h3>

                {/* Tagline */}
                <p className="text-[var(--label-secondary)] text-sm mb-3 leading-relaxed font-medium">
                  {project.tagline}
                </p>

                {/* Short description */}
                <p className="text-[var(--label-secondary)] text-xs md:text-sm mb-6 line-clamp-2 leading-relaxed">
                  {project.shortDescription}
                </p>
              </div>

              <div>
                {/* Tech stack */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.technologies.slice(0, 5).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-sm text-[11px] font-mono text-[var(--label-secondary)] bg-[var(--bg-grouped)] border border-[var(--separator)]"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 5 && (
                    <span className="px-2 py-0.5 rounded-sm text-[11px] font-mono text-[var(--label-quaternary)]">
                      +{project.technologies.length - 5}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--accent-primary)] text-[var(--text-on-accent)] text-xs md:text-sm font-semibold hover:bg-[var(--accent-primary-hover)] transition-all shadow-md min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
                  >
                    <Eye size={15} aria-hidden="true" />
                    <span>Case Study</span>
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </Link>

                  {project.repositoryUrl && (
                    <a
                      href={project.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${project.name} source repository on GitHub`}
                      className="p-2.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
                    >
                      <Github size={18} aria-hidden="true" />
                    </a>
                  )}

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${project.name} live deployment`}
                      className="p-2.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
                    >
                      <ExternalLink size={18} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </LiquidGlass>
      </div>
    </motion.div>
  );
}

/**
 * ExpandedProjectModal: Full architectural modal view for project media and details.
 */
function ExpandedProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const style = PROJECT_ACCENTS[project.slug] || PROJECT_ACCENTS.numora;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} expanded preview`}
      className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4 sm:p-6 lg:p-8"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-md"
      />

      {/* Modal Surface */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={SPRING}
        className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-specular)] shadow-2xl p-6 md:p-8"
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono">
              <span className="badge">{project.category}</span>
              <span className="px-2 py-0.5 rounded-sm text-xs bg-[var(--bg-surface-2)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                {project.tier}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-[var(--text-primary)]">
              {project.name}
            </h2>
            <p className="text-sm text-[var(--accent-primary)] font-mono mt-1">
              {project.tagline}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)] min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close modal"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Architecture schematic box */}
        <div
          className="rounded-xl p-5 mb-6 border border-[var(--border-subtle)] bg-[var(--bg-surface-2)]"
          style={{
            boxShadow: `inset 0 0 20px ${style.accent}10`,
          }}
        >
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] uppercase mb-2">
            <Layers size={14} style={{ color: style.accent }} aria-hidden="true" />
            <span>Architectural Pipeline</span>
          </div>
          <p className="text-sm font-mono text-[var(--text-primary)] leading-relaxed">
            {project.caseStudy.architecture}
          </p>
        </div>

        {/* Problem & Solution */}
        <div className="space-y-4 mb-6 text-sm text-[var(--text-secondary)] leading-relaxed">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-1">
              Core Problem
            </h3>
            <p>{project.caseStudy.problem}</p>
          </div>
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-1">
              Engineered Solution
            </h3>
            <p>{project.caseStudy.solution}</p>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-6">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-3">
            Key Architecture Features
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {project.caseStudy.keyFeatures.map((feat) => (
              <li key={feat} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                <CheckCircle2 size={14} className="text-[var(--accent-emerald)] shrink-0 mt-0.5" aria-hidden="true" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--border-subtle)]">
          <Link
            href={`/projects/${project.slug}`}
            onClick={onClose}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--text-on-accent)] text-xs font-semibold transition-colors min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)] shadow-sm"
          >
            <span>Read Full Case Study</span>
            <ArrowRight size={14} aria-hidden="true" />
          </Link>

          <div className="flex items-center gap-2">
            {project.repositoryUrl && (
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
                aria-label={`View ${project.name} on GitHub`}
              >
                <Github size={18} aria-hidden="true" />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
                aria-label={`Open ${project.name} live deployment`}
              >
                <ExternalLink size={18} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function SelectedWork() {
  const featuredProjects = projects.filter((p) => p.featured);
  const [expandedProject, setExpandedProject] = useState<Project | null>(null);

  return (
    <section
      id="selected-work"
      className="relative py-28 px-4 md:px-8 w-full scroll-mt-24"
      aria-label="Selected work"
    >
      <div id="work" className="absolute -top-24 pointer-events-none" aria-hidden="true" />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={SPRING}
          className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <span className="section-label">
              <span aria-hidden="true">#</span>
              Selected Work
            </span>
            <h2 className="section-title text-[var(--text-primary)] mt-1">
              Featured Projects
            </h2>
            <p className="section-subtitle mt-2">
              Production-grade applications engineered with focus on architecture, performance, and deterministic constraints.
            </p>
          </div>

          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors whitespace-nowrap px-3 py-2 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)] min-h-[44px]"
          >
            <span>View All {projects.length} Projects</span>
            <ArrowRight
              size={15}
              className="group-hover:translate-x-1 transition-transform duration-200"
              aria-hidden="true"
            />
          </Link>
        </motion.div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 gap-6">
          {featuredProjects.map((project, index) => (
            <ProjectTiltCard
              key={project.slug}
              project={project}
              index={index}
              onExpand={setExpandedProject}
            />
          ))}
        </div>

        {/* View all button */}
        <div className="mt-14 flex justify-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[var(--border-subtle)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-medium)] hover:bg-[var(--bg-surface-hover)] transition-colors min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)] shadow-sm"
          >
            <span>Browse all {projects.length} projects</span>
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Expanded Modal */}
      <AnimatePresence>
        {expandedProject && (
          <ExpandedProjectModal
            project={expandedProject}
            onClose={() => setExpandedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
