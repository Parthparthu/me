/**
 * /design-board: Liquid Glass Design System Showroom.
 * Demonstrates elevation tiers, restrained color tints, and pre-configured glass component variants.
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Zap, Check, Sparkles } from 'lucide-react';
import { LiquidGlass, type GlassElevation, type GlassTint } from '@/components/glass/LiquidGlass';
import {
  GlassBadge,
  GlassButton,
  GlassInput,
  GlassTextarea,
} from '@/components/glass/GlassVariants';
import { useSceneStore } from '@/store/useSceneStore';

export default function DesignBoardPage() {
  const [activeElevation, setActiveElevation] = useState<GlassElevation>(3);
  const [activeTint, setActiveTint] = useState<GlassTint>('cyan');
  const { quality, theme, toggleTheme } = useSceneStore();

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Back button */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-white transition-colors min-h-[44px]"
        >
          <ArrowLeft size={16} />
          Back to Portfolio
        </Link>
      </div>

      {/* Header */}
      <div className="mb-14">
        <span className="section-label">
          <span aria-hidden="true">◈</span>
          Design Tokens
        </span>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mt-1">
          Liquid Glass System
        </h1>
        <p className="text-[var(--text-secondary)] text-base max-w-2xl mt-2 leading-relaxed">
          Restrained, translucent surfaces with controlled refraction and subtle edge highlights.
          Engineered for high readability and strict contrast compliance.
        </p>

        <div className="flex flex-wrap items-center gap-3 mt-6">
          <span className="px-3 py-1 rounded-[8px] text-xs font-mono bg-white/6 border border-white/10 text-white/80">
            GPU Quality: <strong className="text-[var(--accent-cyan)]">{quality}</strong>
          </span>
          <span className="px-3 py-1 rounded-[8px] text-xs font-mono bg-white/6 border border-white/10 text-white/80">
            Mode: <strong className="text-[var(--accent-cyan)]">{theme}</strong>
          </span>
          <button
            onClick={toggleTheme}
            className="text-xs px-3 py-1 rounded-[8px] border border-white/15 hover:bg-white/10 transition-colors text-white min-h-[36px]"
          >
            Toggle Theme
          </button>
        </div>
      </div>

      {/* Section 1: Elevations 1 to 5 */}
      <section className="mb-20">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold text-white">Elevation Tiers (1 to 5)</h2>
            <p className="text-sm text-[var(--text-tertiary)] mt-1">
              Blur intensity, shadow dispersion, and glass alpha scale with elevation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {([1, 2, 3, 4, 5] as GlassElevation[]).map((elev) => {
            const isSelected = activeElevation === elev;
            const blurMap = { 1: '12px', 2: '20px', 3: '28px', 4: '36px', 5: '48px' };
            const alphaMap = { 1: '4%', 2: '7%', 3: '10%', 4: '14%', 5: '18%' };

            return (
              <button
                key={elev}
                onClick={() => setActiveElevation(elev)}
                className="text-left cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)] rounded-[12px]"
              >
                <LiquidGlass
                  elevation={elev}
                  tint="neutral"
                  radius={12}
                  className={`p-6 transition-all duration-200 ${
                    isSelected ? 'ring-2 ring-[var(--accent-primary)]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-[var(--accent-cyan)]">
                      Level {elev}
                    </span>
                    {isSelected && <Check size={14} className="text-[var(--accent-primary)]" />}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">glass-{elev}</h3>

                  <div className="space-y-1 text-xs font-mono text-[var(--text-muted)]">
                    <div>Blur: {blurMap[elev]}</div>
                    <div>Alpha: {alphaMap[elev]}</div>
                  </div>
                </LiquidGlass>
              </button>
            );
          })}
        </div>
      </section>

      {/* Section 2: Color Tints */}
      <section className="mb-20">
        <div className="mb-6">
          <h2 className="text-2xl font-display font-bold text-white">Chrominance Tints</h2>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">
            Restrained hues blended into translucent glass surfaces with matched ambient glows.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(['neutral', 'cyan', 'amber'] as GlassTint[]).map((tint) => {
            const isSelected = activeTint === tint;

            return (
              <button
                key={tint}
                onClick={() => setActiveTint(tint)}
                className="text-left cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)] rounded-[12px]"
              >
                <LiquidGlass
                  elevation={activeElevation}
                  tint={tint}
                  radius={12}
                  className={`p-6 transition-all duration-200 ${
                    isSelected ? 'ring-2 ring-[var(--accent-primary)]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                      {tint}
                    </span>
                    {isSelected && <Check size={14} className="text-white" />}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Subtle physical tint calibrated for WCAG contrast compliance.
                  </p>
                </LiquidGlass>
              </button>
            );
          })}
        </div>
      </section>

      {/* Section 3: Component Variants Playground */}
      <section className="mb-20">
        <div className="mb-6">
          <h2 className="text-2xl font-display font-bold text-white">Component Variants</h2>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">
            Standardized production components implementing consistent hit targets, focus rings, and 8px/12px geometry.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Buttons and Badges */}
          <LiquidGlass elevation={2} tint="neutral" radius={12} className="p-8 space-y-6">
            <h3 className="text-base font-bold text-white">Buttons and Badges</h3>

            <div className="flex flex-wrap gap-3 items-center">
              <GlassButton variant="primary">Primary CTA</GlassButton>
              <GlassButton variant="secondary">Secondary</GlassButton>
              <GlassButton variant="ghost">Ghost Glass</GlassButton>
            </div>

            <div className="flex flex-wrap gap-2 items-center pt-2">
              <GlassBadge>
                <Sparkles size={12} className="text-[var(--accent-primary)]" />
                <span>Feature Badge</span>
              </GlassBadge>
              <GlassBadge>
                <Shield size={12} className="text-[var(--accent-cyan)]" />
                <span>Verified Spec</span>
              </GlassBadge>
              <GlassBadge>
                <Zap size={12} className="text-amber-400" />
                <span>High Performance</span>
              </GlassBadge>
            </div>
          </LiquidGlass>

          {/* Form Inputs */}
          <LiquidGlass elevation={2} tint="neutral" radius={12} className="p-8 space-y-4">
            <h3 className="text-base font-bold text-white">Form Controls</h3>

            <GlassInput
              label="Standard Text Input"
              placeholder="e.g. Type something here…"
              required
            />

            <GlassTextarea
              label="Glass Textarea"
              placeholder="Multiline input with focus highlights…"
              rows={3}
            />
          </LiquidGlass>
        </div>
      </section>
    </div>
  );
}
