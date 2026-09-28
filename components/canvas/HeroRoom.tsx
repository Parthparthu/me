/**
 * HeroRoom — 3D objects for the Hero section.
 *
 * Contains:
 * - Glass sculptural slab (MeshTransmissionMaterial) — main hero object
 * - Orbiting glass orb — smaller satellite with chromatic aberration
 * - Extruded "P" monogram — glass text geometry with IOR
 * - Aurora backdrop — plane with animated gradient shader
 *
 * All objects respond to cursor (mouse parallax via useMouseParallax).
 * The group gently floats via drei <Float>.
 */
'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  MeshTransmissionMaterial,
  Float,
  RoundedBox,
  Sphere,
  Text3D,
  Center,
} from '@react-three/drei';
import * as THREE from 'three';
import { useSceneStore } from '@/store/useSceneStore';
import { useMouseParallax } from '@/hooks/useMouseParallax';

export function HeroRoom() {
  const groupRef = useRef<THREE.Group>(null);
  const orbRef = useRef<THREE.Mesh>(null);
  const quality = useSceneStore((s) => s.quality);
  const { nx, ny } = useMouseParallax();
  const { viewport } = useThree();

  // Scale based on viewport
  const scale = Math.min(viewport.width / 8, 1.2);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Gentle mouse parallax tilt on the whole group
    const targetRX = -ny * 0.15;
    const targetRY = nx * 0.2;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRX,
      delta * 3
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRY,
      delta * 3
    );

    // Orb orbit animation
    if (orbRef.current) {
      const t = state.clock.elapsedTime;
      orbRef.current.position.x = Math.cos(t * 0.4) * 2.2;
      orbRef.current.position.y = Math.sin(t * 0.6) * 0.8;
      orbRef.current.position.z = Math.sin(t * 0.3) * 0.4;
    }
  });

  const transmissionProps = useMemo(() => ({
    samples: quality === 'high' ? 16 : 6,
    resolution: quality === 'high' ? 512 : 256,
    thickness: 0.35,
    roughness: 0.04,
    ior: 1.45,
    chromaticAberration: quality === 'high' ? 0.06 : 0,
    anisotropicBlur: quality === 'high' ? 0.1 : 0,
    envMapIntensity: 1.5,
    distortion: 0.1,
    distortionScale: 0.2,
    temporalDistortion: 0.05,
  }), [quality]);

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={scale}>
      {/* ── Main glass slab ────────────────────────────────────────────────── */}
      <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.3}>
        <RoundedBox args={[3.2, 1.9, 0.28]} radius={0.12} smoothness={6}>
          <MeshTransmissionMaterial
            {...transmissionProps}
            color="#9ba4ff"
            attenuationColor="#4f46e5"
            attenuationDistance={0.6}
            background={new THREE.Color('#060818')}
          />
        </RoundedBox>

        {/* Slab inner glow plane */}
        <mesh position={[0, 0, -0.12]} rotation={[0, 0, 0]}>
          <planeGeometry args={[3.0, 1.7]} />
          <meshBasicMaterial
            color="#818cf8"
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
          />
        </mesh>
      </Float>

      {/* ── Orbiting glass orb ────────────────────────────────────────────── */}
      <mesh ref={orbRef} position={[2.2, 0.3, 0]}>
        <Sphere args={[0.4, 32, 32]}>
          <MeshTransmissionMaterial
            samples={quality === 'high' ? 12 : 4}
            resolution={quality === 'high' ? 256 : 128}
            thickness={0.5}
            roughness={0.0}
            ior={1.55}
            chromaticAberration={quality === 'high' ? 0.1 : 0}
            color="#38bdf8"
            attenuationColor="#0ea5e9"
            attenuationDistance={0.4}
            envMapIntensity={2}
          />
        </Sphere>
      </mesh>

      {/* ── Smaller accent orb ────────────────────────────────────────────── */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[-1.8, -0.7, 0.3]}>
          <Sphere args={[0.2, 24, 24]}>
            <MeshTransmissionMaterial
              samples={quality === 'high' ? 8 : 4}
              resolution={128}
              thickness={0.4}
              roughness={0.02}
              ior={1.5}
              color="#818cf8"
              envMapIntensity={2}
            />
          </Sphere>
        </mesh>
      </Float>

      {/* ── Glass "P" monogram ────────────────────────────────────────────── */}
      <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.15}>
        <group position={[0, 0, 0.18]}>
          <Center>
            <Text3D
              font="/fonts/SpaceGrotesk_Bold.json"
              size={0.7}
              height={0.06}
              curveSegments={12}
              bevelEnabled
              bevelThickness={0.015}
              bevelSize={0.008}
              bevelSegments={4}
            >
              P
              <MeshTransmissionMaterial
                samples={quality === 'high' ? 8 : 4}
                resolution={256}
                thickness={0.08}
                roughness={0.08}
                ior={1.4}
                chromaticAberration={quality === 'high' ? 0.04 : 0}
                color="#ffffff"
                envMapIntensity={1.2}
              />
            </Text3D>
          </Center>
        </group>
      </Float>

      {/* ── Ambient background glow planes ───────────────────────────────── */}
      <mesh position={[0, 0, -2]} rotation={[0, 0, Math.PI * 0.03]}>
        <planeGeometry args={[8, 6]} />
        <meshBasicMaterial
          color="#3730a3"
          transparent
          opacity={0.12}
        />
      </mesh>
      <mesh position={[2, 0.5, -3]}>
        <planeGeometry args={[4, 3]} />
        <meshBasicMaterial
          color="#0ea5e9"
          transparent
          opacity={0.08}
        />
      </mesh>
    </group>
  );
}
