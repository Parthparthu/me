'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  GraduationCap,
  Github,
  Medal,
  Star,
  Brain,
  ExternalLink,
  X,
  FileCheck,
  Award,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react';
import { achievements, verifiedCertificates, type VerifiedCertificate } from '@/data/achievements';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { ParallaxCard, ParallaxImage } from '@/components/parallax';
import { getAssetPath } from '@/lib/utils';
import { POINTER_REACTIVE_3D } from '@/lib/config';

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

  const primaryCert = verifiedCertificates.find((c) => c.id === 'wmc-2023') || verifiedCertificates[0];
  const additionalCerts = verifiedCertificates.filter((c) => c.id !== primaryCert?.id);

  const [activeModal, setActiveModal] = useState<VerifiedCertificate | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const modalCloseBtnRef = useRef<HTMLButtonElement | null>(null);

  const openModal = (cert: VerifiedCertificate, e?: React.MouseEvent<HTMLElement>) => {
    if (e?.currentTarget) {
      triggerRef.current = e.currentTarget;
    }
    setActiveModal(cert);
  };

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setTimeout(() => {
      triggerRef.current?.focus();
    }, 50);
  }, []);

  // Keyboard navigation: Escape key closes modal & returns focus
  useEffect(() => {
    if (!activeModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Focus the close button when opened
    setTimeout(() => {
      modalCloseBtnRef.current?.focus();
    }, 60);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, closeModal]);

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
            radius={16}
            dynamicLight={POINTER_REACTIVE_3D}
            className="p-7 md:p-9 relative overflow-hidden border border-[var(--separator)]"
          >
            <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start lg:items-center">
              {/* Certificate & Medal Photo Thumbnail with reserved aspect ratio */}
              <div className="w-full lg:w-80 flex-shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    const wmcCert = verifiedCertificates.find((c) => c.id === 'wmc-2023');
                    if (wmcCert) openModal(wmcCert, e);
                  }}
                  className="group relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-[var(--accent-amber-border)] bg-black/40 block text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] min-h-[44px]"
                  aria-label="View World Memory Championship Bronze Medal certificate photograph"
                >
                  <Image
                    src={getAssetPath(featured.image || '/certificates/wmc-2023-bronze-medal.jpg')}
                    alt="World Memory Championship 2023 Bronze Medal and Top Amateur Certificate photograph"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 320px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                    <span className="text-xs font-mono font-medium text-[var(--accent-amber)] flex items-center gap-1.5">
                      <FileCheck size={14} aria-hidden="true" />
                      <span>View Official Evidence</span>
                    </span>
                  </div>
                </button>
              </div>

              {/* Text content */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2.5 mb-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-xs font-mono font-semibold bg-[var(--accent-amber-subtle)] border border-[var(--accent-amber-border)] text-[var(--accent-amber)]">
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
                  <div className="p-3.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--accent-amber-border)] text-xs font-mono text-[var(--text-secondary)] flex items-start gap-2.5">
                    <Brain size={16} className="text-[var(--accent-amber)] flex-shrink-0 mt-0.5" aria-hidden="true" />
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
            <ParallaxCard key={achievement.id} index={index} className="h-full">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ ...SPRING, delay: index * 0.06 }}
                className="h-full"
              >
                <LiquidGlass
                  elevation={2}
                  tint="neutral"
                  radius={14}
                  dynamicLight={POINTER_REACTIVE_3D}
                  className="h-full p-6 flex items-start gap-4 border border-[var(--separator)]"
                >
                  <div className="p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--separator)] text-[var(--accent)] flex-shrink-0">
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
            </ParallaxCard>
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
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[var(--separator)] pb-4">
          <div>
            <h3 className="text-xl font-display font-bold text-[var(--text-primary)]">
              Documented Certificates &amp; Credentials
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">
              Verified original documentation archived in repository files.
            </p>
          </div>
          <span className="text-xs font-mono text-[var(--accent)] font-semibold">
            {verifiedCertificates.length} Verified Documents
          </span>
        </div>

        {/* Primary Featured Credential (WMC Bronze Medal & Top Amateur) */}
        {primaryCert && (
          <div className="mb-6">
            <ParallaxCard index={0} className="w-full">
              <LiquidGlass
                elevation={3}
                tint="amber"
                radius={16}
                dynamicLight={POINTER_REACTIVE_3D}
                className="p-6 md:p-7 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border border-[var(--separator)]"
              >
                <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center flex-1">
                  <button
                    type="button"
                    onClick={(e) => openModal(primaryCert, e)}
                    className="relative w-full sm:w-48 aspect-[16/10] rounded-lg overflow-hidden bg-[var(--bg-secondary)] border border-[var(--accent-amber-border)] block group hover:border-[var(--accent-amber)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] min-h-[44px] flex-shrink-0"
                    aria-label={`View full certificate: ${primaryCert.title}`}
                  >
                    <Image
                      src={getAssetPath(primaryCert.imagePreview)}
                      alt={primaryCert.title}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-200"
                      sizes="(max-width: 640px) 100vw, 200px"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-opacity" />
                  </button>

                  <div>
                    <div className="flex items-center gap-2 mb-1.5 font-mono text-xs">
                      <span className="text-[var(--accent-amber)] font-semibold">
                        {primaryCert.issuer}
                      </span>
                      <span className="text-[var(--text-muted)]">&middot;</span>
                      <span className="text-[var(--text-muted)] tabular-nums">
                        {primaryCert.year}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-[var(--text-primary)] leading-tight mb-2 font-sans">
                      {primaryCert.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                      {primaryCert.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-[var(--separator)] w-full md:w-auto justify-end">
                  <button
                    type="button"
                    onClick={(e) => openModal(primaryCert, e)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-[var(--accent-amber-subtle)] text-[var(--accent-amber)] border border-[var(--accent-amber-border)] hover:bg-[var(--accent-amber)] hover:text-black transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                  >
                    <FileCheck size={14} aria-hidden="true" />
                    <span>Inspect Evidence</span>
                  </button>

                  <a
                    href={getAssetPath(primaryCert.documentUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors min-h-[44px] px-3 py-2 rounded-lg border border-[var(--separator)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                    aria-label={`Open original document for ${primaryCert.title}`}
                  >
                    <span>Raw Document</span>
                    <ExternalLink size={12} aria-hidden="true" />
                  </a>
                </div>
              </LiquidGlass>
            </ParallaxCard>
          </div>
        )}

        {/* Collapsible Disclosure for 6 Foundational & Academic Credentials */}
        <details className="group border border-[var(--separator)] rounded-[14px] bg-[var(--bg-surface)] overflow-hidden transition-all duration-300">
          <summary className="flex items-center justify-between p-5 cursor-pointer list-none select-none hover:bg-[var(--bg-surface-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] min-h-[48px]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] border border-[var(--separator)] flex items-center justify-center text-[var(--accent)]">
                <FileCheck size={16} aria-hidden="true" />
              </div>
              <div className="text-left">
                <span className="text-sm font-bold text-[var(--text-primary)] block font-sans">
                  Foundational &amp; Academic Credentials ({additionalCerts.length})
                </span>
                <span className="text-xs text-[var(--text-muted)] font-mono">
                  Certifications in app development, game design, and early competitive logic (2019 - 2024)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[var(--accent)] group-open:hidden">
                Show All
              </span>
              <span className="text-xs font-mono text-[var(--accent)] hidden group-open:inline">
                Hide
              </span>
              <ChevronDown
                size={16}
                className="text-[var(--text-muted)] group-open:rotate-180 transition-transform duration-200"
                aria-hidden="true"
              />
            </div>
          </summary>

          <div className="p-5 pt-2 border-t border-[var(--separator)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-3">
              {additionalCerts.map((cert, index) => (
                <ParallaxCard key={cert.id} index={index} className="h-full">
                  <LiquidGlass
                    elevation={2}
                    tint="neutral"
                    radius={14}
                    dynamicLight={POINTER_REACTIVE_3D}
                    className="p-5 flex flex-col justify-between group hover:border-[var(--accent-border)] transition-[border-color] duration-[var(--dur-base)] border border-[var(--separator)] h-full"
                  >
                    <div>
                      {/* Thumbnail with internal parallax */}
                      <button
                        type="button"
                        onClick={(e) => openModal(cert, e)}
                        className="relative w-full aspect-[16/10] rounded-lg overflow-hidden bg-[var(--bg-secondary)] border border-[var(--separator)] mb-4 block group-hover:border-[var(--accent-border)] transition-[border-color] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] min-h-[44px]"
                        aria-label={`View full certificate: ${cert.title}`}
                      >
                        <ParallaxImage containerClassName="w-full h-full relative overflow-hidden">
                          <Image
                            src={getAssetPath(cert.imagePreview)}
                            alt={cert.title}
                            fill
                            className="object-cover object-top group-hover:scale-105 transition-transform duration-200"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-opacity" />
                        </ParallaxImage>
                      </button>

                      <div className="flex items-center justify-between gap-2 mb-2 font-mono text-[11px]">
                        <span className="text-[var(--accent)] font-medium">
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

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-[var(--separator)] flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={(e) => openModal(cert, e)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] hover:underline min-h-[44px] px-2 py-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                      >
                        <FileCheck size={14} aria-hidden="true" />
                        <span>Inspect Document</span>
                      </button>

                      <a
                        href={getAssetPath(cert.documentUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors min-h-[44px] px-2 py-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                        aria-label={`Open original document for ${cert.title}`}
                      >
                        <span>Raw File</span>
                        <ExternalLink size={12} aria-hidden="true" />
                      </a>
                    </div>
                  </LiquidGlass>
                </ParallaxCard>
              ))}
            </div>
          </div>
        </details>
      </motion.div>

      {/* Accessible Document Preview Lightbox Modal with Keyboard Trap & Escape Listener */}
      <AnimatePresence>
        {activeModal && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={activeModal.title}
            className="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full max-h-[90vh] bg-[var(--bg-elevated)] border border-[var(--separator)] rounded-[14px] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--separator)] bg-[var(--bg-secondary)]">
                <div>
                  <h4 className="text-base font-bold text-[var(--text-primary)] font-sans">
                    {activeModal.title}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] font-mono">
                    {activeModal.issuer} &middot; {activeModal.year}
                  </p>
                </div>

                <button
                  ref={modalCloseBtnRef}
                  type="button"
                  onClick={closeModal}
                  className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
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
              <div className="px-6 py-3.5 border-t border-[var(--separator)] bg-[var(--bg-secondary)] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                <span className="text-[var(--text-secondary)]">
                  Awarded to: <strong className="text-[var(--text-primary)] font-sans">{activeModal.recipient}</strong>
                </span>

                <div className="flex items-center gap-3">
                  <a
                    href={getAssetPath(activeModal.documentUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--accent)] text-[var(--bg-primary)] font-semibold hover:bg-[var(--accent-hover)] transition-colors min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
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
