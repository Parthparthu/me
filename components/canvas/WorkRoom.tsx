'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useSceneStore } from '@/store/useSceneStore';
import { useMouseParallax } from '@/hooks/useMouseParallax';
import { POINTER_REACTIVE_3D } from '@/lib/config';
import { projects } from '@/data/projects';

// Project accent colors (strictly non-purple)
const PROJECT_ACCENTS: Record<string, { primary: string; secondary: string }> = {
  oweo: { primary: '#10b981', secondary: '#059669' },
  numora: { primary: '#22D3EE', secondary: '#0369A1' },
  insidertracker: { primary: '#F59E0B', secondary: '#B45309' },
  'codeclash-ai': { primary: '#67E8F9', secondary: '#22D3EE' },
  stockscreener: { primary: '#0369A1', secondary: '#075985' },
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

  const pointer = useMouseParallax();
  const colors = PROJECT_ACCENTS[projectSlug] || { primary: '#22D3EE', secondary: '#0369A1' };

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Pointer-reactive tilt
    if (POINTER_REACTIVE_3D) {
      const tiltX = -pointer.ny * 0.15;
      const tiltY = pointer.nx * 0.2;
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
        <meshPhysicalMaterial
          roughness={isDark ? 0.06 : 0.03}
          metalness={0.12}
          clearcoat={1.0}
          clearcoatRoughness={0.06}
          color={isDark ? '#0E1626' : '#FFFFFF'}
          emissive={colors.primary}
          emissiveIntensity={isDark ? 0.15 : 0.08}
          transparent
          opacity={isDark ? 0.88 : 0.92}
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

import { useScrollStore } from '@/store/useScrollStore';

export function WorkRoom() {
  const groupRef = useRef<THREE.Group>(null);
  const theme = useSceneStore((s) => s.theme);
  const isDark = theme === 'dark';
  const featured = projects.filter((p) => p.featured).slice(0, 5);

  useFrame(() => {
    if (!groupRef.current) return;
    const progress = useScrollStore.getState().progress;
    groupRef.current.visible = progress >= 0.02 && progress <= 0.60;
  });

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
    <group ref={groupRef}>
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
          color={isDark ? '#060B18' : '#F6F8FB'}
          transparent
          opacity={isDark ? 0.25 : 0.45}
        />
      </mesh>
    </group>
  );
}
