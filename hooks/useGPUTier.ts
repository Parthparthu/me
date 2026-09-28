/**
 * useGPUTier — Detects GPU capability on mount using detect-gpu.
 * Returns a QualityTier and updates the global Zustand store.
 * Called once in SceneCanvas; result is persisted if user hasn't overridden.
 */
'use client';

import { useEffect, useState } from 'react';
import { useSceneStore, QualityTier } from '@/store/useSceneStore';

export function useGPUTier(): QualityTier {
  const { qualityOverride, setQuality } = useSceneStore();
  const [detected, setDetected] = useState<QualityTier>('high');

  useEffect(() => {
    // If the user has manually overridden, respect that
    if (qualityOverride) {
      setQuality(qualityOverride);
      setDetected(qualityOverride);
      return;
    }

    // Check WebGL support first
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) {
      setQuality('none');
      setDetected('none');
      return;
    }

    // Check reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setQuality('none');
      setDetected('none');
      return;
    }

    // Dynamic import to avoid blocking initial paint
    import('detect-gpu').then(({ getGPUTier }) => {
      getGPUTier().then((tier) => {
        let quality: QualityTier;
        if (tier.tier >= 3) {
          quality = 'high';
        } else if (tier.tier === 2) {
          quality = 'medium';
        } else if (tier.tier === 1) {
          quality = 'low';
        } else {
          quality = 'none';
        }

        // Mobile gets one tier lower by default
        const isMobile =
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          );
        if (isMobile && quality === 'high') quality = 'medium';

        setQuality(quality);
        setDetected(quality);
      });
    });
  }, [qualityOverride, setQuality]);

  return detected;
}
