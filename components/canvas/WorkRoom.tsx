/**
 * WorkRoom — Floating glass project panel gallery in 3D space.
 * 5 Tier-A projects displayed as floating glass 16:9 frames
 * arranged in a gentle curved arc. Camera passes through them on scroll.
 */
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Float } from '@react-three/drei';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useSceneStore } from '@/store/useSceneStore';
import { projects } from '@/data/projects';

// Project accent colors for gradient placeholder panels
const PROJECT_COLORS: Record<string, { primary: string; secondary: string }> = {
  oweo: { primary: '#10b981', secondary: '#059669' },
  numora: { primary: '#818cf8', secondary: '#6366f1' },
  insidertracker: { primary: '#f59e0b', secondary: '#d97706' },
  'codeclash-ai': { primary: '#38bdf8', secondary: '#0ea5e9' },
  stockscreener: { primary: '#6366f1', secondary: '#4f46e5' },
};

function ProjectPanel({
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
  const meshRef = useRef<THREE.Mesh>(null);
  const quality = useSceneStore((s) => s.quality);
  const colors = PROJECT_COLORS[projectSlug] || { primary: '#6366f1', secondary: '#4f46e5' };

  useFrame((state) => {
    if (!meshRef.current) return;
    // Gentle idle float
    meshRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 0.5 + index * 1.2) * 0.08;
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Glass frame */}
      <RoundedBox
        ref={meshRef}
        args={[2.8, 1.7, 0.06]}
        radius={0.08}
        smoothness={4}
      >
        <MeshTransmissionMaterial
          samples={quality === 'high' ? 12 : 4}
          resolution={quality === 'high' ? 256 : 128}
          thickness={0.06}
          roughness={0.05}
          ior={1.42}
          chromaticAberration={quality === 'high' ? 0.04 : 0}
          color="#9ba4ff"
          envMapIntensity={1}
          transparent
          opacity={0.85}
        />
      </RoundedBox>

      {/* Gradient placeholder panel inside glass */}
      <mesh position={[0, 0, -0.025]}>
        <planeGeometry args={[2.6, 1.55]} />
        <meshBasicMaterial
          color={colors.primary}
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Inner glow */}
      <mesh position={[0, 0.35, 0.04]}>
        <planeGeometry args={[1.8, 0.5]} />
        <meshBasicMaterial
          color={colors.primary}
          transparent
          opacity={0.08}
        />
      </mesh>
    </group>
  );
}

export function WorkRoom() {
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 5);

  // Curved arc layout
  const panelConfigs = featuredProjects.map((project, i) => {
    const total = featuredProjects.length;
    const angle = ((i - (total - 1) / 2) / total) * 0.8;
    const radius = 5;

    return {
      slug: project.slug,
      position: [
        Math.sin(angle) * radius,
        -8 + i * 0.4,
        -Math.cos(angle) * 1.5 + 0.5,
      ] as [number, number, number],
      rotation: [0, -angle * 0.6, 0] as [number, number, number],
    };
  });

  return (
    <group>
      {panelConfigs.map((cfg, i) => (
        <Float key={cfg.slug} speed={0.6 + i * 0.15} rotationIntensity={0.05} floatIntensity={0.15}>
          <ProjectPanel
            position={cfg.position}
            rotation={cfg.rotation}
            projectSlug={cfg.slug}
            index={i}
          />
        </Float>
      ))}

      {/* Section ambient glow */}
      <mesh position={[0, -10, -3]}>
        <planeGeometry args={[12, 8]} />
        <meshBasicMaterial color="#0c2340" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
