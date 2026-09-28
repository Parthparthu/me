/**
 * PostProcessingEffects — Quality-gated post-processing stack.
 * Only rendered at 'high' quality tier.
 * Includes: Bloom, ChromaticAberration, DepthOfField, Vignette.
 */
'use client';

import { useSceneStore } from '@/store/useSceneStore';
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  DepthOfField,
  Vignette,
} from '@react-three/postprocessing';
import { BlendFunction, KernelSize } from 'postprocessing';
import * as THREE from 'three';

export function PostProcessingEffects() {
  const quality = useSceneStore((s) => s.quality);

  // Don't render if not high quality (safety check — SceneCanvas also gates this)
  if (quality !== 'high') return null;

  return (
    <EffectComposer multisampling={4}>
      {/* Soft bloom for glass luminosity */}
      <Bloom
        luminanceThreshold={0.6}
        luminanceSmoothing={0.3}
        intensity={0.4}
        kernelSize={KernelSize.MEDIUM}
        blendFunction={BlendFunction.ADD}
      />

      {/* Subtle chromatic aberration on edges */}
      <ChromaticAberration
        offset={new THREE.Vector2(0.0005, 0.0005)}
        blendFunction={BlendFunction.NORMAL}
        radialModulation={true}
        modulationOffset={0.4}
      />

      {/* Depth of field — slight bokeh on far objects */}
      <DepthOfField
        focusDistance={0.02}
        focalLength={0.05}
        bokehScale={1.5}
        blendFunction={BlendFunction.NORMAL}
      />

      {/* Subtle vignette for cinematic framing */}
      <Vignette
        offset={0.35}
        darkness={0.5}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}
