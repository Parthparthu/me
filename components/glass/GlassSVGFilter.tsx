/**
 * GlassSVGFilter — Mounts the refractive SVG displacement filter once
 * at the document root. Used by LiquidGlass via backdrop-filter: url(#glass-distort).
 * Feature-detected: only Chromium supports backdrop-filter with SVG url().
 * Safari/Firefox receive the blur+saturate fallback without distortion.
 */
'use client';

import { useEffect, useState } from 'react';

export function GlassSVGFilter() {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    // Feature-detect backdrop-filter url() support (Chromium only)
    const el = document.createElement('div');
    el.style.backdropFilter = 'url(#test)';
    setSupported(el.style.backdropFilter === 'url("#test")'
      || el.style.backdropFilter === 'url(#test)');
  }, []);

  if (!supported) return null;

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: 'absolute', overflow: 'hidden', pointerEvents: 'none' }}
    >
      <defs>
        {/* Primary glass distortion — gentle edge lensing */}
        <filter id="glass-distort" colorInterpolationFilters="sRGB">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.006 0.009"
            numOctaves="2"
            seed="4"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="5"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Stronger distortion for hero sculpture overlay panels */}
        <filter id="glass-distort-strong" colorInterpolationFilters="sRGB">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.012"
            numOctaves="3"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="12"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Gooey merge filter — for metaball nav dock effect */}
        <filter id="glass-goo" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
}
