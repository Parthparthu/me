/**
 * /design-board — Liquid Glass Design System Showroom.
 * Demonstrates all 5 elevation tiers, color tints, interactive specular highlights,
 * and pre-configured glass component variants.
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Sliders, Shield, Zap, Eye, Check } from 'lucide-react';
import { LiquidGlass, type GlassElevation, type GlassTint } from '@/components/glass/LiquidGlass';
import {
  GlassCard,
  GlassPill,
  GlassButton,
  GlassInput,
  GlassTextarea,
} from '@/components/glass/GlassVariants';
import { useSceneStore } from '@/store/useSceneStore';

export default function DesignBoardPage() {
  const [activeElevation, setActiveElevation] = useState<GlassElevation>(3);
  const [activeTint, setActiveTint] = useState<GlassTint>('violet');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const { quality, theme, toggleTheme } = useSceneStore();

  const handleCopy = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Back button */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Portfolio
        </Link>
      </div>

      {/* Header */}
      <div className="mb-14">
        <span className="section-label">
          <span aria-hidden="true">◈</span>
          Art Direction
        </span>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mt-1">
          Liquid Glass Design System
        </h1>
        <p className="text-[var(--text-secondary)] text-base max-w-2xl mt-2 leading-relaxed">
          A physical, refractive material system engineered for Apple-grade luxury.
          Features 4-layer composition: backdrop blur, SVG displacement refraction, dynamic cursor specular, and layered inset rim borders.
        </p>

        <div className="flex flex-wrap items-center gap-3 mt-6">
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/6 border border-white/10 text-white/80">
            GPU Quality: <strong className="text-[var(--accent-cyan)]">{quality}</strong>
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/6 border border-white/10 text-white/80">
            Mode: <strong className="text-[var(--accent-violet)]">{theme}</strong>
          </span>
          <button
            onClick={toggleTheme}
            className="text-xs px-3 py-1 rounded-full border border-white/15 hover:bg-white/10 transition-colors text-white"
          >
            Toggle Theme
          </button>
        </div>
      </div>

      {/* Section 1: Elevations 1 to 5 */}
      <section className="mb-20">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold text-white">Elevation Tiers (1–5)</h2>
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
                className="text-left cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)] rounded-3xl"
              >
                <LiquidGlass
                  elevation={elev}
                  tint="neutral"
                  radius={24}
                  dynamicLight
                  className={`p-6 transition-all duration-200 ${
                    isSelected ? 'ring-2 ring-[var(--accent-primary)] scale-[1.02]' : ''
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
            Dynamic colored hues blended into translucent glass surfaces with matched ambient glows.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {(['neutral', 'violet', 'cyan', 'amber', 'rose'] as GlassTint[]).map((tint) => {
            const isSelected = activeTint === tint;

            return (
              <button
                key={tint}
                onClick={() => setActiveTint(tint)}
                className="text-left cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)] rounded-3xl"
              >
                <LiquidGlass
                  elevation={activeElevation}
                  tint={tint}
                  radius={24}
                  dynamicLight
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
                    Interactive specular response mapped to mouse coordinates.
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
          <h2 className="text-2xl font-display font-bold text-white">Glass Component Variants</h2>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">
            Standardized production components implementing consistent hit targets, focus rings, and states.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Buttons & Pills */}
          <LiquidGlass elevation={3} tint="neutral" radius={24} className="p-8 space-y-6">
            <h3 className="text-base font-bold text-white">Buttons & Nav Pills</h3>

            <div className="flex flex-wrap gap-3 items-center">
              <GlassButton variant="primary">Primary CTA</GlassButton>
              <GlassButton variant="secondary">Secondary</GlassButton>
              <GlassButton variant="ghost">Ghost Glass</GlassButton>
            </div>

            <div className="flex flex-wrap gap-2 items-center pt-2">
              <GlassPill>
                <Sparkles size={12} className="text-[var(--accent-primary)]" />
                <span>Feature Pill</span>
              </GlassPill>
              <GlassPill>
                <Shield size={12} className="text-[var(--accent-cyan)]" />
                <span>Verified Spec</span>
              </GlassPill>
              <GlassPill>
                <Zap size={12} className="text-amber-400" />
                <span>High Performance</span>
              </GlassPill>
            </div>
          </LiquidGlass>

          {/* Form Inputs */}
          <LiquidGlass elevation={3} tint="neutral" radius={24} className="p-8 space-y-4">
            <h3 className="text-base font-bold text-white">Refractive Form Controls</h3>

            <GlassInput
              label="Standard Text Input"
              placeholder="e.g. Type something here…"
              required
            />

            <GlassTextarea
              label="Glass Textarea"
              placeholder="Multiline refractive input with focus highlights…"
              rows={3}
            />
          </LiquidGlass>
        </div>
      </section>
    </div>
  );
}
