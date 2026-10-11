'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useSceneStore } from '@/store/useSceneStore';
import { useMouseParallax } from '@/hooks/useMouseParallax';
import { POINTER_REACTIVE_3D } from '@/lib/config';

/**
 * HeroRoom: Prominent 3D crystal sculpture with real refractive transmission.
 * Engineered to adapt dynamically to Light and Dark themes, and responsive aspect ratios.
 */
export function HeroRoom() {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const satelliteRef = useRef<THREE.Mesh>(null);

  const quality = useSceneStore((s) => s.quality);
  const theme = useSceneStore((s) => s.theme);
  const isDark = theme === 'dark';

  const { nx, ny } = useMouseParallax();
  const { viewport } = useThree();

  // Responsive scale adapted to aspect ratio (portrait mobile vs landscape/desktop)
  const isPortrait = viewport.aspect < 1;
  const scale = isPortrait
    ? Math.min(Math.max(viewport.width / 6.2, 0.55), 0.75)
    : Math.min(Math.max(viewport.width / 10, 0.85), 1.25);

  // Click kinetic impulse
  const impulse = useRef(0);
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      const isInteractive = target?.closest('button, a, input, textarea, select, [role="button"]');
      impulse.current = isInteractive ? 0.3 : 0.8;
    };
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Decay impulse
    impulse.current = THREE.MathUtils.damp(impulse.current, 0, 3, delta);

    // Pointer-reactive tilt if enabled
    if (POINTER_REACTIVE_3D) {
      const targetRX = -ny * 0.35;
      const targetRY = nx * 0.45 + t * 0.15;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRX,
        Math.min(delta * 3.5, 1)
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRY,
        Math.min(delta * 3.5, 1)
      );
    } else {
      groupRef.current.rotation.y += delta * 0.15;
    }

    // Dynamic scale response to impulse
    const currentScale = scale * (1 + impulse.current * 0.08);
    groupRef.current.scale.setScalar(currentScale);

    // Inner quantum core pulsing
    if (coreRef.current) {
      const coreScale = 1 + Math.sin(t * 2.2) * 0.06 + impulse.current * 0.25;
      coreRef.current.scale.setScalar(coreScale);
      coreRef.current.rotation.y = -t * 0.6;
      coreRef.current.rotation.x = t * 0.35;
    }

    // Gyroscopic rings
    if (outerRingRef.current) {
      outerRingRef.current.rotation.x = t * 0.4;
      outerRingRef.current.rotation.y = t * 0.3;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.x = -t * 0.5;
      innerRingRef.current.rotation.y = t * 0.35;
    }

    // Orbiting crystal satellite
    if (satelliteRef.current) {
      const satDist = isPortrait ? 1.8 : 2.5;
      const satSpeed = t * 0.7;
      satelliteRef.current.position.x = Math.cos(satSpeed) * satDist;
      satelliteRef.current.position.y = Math.sin(satSpeed * 0.8) * 0.8;
      satelliteRef.current.position.z = Math.sin(satSpeed) * (satDist * 0.9);
      satelliteRef.current.rotation.x = t * 1.2;
      satelliteRef.current.rotation.y = t;
    }
  });

  const transmissionProps = useMemo(
    () => ({
      samples: quality === 'high' ? 6 : 2,
      resolution: quality === 'high' ? 256 : 128,
      thickness: isDark ? 1.2 : 1.4,
      roughness: isDark ? 0.04 : 0.02,
      ior: isDark ? 1.5 : 1.52,
      chromaticAberration: quality === 'high' ? (isDark ? 0.03 : 0.02) : 0,
      anisotropicBlur: 0,
      distortion: 0.04,
      distortionScale: 0.1,
      temporalDistortion: 0,
      color: isDark ? '#f0f9ff' : '#ffffff',
      attenuationColor: isDark ? '#0284c7' : '#0369a1',
      attenuationDistance: isDark ? 0.75 : 0.65,
    }),
    [quality, isDark]
  );

  return (
    <group position={[0, isPortrait ? 0.2 : 0, 0]}>
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.25}>
        <group ref={groupRef}>
          {/* Main Faceted Glass Sculpture (Icosahedron) */}
          <mesh castShadow receiveShadow>
            <icosahedronGeometry args={[1.5, 0]} />
            <MeshTransmissionMaterial {...transmissionProps} />
          </mesh>

          {/* Precision Specular Wireframe Edge Lattice */}
          <mesh>
            <icosahedronGeometry args={[1.515, 0]} />
            <meshBasicMaterial
              wireframe
              color={isDark ? '#38bdf8' : '#0284c7'}
              transparent
              opacity={isDark ? 0.25 : 0.42}
            />
          </mesh>

          {/* Inner Pulsating Quantum Core */}
          <mesh ref={coreRef}>
            <octahedronGeometry args={[0.6, 0]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive={isDark ? '#0ea5e9' : '#0284c7'}
              emissiveIntensity={isDark ? 1.2 : 1.0}
              roughness={0.15}
              metalness={0.8}
            />
          </mesh>

          {/* Inner Core Radiant Glow */}
          <pointLight
            color={isDark ? '#38bdf8' : '#0284c7'}
            intensity={isDark ? 1.8 : 1.4}
            distance={5}
            decay={2}
          />

          {/* Outer Gyroscopic Orbital Ring */}
          <mesh ref={outerRingRef}>
            <torusGeometry args={[isPortrait ? 1.7 : 2.2, 0.018, 16, 80]} />
            <meshStandardMaterial
              color={isDark ? '#7dd3fc' : '#0284c7'}
              emissive={isDark ? '#0284c7' : '#0369a1'}
              emissiveIntensity={isDark ? 0.6 : 0.4}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>

          {/* Inner Gyroscopic Orbital Ring */}
          <mesh ref={innerRingRef} rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[isPortrait ? 2.0 : 2.5, 0.015, 16, 80]} />
            <meshStandardMaterial
              color={isDark ? '#38bdf8' : '#0ea5e9'}
              emissive={isDark ? '#0369a1' : '#0284c7'}
              emissiveIntensity={isDark ? 0.5 : 0.4}
              roughness={0.12}
              metalness={0.9}
            />
          </mesh>

          {/* Orbiting Satellite Crystal */}
          <mesh ref={satelliteRef}>
            <octahedronGeometry args={[0.2, 0]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={isDark ? 0.9 : 0.7}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>
        </group>
      </Float>
    </group>
  );
}
