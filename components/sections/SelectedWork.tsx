/**
 * SelectedWork: Featured project showcase with interactive 3D liquid-glass cards.
 * Features:
 * - 3D card perspective tilt with light sweeps (respecting POINTER_REACTIVE_3D)
 * - Real live screenshots and high-fidelity architectural mockups with reserved aspect ratio
 * - Featured flagship elevation for top 2 projects
 * - One concrete problem/solution sentence per project
 * - Clean tech chips (no hashtags)
 * - Safe external links and case study deep-links
 * - Accessible keyboard navigation and ARIA semantics
 */
'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  ExternalLink,
  Github,
  ArrowRight,
  Eye,
  Maximize2,
  X,
  Cpu,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { projects } from '@/data/projects';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { ParallaxCard, ParallaxImage, ParallaxLayer } from '@/components/parallax';
import { POINTER_REACTIVE_3D } from '@/lib/config';
import { cn } from '@/lib/utils';
import type { Project } from '@/types/project';

// Project visual color palettes using deep navy, cyan, emerald, amber (strictly non-purple)
const PROJECT_ACCENTS: Record<string, { from: string; to: string; accent: string; pattern: string }> = {
  numora: {
    from: '#060B18',
    to: '#0E1626',
    accent: '#22D3EE',
    pattern: 'radial-gradient(circle at 70% 30%, rgba(34,211,238,0.2) 0%, transparent 60%)',
  },
  oweo: {
    from: '#060B18',
    to: '#0B2418',
    accent: '#10b981',
    pattern: 'radial-gradient(circle at 70% 30%, rgba(16,185,129,0.2) 0%, transparent 60%)',
  },
  insidertracker: {
    from: '#060B18',
    to: '#1F140A',
    accent: '#F59E0B',
    pattern: 'radial-gradient(circle at 70% 30%, rgba(245,158,11,0.2) 0%, transparent 60%)',
  },
  bilingsystem: {
    from: '#060B18',
    to: '#0E1626',
    accent: '#22D3EE',
    pattern: 'radial-gradient(circle at 70% 30%, rgba(34,211,238,0.2) 0%, transparent 60%)',
  },
  'codeclash-ai': {
    from: '#060B18',
    to: '#0E1626',
    accent: '#67E8F9',
    pattern: 'radial-gradient(circle at 70% 30%, rgba(103,232,249,0.2) 0%, transparent 60%)',
  },
  stockscreener: {
    from: '#060B18',
    to: '#0E1626',
    accent: '#0369A1',
    pattern: 'radial-gradient(circle at 70% 30%, rgba(3,105,161,0.2) 0%, transparent 60%)',
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
  const rectRef = useRef<DOMRect | null>(null);
  const ticking = useRef(false);

  const isFeatured = index < 2;
  const style = PROJECT_ACCENTS[project.slug] || PROJECT_ACCENTS.numora;

  const handlePointerEnter = useCallback(() => {
    if (cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!POINTER_REACTIVE_3D || !cardRef.current || ticking.current) return;
    if (!rectRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
    ticking.current = true;
    const clientX = e.clientX;
    const clientY = e.clientY;

    requestAnimationFrame(() => {
      if (cardRef.current && rectRef.current) {
        const x = (clientX - rectRef.current.left) / rectRef.current.width;
        const y = (clientY - rectRef.current.top) / rectRef.current.height;
        const rx = (y - 0.5) * -8;
        const ry = (x - 0.5) * 8;
        cardRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
      }
      ticking.current = false;
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    rectRef.current = null;
    if (cardRef.current) {
      cardRef.current.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
    }
  }, []);

  return (
    <ParallaxCard index={index} className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ ...SPRING, delay: index * 0.08 }}
        className="perspective-1000"
      >
        <div
          ref={cardRef}
          onPointerEnter={handlePointerEnter}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          style={{
            transform: 'rotateX(0deg) rotateY(0deg) translateZ(0px)',
            transition: 'transform 200ms ease-out',
          }}
          className="group relative will-change-transform"
        >
          <LiquidGlass
            elevation={isFeatured ? 3 : 2}
            tint="neutral"
            radius={20}
            dynamicLight={POINTER_REACTIVE_3D}
            className="overflow-hidden border border-[var(--separator)] group-hover:border-[var(--accent-border)] transition-[border-color,box-shadow] duration-[var(--dur-base)]"
            style={{ boxShadow: isFeatured ? 'var(--shadow-md)' : 'var(--shadow-sm)' }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Visual preview column with reserved aspect ratio */}
              <div
                className={cn(
                  'relative overflow-hidden flex flex-col justify-between p-6',
                  isFeatured
                    ? 'lg:col-span-6 aspect-video min-h-[220px] lg:min-h-[300px]'
                    : 'lg:col-span-5 aspect-video min-h-[190px] lg:min-h-[260px]'
                )}
                style={{
                  background: `linear-gradient(135deg, ${style.from} 0%, ${style.to} 100%)`,
                }}
              >
                {/* Real screenshot or architectural SVG mockup with internal parallax */}
                {project.image ? (
                  <ParallaxImage containerClassName="absolute inset-0 z-0 overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.imageAlt || `Screenshot and interface visual for ${project.name}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                      className="object-cover object-top opacity-80 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500"
                      priority={isFeatured}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-elevated)]/90 via-transparent to-black/40 pointer-events-none" />
                  </ParallaxImage>
                ) : (
                  /* Fallback atmospheric pattern */
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-60"
                    style={{ background: style.pattern }}
                  />
                )}

              {/* Top metadata tags */}
              <div className="relative z-10 flex items-center justify-between">
                <span
                  className="font-mono text-xs font-bold px-2 py-0.5 rounded-sm bg-black/60 backdrop-blur-sm border border-white/10"
                  style={{ color: style.accent }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="flex items-center gap-1.5">
                  {isFeatured && (
                    <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold font-mono tracking-wider bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-border)]">
                      FLAGSHIP
                    </span>
                  )}
                  <span
                    className="px-2 py-0.5 rounded-sm text-[10px] font-bold font-mono tracking-wider bg-black/60 backdrop-blur-sm"
                    style={{
                      color: style.accent,
                      border: `1px solid ${style.accent}40`,
                    }}
                  >
                    {project.tier}
                  </span>
                </div>
              </div>

              {/* Center interactive architectural wireframe if no image */}
              {!project.image && (
                <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center">
                  <div
                    className="w-16 h-16 rounded-xl border border-white/15 flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_24px_rgba(56,189,248,0.25)]"
                    style={{
                      background: `${style.accent}15`,
                    }}
                  >
                    <Cpu size={28} style={{ color: style.accent }} aria-hidden="true" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-300 uppercase tracking-wider">
                    {project.primaryLanguage} Architecture
                  </span>
                </div>
              )}

              {/* Bottom quick actions */}
              <div className="relative z-10 flex items-center justify-between mt-auto pt-4">
                <span className="text-[10px] font-mono text-white/80 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                  {project.date}
                </span>

                <button
                  type="button"
                  onClick={() => onExpand(project)}
                  className="inline-flex items-center gap-1.5 text-[11px] font-mono text-white/90 hover:text-white px-3 py-2 rounded bg-black/60 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] min-h-[44px] min-w-[44px]"
                  aria-label={`Open expanded preview for ${project.name}`}
                >
                  <Maximize2 size={12} aria-hidden="true" />
                  <span>Inspect</span>
                </button>
              </div>
            </div>

            {/* Content Details Column */}
            <div
              className={cn(
                'p-6 md:p-8 flex flex-col justify-between',
                isFeatured ? 'lg:col-span-6' : 'lg:col-span-7'
              )}
            >
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
                <h3 className="text-xl md:text-2xl font-display font-bold text-[var(--text-primary)] mb-2 leading-tight group-hover:text-[var(--accent)] transition-colors">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--focus-ring)] rounded"
                  >
                    {project.name}
                  </Link>
                </h3>

                {/* Tagline */}
                <p className="text-[var(--text-secondary)] text-sm mb-2 leading-relaxed font-medium">
                  {project.tagline}
                </p>

                {/* One concrete sentence (problem and what I built) */}
                <p className="text-[var(--text-secondary)] text-xs md:text-sm mb-6 leading-relaxed">
                  {project.shortDescription}
                </p>
              </div>

              <div>
                {/* Clean tech chips (never hashtags) */}
                <div className="flex flex-wrap gap-1.5 mb-6" aria-label="Technologies used">
                  {project.technologies.slice(0, 6).map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-[var(--radius-xs)] text-[11px] font-mono font-medium text-[var(--text-secondary)] bg-[var(--bg-secondary)] border border-[var(--separator)]"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 6 && (
                    <span className="px-2 py-1 rounded-[var(--radius-xs)] text-[11px] font-mono text-[var(--text-muted)] bg-[var(--bg-secondary)] border border-[var(--separator)]">
                      +{project.technologies.length - 6}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-md)] bg-[var(--accent)] text-[var(--bg-primary)] text-xs md:text-sm font-semibold hover:bg-[var(--accent-hover)] transition-all shadow-sm min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
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
                      className="p-2.5 rounded-[var(--radius-md)] border border-[var(--separator)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
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
                      className="p-2.5 rounded-[var(--radius-md)] border border-[var(--separator)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
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
    </ParallaxCard>
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
              <span className="px-2 py-0.5 rounded-sm text-xs bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--separator)]">
                {project.tier}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-[var(--text-primary)]">
              {project.name}
            </h2>
            <p className="text-sm text-[var(--accent)] font-mono mt-1">
              {project.tagline}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close modal"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Real screenshot or architectural visual preview if available */}
        {project.image && (
          <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-6 border border-[var(--separator)] bg-[var(--bg-elevated)]">
            <Image
              src={project.image}
              alt={project.imageAlt || `${project.name} visual preview`}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        {/* Architecture schematic box */}
        <div
          className="rounded-xl p-5 mb-6 border border-[var(--separator)] bg-[var(--bg-secondary)]"
          style={{
            boxShadow: `inset 0 0 20px ${style.accent}10`,
          }}
        >
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] uppercase mb-2">
            <Layers size={14} style={{ color: style.accent }} aria-hidden="true" />
            <span>Architecture Pipeline</span>
          </div>
          <code className="text-xs md:text-sm font-mono text-[var(--text-primary)] block break-all">
            {project.caseStudy.architecture}
          </code>
        </div>

        {/* Problem and Solution */}
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
                <CheckCircle2 size={14} className="text-[var(--accent)] shrink-0 mt-0.5" aria-hidden="true" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--separator)]">
          <Link
            href={`/projects/${project.slug}`}
            onClick={onClose}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-md)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--bg-primary)] text-xs font-semibold transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] shadow-sm"
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
                className="p-2.5 rounded-[var(--radius-md)] border border-[var(--separator)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
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
                className="p-2.5 rounded-[var(--radius-md)] border border-[var(--separator)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
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
      
      {/* Floating detail accents lagging at 0.22x */}
      <div className="hidden lg:block absolute left-8 top-1/4 pointer-events-none z-0" aria-hidden="true">
        <ParallaxLayer rate={0.22} direction="down">
          <div className="px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--separator)] bg-[var(--bg-secondary)]/60 backdrop-blur-sm text-[10px] font-mono text-[var(--label-quaternary)]">
            CATALOG // PRODUCTION
          </div>
        </ParallaxLayer>
      </div>
      <div className="hidden lg:block absolute right-8 top-2/3 pointer-events-none z-0" aria-hidden="true">
        <ParallaxLayer rate={0.22} direction="up">
          <div className="px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--separator)] bg-[var(--bg-secondary)]/60 backdrop-blur-sm text-[10px] font-mono text-[var(--label-quaternary)]">
            SYSTEMS // ARCHITECTURE
          </div>
        </ParallaxLayer>
      </div>

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
            className="group inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors whitespace-nowrap px-3 py-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] min-h-[44px]"
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[var(--separator)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--separator-strong)] hover:bg-[var(--bg-hover)] transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] shadow-sm"
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
