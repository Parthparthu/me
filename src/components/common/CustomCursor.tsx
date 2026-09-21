import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

type CursorVariant = 'default' | 'hovering' | 'text' | 'canvas3d';

// ─── Canvas-based spark/shockwave renderer (zero React state) ─────────────────
interface CanvasParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'spark' | 'shockwave';
  radius?: number;
}

const SPARK_PALETTE = ['#38BDF8', '#6366F1', '#818CF8', '#A855F7'];

// ─── Component ────────────────────────────────────────────────────────────────
export const CustomCursor: React.FC = () => {
  const [isFinePointer, setIsFinePointer] = useState<boolean | null>(null);
  const [variant, setVariant] = useState<CursorVariant>('default');
  const [cursorLabel, setCursorLabel] = useState<string>('');

  // Label position (for smooth label tracking)
  const labelX = useMotionValue(-200);
  const labelY = useMotionValue(-200);
  const springLabelX = useSpring(labelX, { damping: 20, stiffness: 180 });
  const springLabelY = useSpring(labelY, { damping: 20, stiffness: 180 });

  // Canvas ref for spark/shockwave rendering
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<CanvasParticle[]>([]);
  const rafRef = useRef<number>(0);

  // Motion values for cursor position (no React state — zero re-renders)
  const ringX = useMotionValue(-100);
  const ringY = useMotionValue(-100);
  const springX = useSpring(ringX, { damping: 26, stiffness: 260 });
  const springY = useSpring(ringY, { damping: 26, stiffness: 260 });

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  useEffect(() => {
    setIsFinePointer(window.matchMedia('(pointer: fine)').matches);
  }, []);

  // ─── Canvas particle loop ──────────────────────────────────────────────────
  useEffect(() => {
    if (!isFinePointer) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter(p => p.life > 0);

      for (const p of particlesRef.current) {
        const t = 1 - p.life / p.maxLife;

        if (p.type === 'spark') {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.08; // gravity
          p.life -= 1;

          const alpha = p.life / p.maxLife;
          ctx.save();
          ctx.globalAlpha = alpha * 0.9;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (p.type === 'shockwave') {
          p.life -= 1;
          const radius = (p.radius ?? 0) * t;
          const alpha = (1 - t) * 0.8;

          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1.5;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [isFinePointer]);

  // ─── Event listeners ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!isFinePointer) return;

    let lastSparkTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      ringX.set(e.clientX - 14);
      ringY.set(e.clientY - 14);
      dotX.set(e.clientX - 3);
      dotY.set(e.clientY - 3);
      labelX.set(e.clientX + 16);
      labelY.set(e.clientY - 8);

      // Throttled spark spawning
      const now = performance.now();
      if (now - lastSparkTime > 55) {
        lastSparkTime = now;
        const color = SPARK_PALETTE[Math.floor(Math.random() * SPARK_PALETTE.length)];
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.5 + 0.5;
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          life: 18,
          maxLife: 18,
          size: Math.random() * 2.5 + 1,
          color,
          type: 'spark',
        });
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const color = SPARK_PALETTE[Math.floor(Math.random() * SPARK_PALETTE.length)];
      // Multiple concentric shockwaves
      [40, 70, 100].forEach((radius, i) => {
        setTimeout(() => {
          particlesRef.current.push({
            x: e.clientX,
            y: e.clientY,
            vx: 0, vy: 0,
            life: 30,
            maxLife: 30,
            size: 0,
            radius,
            color,
            type: 'shockwave',
          });
        }, i * 60);
      });
    };

    const HOVER_SEL = 'a, button, [data-cursor-hover], .btn, [role="button"], input, select, textarea, label';
    const TEXT_SEL = '[data-cursor-text]';
    const CANVAS_SEL = '[data-cursor-3d], canvas';

    const resolveVariant = (target: EventTarget | null): CursorVariant => {
      if (!(target instanceof Element)) return 'default';
      if (target.closest(CANVAS_SEL)) return 'canvas3d';
      if (target.closest(TEXT_SEL)) return 'text';
      if (target.closest(HOVER_SEL)) return 'hovering';
      return 'default';
    };

    const resolveCursorLabel = (target: EventTarget | null): string => {
      if (!(target instanceof Element)) return '';
      const el = target.closest('[data-cursor-label]');
      return el?.getAttribute('data-cursor-label') ?? '';
    };

    const handleMouseOver = (e: MouseEvent) => {
      setVariant(resolveVariant(e.target));
      setCursorLabel(resolveCursorLabel(e.target));
    };
    const handleMouseOut = (e: MouseEvent) => {
      setVariant(resolveVariant(e.relatedTarget));
      setCursorLabel(resolveCursorLabel(e.relatedTarget));
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isFinePointer, ringX, ringY, dotX, dotY, labelX, labelY]);

  if (isFinePointer === null || !isFinePointer) return null;

  const isHovering = variant === 'hovering';
  const isCanvas = variant === 'canvas3d';
  const isText = variant === 'text';
  const showLabel = cursorLabel.length > 0;

  return (
    <>
      {/* ── Canvas overlay for sparks & shockwaves (no React re-renders) ─── */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 9996,
        }}
      />

      {/* ── Cursor Label Pill ──────────────────────────────────────────────── */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: springLabelX,
          y: springLabelY,
          pointerEvents: 'none',
          zIndex: 9998,
          opacity: showLabel ? 1 : 0,
          scale: showLabel ? 1 : 0.7,
        }}
        transition={{ opacity: { duration: 0.15 }, scale: { type: 'spring', stiffness: 400, damping: 28 } }}
      >
        <span
          style={{
            display: 'inline-block',
            background: 'rgba(8, 9, 14, 0.88)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            borderRadius: '4px',
            padding: '3px 8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: '#38BDF8',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            boxShadow: '0 0 12px rgba(56, 189, 248, 0.25)',
          }}
        >
          {cursorLabel}
        </span>
      </motion.div>

      {/* ── Outer Magnetic Ring ────────────────────────────────────────────── */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: isHovering
            ? '1.5px solid #38BDF8'
            : isCanvas
            ? '1.5px dashed rgba(99, 102, 241, 0.6)'
            : '1.5px solid rgba(99, 102, 241, 0.5)',
          boxShadow: isHovering
            ? '0 0 20px rgba(56, 189, 248, 0.5), inset 0 0 8px rgba(56, 189, 248, 0.1)'
            : '0 0 8px rgba(99, 102, 241, 0.2)',
          pointerEvents: 'none',
          zIndex: 9998,
          x: springX,
          y: springY,
          scaleX: isText ? 1.4 : isHovering ? 1.3 : 1,
          scaleY: isText ? 0.2 : isHovering ? 1.3 : 1,
          opacity: isHovering ? 0.95 : 0.65,
        }}
        transition={{
          scaleX: { type: 'spring', stiffness: 360, damping: 26 },
          scaleY: { type: 'spring', stiffness: 360, damping: 26 },
          opacity: { duration: 0.12 },
        }}
      />

      {/* ── Inner Precision Dot ────────────────────────────────────────────── */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: isHovering
            ? 'linear-gradient(135deg, #38BDF8, #6366F1)'
            : 'linear-gradient(135deg, #6366F1, #818CF8)',
          boxShadow: isHovering ? '0 0 10px #38BDF8' : '0 0 6px #6366F1',
          pointerEvents: 'none',
          zIndex: 9999,
          x: dotX,
          y: dotY,
          scale: isText ? 0.2 : isHovering ? 0.6 : 1,
        }}
        transition={{
          scale: { type: 'spring', stiffness: 480, damping: 28 },
        }}
      />
    </>
  );
};

export default CustomCursor;
