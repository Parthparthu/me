import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HeroCanvas3DProps {
  className?: string;
}

// ─── Adaptive quality tier detection ──────────────────────────────────────────
type QualityTier = 'high' | 'medium' | 'low';

function detectQualityTier(): QualityTier {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const dpr = window.devicePixelRatio ?? 1;
  const cores = navigator.hardwareConcurrency ?? 2;

  if (isMobile || cores <= 2) return 'low';
  if (dpr > 2 || cores <= 4) return 'medium';
  return 'high';
}

export const HeroCanvas3D: React.FC<HeroCanvas3DProps> = ({ className }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ─── Quality & motion config ─────────────────────────────────────────────
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tier = detectQualityTier();
    const speedMultiplier = prefersReducedMotion ? 0.08 : 1.0;

    // Per-tier config
    const config = {
      high:   { dustCount: 380, ringCount: 2, satCount: 4, dpr: Math.min(window.devicePixelRatio, 2) },
      medium: { dustCount: 180, ringCount: 1, satCount: 3, dpr: Math.min(window.devicePixelRatio, 1.5) },
      low:    { dustCount: 80,  ringCount: 0, satCount: 2, dpr: 1 },
    }[tier];

    // ─── Renderer ────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: tier !== 'low',
      alpha: true,
      powerPreference: tier === 'low' ? 'default' : 'high-performance',
    });
    renderer.setPixelRatio(config.dpr);
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ─── Scene & Camera ──────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 7.2);
    let targetCameraZ = 7.2;

    // ─── Root group (mouse-tracked) ──────────────────────────────────────────
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // ─── 1. Outer Crystalline Torus Knot ────────────────────────────────────
    // Reduced segment count on medium/low for performance
    const tkTubularSegs = tier === 'high' ? 200 : tier === 'medium' ? 140 : 100;
    const tkRadialSegs  = tier === 'high' ? 22  : 16;
    const torusKnotGeo = new THREE.TorusKnotGeometry(1.65, 0.42, tkTubularSegs, tkRadialSegs);
    const torusKnotMat = new THREE.MeshStandardMaterial({
      color: 0x080c1a,
      metalness: 0.92,
      roughness: 0.08,
    });
    const torusKnot = new THREE.Mesh(torusKnotGeo, torusKnotMat);
    rootGroup.add(torusKnot);

    // Wireframe overlay (skip on low-tier for perf)
    let torusKnotWire: THREE.Mesh | null = null;
    if (tier !== 'low') {
      const torusKnotWireGeo = new THREE.TorusKnotGeometry(1.65, 0.42, tkTubularSegs, tkRadialSegs);
      const torusKnotWireMat = new THREE.MeshBasicMaterial({
        color: 0x19d3e6,
        wireframe: true,
        transparent: true,
        opacity: 0.18,
      });
      torusKnotWire = new THREE.Mesh(torusKnotWireGeo, torusKnotWireMat);
      rootGroup.add(torusKnotWire);
    }

    // ─── 2. Inner GLSL Shader Icosahedron ────────────────────────────────────
    const vertexShader = `
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying float vDisplacement;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        
        float displacement = sin(position.x * 3.5 + uTime * 1.5) * 0.14
          + cos(position.y * 3.0 + uTime * 1.2) * 0.14
          + sin(position.z * 2.5 + uTime * 1.8) * 0.10;
          
        vDisplacement = displacement;
        vec3 displaced = position + normal * displacement;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying float vDisplacement;

      void main() {
        // Cobalt #4F7CFF, Cyan #19D3E6, Violet #7C6CFF, Ice #E0F2FE
        vec3 colCyan   = vec3(0.098, 0.827, 0.902);  // #19D3E6
        vec3 colCobalt = vec3(0.310, 0.486, 1.0);    // #4F7CFF
        vec3 colViolet = vec3(0.486, 0.424, 1.0);    // #7C6CFF
        vec3 colIce    = vec3(0.878, 0.949, 0.996);  // #E0F2FE

        vec3 viewDir = normalize(-vPosition);
        float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.2);

        float t1 = sin(uTime * 0.9 + vNormal.y * 3.14) * 0.5 + 0.5;
        float t2 = cos(uTime * 1.1 + vDisplacement * 5.0) * 0.5 + 0.5;

        vec3 baseColor = mix(colCobalt, colCyan, t1);
        vec3 accentColor = mix(colViolet, colIce, t2);
        vec3 finalColor = mix(baseColor, accentColor, 0.4 + vDisplacement * 2.0);

        finalColor += colIce * fresnel * 0.75;
        finalColor += colCyan * (1.0 - fresnel) * 0.18;

        gl_FragColor = vec4(finalColor, 0.95);
      }
    `;

    const icoDetail = tier === 'high' ? 5 : tier === 'medium' ? 4 : 3;
    const icoGeo = new THREE.IcosahedronGeometry(0.92, icoDetail);
    const icoMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const icosahedron = new THREE.Mesh(icoGeo, icoMat);
    rootGroup.add(icosahedron);

    // ─── 3. Orbiting Geometric Satellites ───────────────────────────────────
    type Satellite = { mesh: THREE.Mesh; orbitRadius: number; speed: number; angle: number; tilt: number };
    const satellites: Satellite[] = [];

    const satDefs = [
      { geo: new THREE.OctahedronGeometry(0.22),   color: 0x19d3e6, emissive: 0x19d3e6, r: 2.5,  speed:  0.018, angle: 0,           tilt:  0.4 },
      { geo: new THREE.DodecahedronGeometry(0.22),  color: 0x4f7cff, emissive: 0x4f7cff, r: 3.2,  speed: -0.014, angle: Math.PI*0.5, tilt: -0.5 },
      { geo: new THREE.TetrahedronGeometry(0.24),   color: 0x7c6cff, emissive: 0x7c6cff, r: 3.9,  speed:  0.011, angle: Math.PI*1.2, tilt:  0.7 },
      { geo: new THREE.IcosahedronGeometry(0.17),   color: 0xe0f2fe, emissive: 0x19d3e6, r: 2.9,  speed:  0.021, angle: Math.PI*1.8, tilt: -0.3 },
    ].slice(0, config.satCount);

    for (const def of satDefs) {
      const mat = new THREE.MeshStandardMaterial({
        color: def.color,
        emissive: def.emissive,
        emissiveIntensity: 0.55,
        metalness: 0.9,
        roughness: 0.1,
      });
      const mesh = new THREE.Mesh(def.geo, mat);
      rootGroup.add(mesh);
      satellites.push({ mesh, orbitRadius: def.r, speed: def.speed, angle: def.angle, tilt: def.tilt });
    }

    // ─── 4. Particle Ring System ─────────────────────────────────────────────
    const rings: THREE.Points[] = [];
    const ringBases: Float32Array[] = [];

    if (config.ringCount > 0) {
      const buildRing = (count: number, radius: number, color: number): THREE.Points => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2;
          positions[i * 3 + 0] = Math.cos(angle) * radius;
          positions[i * 3 + 1] = 0;
          positions[i * 3 + 2] = Math.sin(angle) * radius;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const mat = new THREE.PointsMaterial({
          color, size: 0.065, blending: THREE.AdditiveBlending,
          depthWrite: false, transparent: true, opacity: 0.9,
        });
        return new THREE.Points(geo, mat);
      };

      const ring1 = buildRing(120, 3.0, 0x19d3e6);
      rootGroup.add(ring1);
      rings.push(ring1);
      ringBases.push((ring1.geometry.attributes.position as THREE.BufferAttribute).array.slice() as Float32Array);

      if (config.ringCount >= 2) {
        const ring2 = buildRing(120, 4.1, 0x4f7cff);
        rootGroup.add(ring2);
        rings.push(ring2);
        ringBases.push((ring2.geometry.attributes.position as THREE.BufferAttribute).array.slice() as Float32Array);
      }
    }

    // ─── 5. Ambient Stardust ─────────────────────────────────────────────────
    const dustCount = config.dustCount;
    const dustPositions = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);
    const colorOptions = [
      new THREE.Color(0x19d3e6), new THREE.Color(0x4f7cff),
      new THREE.Color(0x7c6cff), new THREE.Color(0x38bdf8), new THREE.Color(0xe0f2fe),
    ];

    for (let i = 0; i < dustCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 5.5 * Math.cbrt(Math.random());
      dustPositions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      dustPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      dustPositions[i * 3 + 2] = r * Math.cos(phi);
      const col = colorOptions[i % colorOptions.length];
      dustColors[i * 3 + 0] = col.r;
      dustColors[i * 3 + 1] = col.g;
      dustColors[i * 3 + 2] = col.b;
    }

    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustGeo.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.05, vertexColors: true, transparent: true,
      opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    rootGroup.add(dust);

    const dustVelocities = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustVelocities[i * 3 + 0] = (Math.random() - 0.5) * 0.0014;
      dustVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.0014;
      dustVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.0014;
    }

    // ─── 6. Lighting ──────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    const cobaltLight = new THREE.PointLight(0x4f7cff, 7, 20);
    scene.add(cobaltLight);
    const cyanLight = new THREE.PointLight(0x19d3e6, 6, 18);
    scene.add(cyanLight);
    const platinumLight = new THREE.PointLight(0xe0f2fe, 3, 14);
    scene.add(platinumLight);
    const violetLight = new THREE.PointLight(0x7c6cff, 4, 15);
    scene.add(violetLight);

    // ─── Mouse tracking ───────────────────────────────────────────────────────
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let burstScale = 1.0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetRotY = x * 0.5;
      targetRotX = -y * 0.35;
    };

    const onClickBurst = () => { burstScale = 1.22; };

    mount.addEventListener('mousemove', onMouseMove, { passive: true });
    mount.addEventListener('click', onClickBurst, { passive: true });

    // ─── Scroll parallax (via scroll event on window) ─────────────────────────
    const onScroll = () => {
      const t = Math.min(Math.max(window.scrollY / 800, 0), 1);
      targetCameraZ = 7.2 + t * 1.6;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // ─── Visibility & resize observers ───────────────────────────────────────
    let isVisible = true;
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { threshold: 0.01 }
    );
    intersectionObserver.observe(mount);

    const handleVisibilityChange = () => { isVisible = !document.hidden; };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const resizeObserver = new ResizeObserver(() => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    resizeObserver.observe(mount);

    // ─── Animation loop ───────────────────────────────────────────────────────
    let animId: number;
    let elapsed = 0;
    let frameCount = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      elapsed += 0.012 * speedMultiplier;
      frameCount++;

      // Mouse damping
      currentRotX += (targetRotX - currentRotX) * 0.042;
      currentRotY += (targetRotY - currentRotY) * 0.042;
      rootGroup.rotation.x = currentRotX;
      rootGroup.rotation.y = currentRotY;

      // Elastic burst return
      if (burstScale > 1.0) burstScale += (1.0 - burstScale) * 0.08;
      icosahedron.scale.setScalar(burstScale);

      // Camera parallax
      camera.position.z += (targetCameraZ - camera.position.z) * 0.038;

      // Torus knot rotation
      torusKnot.rotation.y += 0.005 * speedMultiplier;
      torusKnot.rotation.x += 0.002 * speedMultiplier;
      if (torusKnotWire) {
        torusKnotWire.rotation.y = torusKnot.rotation.y;
        torusKnotWire.rotation.x = torusKnot.rotation.x;
      }

      // Shader time
      icoMat.uniforms.uTime.value += 0.013 * speedMultiplier;
      icosahedron.rotation.y -= 0.007 * speedMultiplier;
      icosahedron.rotation.z += 0.004 * speedMultiplier;

      // Dynamic light orbits
      cobaltLight.position.set(
        Math.cos(elapsed * 0.8) * 5,
        Math.sin(elapsed * 0.6) * 4 + 1,
        Math.sin(elapsed * 0.8) * 3 + 2
      );
      cyanLight.position.set(
        Math.cos(elapsed * 0.9 + Math.PI) * 4.5,
        Math.sin(elapsed * 0.7 + Math.PI) * 3.5 - 1,
        Math.sin(elapsed * 0.9) * 3 + 2
      );
      platinumLight.position.set(
        Math.sin(elapsed * 1.1) * 4, Math.cos(elapsed * 0.5) * 3, Math.cos(elapsed * 1.1) * 3 + 3
      );
      violetLight.position.set(
        Math.sin(elapsed * 0.7 + 1) * 4, Math.cos(elapsed * 0.9) * 3, -4.5
      );

      // Satellites
      for (const sat of satellites) {
        sat.angle += sat.speed * speedMultiplier;
        sat.mesh.position.set(
          Math.cos(sat.angle) * sat.orbitRadius,
          Math.sin(sat.angle * 2) * sat.tilt,
          Math.sin(sat.angle) * sat.orbitRadius
        );
        sat.mesh.rotation.x += 0.02 * speedMultiplier;
        sat.mesh.rotation.y += 0.03 * speedMultiplier;
      }

      // Ring wobbles (every 2 frames for perf)
      if (frameCount % 2 === 0) {
        for (let ri = 0; ri < rings.length; ri++) {
          const ring = rings[ri];
          const base = ringBases[ri];
          const posArr = (ring.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
          const count = posArr.length / 3;
          for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            posArr[i * 3 + 1] = base[i * 3 + 1] + Math.sin(angle * 3 + elapsed * 2.5 + ri) * 0.14;
          }
          ring.geometry.attributes.position.needsUpdate = true;
          ring.rotation.z += (ri === 0 ? 0.003 : -0.003) * speedMultiplier;
        }
      }

      // Ambient stardust (every 3 frames for perf)
      if (frameCount % 3 === 0) {
        const dustPos = dustGeo.attributes.position as THREE.BufferAttribute;
        const dp = dustPos.array as Float32Array;
        for (let i = 0; i < dustCount; i++) {
          dp[i * 3 + 0] += dustVelocities[i * 3 + 0] * speedMultiplier;
          dp[i * 3 + 1] += dustVelocities[i * 3 + 1] * speedMultiplier;
          dp[i * 3 + 2] += dustVelocities[i * 3 + 2] * speedMultiplier;
          const dx = dp[i * 3 + 0], dy = dp[i * 3 + 1], dz = dp[i * 3 + 2];
          if (dx * dx + dy * dy + dz * dz > 5.5 * 5.5) {
            dp[i * 3 + 0] *= -0.95;
            dp[i * 3 + 1] *= -0.95;
            dp[i * 3 + 2] *= -0.95;
          }
        }
        dustPos.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // ─── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      mount.removeEventListener('mousemove', onMouseMove);
      mount.removeEventListener('click', onClickBurst);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();

      // Dispose geometries
      torusKnotGeo.dispose();
      icoGeo.dispose();
      dustGeo.dispose();
      for (const def of satDefs) def.geo.dispose();
      for (const ring of rings) ring.geometry.dispose();
      if (torusKnotWire) torusKnotWire.geometry.dispose();

      // Dispose materials
      torusKnotMat.dispose();
      icoMat.dispose();
      dustMat.dispose();
      for (const sat of satellites) (sat.mesh.material as THREE.Material).dispose();
      for (const ring of rings) (ring.material as THREE.Material).dispose();
      if (torusKnotWire) (torusKnotWire.material as THREE.Material).dispose();

      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={mountRef}
      className={className}
      data-cursor-3d
      aria-hidden="true"
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        cursor: 'grab',
      }}
    />
  );
};

export default HeroCanvas3D;
