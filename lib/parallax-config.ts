/**
 * Parallax Architecture & Configuration
 *
 * Centralized settings controlling layer rates, mobile scaling, reduced-motion overrides,
 * section spine geometry, and performance thresholds.
 */

export interface ParallaxLayerConfig {
  rate: number;
  minOpacity?: number;
  maxOpacity?: number;
  exitScaleMin?: number;
  exitFadeThreshold?: number;
}

export const PARALLAX_CONFIG = {
  enabled: true,

  // Layer rates for hero section (multipliers relative to scroll velocity)
  hero: {
    layer1FarBg: { rate: 0.18, minOpacity: 0.15, maxOpacity: 0.85 } as ParallaxLayerConfig,
    layer2MidField: { rate: 0.35, minOpacity: 0.1, maxOpacity: 0.65 } as ParallaxLayerConfig,
    layer3Canvas: { rotationRate: 0.0018, dollyRate: 0.38 },
    layer4Foreground: { rate: 0.88, exitScaleMin: 0.96, exitFadeThreshold: 0.85 } as ParallaxLayerConfig,
  },

  // Section grid alternating card offsets (relative translation variance)
  cards: {
    oddRate: 0.05,  // Odd cards lead by +5%
    evenRate: -0.04, // Even cards lag by -4%
  },

  // Floating detail accents per section (lagging micro-elements)
  floatingAccents: {
    lagRate: 0.22,
    leadRate: -0.18,
  },

  // Inner image container parallax within cards
  cardImages: {
    internalRate: 0.88, // Image moves at ~0.88x speed within overflow:hidden container
    overflowScale: 1.12, // Scale to provide travel room without clipping borders
  },

  // Section spine / vertical thread
  spine: {
    width: 2,
    dotRadius: 4,
    glowRadius: 10,
    color: 'var(--accent)',
    glowColor: 'var(--accent-subtle)',
    smoothing: 0.12,
  },

  // Background crossfade tints for section transitions
  backgroundCrossfades: [
    { section: 'hero', ambient: 'rgba(34, 211, 238, 0.06)' },
    { section: 'work', ambient: 'rgba(14, 165, 233, 0.05)' },
    { section: 'about', ambient: 'rgba(56, 189, 248, 0.05)' },
    { section: 'skills', ambient: 'rgba(34, 211, 238, 0.06)' },
    { section: 'journey', ambient: 'rgba(14, 165, 233, 0.05)' },
    { section: 'achievements', ambient: 'rgba(56, 189, 248, 0.05)' },
    { section: 'contact', ambient: 'rgba(34, 211, 238, 0.07)' },
  ],

  // Contact settling physics
  contact: {
    convergeDistance: 24, // px convergence
    stiffness: 260,
    damping: 26,
  },

  // Device & accessibility scaling multipliers
  mobileScale: 0.5, // Touch viewports scale down intensity by 50%
  reducedMotionScale: 0.0, // Reduced motion disables all scroll-linked translation
  lowQualityScale: 0.25, // Low quality GPU tier simplifies depth
} as const;
