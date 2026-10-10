'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useSceneStore } from '@/store/useSceneStore';
import { useMouseParallax } from '@/hooks/useMouseParallax';
import { POINTER_REACTIVE_3D } from '@/lib/config';
import { skillCategories } from '@/data/skills';

// Palette: Sky, Blue, Emerald, Amber, Slate (no purple/violet)
const CATEGORY_COLORS = [
  '#0ea5e9', // Languages: sky
  '#0284c7', // Frameworks: blue
  '#10b981', // Backend: emerald
  '#f59e0b', // Storage: amber
  '#38bdf8', // Academic: cyan
  '#64748b', // Tools: slate
];

export function SkillsRoom() {
  const groupRef = useRef<THREE.Group>(null);
  const quality = useSceneStore((s) => s.quality);
  const theme = useSceneStore((s) => s.theme);
  const isDark = theme === 'dark';
  const { nx, ny } = useMouseParallax();

  // Generate constellation layout using Fibonacci sphere distribution
  const orbs = useMemo(() => {
    const list: {
      position: THREE.Vector3;
      scale: number;
      color: string;
    }[] = [];

    const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle
    let count = 0;

    skillCategories.forEach((cat, catIdx) => {
      cat.skills.forEach((skill) => {
        const radius = 2.4 + (count % 3) * 0.35;
        const theta = phi * count;
        const cosTheta = 1 - (2 * count) / 32;
        const sinTheta = Math.sqrt(Math.max(0, 1 - cosTheta * cosTheta));

        list.push({
          position: new THREE.Vector3(
            radius * sinTheta * Math.cos(theta),
            radius * cosTheta,
            radius * sinTheta * Math.sin(theta)
          ),
          scale: 0.08 + (Math.min(skill.verifiedIn?.length || 1, 4) / 4) * 0.12,
          color: CATEGORY_COLORS[catIdx % CATEGORY_COLORS.length],
        });
        count++;
      });
    });

    return list;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Slow ambient constellation rotation
    groupRef.current.rotation.y += delta * 0.08;
    groupRef.current.rotation.x = Math.sin(t * 0.15) * 0.08;

    // Pointer-reactive tilt
    if (POINTER_REACTIVE_3D) {
      groupRef.current.rotation.x += (-ny * 0.2 - groupRef.current.rotation.x) * delta * 2;
      groupRef.current.rotation.z = (nx * 0.15 - groupRef.current.rotation.z) * delta * 2;
    }
  });

  return (
    <group position={[1.5, -18, 0]}>
      <group ref={groupRef}>
        {orbs.map((orb, i) => (
          <mesh key={i} position={orb.position} scale={orb.scale}>
            <Sphere args={[1, quality === 'high' ? 16 : 8, quality === 'high' ? 16 : 8]}>
              <MeshTransmissionMaterial
                samples={quality === 'high' ? 6 : 2}
                resolution={quality === 'high' ? 128 : 64}
                thickness={orb.scale * 2.2}
                roughness={isDark ? 0.04 : 0.02}
                ior={1.42}
                chromaticAberration={quality === 'high' ? 0.02 : 0}
                color={isDark ? '#ffffff' : '#f0f9ff'}
                attenuationColor={orb.color}
                attenuationDistance={0.35}
                transparent
                opacity={isDark ? 0.9 : 0.95}
              />
            </Sphere>
          </mesh>
        ))}

        {/* Central radiant cluster light */}
        <pointLight
          color={isDark ? '#38bdf8' : '#0284c7'}
          intensity={isDark ? 1.2 : 1.5}
          distance={8}
          decay={2}
        />
      </group>

      {/* Backdrop glow: luminous sky in light mode, deep slate in dark */}
      <mesh position={[0, 0, -3]}>
        <planeGeometry args={[10, 8]} />
        <meshBasicMaterial
          color={isDark ? '#062038' : '#e0f2fe'}
          transparent
          opacity={isDark ? 0.25 : 0.45}
        />
      </mesh>
    </group>
  );
}
