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
 * NAV_BLUR:
 * When true, the floating navigation bar uses a very subtle backdrop-filter blur.
 * When false (default), the nav renders with a solid surface and no blur.
 */
export const NAV_BLUR = false;

/**
 * ALLOW_CAPSULE:
 * When true, buttons may use fully rounded capsule shapes (border-radius: 9999px).
 * When false (default), buttons use rounded rectangles with continuous corners.
 */
export const ALLOW_CAPSULE = false;

/**
 * ALLOW_EMOJI:
 * When true, emoji characters may be used as decorative icons.
 * When false (default), only SVG icons from lucide-react are used.
 */
export const ALLOW_EMOJI = false;


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
