/**
 * Global Site Configuration & Feature Flags
 *
 * POINTER_REACTIVE_3D:
 * When true, 3D objects, glass panels, and cards tilt, rotate, or shift light
 * in response to pointer/mouse position. Set to false to disable pointer-reactive
 * scene transformations with a single toggle.
 */
export const POINTER_REACTIVE_3D = true;

/**
 * PRELOADER_CONFIG:
 * Settings for the branded first-visit preloader.
 */
export const PRELOADER_CONFIG = {
  enabled: true,
  maxDurationMs: 1600,
  minSkippableMs: 500,
  sessionKey: 'pradyuma_portfolio_preloader_seen',
};

/**
 * QUALITY_CONFIG:
 * Default quality settings and performance thresholds.
 */
export const QUALITY_CONFIG = {
  defaultDesktop: 'high' as const,
  defaultMobile: 'high' as const,
  maxPixelRatio: 2,
  enablePostProcessing: true,
};
