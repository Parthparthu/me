'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, GraduationCap, Github, Medal, Star, Brain, ExternalLink, X, FileCheck, Award, type LucideIcon } from 'lucide-react';
import { achievements, verifiedCertificates, type VerifiedCertificate } from '@/data/achievements';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { getAssetPath } from '@/lib/utils';

const ICON_MAP: Record<string, LucideIcon> = {
  Trophy,
  GraduationCap,
  Github,
  Medal,
  Star,
};

const SPRING = { type: 'spring', stiffness: 280, damping: 28 } as const;

export function AchievementsSection() {
  const featured = achievements.find((a) => a.highlight) || achievements[0];
  const secondary = achievements.filter((a) => a.id !== featured?.id);
  const FeaturedIcon = featured ? ICON_MAP[featured.icon] || Trophy : Trophy;

  const [activeModal, setActiveModal] = useState<VerifiedCertificate | null>(null);

  return (
    <section
      id="achievements"
      className="py-24 px-4 md:px-8 max-w-6xl mx-auto w-full scroll-mt-24"
      aria-label="Achievements and Recognition"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={SPRING}
        className="mb-14"
      >
        <span className="section-label">
          <span aria-hidden="true">#</span>
          Recognition
        </span>
        <h2 className="section-title text-[var(--text-primary)] mt-1">
          Honours &amp; Verified Evidence
        </h2>
        <p className="section-subtitle mt-2">
          Competitive honours and certified credentials substantiated by original documents and photographs.
        </p>
      </motion.div>

      {/* Featured: World Memory Championship Bronze Medal with Evidence Photo */}
      {featured && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={SPRING}
          className="mb-10"
        >
          <LiquidGlass
            elevation={4}
            tint="amber"
            radius={14}
            className="p-7 md:p-9 relative overflow-hidden"
          >
            <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start lg:items-center">
              {/* Certificate & Medal Photo Thumbnail */}
              <div className="w-full lg:w-72 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const wmcCert = verifiedCertificates.find((c) => c.id === 'wmc-2023');
                    if (wmcCert) setActiveModal(wmcCert);
                  }}
                  className="group relative w-full h-56 rounded-lg overflow-hidden border border-amber-500/30 bg-black/40 block text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)] min-h-[44px]"
                  aria-label="View World Memory Championship Bronze Medal certificate photograph"
                >
                  <Image
                    src={getAssetPath(featured.image || '/certificates/wmc-2023-bronze-medal.jpg')}
                    alt="World Memory Championship 2023 Bronze Medal and Top Amateur Certificate photograph"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                    <span className="text-xs font-mono font-medium text-amber-300 flex items-center gap-1.5">
                      <FileCheck size={14} aria-hidden="true" />
                      <span>View Official Evidence</span>
                    </span>
                  </div>
                </button>
              </div>

              {/* Text content */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2.5 mb-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-xs font-mono font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                    <Award size={13} aria-hidden="true" />
                    <span>Competitive Honour</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-[var(--text-muted)] tabular-nums">
                    {featured.year}
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-display font-bold text-[var(--text-primary)] mb-2 leading-tight">
                  {featured.title}
                </h3>
                <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed mb-4">
                  {featured.description}
                </p>

                {featured.details && (
                  <div className="p-3.5 rounded-lg bg-white/5 border border-amber-500/20 text-xs font-mono text-amber-200/90 flex items-start gap-2.5">
                    <Brain size={16} className="text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{featured.details}</span>
                  </div>
                )}
              </div>
            </div>
          </LiquidGlass>
        </motion.div>
      )}

      {/* Secondary achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
        {secondary.map((achievement, index) => {
          const Icon = ICON_MAP[achievement.icon] || Star;

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ ...SPRING, delay: index * 0.06 }}
            >
              <LiquidGlass
                elevation={2}
                tint="neutral"
                radius={14}
                  className="h-full p-6 flex items-start gap-4"
              >
                <div className="p-2.5 rounded-lg bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] text-[var(--accent-primary)] flex-shrink-0">
                  <Icon size={20} aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <h4 className="text-base font-bold text-[var(--text-primary)] leading-tight">
                      {achievement.title}
                    </h4>
                    <span className="text-xs font-mono text-[var(--text-muted)] tabular-nums">
                      {achievement.year}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {achievement.description}
                  </p>
                </div>
              </LiquidGlass>
            </motion.div>
          );
        })}
      </div>

      {/* Verified Certificates & Credentials Grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={SPRING}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[var(--border-subtle)] pb-4">
          <div>
            <h3 className="text-xl font-display font-bold text-[var(--text-primary)]">
              Documented Certificates &amp; Credentials
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono">
              Verified original documentation archived in repository files.
            </p>
          </div>
          <span className="text-xs font-mono text-[var(--accent-primary)]">
            {verifiedCertificates.length} Verified Documents
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {verifiedCertificates.map((cert) => (
            <LiquidGlass
              key={cert.id}
              elevation={2}
              tint="neutral"
              radius={14}
              className="p-5 flex flex-col justify-between group hover:border-[var(--border-medium)] transition-colors"
            >
              <div>
                {/* Thumbnail */}
                <button
                  type="button"
                  onClick={() => setActiveModal(cert)}
                  className="relative w-full h-36 rounded-lg overflow-hidden bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] mb-4 block group-hover:border-[var(--border-medium)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)] min-h-[44px]"
                  aria-label={`View full certificate: ${cert.title}`}
                >
                  <Image
                    src={getAssetPath(cert.imagePreview)}
                    alt={cert.title}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-200"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors" />
                </button>

                <div className="flex items-center justify-between gap-2 mb-2 font-mono text-[11px]">
                  <span className="text-[var(--accent-primary)] font-medium">
                    {cert.issuer}
                  </span>
                  <span className="text-[var(--text-muted)] tabular-nums">
                    {cert.year}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[var(--text-primary)] leading-snug mb-2 font-sans">
                  {cert.title}
                </h4>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                  {cert.description}
                </p>
              </div>

              {/* Action Buttons: 8px radius */}
              <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(cert)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-primary)] hover:underline min-h-[44px] p-1 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
                >
                  <FileCheck size={14} aria-hidden="true" />
                  <span>Inspect Document</span>
                </button>

                <a
                  href={getAssetPath(cert.documentUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors min-h-[44px] p-1 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
                  aria-label={`Open document for ${cert.title}`}
                >
                  <span>Raw File</span>
                  <ExternalLink size={12} aria-hidden="true" />
                </a>
              </div>
            </LiquidGlass>
          ))}
        </div>
      </motion.div>

      {/* Accessible Document Preview Lightbox Modal */}
      <AnimatePresence>
        {activeModal && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={activeModal.title}
            className="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full max-h-[90vh] bg-[var(--bg-surface)] border border-[var(--border-specular)] rounded-[14px] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-2)]">
                <div>
                  <h4 className="text-base font-bold text-[var(--text-primary)] font-sans">
                    {activeModal.title}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] font-mono">
                    {activeModal.issuer} &middot; {activeModal.year}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
                  aria-label="Close document modal"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>

              {/* Modal image preview */}
              <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center bg-black/60">
                <div className="relative w-full max-h-[65vh] min-h-[300px] flex items-center justify-center">
                  <Image
                    src={getAssetPath(activeModal.imagePreview)}
                    alt={activeModal.title}
                    width={1000}
                    height={800}
                    className="max-h-[65vh] w-auto object-contain rounded-md shadow-lg"
                  />
                </div>
              </div>

              {/* Modal footer */}
              <div className="px-6 py-3.5 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-2)] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                <span className="text-[var(--text-secondary)]">
                  Awarded to: <strong className="text-[var(--text-primary)] font-sans">{activeModal.recipient}</strong>
                </span>

                <div className="flex items-center gap-3">
                  <a
                    href={getAssetPath(activeModal.documentUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-[var(--text-on-accent)] font-semibold hover:bg-[var(--accent-primary-hover)] transition-colors min-h-[44px] flex items-center justify-center"
                  >
                    <span>Open Original Document</span>
                    <ExternalLink size={12} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
