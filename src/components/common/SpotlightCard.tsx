import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate, HTMLMotionProps } from 'motion/react';

interface SpotlightCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  spotlightColor?: string;
  borderColor?: string;
  enableTilt?: boolean;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(0, 240, 255, 0.16)',
  borderColor = 'rgba(0, 240, 255, 0.35)',
  enableTilt = true,
  style,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse relative coordinates as reactive motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // 3D tilt angles with damped spring physics
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springTiltX = useSpring(tiltX, { damping: 22, stiffness: 240 });
  const springTiltY = useSpring(tiltY, { damping: 22, stiffness: 240 });

  // Dynamic reactive motion template for cursor spotlight
  const dynamicSpotlightBg = useMotionTemplate`radial-gradient(circle 340px at ${mouseX}px ${mouseY}px, ${spotlightColor}, transparent 75%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseX.set(x);
    mouseY.set(y);

    if (enableTilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = -((y - centerY) / centerY) * 8.5;
      const rotateY = ((x - centerX) / centerX) * 8.5;
      tiltX.set(rotateX);
      tiltY.set(rotateY);
    }
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`spotlight-card ${className}`}
      style={{
        perspective: 1200,
        rotateX: enableTilt ? springTiltX : 0,
        rotateY: enableTilt ? springTiltY : 0,
        transformStyle: 'preserve-3d',
        borderColor: isHovered ? borderColor : undefined,
        ...style,
      }}
      whileHover={{ y: -5 }}
      transition={{ y: { duration: 0.22, ease: 'easeOut' } }}
      {...props}
    >
      {/* Dynamic Cursor Spotlight Radial Glow with Hardware Motion Template */}
      <motion.div
        aria-hidden="true"
        className="spotlight-card-glow"
        style={{
          opacity: isHovered ? 1 : 0,
          background: dynamicSpotlightBg,
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* Card Content Container with 3D Pop-Out Lift on Hover */}
      <div
        className="spotlight-card-content"
        style={{
          position: 'relative',
          zIndex: 2,
          transform: isHovered ? 'translateZ(18px)' : 'translateZ(0px)',
          transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {children}
      </div>
    </motion.div>
  );
};

export default SpotlightCard;
