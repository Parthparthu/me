/**
 * LiquidGlass: The core glass component for the entire design system.
 *
 * Implements a 4-layer glass material:
 *   1. Base: backdrop-filter blur + saturate + brightness + translucent fill
 *   2. Refraction: SVG displacement map via backdrop-filter url() [Chromium only]
 *   3. Specular: dynamic highlight that follows interaction position
 *   4. Structure: 1px specular border, inset top rim, layered shadows
 *
 * Usage:
 *   <LiquidGlass elevation={3} tint="neutral" dynamicLight>
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

// Types

export type GlassElevation = 1 | 2 | 3 | 4 | 5;
export type GlassTint = 'neutral' | 'cyan' | 'amber' | 'emerald' | 'violet' | 'rose' | 'auto';
export type GlassVariant = 'default' | 'badge' | 'card' | 'panel' | 'modal' | 'button' | 'input' | 'pill';

export interface LiquidGlassProps extends HTMLAttributes<HTMLDivElement> {
  /** Controls blur intensity, fill alpha, and shadow depth (1=subtle, 5=deep) */
  elevation?: GlassElevation;
  /** SVG displacement refraction strength (0=none, 1=max). Only on Chromium. */
  refraction?: number;
  /** Tint color blended into the glass fill */
  tint?: GlassTint;
  /** Border radius in px */
  radius?: number | string;
  /** Whether the specular highlight responds to cursor/pointer position */
  dynamicLight?: boolean;
  /** Preset variant with opinionated sizing and shape */
  variant?: GlassVariant;
  /** Render as a different element */
  as?: React.ElementType;
}

// Config Tables

const ELEVATION_CONFIG: Record<
  GlassElevation,
  { blur: number; saturate: number; alpha: number; shadow: string; border: string }
> = {
  1: {
    blur: 12,
    saturate: 140,
    alpha: 0.04,
    shadow: '0 2px 8px rgba(0,0,0,0.25), 0 1px 3px rgba(0,0,0,0.15)',
    border: 'rgba(255,255,255,0.08)',
  },
  2: {
    blur: 18,
    saturate: 150,
    alpha: 0.07,
    shadow: '0 4px 16px rgba(0,0,0,0.30), 0 2px 6px rgba(0,0,0,0.20)',
    border: 'rgba(255,255,255,0.10)',
  },
  3: {
    blur: 24,
    saturate: 160,
    alpha: 0.10,
    shadow: '0 8px 24px rgba(0,0,0,0.40), 0 3px 10px rgba(0,0,0,0.25)',
    border: 'rgba(255,255,255,0.12)',
  },
  4: {
    blur: 32,
    saturate: 170,
    alpha: 0.14,
    shadow: '0 16px 36px rgba(0,0,0,0.45), 0 6px 18px rgba(0,0,0,0.30)',
    border: 'rgba(255,255,255,0.14)',
  },
  5: {
    blur: 40,
    saturate: 180,
    alpha: 0.18,
    shadow: '0 24px 50px rgba(0,0,0,0.55), 0 10px 24px rgba(0,0,0,0.35)',
    border: 'rgba(255,255,255,0.16)',
  },
};

const TINT_COLORS: Record<GlassTint, { dark: string; light: string; glow: string }> = {
  neutral: {
    dark: 'rgba(255,255,255,__ALPHA__)',
    light: 'rgba(255,255,255,__ALPHA2__)',
    glow: 'transparent',
  },
  cyan: {
    dark: 'rgba(14,165,233,__ALPHA__)',
    light: 'rgba(2,132,199,__ALPHA__)',
    glow: 'rgba(14,165,233,0.06)',
  },
  amber: {
    dark: 'rgba(245,158,11,__ALPHA__)',
    light: 'rgba(217,119,6,__ALPHA__)',
    glow: 'rgba(245,158,11,0.06)',
  },
  emerald: {
    dark: 'rgba(16,185,129,__ALPHA__)',
    light: 'rgba(5,150,105,__ALPHA__)',
    glow: 'rgba(16,185,129,0.06)',
  },
  // Map legacy violet/rose requests to neutral/cyan to prevent purple rendering
  violet: {
    dark: 'rgba(14,165,233,__ALPHA__)',
    light: 'rgba(2,132,199,__ALPHA__)',
    glow: 'rgba(14,165,233,0.06)',
  },
  rose: {
    dark: 'rgba(255,255,255,__ALPHA__)',
    light: 'rgba(255,255,255,__ALPHA2__)',
    glow: 'transparent',
  },
  auto: {
    dark: 'rgba(14,165,233,__ALPHA__)',
    light: 'rgba(2,132,199,__ALPHA__)',
    glow: 'rgba(14,165,233,0.06)',
  },
};

// Component

export const LiquidGlass = forwardRef<HTMLDivElement, LiquidGlassProps>(
  function LiquidGlass(
    {
      elevation = 3,
      refraction = 0.4,
      tint = 'neutral',
      radius = 12,
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

    const cfg = ELEVATION_CONFIG[elevation];
    const tintCfg = TINT_COLORS[tint] || TINT_COLORS.neutral;
    const isDark = theme === 'dark';

    const alpha = cfg.alpha;
    const alpha2 = alpha * 1.8;

    const fillColor = isDark
      ? tintCfg.dark
          .replace('__ALPHA__', String(alpha))
          .replace('__ALPHA2__', String(alpha2))
      : tintCfg.light
          .replace('__ALPHA__', String(alpha2))
          .replace('__ALPHA2__', String(alpha2));

    // Backdrop filter: conditionally add SVG refraction for Chromium/high quality
    const useRefraction = quality === 'high' && refraction > 0;
    const backdropFilter = useRefraction
      ? `url(#glass-distort) blur(${cfg.blur}px) saturate(${cfg.saturate}%) brightness(1.04)`
      : `blur(${cfg.blur}px) saturate(${cfg.saturate}%) brightness(1.04)`;

    // Specular highlight responds to pointer movement on the element itself
    useEffect(() => {
      if (!dynamicLight) return;
      const el = ref.current;
      if (!el) return;

      const handlePointerMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const relX = ((e.clientX - rect.left) / rect.width) * 100;
        const relY = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty('--gl-x', `${Math.max(-10, Math.min(110, relX))}%`);
        el.style.setProperty('--gl-y', `${Math.max(-10, Math.min(110, relY))}%`);
      };

      el.addEventListener('pointermove', handlePointerMove, { passive: true });
      return () => el.removeEventListener('pointermove', handlePointerMove);
    }, [dynamicLight, ref]);

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
        cfg.shadow,
        tintCfg.glow !== 'transparent' ? `0 0 20px ${tintCfg.glow}` : null,
        isDark ? 'inset 0 1px 0 rgba(255,255,255,0.08)' : 'inset 0 1px 0 rgba(255,255,255,0.5)',
      ]
        .filter(Boolean)
        .join(', '),
      ...style,
    };

    const Component = (Tag || 'div') as any;

    return (
      <Component
        ref={ref}
        className={cn('liquid-glass', className)}
        style={glassStyle}
        {...props}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{
            borderRadius,
            background:
              'radial-gradient(ellipse 60% 40% at var(--gl-x, 50%) var(--gl-y, -20%), rgba(255,255,255,0.06) 0%, transparent 70%)',
          }}
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-[8%] right-[8%] h-[1px] opacity-60"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.2) 30%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.2) 70%, transparent)',
          }}
        />

        <div className="relative z-10 w-full h-full">{children}</div>
      </Component>
    );
  }
);
LiquidGlass.displayName = 'LiquidGlass';
