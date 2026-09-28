/**
 * SkillsRoom — 3D skill orb constellation.
 * 30 glass orbs sized by skill level (1–4), arranged in a spherical cluster.
 * Hover to reveal label (handled via DOM tooltip overlay).
 * Click/drag to rotate the constellation.
 */
'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useSceneStore } from '@/store/useSceneStore';
import { skillCategories } from '@/data/skills';

const CATEGORY_COLORS = [
  '#6366f1', // Core Languages — indigo
  '#38bdf8', // Frontend — cyan
  '#10b981', // Backend — emerald
  '#f59e0b', // Databases — amber
  '#818cf8', // AI/ML — violet
  '#a78bfa', // DevTools — purple
];

export function SkillsRoom() {
  const groupRef = useRef<THREE.Group>(null);
  const quality = useSceneStore((s) => s.quality);
  const autoRotate = useRef(true);

  // Build orb positions from skills
  const orbs = useMemo(() => {
    const result: {
      position: THREE.Vector3;
      scale: number;
      color: string;
      categoryIdx: number;
    }[] = [];

    const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle

    let globalIdx = 0;
    skillCategories.forEach((cat, catIdx) => {
      cat.skills.forEach((skill) => {
        const r = 2.5 + Math.random() * 0.8; // cluster radius
        const theta = phi * globalIdx;
        const cosTheta = 1 - (2 * globalIdx) / 30;
        const sinTheta = Math.sqrt(1 - cosTheta * cosTheta);

        result.push({
          position: new THREE.Vector3(
            r * sinTheta * Math.cos(theta),
            r * cosTheta,
            r * sinTheta * Math.sin(theta)
          ),
          // Scale 0.08–0.18 based on skill level 1–4
          scale: 0.06 + (skill.level / 4) * 0.14,
          color: CATEGORY_COLORS[catIdx],
          categoryIdx: catIdx,
        });
        globalIdx++;
      });
    });

    return result;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current || !autoRotate.current) return;
    // Slow auto-rotation
    groupRef.current.rotation.y += delta * 0.08;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
  });

  return (
    <group position={[2, -16, 0]}>
      <group ref={groupRef}>
        {orbs.map((orb, i) => (
          <mesh key={i} position={orb.position} scale={orb.scale}>
            <Sphere args={[1, quality === 'high' ? 16 : 8, quality === 'high' ? 16 : 8]}>
              <MeshTransmissionMaterial
                samples={quality === 'high' ? 6 : 2}
                resolution={quality === 'high' ? 128 : 64}
                thickness={orb.scale * 2}
                roughness={0.05}
                ior={1.4}
                chromaticAberration={quality === 'high' ? 0.03 : 0}
                color={orb.color}
                envMapIntensity={1.2}
                transparent
                opacity={0.9}
              />
            </Sphere>
          </mesh>
        ))}
      </group>

      {/* Ambient glow */}
      <mesh position={[0, 0, -3]}>
        <planeGeometry args={[10, 8]} />
        <meshBasicMaterial color="#1e1b4b" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}
