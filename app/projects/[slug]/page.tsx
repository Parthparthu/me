import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Github, ArrowUpRight, CheckCircle2, Cpu } from 'lucide-react';
import { projects } from '@/data/projects';
import { LiquidGlass } from '@/components/glass/LiquidGlass';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const project = projects.find((p) => p.slug === resolvedParams.slug);

  if (!project) {
    return { title: 'Project Not Found | Pradyumna' };
  }

  return {
    title: `${project.name} Case Study | Pradyumna`,
    description: project.tagline,
  };
}

export default async function ProjectCaseStudyPage({ params }: Props) {
  const resolvedParams = await params;
  const projectIndex = projects.findIndex((p) => p.slug === resolvedParams.slug);
  const project = projects[projectIndex];

  if (!project) {
    notFound();
  }

  const prevProject = projectIndex > 0 ? projects[projectIndex - 1] : null;
  const nextProject = projectIndex < projects.length - 1 ? projects[projectIndex + 1] : null;
  const caseStudy = project.caseStudy;

  return (
    <article className="min-h-screen pt-28 pb-24 text-[var(--text-primary)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors min-h-[44px]"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </Link>
        </div>

        {/* Header Section */}
        <header className="mb-14">
          <div className="flex flex-wrap items-center gap-2.5 mb-6">
            <span className="badge">{project.category}</span>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-mono bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
              {project.date}
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-mono bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
              {project.tier}
            </span>
            {project.status === 'Active Development' && (
              <span className="flex items-center gap-1.5 text-xs font-mono font-medium px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-sm bg-emerald-400 animate-pulse" />
                Active Development
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4 text-[var(--text-primary)] tracking-tight leading-tight">
            {project.name}
          </h1>

          <p className="text-lg sm:text-xl text-[var(--accent-primary)] font-medium mb-6 leading-relaxed">
            {project.tagline}
          </p>

          <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8 max-w-2xl">
            {project.longDescription}
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-8">
            {project.repositoryUrl && (
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--bg-surface)] border border-[var(--border-medium)] hover:bg-white/5 transition-colors text-xs font-semibold min-h-[44px]"
              >
                <Github size={15} />
                <span>Source Repository</span>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors text-xs font-semibold shadow-md min-h-[44px]"
              >
                <ArrowUpRight size={15} />
                <span>Live Deployment</span>
              </a>
            )}
          </div>

          {/* Tech Badges */}
          <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[var(--border-subtle)]">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="text-xs font-mono px-2.5 py-1 rounded-md bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] text-[var(--text-secondary)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </header>

        {/* Case Study Content */}
        <div className="space-y-10">
          {/* Problem & Solution */}
          <div className="grid md:grid-cols-2 gap-6">
            {caseStudy?.problem && (
              <LiquidGlass elevation={2} tint="neutral" radius={12} className="p-6 border border-[var(--border-subtle)]">
                <h2 className="text-base font-display font-bold text-[var(--text-primary)] mb-2">The Problem</h2>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {caseStudy.problem}
                </p>
              </LiquidGlass>
            )}

            {caseStudy?.solution && (
              <LiquidGlass elevation={2} tint="cyan" radius={12} className="p-6 border border-[var(--accent-primary-border)]">
                <h2 className="text-base font-display font-bold text-[var(--text-primary)] mb-2">The Solution</h2>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {caseStudy.solution}
                </p>
              </LiquidGlass>
            )}
          </div>

          {/* Architecture Highlight */}
          {caseStudy?.architecture && (
            <LiquidGlass elevation={3} tint="neutral" radius={12} className="p-6 sm:p-8 border border-[var(--border-medium)]">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--accent-primary)] font-bold mb-2">
                <Cpu size={15} />
                <span>System Architecture</span>
              </div>
              <p className="text-base text-[var(--text-primary)] leading-relaxed font-mono">
                {caseStudy.architecture}
              </p>
            </LiquidGlass>
          )}

          {/* Key Features */}
          {caseStudy?.keyFeatures && caseStudy.keyFeatures.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-display font-bold text-[var(--text-primary)]">Key Features</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {caseStudy.keyFeatures.map((feature, idx) => (
                  <LiquidGlass key={idx} elevation={1} tint="neutral" radius={8} className="p-4 flex items-start gap-3 border border-[var(--border-subtle)]">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-[var(--text-secondary)] leading-relaxed">{feature}</span>
                  </LiquidGlass>
                ))}
              </div>
            </section>
          )}

          {/* Engineering Decisions & Tradeoffs */}
          {caseStudy?.engineeringDecisions && caseStudy.engineeringDecisions.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-display font-bold text-[var(--text-primary)]">Engineering Decisions</h2>
              <div className="space-y-4">
                {caseStudy.engineeringDecisions.map((decision, idx) => (
                  <LiquidGlass key={idx} elevation={2} tint="neutral" radius={12} className="p-6 border border-[var(--border-subtle)]">
                    <h3 className="font-bold text-sm text-[var(--text-primary)] mb-2">{decision.decision}</h3>
                    <div className="space-y-2 text-xs text-[var(--text-secondary)] leading-relaxed">
                      <p>
                        <strong className="text-[var(--text-primary)] font-semibold">Rationale:</strong> {decision.rationale}
                      </p>
                      {decision.tradeoff && (
                        <p>
                          <strong className="text-amber-400 font-semibold">Tradeoff:</strong> {decision.tradeoff}
                        </p>
                      )}
                    </div>
                  </LiquidGlass>
                ))}
              </div>
            </section>
          )}

          {/* Challenges & Lessons Learned */}
          <div className="grid md:grid-cols-2 gap-6">
            {caseStudy?.challenges && caseStudy.challenges.length > 0 && (
              <LiquidGlass elevation={2} tint="neutral" radius={12} className="p-6 border border-[var(--border-subtle)]">
                <h2 className="text-base font-display font-bold text-[var(--text-primary)] mb-3">Challenges Encountered</h2>
                <ul className="space-y-2 text-xs text-[var(--text-secondary)] leading-relaxed">
                  {caseStudy.challenges.map((challenge, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 mt-0.5">•</span>
                      <span>{challenge}</span>
                    </li>
                  ))}
                </ul>
              </LiquidGlass>
            )}

            {caseStudy?.lessonsLearned && caseStudy.lessonsLearned.length > 0 && (
              <LiquidGlass elevation={2} tint="neutral" radius={12} className="p-6 border border-[var(--border-subtle)]">
                <h2 className="text-base font-display font-bold text-[var(--text-primary)] mb-3">Lessons Learned</h2>
                <ul className="space-y-2 text-xs text-[var(--text-secondary)] leading-relaxed">
                  {caseStudy.lessonsLearned.map((lesson, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">•</span>
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
              className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-colors w-full sm:w-1/2 min-h-[44px]"
            >
              <span className="text-xs text-[var(--text-muted)] mb-1 flex items-center gap-1">
                <ArrowLeft size={12} /> Previous Case Study
              </span>
              <span className="font-semibold text-sm text-[var(--text-primary)] line-clamp-1">{prevProject.name}</span>
            </Link>
          ) : (
            <div className="w-full sm:w-1/2" />
          )}

          {nextProject ? (
            <Link
              href={`/projects/${nextProject.slug}`}
              className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-colors w-full sm:w-1/2 text-right min-h-[44px]"
            >
              <span className="text-xs text-[var(--text-muted)] mb-1 flex items-center gap-1 justify-end">
                Next Case Study <ArrowUpRight size={12} />
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
