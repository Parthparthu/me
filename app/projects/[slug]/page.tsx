import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Github, ArrowUpRight, CheckCircle2, Cpu, Sparkles } from 'lucide-react';
import { projects } from '@/data/projects';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { GlassButton } from '@/components/glass/GlassVariants';

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
    <article className="min-h-screen pt-28 pb-24 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </Link>
        </div>

        {/* Header Section */}
        <header className="mb-14">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="badge">{project.category}</span>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/6 border border-white/10 text-[var(--text-secondary)]">
              {project.date}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/6 border border-white/10 text-[var(--text-muted)]">
              {project.tier}
            </span>
            {project.status === 'Active Development' && (
              <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Development
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 text-white tracking-tight leading-none">
            {project.name}
          </h1>

          <p className="text-xl md:text-2xl text-[var(--text-secondary)] font-light mb-8 leading-relaxed">
            {project.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            {project.repositoryUrl && (
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/8 border border-white/12 hover:bg-white/15 transition-all text-sm font-medium min-h-[44px]"
              >
                <Github size={16} />
                <span>GitHub Repository</span>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary)]/90 transition-all text-sm font-semibold shadow-lg min-h-[44px]"
              >
                <ArrowUpRight size={16} />
                <span>Live Deployment</span>
              </a>
            )}
          </div>

          {/* Tech Badges */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/8">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="text-xs font-mono px-3 py-1 rounded-md bg-white/5 border border-white/8 text-[var(--text-secondary)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </header>

        {/* Case Study Content */}
        <div className="space-y-12">
          {/* Problem & Solution in Glass Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {caseStudy?.problem && (
              <LiquidGlass elevation={2} tint="neutral" radius={24} className="p-7">
                <h2 className="text-lg font-display font-bold text-white mb-3">The Problem</h2>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {caseStudy.problem}
                </p>
              </LiquidGlass>
            )}

            {caseStudy?.solution && (
              <LiquidGlass elevation={2} tint="cyan" radius={24} className="p-7">
                <h2 className="text-lg font-display font-bold text-white mb-3">The Solution</h2>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {caseStudy.solution}
                </p>
              </LiquidGlass>
            )}
          </div>

          {/* Architecture Highlight */}
          {caseStudy?.architecture && (
            <LiquidGlass elevation={3} tint="violet" radius={28} className="p-8 md:p-10 relative overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--accent-cyan)] font-bold mb-3">
                <Cpu size={16} />
                <span>System Architecture</span>
              </div>
              <p className="text-base md:text-lg text-white/90 leading-relaxed font-sans">
                {caseStudy.architecture}
              </p>
            </LiquidGlass>
          )}

          {/* Key Features */}
          {caseStudy?.keyFeatures && caseStudy.keyFeatures.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-white">Key Features</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {caseStudy.keyFeatures.map((feature, idx) => (
                  <LiquidGlass key={idx} elevation={1} tint="neutral" radius={18} className="p-4 flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[var(--text-secondary)] leading-relaxed">{feature}</span>
                  </LiquidGlass>
                ))}
              </div>
            </section>
          )}

          {/* Engineering Decisions & Tradeoffs */}
          {caseStudy?.engineeringDecisions && caseStudy.engineeringDecisions.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-white">Engineering Decisions</h2>
              <div className="space-y-4">
                {caseStudy.engineeringDecisions.map((decision, idx) => (
                  <LiquidGlass key={idx} elevation={2} tint="neutral" radius={22} className="p-6 md:p-7">
                    <h3 className="font-bold text-base text-white mb-3">{decision.decision}</h3>
                    <div className="space-y-2 text-xs text-[var(--text-secondary)] leading-relaxed">
                      <p>
                        <strong className="text-white">Rationale:</strong> {decision.rationale}
                      </p>
                      {decision.tradeoff && (
                        <p>
                          <strong className="text-amber-400">Tradeoff:</strong> {decision.tradeoff}
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
              <h2 className="text-2xl font-display font-bold text-white">Impact & Metrics</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {caseStudy.metrics.map((metric, idx) => (
                  <LiquidGlass key={idx} elevation={2} tint="violet" radius={20} className="p-6 text-center">
                    <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-1 font-semibold">
                      {metric.label}
                    </div>
                    <div className="text-2xl md:text-3xl font-display font-bold text-white tabular-nums">
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
              <LiquidGlass elevation={2} tint="neutral" radius={22} className="p-6">
                <h2 className="text-lg font-display font-bold text-white mb-4">Challenges</h2>
                <ul className="space-y-2 text-xs text-[var(--text-secondary)] leading-relaxed">
                  {caseStudy.challenges.map((challenge, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[var(--accent-rose)] mt-0.5">•</span>
                      <span>{challenge}</span>
                    </li>
                  ))}
                </ul>
              </LiquidGlass>
            )}

            {caseStudy?.lessonsLearned && caseStudy.lessonsLearned.length > 0 && (
              <LiquidGlass elevation={2} tint="neutral" radius={22} className="p-6">
                <h2 className="text-lg font-display font-bold text-white mb-4">Lessons Learned</h2>
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
        <footer className="mt-20 pt-8 border-t border-white/8 flex flex-col sm:flex-row justify-between gap-4">
          {prevProject ? (
            <Link
              href={`/projects/${prevProject.slug}`}
              className="p-4 rounded-2xl bg-white/5 border border-white/8 hover:bg-white/10 transition-colors w-full sm:w-1/2 min-h-[44px]"
            >
              <span className="text-xs text-[var(--text-muted)] mb-1 flex items-center gap-1">
                <ArrowLeft size={12} /> Previous Case Study
              </span>
              <span className="font-semibold text-sm text-white line-clamp-1">{prevProject.name}</span>
            </Link>
          ) : (
            <div className="w-full sm:w-1/2" />
          )}

          {nextProject ? (
            <Link
              href={`/projects/${nextProject.slug}`}
              className="p-4 rounded-2xl bg-white/5 border border-white/8 hover:bg-white/10 transition-colors w-full sm:w-1/2 text-right min-h-[44px]"
            >
              <span className="text-xs text-[var(--text-muted)] mb-1 flex items-center gap-1 justify-end">
                Next Case Study <ArrowUpRight size={12} />
              </span>
              <span className="font-semibold text-sm text-white line-clamp-1">{nextProject.name}</span>
            </Link>
          ) : (
            <div className="w-full sm:w-1/2" />
          )}
        </footer>
      </div>
    </article>
  );
}
