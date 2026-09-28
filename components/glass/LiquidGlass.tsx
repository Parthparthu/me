/**
 * LiquidGlass — The core glass component for the entire design system.
 *
 * Implements a 4-layer glass material:
 *   1. Base: backdrop-filter blur + saturate + brightness + translucent fill
 *   2. Refraction: SVG displacement map via backdrop-filter url() [Chromium only]
 *   3. Specular: dynamic highlight that follows cursor/gyroscope position
 *   4. Structure: 1px specular border, inset top rim, layered shadows
 *
 * Usage:
 *   <LiquidGlass elevation={3} tint="violet" dynamicLight>
 *     Content here
 *   </LiquidGlass>
 */
'use client';

import React, {
  useRef,
  useEffect,
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
} from 'react';
import { useSceneStore } from '@/store/useSceneStore';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

export type GlassElevation = 1 | 2 | 3 | 4 | 5;
export type GlassTint = 'neutral' | 'violet' | 'cyan' | 'amber' | 'rose' | 'auto';
export type GlassVariant = 'default' | 'pill' | 'card' | 'panel' | 'modal' | 'button' | 'input';

export interface LiquidGlassProps extends HTMLAttributes<HTMLDivElement> {
  /** Controls blur intensity, fill alpha, and shadow depth (1=subtle, 5=deep) */
  elevation?: GlassElevation;
  /** SVG displacement refraction strength (0=none, 1=max). Only on Chromium. */
  refraction?: number;
  /** Tint color blended into the glass fill */
  tint?: GlassTint;
  /** Border radius in px */
  radius?: number | string;
  /** Whether the specular highlight responds to cursor/gyro position */
  dynamicLight?: boolean;
  /** Preset variant with opinionated sizing and shape */
  variant?: GlassVariant;
  /** Render as a different element */
  as?: keyof React.JSX.IntrinsicElements;
}

// ─── Config Tables ─────────────────────────────────────────────────────────────

const ELEVATION_CONFIG: Record<
  GlassElevation,
  { blur: number; saturate: number; alpha: number; shadow: string; border: string }
> = {
  1: {
    blur: 12,
    saturate: 150,
    alpha: 0.04,
    shadow: '0 2px 8px rgba(0,0,0,0.30), 0 1px 3px rgba(0,0,0,0.20)',
    border: 'rgba(255,255,255,0.10)',
  },
  2: {
    blur: 20,
    saturate: 160,
    alpha: 0.07,
    shadow: '0 4px 16px rgba(0,0,0,0.40), 0 2px 6px rgba(0,0,0,0.25)',
    border: 'rgba(255,255,255,0.12)',
  },
  3: {
    blur: 28,
    saturate: 175,
    alpha: 0.10,
    shadow: '0 8px 32px rgba(0,0,0,0.50), 0 3px 10px rgba(0,0,0,0.30)',
    border: 'rgba(255,255,255,0.14)',
  },
  4: {
    blur: 36,
    saturate: 185,
    alpha: 0.14,
    shadow: '0 16px 48px rgba(0,0,0,0.55), 0 6px 18px rgba(0,0,0,0.35)',
    border: 'rgba(255,255,255,0.16)',
  },
  5: {
    blur: 48,
    saturate: 200,
    alpha: 0.18,
    shadow: '0 24px 64px rgba(0,0,0,0.65), 0 10px 28px rgba(0,0,0,0.40)',
    border: 'rgba(255,255,255,0.18)',
  },
};

const TINT_COLORS: Record<GlassTint, { dark: string; light: string; glow: string }> = {
  neutral: {
    dark: 'rgba(255,255,255,__ALPHA__)',
    light: 'rgba(255,255,255,__ALPHA2__)',
    glow: 'transparent',
  },
  violet: {
    dark: 'rgba(129,140,248,__ALPHA__)',
    light: 'rgba(99,102,241,__ALPHA__)',
    glow: 'rgba(129,140,248,0.08)',
  },
  cyan: {
    dark: 'rgba(56,189,248,__ALPHA__)',
    light: 'rgba(2,132,199,__ALPHA__)',
    glow: 'rgba(56,189,248,0.08)',
  },
  amber: {
    dark: 'rgba(245,158,11,__ALPHA__)',
    light: 'rgba(217,119,6,__ALPHA__)',
    glow: 'rgba(245,158,11,0.08)',
  },
  rose: {
    dark: 'rgba(244,63,94,__ALPHA__)',
    light: 'rgba(225,29,72,__ALPHA__)',
    glow: 'rgba(244,63,94,0.08)',
  },
  auto: {
    dark: 'rgba(99,102,241,__ALPHA__)',
    light: 'rgba(99,102,241,__ALPHA__)',
    glow: 'rgba(99,102,241,0.06)',
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export const LiquidGlass = forwardRef<HTMLDivElement, LiquidGlassProps>(
  function LiquidGlass(
    {
      elevation = 3,
      refraction = 0.5,
      tint = 'neutral',
      radius = 20,
      dynamicLight = true,
      variant = 'default',
      as: Tag = 'div',
      className,
      style,
      children,
      ...props
    },
    forwardedRef
  ) {
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLDivElement>) || internalRef;

    const quality = useSceneStore((s) => s.quality);
    const theme = useSceneStore((s) => s.theme);

    // ── Config ────────────────────────────────────────────────────────────────
    const cfg = ELEVATION_CONFIG[elevation];
    const tintCfg = TINT_COLORS[tint];
    const isDark = theme === 'dark';

    // Alpha scales with elevation
    const alpha = cfg.alpha;
    const alpha2 = alpha * 1.8; // lighter fill for light theme

    const fillColor = isDark
      ? (tintCfg.dark || tintCfg.dark)
          .replace('__ALPHA__', String(alpha))
          .replace('__ALPHA2__', String(alpha2))
      : (tintCfg.light || tintCfg.light)
          .replace('__ALPHA__', String(alpha2))
          .replace('__ALPHA2__', String(alpha2));

    // Backdrop filter — conditionally add SVG refraction for Chromium/high quality
    const useRefraction = quality === 'high' && refraction > 0;
    const refractionScale = Math.round(refraction * 8);
    const backdropFilter = useRefraction
      ? `url(#glass-distort) blur(${cfg.blur}px) saturate(${cfg.saturate}%) brightness(1.06)`
      : `blur(${cfg.blur}px) saturate(${cfg.saturate}%) brightness(1.06)`;

    // ── Dynamic specular (cursor/gyro driven) ─────────────────────────────────
    useEffect(() => {
      if (!dynamicLight) return;
      const el = ref.current;
      if (!el) return;

      const updateLight = (cursor: { x: number; y: number }) => {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        // Calculate light position relative to this element
        const relX = ((cursor.x - rect.left) / rect.width) * 100;
        const relY = ((cursor.y - rect.top) / rect.height) * 100;

        // Clamp to [-10, 110]% so it can enter from edges
        const clampedX = Math.max(-10, Math.min(110, relX));
        const clampedY = Math.max(-10, Math.min(110, relY));

        el.style.setProperty('--gl-x', `${clampedX}%`);
        el.style.setProperty('--gl-y', `${clampedY}%`);
      };

      // Set initial position
      updateLight(useSceneStore.getState().cursor);

      // Subscribe to cursor updates without triggering component re-renders
      const unsubscribe = useSceneStore.subscribe(
        (s) => s.cursor,
        (cursor) => updateLight(cursor)
      );

      return () => unsubscribe();
    }, [dynamicLight, ref]);

    // ── Styles ────────────────────────────────────────────────────────────────
    const borderRadius =
      typeof radius === 'number' ? `${radius}px` : radius;

    const glassStyle: CSSProperties = {
      position: 'relative',
      borderRadius,
      backgroundColor: fillColor,
      backdropFilter,
      WebkitBackdropFilter: backdropFilter,
      border: `1px solid ${cfg.border}`,
      boxShadow: [
        `inset 0 1px 0 rgba(255,255,255,${isDark ? 0.18 : 0.65})`,
        `inset 1px 0 0 rgba(255,255,255,${isDark ? 0.06 : 0.25})`,
        `inset 0 -1px 0 rgba(0,0,0,${isDark ? 0.12 : 0.06})`,
        cfg.shadow,
        tint !== 'neutral' ? `0 0 40px ${tintCfg.glow}` : '',
      ]
        .filter(Boolean)
        .join(', '),
      '--gl-x': '50%',
      '--gl-y': '-20%',
      overflow: 'hidden',
      ...style,
    } as CSSProperties;

    const variantClass = variant !== 'default' ? `glass-${variant}` : '';

    // Use createElement to support dynamic 'as' prop without type gymnastics
    const specular = dynamicLight ? (
      <span
        aria-hidden="true"
        className="glass-specular"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          background: `radial-gradient(
            ellipse 70% 50% at var(--gl-x, 50%) var(--gl-y, -20%),
            rgba(255,255,255,${isDark ? 0.10 : 0.40}) 0%,
            transparent 70%
          )`,
          zIndex: 1,
        }}
      />
    ) : null;

    const content = (
      <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
    );

    return React.createElement(
      Tag as string,
      {
        ref,
        className: cn('liquid-glass', variantClass, className),
        style: glassStyle,
        ...props,
      },
      specular,
      content
    );
  }
);

LiquidGlass.displayName = 'LiquidGlass';
