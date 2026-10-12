import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Github, Cpu, CheckCircle2 } from 'lucide-react';
import { projects } from '@/data/projects';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: 'Project Not Found' };

  return {
    title: `${project.name}: Engineering Case Study`,
    description: project.shortDescription,
    openGraph: {
      title: `${project.name}: Engineering Case Study`,
      description: project.shortDescription,
      type: 'article',
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const projectIndex = projects.findIndex((p) => p.slug === slug);
  const project = projects[projectIndex];

  if (!project) {
    notFound();
  }

  const prevProject = projectIndex > 0 ? projects[projectIndex - 1] : null;
  const nextProject = projectIndex < projects.length - 1 ? projects[projectIndex + 1] : null;
  const caseStudy = project.caseStudy;

  return (
    <article className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors rounded-lg p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Back to Projects</span>
          </Link>
        </div>

        {/* Header Section */}
        <header className="mb-14">
          <div className="flex flex-wrap items-center gap-2.5 mb-6 font-mono">
            <span className="badge">{project.category}</span>
            <span className="px-2.5 py-0.5 rounded-sm text-xs bg-[var(--bg-surface-active)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
              {project.date}
            </span>
            <span className="px-2.5 py-0.5 rounded-sm text-xs bg-[var(--bg-surface-active)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
              {project.tier}
            </span>
            <span className="px-2.5 py-0.5 rounded-sm text-xs bg-[var(--bg-surface-active)] border border-[var(--border-subtle)] text-[var(--accent-primary)]">
              {project.status}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 text-[var(--text-primary)] tracking-tight leading-tight">
            {project.name}
          </h1>

          <p className="text-lg md:text-xl text-[var(--text-secondary)] font-normal mb-8 leading-relaxed">
            {project.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-8">
            {project.repositoryUrl && (
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-hover)] transition-colors text-sm font-medium min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
              >
                <Github size={16} aria-hidden="true" />
                <span>GitHub Repository</span>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--accent-primary)] text-[var(--text-on-accent)] hover:bg-[var(--accent-hover)] transition-colors text-sm font-semibold shadow-md min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
              >
                <ArrowUpRight size={16} aria-hidden="true" />
                <span>Live Deployment</span>
              </a>
            )}
          </div>

          {/* Tech Badges */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border-subtle)]">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="text-xs font-mono px-2.5 py-1 rounded-sm bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </header>

        {/* Project Preview Image */}
        {project.image && (
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden mb-12 border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            <Image
              src={project.image}
              alt={project.imageAlt || `${project.name} interface preview`}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1200px) 100vw, 1024px"
              priority
            />
          </div>
        )}

        {/* Case Study Content */}
        <div className="space-y-10">
          {/* Problem & Solution in Glass Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {caseStudy?.problem && (
              <LiquidGlass elevation={2} tint="neutral" radius={14} className="p-7">
                <h2 className="text-lg font-display font-bold text-[var(--text-primary)] mb-3">The Problem</h2>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {caseStudy.problem}
                </p>
              </LiquidGlass>
            )}

            {caseStudy?.solution && (
              <LiquidGlass elevation={2} tint="cyan" radius={14} className="p-7">
                <h2 className="text-lg font-display font-bold text-[var(--text-primary)] mb-3">The Solution</h2>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {caseStudy.solution}
                </p>
              </LiquidGlass>
            )}
          </div>

          {/* Architecture Highlight */}
          {caseStudy?.architecture && (
            <LiquidGlass elevation={3} tint="neutral" radius={14} className="p-7 md:p-8 relative overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--accent-primary)] font-bold mb-3">
                <Cpu size={16} aria-hidden="true" />
                <span>System Architecture</span>
              </div>
              <p className="text-base text-[var(--text-secondary)] leading-relaxed font-sans">
                {caseStudy.architecture}
              </p>
            </LiquidGlass>
          )}

          {/* Key Features */}
          {caseStudy?.keyFeatures && caseStudy.keyFeatures.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-[var(--text-primary)]">Key Features</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {caseStudy.keyFeatures.map((feature, idx) => (
                  <LiquidGlass key={idx} elevation={1} tint="neutral" radius={14} className="p-4 flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-sm text-[var(--text-secondary)] leading-relaxed">{feature}</span>
                  </LiquidGlass>
                ))}
              </div>
            </section>
          )}

          {/* Engineering Decisions & Tradeoffs */}
          {caseStudy?.engineeringDecisions && caseStudy.engineeringDecisions.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-[var(--text-primary)]">Engineering Decisions</h2>
              <div className="space-y-4">
                {caseStudy.engineeringDecisions.map((decision, idx) => (
                  <LiquidGlass key={idx} elevation={2} tint="neutral" radius={14} className="p-6">
                    <h3 className="font-bold text-base text-[var(--text-primary)] mb-3">{decision.decision}</h3>
                    <div className="space-y-2 text-xs text-[var(--text-secondary)] leading-relaxed">
                      <p>
                        <strong className="text-[var(--text-primary)]">Rationale:</strong> {decision.rationale}
                      </p>
                      {decision.tradeoff && (
                        <p>
                          <strong className="text-amber-600 dark:text-amber-400">Tradeoff:</strong> {decision.tradeoff}
                        </p>
                      )}
                    </div>
                  </LiquidGlass>
                ))}
              </div>
            </section>
          )}

          {/* Metrics */}
          {caseStudy?.metrics && caseStudy.metrics.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-[var(--text-primary)]">Impact &amp; Metrics</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono">
                {caseStudy.metrics.map((metric, idx) => (
                  <LiquidGlass key={idx} elevation={2} tint="neutral" radius={14} className="p-5 text-center">
                    <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-1 font-semibold">
                      {metric.label}
                    </div>
                    <div className="text-2xl font-display font-bold text-[var(--text-primary)] tabular-nums">
                      {metric.value}
                    </div>
                  </LiquidGlass>
                ))}
              </div>
            </section>
          )}

          {/* Challenges & Lessons Learned */}
          <div className="grid md:grid-cols-2 gap-6">
            {caseStudy?.challenges && caseStudy.challenges.length > 0 && (
              <LiquidGlass elevation={2} tint="neutral" radius={14} className="p-6">
                <h2 className="text-lg font-display font-bold text-[var(--text-primary)] mb-4">Challenges</h2>
                <ul className="space-y-2 text-xs text-[var(--text-secondary)] leading-relaxed">
                  {caseStudy.challenges.map((challenge, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-500 dark:text-red-400 mt-0.5" aria-hidden="true">&bull;</span>
                      <span>{challenge}</span>
                    </li>
                  ))}
                </ul>
              </LiquidGlass>
            )}

            {caseStudy?.lessonsLearned && caseStudy.lessonsLearned.length > 0 && (
              <LiquidGlass elevation={2} tint="neutral" radius={14} className="p-6">
                <h2 className="text-lg font-display font-bold text-[var(--text-primary)] mb-4">Lessons Learned</h2>
                <ul className="space-y-2 text-xs text-[var(--text-secondary)] leading-relaxed">
                  {caseStudy.lessonsLearned.map((lesson, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-500 dark:text-emerald-400 mt-0.5" aria-hidden="true">&bull;</span>
                      <span>{lesson}</span>
                    </li>
                  ))}
                </ul>
              </LiquidGlass>
            )}
          </div>
        </div>

        {/* Footer Navigation */}
        <footer className="mt-16 pt-8 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row justify-between gap-4">
          {prevProject ? (
            <Link
              href={`/projects/${prevProject.slug}`}
              className="p-4 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-hover)] transition-colors w-full sm:w-1/2 min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
            >
              <span className="text-xs text-[var(--text-muted)] mb-1 flex items-center gap-1">
                <ArrowLeft size={12} aria-hidden="true" />
                <span>Previous Case Study</span>
              </span>
              <span className="font-semibold text-sm text-[var(--text-primary)] line-clamp-1">{prevProject.name}</span>
            </Link>
          ) : (
            <div className="w-full sm:w-1/2" />
          )}

          {nextProject ? (
            <Link
              href={`/projects/${nextProject.slug}`}
              className="p-4 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-hover)] transition-colors w-full sm:w-1/2 text-right min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
            >
              <span className="text-xs text-[var(--text-muted)] mb-1 flex items-center gap-1 justify-end">
                <span>Next Case Study</span>
                <ArrowUpRight size={12} aria-hidden="true" />
              </span>
              <span className="font-semibold text-sm text-[var(--text-primary)] line-clamp-1">{nextProject.name}</span>
            </Link>
          ) : (
            <div className="w-full sm:w-1/2" />
          )}
        </footer>
      </div>
    </article>
  );
}
