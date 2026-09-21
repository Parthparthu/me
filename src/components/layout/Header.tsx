import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Terminal, Menu, X, Command } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { ThemeToggle } from '../common/ThemeToggle';

interface HeaderProps {
  onOpenCommandPalette: () => void;
}

const NAV_SECTIONS = [
  { label: 'Work', hash: 'projects' },
  { label: 'About', hash: 'about' },
  { label: 'Skills', hash: 'skills' },
  { label: 'Journey', hash: 'journey' },
  { label: 'Achievements', hash: 'achievements' },
  { label: 'Contact', hash: 'contact' },
];

export const Header: React.FC<HeaderProps> = ({ onOpenCommandPalette }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Scroll detection for enhanced elevation
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for active section highlighting
  useEffect(() => {
    if (!isHome) return;
    const ids = NAV_SECTIONS.map((s) => s.hash);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          const sorted = visible.sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          );
          setActiveSection(sorted[0].target.id);
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isHome]);

  const handleNavClick = useCallback(
    (hash: string) => {
      setMobileMenuOpen(false);
      if (isHome) {
        const el = document.getElementById(hash);
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [isHome]
  );

  return (
    <>
      <header role="banner" className="spatial-header-wrapper">
        {/* Island mount animation */}
        <motion.div
          className={`spatial-nav-island${scrolled ? ' is-scrolled' : ''}`}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.1 }}
          style={{ position: 'relative' }}
        >
          {/* Brand Identity */}
          <Link to="/" className="island-brand" aria-label="Pradyumna — Home">
            <div className="island-brand-icon" aria-hidden="true">
              <Terminal size={15} />
            </div>
            <div className="island-brand-text">
              <span className="island-brand-name">Pradyumna</span>
              <span className="island-brand-role">CSE · AI/ML</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="island-nav-menu" role="navigation" aria-label="Main navigation">
            <Link
              to="/projects"
              className={`island-nav-link${location.pathname === '/projects' ? ' is-active' : ''}`}
              style={{ position: 'relative' }}
            >
              All Projects
              {location.pathname === '/projects' && (
                <motion.span
                  layoutId="nav-active-pill"
                  className="nav-active-indicator"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    zIndex: -1,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
            </Link>
            {NAV_SECTIONS.map(({ label, hash }) =>
              isHome ? (
                <a
                  key={hash}
                  href={`#${hash}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(hash);
                  }}
                  className={`island-nav-link${activeSection === hash ? ' is-active' : ''}`}
                  style={{ position: 'relative' }}
                >
                  {label}
                  {activeSection === hash && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="nav-active-indicator"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-subtle)',
                        zIndex: -1,
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}
                </a>
              ) : (
                <Link
                  key={hash}
                  to={`/#${hash}`}
                  className="island-nav-link"
                  style={{ position: 'relative' }}
                >
                  {label}
                </Link>
              )
            )}
          </nav>

          {/* Controls Cluster */}
          <div className="island-controls">
            {/* Command Palette Trigger */}
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="island-cmd-btn"
              aria-label="Search & Commands (Ctrl+K or ⌘K)"
              title="Open Command Palette (Ctrl+K or ⌘K)"
            >
              <Command size={13} aria-hidden="true" />
              <span className="island-cmd-text">Search</span>
              <kbd className="island-kbd">⌘K</kbd>
            </button>

            <ThemeToggle />

            {/* Mobile Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="island-mobile-toggle"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          {/* Scroll Progress Bar */}
          <motion.div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, #6366f1, #38bdf8)',
              borderRadius: '0 0 9999px 9999px',
              transformOrigin: '0%',
              scaleX,
              opacity: scaleX,
            }}
            aria-hidden="true"
          />
        </motion.div>

        {/* Mobile Dropdown Island — AnimatePresence driven */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="island-mobile-drawer is-open"
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: '8px' }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              role="region"
              aria-label="Mobile navigation menu"
            >
              <div className="island-mobile-inner">
                <Link
                  to="/projects"
                  className="island-mobile-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  All Projects
                </Link>
                {NAV_SECTIONS.map(({ label, hash }) =>
                  isHome ? (
                    <a
                      key={hash}
                      href={`#${hash}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(hash);
                      }}
                      className="island-mobile-link"
                    >
                      {label}
                    </a>
                  ) : (
                    <Link
                      key={hash}
                      to={`/#${hash}`}
                      className="island-mobile-link"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {label}
                    </Link>
                  )
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <style>{`
        .spatial-header-wrapper {
          position: sticky;
          top: 0;
          z-index: var(--z-header);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: var(--space-3) var(--space-4);
          pointer-events: none;
        }

        .spatial-nav-island {
          pointer-events: auto;
          width: 100%;
          max-width: 980px;
          height: 54px;
          border-radius: var(--radius-full);
          background-color: var(--bg-glass-island);
          backdrop-filter: blur(20px) saturate(1.6);
          -webkit-backdrop-filter: blur(20px) saturate(1.6);
          border: 1px solid var(--border-specular);
          box-shadow: var(--shadow-spatial);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--space-2) 0 var(--space-3);
          gap: var(--space-3);
          transition:
            transform var(--duration-fast) var(--ease-standard),
            box-shadow var(--duration-fast) var(--ease-standard),
            border-color var(--duration-fast) var(--ease-standard);
        }

        .spatial-nav-island.is-scrolled {
          box-shadow: 0 16px 36px -8px rgba(0, 0, 0, 0.75), 0 0 0 1px var(--border-specular);
          border-color: rgba(99, 102, 241, 0.35);
        }

        /* Brand */
        .island-brand {
          display: flex;
          align-items: center;
          gap: var(--space-2-5, 0.625rem);
          text-decoration: none;
          flex-shrink: 0;
        }

        .island-brand-icon {
          width: 30px;
          height: 30px;
          border-radius: var(--radius-full);
          background-color: var(--bg-surface-elevated);
          border: 1px solid var(--border-medium);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-primary);
          transition: border-color var(--duration-fast), color var(--duration-fast);
        }

        .island-brand:hover .island-brand-icon {
          border-color: var(--accent-primary-border);
          color: var(--accent-primary-hover);
        }

        .island-brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }

        .island-brand-name {
          font-weight: 700;
          font-size: var(--text-xs);
          color: var(--text-primary);
          letter-spacing: var(--tracking-snug);
        }

        .island-brand-role {
          font-size: 10px;
          color: var(--text-tertiary);
          font-family: var(--font-mono);
          letter-spacing: 0.02em;
        }

        /* Desktop Nav Menu */
        .island-nav-menu {
          display: none;
          align-items: center;
          gap: 2px;
        }

        .island-nav-link {
          position: relative;
          padding: 6px 12px;
          font-size: var(--text-xs);
          font-weight: 500;
          color: var(--text-tertiary);
          border-radius: var(--radius-full);
          text-decoration: none;
          transition:
            color var(--duration-fast) var(--ease-standard),
            background-color var(--duration-fast) var(--ease-standard);
        }

        .island-nav-link:hover {
          color: var(--text-primary);
          background-color: var(--bg-surface-elevated);
        }

        .island-nav-link.is-active {
          color: var(--text-primary);
          font-weight: 600;
          background-color: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
        }

        /* Controls */
        .island-controls {
          display: flex;
          align-items: center;
          gap: var(--space-1-5);
          flex-shrink: 0;
        }

        .island-cmd-btn {
          display: none;
          align-items: center;
          gap: var(--space-1-5);
          height: 32px;
          padding: 0 var(--space-2-5, 0.625rem);
          border-radius: var(--radius-full);
          border: 1px solid var(--border-subtle);
          background-color: var(--bg-surface-elevated);
          color: var(--text-tertiary);
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
          transition: border-color var(--duration-fast), color var(--duration-fast);
        }

        .island-cmd-btn:hover {
          border-color: var(--border-medium);
          color: var(--text-primary);
        }

        .island-cmd-text {
          display: none;
        }

        .island-kbd {
          background-color: var(--bg-app);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-xs);
          padding: 1px 4px;
          font-size: 9px;
          font-family: var(--font-mono);
          color: var(--text-muted);
          line-height: 1.4;
        }

        .island-mobile-toggle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-subtle);
          background-color: var(--bg-surface-elevated);
          color: var(--text-primary);
          cursor: pointer;
          transition: background-color var(--duration-fast);
        }

        .island-mobile-toggle:hover {
          background-color: var(--bg-surface-hover);
        }

        /* Mobile Drawer */
        .island-mobile-drawer {
          pointer-events: auto;
          width: 100%;
          max-width: 980px;
          overflow: hidden;
          border-radius: var(--radius-xl);
          border: 1px solid transparent;
        }

        .island-mobile-drawer.is-open {
          background-color: var(--bg-glass-island);
          backdrop-filter: blur(20px) saturate(1.6);
          border-color: var(--border-specular);
          box-shadow: var(--shadow-spatial);
        }

        .island-mobile-inner {
          overflow: hidden;
          display: flex;
          flex-direction: column;
          padding: var(--space-3) var(--space-4);
          gap: 2px;
        }

        .island-mobile-link {
          display: flex;
          align-items: center;
          min-height: 44px;
          padding: var(--space-2) var(--space-3);
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--text-secondary);
          border-radius: var(--radius-md);
          text-decoration: none;
          transition: background-color var(--duration-fast), color var(--duration-fast);
        }

        .island-mobile-link:hover {
          background-color: var(--bg-surface-elevated);
          color: var(--text-primary);
        }

        /* Active nav indicator pill */
        .nav-active-indicator {
          display: block;
        }

        @media (min-width: 860px) {
          .island-nav-menu {
            display: flex !important;
          }
          .island-mobile-toggle {
            display: none !important;
          }
          .island-cmd-btn {
            display: inline-flex !important;
          }
          .island-cmd-text {
            display: inline !important;
          }
        }
      `}</style>
    </>
  );
};
