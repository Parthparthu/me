'use client';

import React, {
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
} from 'react';
import { cn } from '@/lib/utils';

export type GlassElevation = 1 | 2 | 3 | 4 | 5;
export type GlassTint = 'neutral' | 'cyan' | 'amber' | 'auto';
export type GlassVariant = 'default' | 'card' | 'panel' | 'modal' | 'button' | 'input' | 'badge';

export interface LiquidGlassProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: GlassElevation;
  tint?: GlassTint;
  radius?: number | string;
  variant?: GlassVariant;
  as?: keyof React.JSX.IntrinsicElements;
}

const ELEVATION_CONFIG: Record<
  GlassElevation,
  { blur: number; alpha: number; shadow: string; border: string }
> = {
  1: {
    blur: 10,
    alpha: 0.03,
    shadow: '0 1px 3px rgba(0,0,0,0.25)',
    border: 'rgba(255,255,255,0.07)',
  },
  2: {
    blur: 14,
    alpha: 0.05,
    shadow: '0 4px 12px rgba(0,0,0,0.30)',
    border: 'rgba(255,255,255,0.09)',
  },
  3: {
    blur: 18,
    alpha: 0.08,
    shadow: '0 8px 24px rgba(0,0,0,0.35)',
    border: 'rgba(255,255,255,0.11)',
  },
  4: {
    blur: 24,
    alpha: 0.12,
    shadow: '0 12px 32px rgba(0,0,0,0.40)',
    border: 'rgba(255,255,255,0.14)',
  },
  5: {
    blur: 32,
    alpha: 0.16,
    shadow: '0 16px 40px rgba(0,0,0,0.45)',
    border: 'rgba(255,255,255,0.16)',
  },
};

const TINT_COLORS: Record<GlassTint, { dark: string; light: string }> = {
  neutral: {
    dark: 'rgba(18,21,29,__ALPHA__)',
    light: 'rgba(255,255,255,__ALPHA__)',
  },
  cyan: {
    dark: 'rgba(14,165,233,__ALPHA__)',
    light: 'rgba(2,132,199,__ALPHA__)',
  },
  amber: {
    dark: 'rgba(245,158,11,__ALPHA__)',
    light: 'rgba(217,119,6,__ALPHA__)',
  },
  auto: {
    dark: 'rgba(18,21,29,__ALPHA__)',
    light: 'rgba(255,255,255,__ALPHA__)',
  },
};

export const LiquidGlass = forwardRef<HTMLDivElement, LiquidGlassProps>(
  function LiquidGlass(
    {
      elevation = 3,
      tint = 'neutral',
      radius = 12,
      variant = 'default',
      as: Tag = 'div',
      className,
      style,
      children,
      ...props
    },
    ref
  ) {
    const cfg = ELEVATION_CONFIG[elevation];
    const safeTint = (tint === 'cyan' || tint === 'amber') ? tint : 'neutral';
    const tintCfg = TINT_COLORS[safeTint];

    const backdropFilter = `blur(${cfg.blur}px)`;

    const borderRadius = typeof radius === 'number' ? `${radius}px` : radius;

    const glassStyle: CSSProperties = {
      position: 'relative',
      borderRadius,
      backgroundColor: tintCfg.dark.replace('__ALPHA__', String(cfg.alpha)),
      backdropFilter,
      WebkitBackdropFilter: backdropFilter,
      border: `1px solid ${cfg.border}`,
      boxShadow: [
        'inset 0 1px 0 rgba(255,255,255,0.10)',
        cfg.shadow,
      ].join(', '),
      overflow: 'hidden',
      ...style,
    };

    const variantClass = variant !== 'default' ? `glass-${variant}` : '';

    return React.createElement(
      Tag as string,
      {
        ref,
        className: cn('liquid-glass', variantClass, className),
        style: glassStyle,
        ...props,
      },
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    );
  }
);

LiquidGlass.displayName = 'LiquidGlass';
