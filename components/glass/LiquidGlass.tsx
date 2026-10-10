/**
 * LiquidGlass: The core glass component for the entire design system.
 *
 * Implements a 4-layer glass material engineered for both Dark and Light themes:
 *   1. Base: backdrop-filter blur + saturate + translucent fill
 *   2. Refraction: SVG displacement map via backdrop-filter url() [Chromium only]
 *   3. Specular: dynamic highlight that tracks pointer movement
 *   4. Structure: dual-edge highlight pair, crisp inner/outer borders, layered shadows
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
import { POINTER_REACTIVE_3D } from '@/lib/config';
import { cn } from '@/lib/utils';

export type GlassElevation = 1 | 2 | 3 | 4 | 5;
export type GlassTint = 'neutral' | 'cyan' | 'amber' | 'emerald' | 'violet' | 'rose' | 'auto';
export type GlassVariant = 'default' | 'badge' | 'card' | 'panel' | 'modal' | 'button' | 'input' | 'pill';

export interface LiquidGlassProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: GlassElevation;
  refraction?: number;
  tint?: GlassTint;
  radius?: number | string;
  dynamicLight?: boolean;
  variant?: GlassVariant;
  as?: React.ElementType;
}

const ELEVATION_CONFIG: Record<
  GlassElevation,
  {
    blur: number;
    saturate: number;
    dark: { alpha: number; shadow: string; border: string; insetTop: string };
    light: { alpha: number; shadow: string; border: string; insetTop: string };
  }
> = {
  1: {
    blur: 14,
    saturate: 160,
    dark: {
      alpha: 0.04,
      shadow: '0 2px 8px rgba(0,0,0,0.25), 0 1px 3px rgba(0,0,0,0.15)',
      border: 'rgba(255,255,255,0.08)',
      insetTop: 'inset 0 1px 0 rgba(255,255,255,0.08)',
    },
    light: {
      alpha: 0.80,
      shadow: '0 2px 8px rgba(15,23,42,0.05), 0 1px 2px rgba(15,23,42,0.03)',
      border: 'rgba(15,23,42,0.07)',
      insetTop: 'inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -1px 0 rgba(15,23,42,0.03)',
    },
  },
  2: {
    blur: 20,
    saturate: 170,
    dark: {
      alpha: 0.07,
      shadow: '0 4px 16px rgba(0,0,0,0.30), 0 2px 6px rgba(0,0,0,0.20)',
      border: 'rgba(255,255,255,0.10)',
      insetTop: 'inset 0 1px 0 rgba(255,255,255,0.10)',
    },
    light: {
      alpha: 0.84,
      shadow: '0 4px 14px rgba(15,23,42,0.06), 0 2px 4px rgba(15,23,42,0.03)',
      border: 'rgba(15,23,42,0.09)',
      insetTop: 'inset 0 1px 0 rgba(255,255,255,0.90), inset 0 -1px 0 rgba(15,23,42,0.04)',
    },
  },
  3: {
    blur: 26,
    saturate: 180,
    dark: {
      alpha: 0.10,
      shadow: '0 8px 24px rgba(0,0,0,0.40), 0 3px 10px rgba(0,0,0,0.25)',
      border: 'rgba(255,255,255,0.12)',
      insetTop: 'inset 0 1px 0 rgba(255,255,255,0.12)',
    },
    light: {
      alpha: 0.88,
      shadow: '0 10px 24px -2px rgba(15,23,42,0.08), 0 3px 8px -1px rgba(15,23,42,0.04)',
      border: 'rgba(15,23,42,0.11)',
      insetTop: 'inset 0 1px 0 rgba(255,255,255,0.92), inset 0 -1px 0 rgba(15,23,42,0.05)',
    },
  },
  4: {
    blur: 34,
    saturate: 190,
    dark: {
      alpha: 0.14,
      shadow: '0 16px 36px rgba(0,0,0,0.45), 0 6px 18px rgba(0,0,0,0.30)',
      border: 'rgba(255,255,255,0.14)',
      insetTop: 'inset 0 1px 0 rgba(255,255,255,0.14)',
    },
    light: {
      alpha: 0.92,
      shadow: '0 16px 36px -4px rgba(15,23,42,0.10), 0 6px 14px -2px rgba(15,23,42,0.05)',
      border: 'rgba(15,23,42,0.13)',
      insetTop: 'inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -1px 0 rgba(15,23,42,0.06)',
    },
  },
  5: {
    blur: 42,
    saturate: 200,
    dark: {
      alpha: 0.18,
      shadow: '0 24px 50px rgba(0,0,0,0.55), 0 10px 24px rgba(0,0,0,0.35)',
      border: 'rgba(255,255,255,0.16)',
      insetTop: 'inset 0 1px 0 rgba(255,255,255,0.16)',
    },
    light: {
      alpha: 0.95,
      shadow: '0 24px 48px -6px rgba(15,23,42,0.13), 0 8px 18px -3px rgba(15,23,42,0.06)',
      border: 'rgba(15,23,42,0.16)',
      insetTop: 'inset 0 1px 0 rgba(255,255,255,0.98), inset 0 -1px 0 rgba(15,23,42,0.08)',
    },
  },
};

const TINT_COLORS: Record<GlassTint, { dark: string; light: string; glow: string }> = {
  neutral: {
    dark: 'rgba(255,255,255,__ALPHA__)',
    light: 'rgba(255,255,255,__ALPHA__)',
    glow: 'transparent',
  },
  cyan: {
    dark: 'rgba(14,165,233,__ALPHA__)',
    light: 'rgba(2,132,199,0.08)',
    glow: 'rgba(2,132,199,0.06)',
  },
  amber: {
    dark: 'rgba(245,158,11,__ALPHA__)',
    light: 'rgba(180,83,9,0.07)',
    glow: 'rgba(180,83,9,0.06)',
  },
  emerald: {
    dark: 'rgba(16,185,129,__ALPHA__)',
    light: 'rgba(4,120,87,0.07)',
    glow: 'rgba(4,120,87,0.06)',
  },
  // Map legacy violet/rose requests to neutral/cyan
  violet: {
    dark: 'rgba(14,165,233,__ALPHA__)',
    light: 'rgba(2,132,199,0.08)',
    glow: 'rgba(2,132,199,0.06)',
  },
  rose: {
    dark: 'rgba(255,255,255,__ALPHA__)',
    light: 'rgba(255,255,255,__ALPHA__)',
    glow: 'transparent',
  },
  auto: {
    dark: 'rgba(14,165,233,__ALPHA__)',
    light: 'rgba(2,132,199,0.08)',
    glow: 'rgba(2,132,199,0.06)',
  },
};

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
    const isDark = theme === 'dark';

    const cfg = ELEVATION_CONFIG[elevation];
    const themeCfg = isDark ? cfg.dark : cfg.light;
    const tintCfg = TINT_COLORS[tint] || TINT_COLORS.neutral;

    const rawColor = isDark ? tintCfg.dark : tintCfg.light;
    const fillColor = rawColor.replace('__ALPHA__', String(themeCfg.alpha));

    // Backdrop filter: conditionally add SVG refraction for Chromium/high quality
    const useRefraction = quality === 'high' && refraction > 0;
    const backdropFilter = useRefraction
      ? `url(#glass-distort) blur(${cfg.blur}px) saturate(${cfg.saturate}%) brightness(${isDark ? '1.04' : '1.01'})`
      : `blur(${cfg.blur}px) saturate(${cfg.saturate}%) brightness(${isDark ? '1.04' : '1.01'})`;

    // Specular highlight responds to pointer movement on the element itself
    useEffect(() => {
      if (!dynamicLight || !POINTER_REACTIVE_3D) return;
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
      border: `1px solid ${themeCfg.border}`,
      boxShadow: [
        themeCfg.shadow,
        tintCfg.glow !== 'transparent' ? `0 0 20px ${tintCfg.glow}` : null,
        themeCfg.insetTop,
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
        {/* Dynamic pointer specular highlight */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{
            borderRadius,
            background: isDark
              ? 'radial-gradient(ellipse 60% 40% at var(--gl-x, 50%) var(--gl-y, -20%), rgba(255,255,255,0.06) 0%, transparent 70%)'
              : 'radial-gradient(ellipse 60% 40% at var(--gl-x, 50%) var(--gl-y, -20%), rgba(255,255,255,0.55) 0%, transparent 70%)',
          }}
        />

        {/* Crisp top edge specular rim highlight */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-[8%] right-[8%] h-[1px]"
          style={{
            background: isDark
              ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2) 30%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.2) 70%, transparent)'
              : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8) 30%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.8) 70%, transparent)',
          }}
        />

        <div className="relative z-10 w-full h-full">{children}</div>
      </Component>
    );
  }
);
LiquidGlass.displayName = 'LiquidGlass';
