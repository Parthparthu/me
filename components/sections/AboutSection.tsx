/**
 * AboutSection: Biography, World Memory Championship recognition, and core technical focus areas.
 */
'use client';

import React, { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Brain,
  Code2,
  TrendingUp,
  Award,
  MapPin,
  Layers,
  type LucideIcon,
} from 'lucide-react';
import { profile } from '@/data/profile';
import { type FocusArea } from '@/types/profile';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { GlassCard as GlassCardVariant } from '@/components/glass/GlassVariants';
import { POINTER_REACTIVE_3D } from '@/lib/config';

const SPRING = { type: 'spring', stiffness: 280, damping: 28 } as const;

const ICON_MAP: Record<string, LucideIcon> = {
  Code2,
  Layers,
  TrendingUp,
  Brain,
  Trophy,
};

const FOCUS_COLORS = [
  { tint: 'cyan', accentVar: 'var(--accent)' },
  { tint: 'cyan', accentVar: 'var(--accent)' },
  { tint: 'amber', accentVar: 'var(--accent-amber)' },
  { tint: 'amber', accentVar: 'var(--accent-amber)' },
] as const;

export function AboutSection() {
  return (
    <section
      id="about"
      className="py-24 px-4 md:px-8 max-w-7xl mx-auto w-full scroll-mt-24"
      aria-label="About Pradyumna"
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={SPRING}
        className="mb-14"
      >
        <span className="section-label">
          <span aria-hidden="true">#</span>
          About
        </span>
        <h2 className="section-title text-[var(--text-primary)] mt-1">
          Background and Engineering Focus
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Bio column */}
        <motion.div
          className="lg:col-span-7 flex flex-col gap-5"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={SPRING}
        >
          {/* WMC Bronze Medal card */}
          <LiquidGlass
            elevation={3}
            tint="amber"
            radius={20}
            className="p-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-[var(--radius-sm)] bg-[var(--accent-amber-subtle)] border border-[var(--accent-amber-border)] flex items-center justify-center">
                <Trophy size={22} className="text-[var(--accent-amber)]" aria-hidden="true" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold tracking-wider uppercase font-mono text-[var(--accent-amber)]">
                    World Memory Championship: 2023
                  </span>
                  <Award size={14} className="text-[var(--accent-amber)]" aria-hidden="true" />
                </div>
                <p className="text-[var(--text-primary)] font-semibold text-base leading-snug">
                  Bronze Medalist: Applying systematic spatial loci, speed recall, and pattern recognition directly to system architecture, debugging, and data modeling.
                </p>
              </div>
            </div>
          </LiquidGlass>

          {/* Bio paragraphs */}
          <GlassCardVariant radius={20} className="p-7">
            <div className="space-y-4 text-[var(--text-secondary)] text-sm md:text-base leading-relaxed">
              {profile.fullBio.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {/* Education and status */}
            <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] flex flex-wrap gap-4 text-xs md:text-sm text-[var(--text-muted)] font-mono">
              <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                <Brain size={14} className="text-[var(--accent-primary)]" aria-hidden="true" />
                <span>{profile.education.degree} ({profile.education.year})</span>
              </span>
              <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                <MapPin size={14} className="text-[var(--accent-primary)]" aria-hidden="true" />
                <span>{profile.education.institution}, {profile.education.location}</span>
              </span>
            </div>
          </GlassCardVariant>
        </motion.div>

        {/* Focus areas column: What I do focus cards with 3D tilt & focus states */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {profile.focusAreas.map((area, index) => (
            <FocusTiltCard key={area.label} area={area} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface FocusTiltCardProps {
  area: FocusArea;
  index: number;
}

function FocusTiltCard({ area, index }: FocusTiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const ticking = useRef(false);

  const cfg = FOCUS_COLORS[index % FOCUS_COLORS.length];
  const Icon = ICON_MAP[area.icon] || Code2;

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
        const rx = (y - 0.5) * -10;
        const ry = (x - 0.5) * 10;
        cardRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
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
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ ...SPRING, delay: index * 0.06 }}
      className="perspective-1000 h-full"
    >
      <div
        ref={cardRef}
        tabIndex={0}
        role="region"
        aria-label={area.label}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{
          transform: 'rotateX(0deg) rotateY(0deg) translateZ(0px)',
          transition: 'transform 200ms ease-out',
        }}
        className="group relative h-full rounded-[20px] will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] select-none active:scale-[0.99] transition-transform"
      >
        <LiquidGlass
          elevation={2}
          tint={cfg.tint as 'cyan' | 'amber'}
          radius={20}
          dynamicLight={POINTER_REACTIVE_3D}
          className="p-5 h-full flex flex-col justify-between border border-[var(--separator)] group-hover:border-[var(--accent-border)] group-focus-visible:border-[var(--accent)] transition-[border-color,box-shadow] duration-[var(--dur-base)]"
        >
          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center flex-shrink-0"
                style={{
                  background: cfg.tint === 'amber' ? 'var(--accent-amber-subtle)' : 'var(--accent-subtle)',
                  border: `1px solid ${cfg.tint === 'amber' ? 'var(--accent-amber-border)' : 'var(--accent-border)'}`,
                }}
              >
                <Icon
                  size={20}
                  style={{ color: cfg.accentVar }}
                  aria-hidden="true"
                />
              </div>
              <span className="text-[10px] font-mono text-[var(--text-muted)] tracking-wider uppercase font-semibold">
                Area 0{index + 1}
              </span>
            </div>

            <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-1.5 group-hover:text-[var(--accent)] transition-colors">
              {area.label}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {area.description}
            </p>
          </div>

          {area.technologies && area.technologies.length > 0 && (
            <div className="mt-4 pt-3 border-t border-[var(--separator)] flex flex-wrap gap-1.5">
              {area.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 text-[10px] font-mono font-medium rounded-[var(--radius-xs)] bg-[var(--bg-secondary)] border border-[var(--separator)] text-[var(--text-muted)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </LiquidGlass>
      </div>
    </motion.div>
  );
}
