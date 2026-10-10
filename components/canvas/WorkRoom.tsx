'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Float, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useSceneStore } from '@/store/useSceneStore';
import { useMouseParallax } from '@/hooks/useMouseParallax';
import { POINTER_REACTIVE_3D } from '@/lib/config';
import { projects } from '@/data/projects';

// Project accent colors (strictly non-purple)
const PROJECT_ACCENTS: Record<string, { primary: string; secondary: string }> = {
  oweo: { primary: '#10b981', secondary: '#059669' },
  numora: { primary: '#0ea5e9', secondary: '#0284c7' },
  insidertracker: { primary: '#f59e0b', secondary: '#d97706' },
  'codeclash-ai': { primary: '#38bdf8', secondary: '#0ea5e9' },
  stockscreener: { primary: '#0284c7', secondary: '#0369a1' },
};

function FloatingProjectPanel({
  position,
  rotation,
  projectSlug,
  index,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  projectSlug: string;
  index: number;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const quality = useSceneStore((s) => s.quality);
  const theme = useSceneStore((s) => s.theme);
  const isDark = theme === 'dark';

  const { nx, ny } = useMouseParallax();
  const colors = PROJECT_ACCENTS[projectSlug] || { primary: '#0ea5e9', secondary: '#0284c7' };

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Pointer-reactive tilt
    if (POINTER_REACTIVE_3D) {
      const tiltX = -ny * 0.15;
      const tiltY = nx * 0.2;
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        rotation[0] + tiltX,
        Math.min(delta * 3, 1)
      );
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        rotation[1] + tiltY,
        Math.min(delta * 3, 1)
      );
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation}>
      {/* 3D Liquid-Glass Frame */}
      <RoundedBox args={[2.8, 1.7, 0.08]} radius={0.08} smoothness={4}>
        <MeshTransmissionMaterial
          samples={quality === 'high' ? 8 : 3}
          resolution={quality === 'high' ? 256 : 128}
          thickness={isDark ? 0.12 : 0.15}
          roughness={isDark ? 0.04 : 0.02}
          ior={1.46}
          chromaticAberration={quality === 'high' ? 0.03 : 0}
          color={isDark ? '#f0f9ff' : '#ffffff'}
          attenuationColor={colors.primary}
          attenuationDistance={0.5}
          transparent
          opacity={isDark ? 0.9 : 0.95}
        />
      </RoundedBox>

      {/* Luminescent display plane inside glass frame */}
      <mesh position={[0, 0, -0.03]}>
        <planeGeometry args={[2.65, 1.55]} />
        <meshBasicMaterial
          color={colors.primary}
          transparent
          opacity={isDark ? 0.12 : 0.08}
        />
      </mesh>

      {/* Edge highlight plane */}
      <mesh position={[0, 0.72, 0.045]}>
        <planeGeometry args={[2.5, 0.02]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={isDark ? 0.35 : 0.65}
        />
      </mesh>
    </group>
  );
}

export function WorkRoom() {
  const theme = useSceneStore((s) => s.theme);
  const isDark = theme === 'dark';
  const featured = projects.filter((p) => p.featured).slice(0, 5);

  const panelConfigs = featured.map((project, i) => {
    const total = featured.length;
    const angle = ((i - (total - 1) / 2) / total) * 0.75;
    const radius = 5.2;

    return {
      slug: project.slug,
      position: [
        Math.sin(angle) * radius,
        -9 + (i % 2 === 0 ? 0.2 : -0.2),
        -Math.cos(angle) * 1.5 + 0.6,
      ] as [number, number, number],
      rotation: [0, -angle * 0.7, 0] as [number, number, number],
    };
  });

  return (
    <group>
      {panelConfigs.map((cfg, i) => (
        <Float
          key={cfg.slug}
          speed={0.8 + i * 0.15}
          rotationIntensity={0.06}
          floatIntensity={0.15}
        >
          <FloatingProjectPanel
            position={cfg.position}
            rotation={cfg.rotation}
            projectSlug={cfg.slug}
            index={i}
          />
        </Float>
      ))}

      {/* Spatial backdrop glow: luminous sky in light mode, dark navy in dark */}
      <mesh position={[0, -9, -3.5]}>
        <planeGeometry args={[14, 8]} />
        <meshBasicMaterial
          color={isDark ? '#082f49' : '#e0f2fe'}
          transparent
          opacity={isDark ? 0.25 : 0.45}
        />
      </mesh>
    </group>
  );
}
