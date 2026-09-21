import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, GraduationCap, Sparkles, Zap, Flame, Terminal, Code2 } from 'lucide-react';
import { GithubIcon } from '../common/Icons';
import { profileData } from '../../data/profile';
import { HeroCanvas3D } from '../3d/HeroCanvas3D';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useMagneticButton } from '../../hooks/useMagneticButton';

const ROTATING_ROLES = [
  { text: 'CSE (AI/ML) Undergraduate', color: '#818cf8' },
  { text: 'Full-Stack Web Architect', color: '#6366f1' },
  { text: 'Real-Time Systems & WebSocket Developer', color: '#38bdf8' },
  { text: '3D Spatial & WebGL Builder', color: '#a855f7' },
  { text: 'WMC Bronze Memory Athlete', color: '#e0e7ff' },
];

// ─── Animation Variants ────────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 280, damping: 24 },
  },
};

// ─── Component ─────────────────────────────────────────────────────────────────

export const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);

  // Rotate roles automatically
  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROTATING_ROLES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  // Multi-layer 3D scroll parallax
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const editorialY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const canvasY = useTransform(scrollYProgress, [0, 1], [0, 65]);
  const canvasScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const badgesY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const atmosphereY = useTransform(scrollYProgress, [0, 1], [0, -45]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.3]);

  // Magnetic primary CTA
  const primaryMagnetic = useMagneticButton(0.28);

  const currentRole = ROTATING_ROLES[roleIndex];

  return (
    <section
      ref={sectionRef}
      className="hero-spatial-section"
      aria-label="Introduction & Spatial Identity"
    >
      {/* Layer 1: Vivid Cosmic Atmospheric Lighting with Parallax Depth */}
      <motion.div style={{ y: atmosphereY, opacity: heroOpacity }} className="hero-atmosphere-parallax-wrap" aria-hidden="true">
        <div className="hero-atmosphere" />
        <div className="hero-radial-glow" />
        <div className="hero-ambient-cyan" />
        <div className="hero-ambient-cobalt" />
        <div className="hero-ambient-violet" />
      </motion.div>

      {/* Layer 2: Perspective Horizon Grid */}
      <div className="hero-perspective-grid" aria-hidden="true" />

      {/* Hero Spatial Container */}
      <div className="container hero-spatial-grid">
        {/* Left / Center-Left: Editorial Content */}
        <motion.div
          className="hero-editorial-column"
          style={{ y: editorialY }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Availability Status Pill with Multi-Concentric Radar Pulse */}
          <motion.div variants={itemVariants} className="hero-status-wrap">
            <span className="badge badge-emerald hero-status-pill">
              <span className="hero-radar-wrapper" aria-hidden="true">
                <span className="hero-radar-wave" />
                <span className="hero-status-dot" />
              </span>
              <span>{profileData.currentStatus}</span>
            </span>
          </motion.div>

          {/* Overline Moniker */}
          <motion.div variants={itemVariants} className="hero-spatial-label">
            <Sparkles size={14} className="hero-sparkle-icon" aria-hidden="true" />
            <span className="animate-rainbow-text font-bold">Creative Technologist &amp; Software Developer</span>
          </motion.div>

          {/* Primary Name Display — High-contrast, reliably rendered across all mobile browsers */}
          <motion.h1 variants={itemVariants} className="hero-spatial-title">
            <span className="hero-title-text animate-rainbow-text">
              {profileData.name}
            </span>
          </motion.h1>

          {/* Technical Dynamic Role Cycler */}
          <motion.div variants={itemVariants} className="hero-role-cycler-container">
            <span className="hero-role-prefix">Focus:</span>
            <div
              className="hero-role-track"
              aria-live="polite"
              aria-atomic="true"
              role="status"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentRole.text}
                  initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -16, filter: 'blur(4px)' }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="hero-role-active"
                  style={{ color: currentRole.color, textShadow: `0 0 16px ${currentRole.color}60` }}
                >
                  {currentRole.text}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Academic & Geographic Alignment */}
          <motion.div variants={itemVariants} className="hero-spatial-meta">
            <span className="hero-meta-item">
              <GraduationCap size={15} style={{ color: 'var(--brand-indigo)' }} aria-hidden="true" />
              <span>GL Bajaj Institute of Technology &amp; Management</span>
            </span>
            <span className="hero-meta-sep" aria-hidden="true">·</span>
            <span className="hero-meta-item">
              <MapPin size={15} style={{ color: 'var(--brand-sky)' }} aria-hidden="true" />
              <span>Greater Noida, India</span>
            </span>
          </motion.div>

          {/* Positioning Bio */}
          <motion.p variants={itemVariants} className="hero-spatial-bio">
            {profileData.shortBio}
          </motion.p>

          {/* Action CTAs */}
          <motion.div variants={itemVariants} className="hero-spatial-actions">
            {/* Primary CTA — magnetic with vibrant glow */}
            <motion.a
              ref={primaryMagnetic.ref as React.RefObject<HTMLAnchorElement>}
              style={{ x: primaryMagnetic.springX, y: primaryMagnetic.springY }}
              onMouseMove={primaryMagnetic.handleMouseMove as React.MouseEventHandler<HTMLAnchorElement>}
              onMouseLeave={primaryMagnetic.handleMouseLeave}
              href="#projects"
              data-cursor-label="EXPLORE"
              className="btn btn-primary hero-btn-flagship"
              whileHover={{ scale: 1.05, boxShadow: '0 0 32px rgba(99, 102, 241, 0.5), 0 0 60px rgba(56, 189, 248, 0.3)' }}
              whileTap={{ scale: 0.96 }}
            >
              <Zap size={16} aria-hidden="true" style={{ color: '#fbbf24' }} />
              <span>Explore Flagship Work</span>
              <ArrowRight size={16} aria-hidden="true" />
            </motion.a>

            <Link to="/projects" data-cursor-label="VIEW" className="btn btn-secondary hero-btn-secondary">
              <span>All 9 Case Studies</span>
            </Link>

            <a
              href="https://github.com/Parthparthu"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-label="GITHUB"
              className="btn btn-ghost hero-btn-ghost"
            >
              <GithubIcon size={16} aria-hidden="true" />
              <span>GitHub (52 repos)</span>
            </a>
          </motion.div>

          {/* Core Foundation Tech Pills */}
          <motion.div
            variants={itemVariants}
            className="hero-stack-preview"
            aria-label="Core stack highlights"
          >
            <span className="hero-stack-label">Core Stack:</span>
            {[
              { name: 'TypeScript', color: '#38bdf8' },
              { name: 'Python', color: '#6366f1' },
              { name: 'React 19', color: '#38bdf8' },
              { name: 'FastAPI', color: '#818cf8' },
              { name: 'Three.js', color: '#6366f1' },
              { name: 'PWA', color: '#38bdf8' },
            ].map((tech) => (
              <motion.span
                key={tech.name}
                className="hero-stack-pill"
                whileHover={{ scale: 1.1, borderColor: tech.color, color: '#fff', boxShadow: `0 0 12px ${tech.color}40` }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                {tech.name}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: 3D Spatial Visual Column with Floating Interactive Satellites */}
        <motion.div
          className="hero-3d-visual-column"
          aria-hidden="true"
          style={{ y: canvasY, scale: canvasScale }}
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Floating Levitation Tech Badges with Independent Scroll Parallax Lift */}
          <motion.div style={{ y: badgesY }} className="hero-floating-badges-wrap">
            <motion.div
              className="hero-floating-badge badge-top-left animate-levitate"
              style={{ animationDelay: '0s' }}
              whileHover={{ scale: 1.15, rotate: -4 }}
            >
              <Zap size={13} style={{ color: '#38bdf8' }} />
              <span>React 19 &middot; Concurrent</span>
            </motion.div>

            <motion.div
              className="hero-floating-badge badge-top-right animate-levitate"
              style={{ animationDelay: '1.5s' }}
              whileHover={{ scale: 1.15, rotate: 3 }}
            >
              <Flame size={13} style={{ color: '#6366f1' }} />
              <span>FastAPI &middot; Async</span>
            </motion.div>

            <motion.div
              className="hero-floating-badge badge-bottom-left animate-levitate"
              style={{ animationDelay: '3s' }}
              whileHover={{ scale: 1.15, rotate: 4 }}
            >
              <Code2 size={13} style={{ color: '#818cf8' }} />
              <span>Three.js &middot; WebGL</span>
            </motion.div>

            <motion.div
              className="hero-floating-badge badge-bottom-right animate-levitate"
              style={{ animationDelay: '4.5s' }}
              whileHover={{ scale: 1.15, rotate: -3 }}
            >
              <Terminal size={13} style={{ color: '#38bdf8' }} />
              <span>Pure TypeScript PWA</span>
            </motion.div>
          </motion.div>

          <div className="hero-canvas-wrapper">
            <HeroCanvas3D />
            <div className="hero-canvas-ambient-backdrop" />
          </div>
        </motion.div>
      </div>

      <style>{`
        .hero-spatial-section {
          position: relative;
          min-height: calc(100vh - 80px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding-top: clamp(var(--space-10), 6vw, var(--space-20));
          padding-bottom: clamp(var(--space-12), 8vw, var(--space-24));
          overflow: hidden;
          background: radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.12) 0%, var(--bg-app) 75%);
        }

        /* Vivid Atmospheric Lighting Layers */
        .hero-atmosphere-parallax-wrap {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }

        .hero-atmosphere {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(ellipse 70% 50% at 50% 15%, rgba(99, 102, 241, 0.08) 0%, transparent 80%);
        }

        .hero-radial-glow {
          position: absolute;
          top: -10%;
          right: 15%;
          width: 50vw;
          max-width: 650px;
          height: 520px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.14) 0%, transparent 65%);
          filter: blur(55px);
          pointer-events: none;
        }

        .hero-ambient-cyan {
          position: absolute;
          top: 25%;
          right: 5%;
          width: 35vw;
          max-width: 440px;
          height: 440px;
          background: radial-gradient(circle, rgba(56, 189, 248, 0.10) 0%, transparent 70%);
          filter: blur(60px);
          pointer-events: none;
        }

        .hero-ambient-cobalt {
          position: absolute;
          bottom: 10%;
          left: 5%;
          width: 40vw;
          max-width: 480px;
          height: 480px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.10) 0%, transparent 70%);
          filter: blur(70px);
          pointer-events: none;
        }

        .hero-ambient-violet {
          position: absolute;
          top: 50%;
          left: 20%;
          width: 30vw;
          max-width: 360px;
          height: 360px;
          background: radial-gradient(circle, rgba(129, 140, 248, 0.08) 0%, transparent 70%);
          filter: blur(60px);
          pointer-events: none;
        }

        /* Perspective Grid */
        .hero-perspective-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(var(--bg-grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--bg-grid-line) 1px, transparent 1px);
          background-size: 45px 45px;
          mask-image: radial-gradient(ellipse 75% 65% at 50% 40%, black 20%, transparent 85%);
          -webkit-mask-image: radial-gradient(ellipse 75% 65% at 50% 40%, black 20%, transparent 85%);
          pointer-events: none;
          z-index: 1;
        }

        /* Spatial Grid Layout */
        .hero-spatial-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1fr;
          align-items: center;
          gap: var(--space-8);
          width: 100%;
        }

        @media (min-width: 980px) {
          .hero-spatial-grid {
            grid-template-columns: 1.15fr 0.85fr;
            gap: var(--space-12);
          }
        }

        .hero-editorial-column {
          display: flex;
          flex-direction: column;
        }

        .hero-status-wrap {
          margin-bottom: var(--space-4);
        }

        .hero-status-pill {
          padding: var(--space-1-5) var(--space-4);
          font-size: var(--text-xs);
          border-radius: var(--radius-full);
          border: 1px solid rgba(16, 185, 129, 0.4);
          box-shadow: 0 0 20px -2px rgba(16, 185, 129, 0.35);
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
        }

        .hero-radar-wrapper {
          position: relative;
          width: 8px;
          height: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .hero-radar-wave {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: var(--radius-full);
          background-color: var(--neon-emerald);
          animation: radar-pulse-multi 2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }

        .hero-status-dot {
          width: 8px;
          height: 8px;
          border-radius: var(--radius-full);
          background-color: var(--neon-emerald);
          box-shadow: 0 0 8px var(--neon-emerald);
          position: relative;
          z-index: 2;
        }

        .hero-spatial-label {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          font-family: var(--font-mono);
          font-size: var(--text-2xs);
          text-transform: uppercase;
          letter-spacing: var(--tracking-widest);
          margin-bottom: var(--space-3);
          font-weight: 600;
        }

        .hero-sparkle-icon {
          color: var(--brand-indigo);
          filter: drop-shadow(0 0 6px var(--brand-indigo));
        }

        .hero-spatial-title {
          font-size: clamp(2.4rem, 6.2vw, 5.2rem);
          font-weight: 900;
          letter-spacing: var(--tracking-tighter);
          line-height: 1.05;
          margin-bottom: var(--space-3);
          color: var(--text-primary);
          overflow: visible;
        }

        .hero-title-text {
          display: inline-block;
          color: var(--text-primary);
          filter: drop-shadow(0 0 35px rgba(99, 102, 241, 0.35));
        }

        /* Dynamic Role Cycler */
        .hero-role-cycler-container {
          display: flex;
          align-items: center;
          gap: var(--space-2-5);
          font-size: clamp(var(--text-lg), 2.2vw, var(--text-2xl));
          font-weight: 700;
          margin-bottom: var(--space-4);
          min-height: 38px;
        }

        .hero-role-prefix {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .hero-role-track {
          display: inline-flex;
          position: relative;
        }

        .hero-role-active {
          white-space: nowrap;
          letter-spacing: -0.015em;
        }

        .hero-spatial-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--space-3);
          margin-bottom: var(--space-5);
          font-size: var(--text-sm);
          color: var(--text-tertiary);
        }

        .hero-meta-item {
          display: inline-flex;
          align-items: center;
          gap: var(--space-1-5);
        }

        .hero-meta-sep {
          color: var(--border-medium);
        }

        .hero-spatial-bio {
          font-size: var(--text-base);
          color: var(--text-secondary);
          max-width: 58ch;
          line-height: var(--leading-relaxed);
          margin-bottom: var(--space-8);
        }

        .hero-spatial-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--space-3);
          margin-bottom: var(--space-8);
        }

        .hero-btn-flagship {
          background: linear-gradient(135deg, #6366f1 0%, #38bdf8 100%);
          border: none;
          color: #ffffff;
          font-weight: 700;
          box-shadow: 0 4px 25px -2px rgba(99, 102, 241, 0.45);
        }

        .hero-btn-secondary {
          border-color: rgba(99, 102, 241, 0.35);
        }

        .hero-btn-secondary:hover {
          border-color: #818cf8;
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.25);
        }

        .hero-stack-preview {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--space-2);
          padding-top: var(--space-5);
          border-top: 1px solid var(--border-subtle);
        }

        .hero-stack-label {
          font-size: var(--text-2xs);
          font-family: var(--font-mono);
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: var(--tracking-wider);
          font-weight: 600;
        }

        .hero-stack-pill {
          font-size: var(--text-2xs);
          font-family: var(--font-mono);
          padding: 3px 9px;
          border-radius: var(--radius-xs);
          background-color: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          cursor: default;
          transition: border-color 0.2s, color 0.2s;
        }

        /* 3D Visual Column & Floating Satellites */
        .hero-3d-visual-column {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 380px;
        }

        @media (min-width: 980px) {
          .hero-3d-visual-column {
            min-height: 520px;
          }
        }

        .hero-canvas-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-canvas-ambient-backdrop {
          position: absolute;
          width: 360px;
          height: 360px;
          border-radius: var(--radius-full);
          background: radial-gradient(circle, rgba(99, 102, 241, 0.16) 0%, rgba(56, 189, 248, 0.12) 45%, transparent 70%);
          filter: blur(50px);
          pointer-events: none;
          z-index: 0;
        }

        /* Floating Levitation Badges */
        .hero-floating-badge {
          position: absolute;
          z-index: 10;
          display: inline-flex;
          align-items: center;
          gap: var(--space-1-5);
          padding: 6px 14px;
          border-radius: var(--radius-full);
          background: rgba(14, 18, 27, 0.88);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.14);
          font-family: var(--font-mono);
          font-size: var(--text-2xs);
          font-weight: 600;
          color: var(--text-primary);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
          pointer-events: auto;
          cursor: pointer;
        }

        .badge-top-left {
          top: 12%;
          left: -4%;
          border-color: rgba(56, 189, 248, 0.4);
          box-shadow: 0 0 20px rgba(56, 189, 248, 0.25);
        }

        .badge-top-right {
          top: 16%;
          right: -2%;
          border-color: rgba(99, 102, 241, 0.4);
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.25);
        }

        .badge-bottom-left {
          bottom: 14%;
          left: -2%;
          border-color: rgba(129, 140, 248, 0.4);
          box-shadow: 0 0 20px rgba(129, 140, 248, 0.25);
        }

        .badge-bottom-right {
          bottom: 10%;
          right: 0%;
          border-color: rgba(56, 189, 248, 0.4);
          box-shadow: 0 0 20px rgba(56, 189, 248, 0.25);
        }

        @media (max-width: 980px) {
          .hero-floating-badge { display: none; }
        }

        @media (max-width: 640px) {
          .hero-spatial-section {
            min-height: auto;
            padding-top: var(--space-8);
            padding-bottom: var(--space-12);
          }
          .hero-meta-sep { display: none; }
          .hero-spatial-meta { flex-direction: column; align-items: flex-start; gap: var(--space-1-5); }
          .hero-spatial-actions { flex-direction: column; align-items: flex-start; width: 100%; }
          .hero-spatial-actions .btn { width: 100%; justify-content: center; }
          .hero-editorial-column { order: 1; }
          .hero-3d-visual-column { min-height: 220px; order: 2; margin-top: var(--space-4); }
          .hero-canvas-wrapper { min-height: 220px; }
        }
      `}</style>
    </section>
  );
};
