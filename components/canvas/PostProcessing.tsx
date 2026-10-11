'use client';

import { useSceneStore } from '@/store/useSceneStore';
import { QUALITY_CONFIG } from '@/lib/config';
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
} from '@react-three/postprocessing';
import { BlendFunction, KernelSize } from 'postprocessing';
import * as THREE from 'three';

const CA_OFFSET = new THREE.Vector2(0.0004, 0.0004);

export function PostProcessingEffects() {
  const quality = useSceneStore((s) => s.quality);

  // Only render on high quality tier when enabled
  if (quality !== 'high' || !QUALITY_CONFIG.enablePostProcessing) {
    return null;
  }

  return (
    <EffectComposer multisampling={0}>
      {/* Soft luminous bloom on glass reflections */}
      <Bloom
        luminanceThreshold={0.65}
        luminanceSmoothing={0.3}
        intensity={0.35}
        kernelSize={KernelSize.MEDIUM}
        blendFunction={BlendFunction.ADD}
      />

      {/* Subtle edge chromatic refraction */}
      <ChromaticAberration
        offset={CA_OFFSET}
        blendFunction={BlendFunction.NORMAL}
        radialModulation={true}
        modulationOffset={0.5}
      />

      {/* Cinematic vignette */}
      <Vignette
        offset={0.35}
        darkness={0.45}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}
