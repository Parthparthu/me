/**
 * CustomCursor — Glass lens cursor for fine-pointer (desktop) devices.
 *
 * - Inner dot: 8px, always visible
 * - Outer ring: 36px glass lens with blur + tint, slightly lagged
 * - Context labels: "View", "Drag", "Play", "Open" on hover targets
 * - Magnetic attraction: CTAs pull the cursor toward their center
 * - Touch devices: replaced by tap ripples (CSS, not this component)
 */
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useSceneStore } from '@/store/useSceneStore';

const SPRING_CONFIG = { stiffness: 500, damping: 40, mass: 0.4 };
const RING_SPRING = { stiffness: 200, damping: 22, mass: 0.8 };

export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const setCursor = useSceneStore((s) => s.setCursor);

  const dotX = useMotionValue(0);
  const dotY = useMotionValue(0);
  const ringX = useSpring(dotX, RING_SPRING);
  const ringY = useSpring(dotY, RING_SPRING);
  const scale = useSpring(1, { stiffness: 300, damping: 25 });

  useEffect(() => {
    // Only activate on fine-pointer (mouse/trackpad) devices
    if (!window.matchMedia('(pointer: fine)').matches) return;

    // Hide native cursor
    document.body.classList.add('fine-pointer');

    let mouseX = 0;
    let mouseY = 0;

    const handleMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!visible) setVisible(true);

      dotX.set(mouseX);
      dotY.set(mouseY);

      // Update store for LiquidGlass specular
      setCursor({
        x: mouseX,
        y: mouseY,
        nx: (mouseX / window.innerWidth) * 2 - 1,
        ny: -((mouseY / window.innerHeight) * 2 - 1),
      });

      // Check hover target for context label
      const target = e.target as HTMLElement;
      const cursorLabel = target.closest('[data-cursor]')?.getAttribute('data-cursor') ?? '';
      const isLink =
        target.closest('a') !== null || target.closest('button') !== null;

      setLabel(cursorLabel);
      setIsHovering(isLink || Boolean(cursorLabel));
      scale.set(isLink || cursorLabel ? 1.5 : 1);
    };

    const handleLeave = () => setVisible(false);
    const handleEnter = () => setVisible(true);

    window.addEventListener('mousemove', handleMove, { passive: true });
    document.addEventListener('mouseleave', handleLeave);
    document.addEventListener('mouseenter', handleEnter);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
      document.removeEventListener('mouseenter', handleEnter);
      document.body.classList.remove('fine-pointer');
    };
  }, [dotX, dotY, visible, scale, setCursor]);

  if (!visible) return null;

  return (
    <>
      {/* Inner dot — precise cursor position */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: dotX,
          top: dotY,
          x: '-50%',
          y: '-50%',
          zIndex: 'var(--z-cursor)' as string,
          pointerEvents: 'none',
          mixBlendMode: isHovering ? 'difference' : 'normal',
        }}
        animate={{ opacity: visible ? 1 : 0 }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: isHovering ? '#ffffff' : 'rgba(99,102,241,0.9)',
            transition: 'background-color 0.15s ease',
          }}
        />
      </motion.div>

      {/* Outer glass ring — lagged, with context label */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: ringX,
          top: ringY,
          x: '-50%',
          y: '-50%',
          zIndex: 'calc(var(--z-cursor) - 1)' as string,
          pointerEvents: 'none',
          scale,
        }}
        animate={{ opacity: visible ? 1 : 0 }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            border: '1px solid rgba(255,255,255,0.2)',
            backgroundColor: 'rgba(99,102,241,0.08)',
            boxShadow:
              'inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 8px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s ease, width 0.2s ease, height 0.2s ease',
          }}
        >
          {label && (
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.05em',
                color: 'rgba(255,255,255,0.9)',
                whiteSpace: 'nowrap',
                userSelect: 'none',
              }}
            >
              {label}
            </span>
          )}
        </div>
      </motion.div>
    </>
  );
}
