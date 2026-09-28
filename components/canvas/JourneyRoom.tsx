/**
 * JourneyRoom — 3D timeline ribbon with milestone glass cards.
 * 5 milestone cards positioned along a winding 3D spline.
 * Camera journey passes through this room between progress 0.6–0.8.
 */
'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Sphere, Float } from '@react-three/drei';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useSceneStore } from '@/store/useSceneStore';
import { milestones } from '@/data/journey';

const MILESTONE_COLORS = [
  '#475569', // 2020 — slate (origin)
  '#10b981', // 2021 — emerald (bronze medal)
  '#6366f1', // 2023 — indigo (B.Tech)
  '#f59e0b', // 2024 — amber (systems)
  '#38bdf8', // 2025 — cyan (current)
];

export function JourneyRoom() {
  const quality = useSceneStore((s) => s.quality);
  const lineRef = useRef<THREE.Line | null>(null);

  // Timeline ribbon spline
  const ribbonPoints = useMemo(
    () =>
      milestones.map((_, i) => {
        const t = i / (milestones.length - 1);
        return new THREE.Vector3(
          Math.sin(t * Math.PI * 1.5) * 1.8,
          -22 - i * 1.5,
          Math.cos(t * Math.PI) * 0.5
        );
      }),
    []
  );

  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(ribbonPoints),
    [ribbonPoints]
  );

  const lineGeometry = useMemo(() => {
    const points = curve.getPoints(60);
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [curve]);

  return (
    <group>
      {/* Ribbon line */}
      <primitive
        object={
          new THREE.Line(
            lineGeometry,
            new THREE.LineBasicMaterial({
              color: '#6366f1',
              transparent: true,
              opacity: 0.3,
            })
          )
        }
      />

      {/* Milestone orbs + cards */}
      {milestones.map((milestone, i) => {
        const pt = ribbonPoints[i];
        const color = MILESTONE_COLORS[i];

        return (
          <group key={milestone.id} position={[pt.x, pt.y, pt.z]}>
            <Float speed={0.5 + i * 0.1} rotationIntensity={0.05} floatIntensity={0.1}>
              {/* Milestone orb */}
              <Sphere args={[0.12, 16, 16]}>
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={0.8}
                  metalness={0.3}
                  roughness={0.3}
                />
              </Sphere>

              {/* Glass card behind orb */}
              <RoundedBox
                args={[1.8, 0.6, 0.04]}
                radius={0.06}
                smoothness={4}
                position={[0.9, 0, -0.1]}
              >
                <MeshTransmissionMaterial
                  samples={quality === 'high' ? 6 : 2}
                  resolution={128}
                  thickness={0.04}
                  roughness={0.08}
                  ior={1.4}
                  color={color}
                  envMapIntensity={0.8}
                  transparent
                  opacity={0.5}
                />
              </RoundedBox>

              {/* Glow */}
              <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.25, 8, 8]} />
                <meshBasicMaterial
                  color={color}
                  transparent
                  opacity={0.15}
                />
              </mesh>
            </Float>
          </group>
        );
      })}

      {/* Background haze */}
      <mesh position={[0, -26, -4]}>
        <planeGeometry args={[14, 12]} />
        <meshBasicMaterial color="#0f0621" transparent opacity={0.25} />
      </mesh>
    </group>
  );
}
