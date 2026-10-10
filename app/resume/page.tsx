/**
 * /resume: Curriculum Vitae with Liquid Glass styling.
 * Displays education, WMC bronze medal, technical skills, and core engineering projects.
 */
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Download, Mail, Github, Linkedin, ExternalLink, Trophy, GraduationCap, MapPin } from 'lucide-react';
import { profile } from '@/data/profile';
import { skillCategories } from '@/data/skills';
import { projects } from '@/data/projects';
import { verifiedCertificates } from '@/data/achievements';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { getAssetPath } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Resume: Pradyuma',
  description:
    'Curriculum Vitae and technical resume of Pradyuma, CSE (AI/ML) student at GL Bajaj ITM, software and web developer.',
};

export default function ResumePage() {
  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-white">
      {/* Navigation & Actions */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-colors min-h-[44px] p-1 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Back to Portfolio</span>
        </Link>

        <a
          href={getAssetPath('/resume.pdf')}
          download="Pradyuma_Resume.pdf"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--accent-primary)] text-white text-xs font-semibold shadow-md hover:bg-[var(--accent-primary-hover)] transition-colors min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
        >
          <Download size={14} aria-hidden="true" />
          <span>Download PDF</span>
        </a>
      </div>

      {/* Main Resume Sheet */}
      <LiquidGlass elevation={3} tint="neutral" radius={14} dynamicLight={false} className="p-8 md:p-12 space-y-12">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2 tracking-tight">
              {profile.name}
            </h1>
            <p className="text-base text-[var(--accent-primary)] font-medium mb-3">
              {profile.title}
            </p>
            <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
              <MapPin size={13} className="text-[var(--text-muted)]" aria-hidden="true" />
              <span>{profile.education.location}</span>
            </p>
          </div>

          <div className="flex flex-col gap-2 text-xs font-mono text-[var(--text-secondary)]">
            <a
              href="mailto:pradyumna05@outlook.in"
              className="hover:text-white flex items-center gap-2 transition-colors min-h-[36px]"
            >
              <Mail size={14} className="text-[var(--accent-primary)]" aria-hidden="true" />
              <span>pradyumna05@outlook.in</span>
            </a>
            <a
              href="https://github.com/Parthparthu"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white flex items-center gap-2 transition-colors min-h-[36px]"
            >
              <Github size={14} aria-hidden="true" />
              <span>github.com/Parthparthu</span>
            </a>
            <a
              href="https://www.linkedin.com/in/pradyumna05"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white flex items-center gap-2 transition-colors min-h-[36px]"
            >
              <Linkedin size={14} className="text-[var(--accent-primary)]" aria-hidden="true" />
              <span>linkedin.com/in/pradyumna05</span>
            </a>
          </div>
        </div>

        {/* Education & Key Distinction */}
        <section className="space-y-4">
          <h2 className="font-display font-bold text-white uppercase tracking-wider text-xs font-mono">
            Education and Honours
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 rounded-lg bg-white/5 border border-white/8">
              <div className="flex items-center gap-2 font-bold text-white mb-1">
                <GraduationCap size={16} className="text-[var(--accent-primary)]" aria-hidden="true" />
                <span>{profile.education.degree} ({profile.education.year})</span>
              </div>
              <p className="text-xs text-[var(--accent-primary)] mb-1">{profile.education.field}</p>
              <p className="text-xs text-[var(--text-tertiary)]">{profile.education.institution}</p>
              <p className="text-[11px] font-mono text-[var(--text-muted)] mt-2">{profile.education.period}</p>
            </div>

            <div className="p-5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center gap-2 font-bold text-amber-300 mb-1">
                <Trophy size={16} className="text-amber-400" aria-hidden="true" />
                <span>World Memory Championship 2023</span>
              </div>
              <p className="text-xs text-amber-200/90 mb-1">Bronze Medalist (Top Amateur)</p>
              <p className="text-xs text-[var(--text-secondary)]">
                IAM World Memory Championship 2023 (Navi Mumbai). Verified by official medal and arbiters certificate.
              </p>
            </div>
          </div>
        </section>

        {/* Documented Credentials and Certificates */}
        <section className="space-y-4">
          <h2 className="font-display font-bold text-white uppercase tracking-wider text-xs font-mono">
            Documented Credentials and Certificates
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {verifiedCertificates.map((cert) => (
              <div
                key={cert.id}
                className="p-3.5 rounded-lg bg-white/5 border border-white/8 flex items-center justify-between gap-3 hover:border-white/15 transition-colors"
              >
                <div>
                  <h3 className="text-xs font-bold text-white leading-snug">{cert.title}</h3>
                  <p className="text-[11px] text-[var(--text-muted)] font-mono">
                    {cert.issuer} &middot; {cert.year}
                  </p>
                </div>
                <a
                  href={getAssetPath(cert.documentUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[var(--accent-primary)] hover:underline flex items-center gap-1 flex-shrink-0 min-h-[36px] p-1 font-mono"
                  aria-label={`View evidence for ${cert.title}`}
                >
                  <span>Evidence</span>
                  <ExternalLink size={11} aria-hidden="true" />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Competencies */}
        <section className="space-y-4">
          <h2 className="font-display font-bold text-white uppercase tracking-wider text-xs font-mono">
            Technical Competencies
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillCategories.map((category) => (
              <div key={category.id} className="p-4 rounded-lg bg-white/5 border border-white/8">
                <h3 className="text-xs font-bold text-white mb-2">{category.title}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {category.skills.map((skill) => (
                    <span
                      key={skill.name}
                      className="text-[11px] px-2 py-0.5 rounded-sm bg-white/6 text-[var(--text-secondary)] border border-white/6"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Production Systems */}
        <section className="space-y-4">
          <h2 className="font-display font-bold text-white uppercase tracking-wider text-xs font-mono">
            Flagship Engineering Systems
          </h2>
          <div className="space-y-4">
            {featuredProjects.map((project) => (
              <div key={project.id} className="p-5 rounded-lg bg-white/5 border border-white/8 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-mono">
                    <h3 className="font-bold text-sm text-white font-sans">{project.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-sm bg-white/8 text-[var(--accent-primary)] font-mono">
                      {project.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {project.repositoryUrl && (
                      <a
                        href={project.repositoryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[var(--text-muted)] hover:text-white flex items-center gap-1"
                      >
                        <span>GitHub</span>
                        <ExternalLink size={10} aria-hidden="true" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[var(--accent-primary)] hover:underline flex items-center gap-1"
                      >
                        <span>Live</span>
                        <ExternalLink size={10} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {project.shortDescription}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1 font-mono">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] px-1.5 py-0.5 rounded-xs bg-white/5 text-[var(--text-muted)] border border-white/6"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </LiquidGlass>
    </div>
  );
}
