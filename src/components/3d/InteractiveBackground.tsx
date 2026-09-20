import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const InteractiveBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
      window.innerWidth < 768;
    const speedMultiplier = prefersReducedMotion ? 0.2 : 1.0;

    let width = mount.clientWidth || window.innerWidth;
    let height = mount.clientHeight || window.innerHeight;

    // ─── CSS-variable cursor light (zero React re-renders) ───────────────────
    // We update --cursor-x and --cursor-y via the root element instead of state
    let handleCursorLight: ((e: MouseEvent) => void) | undefined;
    if (!prefersReducedMotion && !isMobile) {
      handleCursorLight = (e: MouseEvent) => {
        const xPct = ((e.clientX / window.innerWidth) * 100).toFixed(1);
        const yPct = ((e.clientY / window.innerHeight) * 100).toFixed(1);
        document.documentElement.style.setProperty('--cursor-x', `${xPct}%`);
        document.documentElement.style.setProperty('--cursor-y', `${yPct}%`);
      };
      document.addEventListener('mousemove', handleCursorLight, { passive: true });
      // Cleanup added below in return
    }

    // ─── Scene, Camera & Renderer ──────────────────────────────────────────────
    const scene = new THREE.Scene();
    // Atmospheric fog for soft depth-fade into obsidian void
    scene.fog = new THREE.FogExp2(0x060709, 0.00075);

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 2500);
    camera.position.set(0, 0, 450);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: isMobile ? 'default' : 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.0 : 1.75));
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.inset = '0';
    renderer.domElement.style.pointerEvents = 'none';
    mount.appendChild(renderer.domElement);

    // ─── 1. Volumetric 3D Cosmic Constellation ──────────────────────────────
    // Adaptive particle count based on device capability
    const particleCount = prefersReducedMotion ? 200 : isMobile ? 350 : 1200;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    const PALETTE_VEC = [
      new THREE.Color('#19D3E6'), // Ice Cyan
      new THREE.Color('#4F7CFF'), // Electric Cobalt
      new THREE.Color('#7C6CFF'), // Violet
      new THREE.Color('#38bdf8'), // Sky Cyan
      new THREE.Color('#e2e8f0'), // Platinum Starlight
    ];

    for (let i = 0; i < particleCount; i++) {
      // Cylindrical/spatial distribution extending deep along the Z and Y axis
      const spreadX = (Math.random() - 0.5) * 1600;
      const spreadY = (Math.random() - 0.5) * 2600;
      const spreadZ = (Math.random() - 0.5) * 2000 - 300;

      positions[i * 3 + 0] = spreadX;
      positions[i * 3 + 1] = spreadY;
      positions[i * 3 + 2] = spreadZ;

      const color = PALETTE_VEC[i % PALETTE_VEC.length];
      colors[i * 3 + 0] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      scales[i] = Math.random() * 2.5 + 1.2;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom circular soft-glow particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.25, 'rgba(0, 240, 255, 0.85)');
      grad.addColorStop(0.6, 'rgba(79, 107, 255, 0.35)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(32, 32, 32, 0, Math.PI * 2);
      ctx.fill();
    }
    const starTex = new THREE.CanvasTexture(canvas);

    const starMat = new THREE.PointsMaterial({
      size: 5.5,
      map: starTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // ─── 2. Floating 3D Wireframe Polyhedra Suspended in Z-Space ───────────────
    // Mesh 1: Torus Knot at Upper-Right (Hero / Projects transition)
    const geoTorus = new THREE.TorusKnotGeometry(55, 14, 120, 16);
    const matTorus = new THREE.MeshBasicMaterial({
      color: 0x4f6bff,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const meshTorus = new THREE.Mesh(geoTorus, matTorus);
    meshTorus.position.set(340, 120, -320);
    scene.add(meshTorus);

    // Mesh 2: Icosahedron at Mid-Left (Projects / About transition)
    const geoIco = new THREE.IcosahedronGeometry(75, 1);
    const matIco = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const meshIco = new THREE.Mesh(geoIco, matIco);
    meshIco.position.set(-360, -380, -600);
    scene.add(meshIco);

    // Mesh 3: Octahedron at Lower-Right (Skills & Journey)
    const geoOcta = new THREE.OctahedronGeometry(65, 0);
    const matOcta = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const meshOcta = new THREE.Mesh(geoOcta, matOcta);
    meshOcta.position.set(320, -900, -850);
    scene.add(meshOcta);

    // Mesh 4: Dodecahedron at Deep Space Bottom (Achievements & Contact)
    const geoDodec = new THREE.DodecahedronGeometry(70, 0);
    const matDodec = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.16,
    });
    const meshDodec = new THREE.Mesh(geoDodec, matDodec);
    meshDodec.position.set(-280, -1450, -1150);
    scene.add(meshDodec);

    // ─── 3. Scroll-Linked 3D Camera Travel & Velocity Parallax ───────────────
    let targetCameraZ = 450;
    let targetCameraY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let targetVelocity = 0;

    const onScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const progress = scrollY / maxScroll; // 0.0 to 1.0

      // Glide camera forward through 3D space from Z=450 to Z=-1050
      targetCameraZ = 450 - progress * 1500;
      // Pan camera downward through the cosmic corridor from Y=0 to Y=-1500
      targetCameraY = -progress * 1500;

      // Compute scroll delta velocity
      const delta = scrollY - lastScrollY;
      lastScrollY = scrollY;
      targetVelocity = delta;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ─── 4. Gyroscopic Mouse Parallax ──────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;
      targetRotY = normX * 0.12;
      targetRotX = -normY * 0.09;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // ─── 5. Responsive Resize & Visibility ────────────────────────────────────
    const onResize = () => {
      if (!mount) return;
      width = mount.clientWidth || window.innerWidth;
      height = mount.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize, { passive: true });

    let isVisible = true;
    const onVisibility = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibility);

    // ─── 6. Continuous Render Loop with Damped Velocity Lerp ───────────────────
    let animId: number;
    let clock = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      clock += 0.01 * speedMultiplier;

      // Damped scroll velocity with smooth decay
      scrollVelocity += (targetVelocity - scrollVelocity) * 0.12;
      targetVelocity *= 0.86;

      // Cosmic Speed Warp: stretch starfield along Z when moving fast
      const warpZ = 1 + Math.min(Math.abs(scrollVelocity) * 0.018, 2.2);
      starField.scale.z = warpZ;
      starField.scale.x = 1 / Math.sqrt(warpZ);
      starField.scale.y = 1 / Math.sqrt(warpZ);

      // Camera dynamic inertia pitch based on scroll velocity
      const pitchOffset = Math.max(Math.min(scrollVelocity * 0.00035, 0.075), -0.075);

      // Smooth camera scroll-travel lerp
      camera.position.z += (targetCameraZ - camera.position.z) * 0.06;
      camera.position.y += (targetCameraY - camera.position.y) * 0.06;

      // Smooth gyroscopic mouse rotation lerp + inertia pitch
      camera.rotation.x += (targetRotX + pitchOffset - camera.rotation.x) * 0.05;
      camera.rotation.y += (targetRotY - camera.rotation.y) * 0.05;

      // Starfield subtle cosmic drift
      starField.rotation.y = clock * 0.02;
      starField.rotation.z = Math.sin(clock * 0.015) * 0.03;

      // Rotate 3D floating polyhedra independently with velocity responsiveness
      const polyhedraSpeed = (1 + Math.abs(scrollVelocity) * 0.02) * speedMultiplier;
      meshTorus.rotation.x += 0.004 * polyhedraSpeed;
      meshTorus.rotation.y += 0.007 * polyhedraSpeed;

      meshIco.rotation.y -= 0.006 * polyhedraSpeed;
      meshIco.rotation.z += 0.005 * polyhedraSpeed;

      meshOcta.rotation.x += 0.008 * polyhedraSpeed;
      meshOcta.rotation.z -= 0.004 * polyhedraSpeed;

      meshDodec.rotation.y += 0.005 * polyhedraSpeed;
      meshDodec.rotation.x -= 0.003 * polyhedraSpeed;

      renderer.render(scene, camera);
    };

    animate();

    // ─── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      if (handleCursorLight) {
        document.removeEventListener('mousemove', handleCursorLight);
      }

      starGeo.dispose();
      starMat.dispose();
      starTex.dispose();

      geoTorus.dispose();
      matTorus.dispose();
      geoIco.dispose();
      matIco.dispose();
      geoOcta.dispose();
      matOcta.dispose();
      geoDodec.dispose();
      matDodec.dispose();

      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    />
  );
};

export default InteractiveBackground;
