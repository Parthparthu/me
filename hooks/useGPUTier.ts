'use client';

import { useEffect, useState } from 'react';
import { useSceneStore, QualityTier } from '@/store/useSceneStore';
import { QUALITY_CONFIG } from '@/lib/config';

/**
 * useGPUTier: Evaluates hardware capability and assigns an appropriate QualityTier.
 * Defaults capable modern devices (both desktop and mobile) to 'high'.
 * Does NOT disable 3D on prefers-reduced-motion (only calms camera/autoplay).
 */
export function useGPUTier(): QualityTier {
  const { qualityOverride, setQuality } = useSceneStore();
  const [detected, setDetected] = useState<QualityTier>(QUALITY_CONFIG.defaultDesktop);

  useEffect(() => {
    // If the user has manually overridden quality, respect that
    if (qualityOverride) {
      setQuality(qualityOverride);
      setDetected(qualityOverride);
      return;
    }

    // Verify basic WebGL capability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
      if (!gl) {
        setQuality('none');
        setDetected('none');
        return;
      }
    } catch {
      setQuality('none');
      setDetected('none');
      return;
    }

    // Modern capability heuristics: CPU threads, memory, and screen resolution
    const concurrency = navigator.hardwareConcurrency || 4;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    // Initial safe baseline: High for capable machines
    let initialTier: QualityTier = concurrency >= 4 ? 'high' : isMobile ? 'medium' : 'high';
    setQuality(initialTier);
    setDetected(initialTier);

    // Fine-tune with detect-gpu dynamically
    import('detect-gpu')
      .then(({ getGPUTier }) => {
        getGPUTier({ glContext: undefined })
          .then((tier) => {
            let resolvedQuality: QualityTier = 'high';

            if (tier.tier >= 2) {
              resolvedQuality = 'high';
            } else if (tier.tier === 1) {
              resolvedQuality = isMobile ? 'low' : 'medium';
            } else if (tier.tier === 0) {
              resolvedQuality = 'low';
            }

            if (!qualityOverride) {
              setQuality(resolvedQuality);
              setDetected(resolvedQuality);
            }
          })
          .catch(() => {
            // Fallback to high on modern desktop
            if (!qualityOverride) {
              setQuality(initialTier);
            }
          });
      })
      .catch(() => {
        if (!qualityOverride) {
          setQuality(initialTier);
        }
      });
  }, [qualityOverride, setQuality]);

  return detected;
}
