'use client';

import { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

function PrismGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.12;
    meshRef.current.rotation.y += delta * 0.16;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
      <RoundedBox
        ref={meshRef}
        args={[2.2, 2.2, 2.2]}
        radius={0.15}
        smoothness={4}
      >
        <meshPhysicalMaterial
          color="#f1f5f9"
          transmission={0.92}
          opacity={1}
          transparent
          roughness={0.08}
          ior={1.48}
          thickness={1.5}
          specularIntensity={0.9}
          specularColor="#38bdf8"
          clearcoat={0.8}
          clearcoatRoughness={0.1}
          reflectivity={0.5}
        />
      </RoundedBox>
    </Float>
  );
}

export function HeroGlassPrism() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener('change', handler);

    // Detect WebGL capability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }

    // Pause rendering when offscreen
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      motionQuery.removeEventListener('change', handler);
      observer.disconnect();
    };
  }, []);

  // Static Fallback for reduced motion or missing WebGL
  if (reducedMotion || !hasWebGL) {
    return (
      <div
        ref={containerRef}
        className="w-48 h-48 md:w-64 md:h-64 flex items-center justify-center opacity-60 pointer-events-none"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-[var(--accent-primary)] stroke-current fill-none"
          strokeWidth="1.5"
        >
          <polygon points="50,15 85,35 85,75 50,95 15,75 15,35" strokeDasharray="2 2" />
          <polygon points="50,22 78,38 78,72 50,88 22,72 22,38" />
          <line x1="50" y1="22" x2="50" y2="88" opacity="0.4" />
          <line x1="22" y1="38" x2="78" y2="72" opacity="0.4" />
          <line x1="22" y1="72" x2="78" y2="38" opacity="0.4" />
        </svg>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-56 h-56 md:w-80 md:h-80 pointer-events-none select-none relative"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        frameloop={isVisible ? 'always' : 'never'}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 8, 5]} intensity={1.4} color="#f8fafc" />
        <directionalLight position={[-5, -4, -3]} intensity={0.9} color="#0ea5e9" />
        <Suspense fallback={null}>
          <PrismGeometry />
        </Suspense>
      </Canvas>
    </div>
  );
}
