/**
 * Header: Apple-inspired floating navigation bar.
 *
 * Desktop:
 *   - Inset from viewport edges (mx-4 mt-4), continuous rounded corners (radius-lg)
 *   - At page top: taller, roomier, larger logo and links
 *   - On scroll: smoothly shrinks (height, padding, font size, logo) with hysteresis
 *   - Active section: sliding rounded-rectangle indicator that glides between items
 *   - Scroll progress bar inside the nav capsule
 *   - Optional backdrop-blur when NAV_BLUR = true
 *   - Keyboard fully accessible; screen-reader landmark
 *
 * Mobile:
 *   - Same floating bar, compact layout with menu button
 *   - Menu opens as a bottom sheet (rounded top corners)
 *   - Focus trap, Escape closes, scroll lock without layout jump
 *   - Large touch targets (44px minimum)
 */
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { Menu, X, Command, House, Folder, User, BookOpen, Mail, FileText } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useScrollStore } from '@/store/useScrollStore';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { NAV_BLUR } from '@/lib/config';
import { cn } from '@/lib/utils';

/* ---- Constants ---- */
const NAV_LINKS = [
  { name: 'Home',    href: '/',           icon: House,    section: 'hero'    },
  { name: 'Work',    href: '/#selected-work', icon: Folder,   section: 'work'    },
  { name: 'About',   href: '/#about',     icon: User,     section: 'about'   },
  { name: 'Journey', href: '/#journey',   icon: BookOpen, section: 'journey' },
  { name: 'Resume',  href: '/resume',     icon: FileText, section: ''        },
  { name: 'Contact', href: '/#contact',   icon: Mail,     section: 'contact' },
];

/* Hysteresis thresholds in px */
const SHRINK_THRESHOLD  = 60;
const RESTORE_THRESHOLD = 20;

/* ---- Sub-components ---- */

interface NavItemProps {
  link: (typeof NAV_LINKS)[0];
  isActive: boolean;
  isScrolled: boolean;
  onNavigate: (e: React.MouseEvent, link: (typeof NAV_LINKS)[0]) => void;
}

function NavItem({ link, isActive, isScrolled, onNavigate }: NavItemProps) {
  return (
    <div className="relative">
      {/* Active indicator (background pill) */}
      {isActive && (
        <motion.span
          layoutId="nav-active-bg"
          className="absolute inset-0 rounded-[var(--radius-xs)] bg-[var(--accent-subtle)]"
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          aria-hidden="true"
        />
      )}
      <Link
        href={link.href}
        scroll={false}
        onClick={(e) => onNavigate(e, link)}
        aria-current={isActive ? 'page' : undefined}
        className={cn(
          'relative z-10 flex items-center gap-1.5 rounded-[var(--radius-xs)]',
          'font-medium transition-colors duration-[var(--dur-fast)]',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]',
          'touch-action-manipulation',
          isScrolled ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs',
          isActive
            ? 'text-[var(--accent)]'
            : 'text-[var(--label-secondary)] hover:text-[var(--label-primary)]'
        )}
      >
        <span>{link.name}</span>
      </Link>
    </div>
  );
}

/* ---- Main Component ---- */

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathname = usePathname();
  const activeRoom = useScrollStore((s) => s.activeRoom);
  const { scrollTo } = useSmoothScroll();

  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  /* Scroll detection with hysteresis */
  useEffect(() => {
    let prevY = 0;

    const handleScroll = () => {
      const y = window.scrollY;

      if (!isScrolled && y > SHRINK_THRESHOLD) {
        setIsScrolled(true);
      } else if (isScrolled && y < RESTORE_THRESHOLD) {
        setIsScrolled(false);
      }

      /* Scroll progress */
      const scrollH = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollH > 0) setScrollProgress(Math.min(y / scrollH, 1));

      prevY = y;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  /* Command palette trigger */
  const openCommandPalette = useCallback(() => {
    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
    );
  }, []);

  /* Active section detection */
  const getIsActive = useCallback((link: (typeof NAV_LINKS)[0]) => {
    if (link.section && activeRoom === link.section) return true;
    if (!link.section && pathname === link.href) return true;
    return false;
  }, [activeRoom, pathname]);

  /* Nav link click handler */
  const handleNavClick = useCallback((e: React.MouseEvent, link: (typeof NAV_LINKS)[0]) => {
    const isExternal = link.href === '/resume';
    if (isExternal) return;

    const isHome =
      pathname === '/' ||
      (typeof window !== 'undefined' &&
        (window.location.pathname === '/' || window.location.pathname === ''));

    if (isHome) {
      e.preventDefault();
      if (link.section === 'hero' || link.href === '/') {
        scrollTo(0, {
          duration: 1.25,
          onComplete: () => window.history.pushState(null, '', '/'),
        });
      } else {
        const targetId = link.href.startsWith('/#')
          ? link.href.replace('/#', '')
          : link.section || link.href.replace('/', '');
        scrollTo(targetId, {
          offset: -80,
          duration: 1.25,
          onComplete: () => window.history.pushState(null, '', `/#${targetId}`),
        });
      }
    }
  }, [pathname, scrollTo]);

  /* Mobile menu focus trap and Escape */
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        menuTriggerRef.current?.focus();
        return;
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const timer = setTimeout(() => {
      dialogRef.current?.querySelector<HTMLElement>('button, [href]')?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [mobileMenuOpen]);

  /* Nav backdrop style */
  const navStyle: React.CSSProperties = NAV_BLUR
    ? { backdropFilter: 'blur(16px) saturate(160%)', WebkitBackdropFilter: 'blur(16px) saturate(160%)' }
    : {};

  return (
    <>
      {/* ---- Desktop floating nav (top center) ---- */}
      <div
        className="fixed z-[var(--z-header)] hidden md:block"
        style={{
          top: isScrolled ? 8 : 16,
          left: '50%',
          transform: 'translateX(-50%)',
          transition: 'top var(--dur-base) var(--ease-standard)',
        }}
      >
        <motion.div
          animate={{
            paddingLeft:  isScrolled ? 10 : 14,
            paddingRight: isScrolled ? 10 : 14,
            paddingTop:   isScrolled ?  5 : 8,
            paddingBottom: isScrolled ? 5 : 8,
          }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--separator)',
            boxShadow: 'var(--shadow-nav)',
            overflow: 'hidden',
            ...navStyle,
          }}
        >
          <nav
            aria-label="Main navigation"
            className="flex items-center gap-0.5"
          >
            {/* Logo */}
            <Link
              href="/"
              scroll={false}
              onClick={(e) => {
                if (pathname === '/') {
                  e.preventDefault();
                  window.history.pushState(null, '', '/');
                  scrollTo(0, { duration: 1.25 });
                }
              }}
              aria-label="Pradyuma: home"
              className={cn(
                'font-display font-bold text-[var(--label-primary)] hover:text-[var(--accent)] transition-colors',
                'rounded-[var(--radius-xs)] px-2 py-1 mr-1',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]',
                isScrolled ? 'text-sm' : 'text-base'
              )}
            >
              P<span className="text-[var(--accent)]">.</span>
            </Link>

            <div className="w-px h-4 bg-[var(--separator)] mx-1" aria-hidden="true" />

            {NAV_LINKS.map((link) => (
              <NavItem
                key={link.name}
                link={link}
                isActive={getIsActive(link)}
                isScrolled={isScrolled}
                onNavigate={handleNavClick}
              />
            ))}

            <div className="w-px h-4 bg-[var(--separator)] mx-1" aria-hidden="true" />

            {/* Command palette trigger */}
            <button
              onClick={openCommandPalette}
              className={cn(
                'flex items-center gap-1 rounded-[var(--radius-xs)]',
                'font-mono text-[var(--label-quaternary)] hover:text-[var(--label-primary)]',
                'hover:bg-[var(--bg-hover)] transition-colors',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]',
                'min-h-[36px] px-2',
                isScrolled ? 'text-[10px]' : 'text-[11px]'
              )}
              aria-label="Open command palette (Ctrl+K or Cmd+K)"
            >
              <Command size={11} aria-hidden="true" />
              <span>K</span>
            </button>

            <ThemeToggle />

            {/* Scroll progress bar inside nav */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-[var(--radius-lg)] overflow-hidden"
              aria-hidden="true"
            >
              <div
                className="h-full scroll-progress-bar transition-all duration-100"
                style={{ width: `${scrollProgress * 100}%` }}
              />
            </div>
          </nav>
        </motion.div>
      </div>

      {/* ---- Mobile bottom nav ---- */}
      <div
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[var(--z-header)] md:hidden w-auto max-w-[calc(100vw-24px)]"
      >
        <div
          style={{
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--separator)',
            boxShadow: 'var(--shadow-nav)',
            padding: '6px 8px',
            ...navStyle,
          }}
        >
          <nav aria-label="Mobile navigation" className="flex items-center gap-0.5">
            {NAV_LINKS.slice(0, 4).map((link) => {
              const Icon = link.icon;
              const active = getIsActive(link);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  scroll={false}
                  onClick={(e) => handleNavClick(e, link)}
                  aria-label={link.name}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex flex-col items-center gap-0.5 px-3 py-2 rounded-[var(--radius-xs)]',
                    'text-[10px] font-medium transition-colors',
                    'min-h-[44px] min-w-[44px] justify-center',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]',
                    active
                      ? 'text-[var(--accent)] bg-[var(--accent-subtle)]'
                      : 'text-[var(--label-secondary)] hover:text-[var(--label-primary)]'
                  )}
                >
                  <Icon size={17} aria-hidden="true" />
                  <span className="leading-tight">{link.name}</span>
                </Link>
              );
            })}

            <button
              ref={menuTriggerRef}
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open full menu"
              aria-expanded={mobileMenuOpen}
              className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-[var(--radius-xs)] min-h-[44px] min-w-[44px] justify-center text-[10px] font-medium text-[var(--label-secondary)] hover:text-[var(--label-primary)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"
            >
              <Menu size={17} aria-hidden="true" />
              <span className="leading-tight">More</span>
            </button>
          </nav>
        </div>
      </div>

      {/* ---- Mobile full menu sheet ---- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                setMobileMenuOpen(false);
                menuTriggerRef.current?.focus();
              }}
              className="fixed inset-0 z-[var(--z-modal-backdrop)] bg-black/60 md:hidden"
              aria-hidden="true"
            />

            {/* Sheet */}
            <motion.div
              ref={dialogRef}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 36 }}
              className="fixed inset-x-3 bottom-3 z-[var(--z-modal)] md:hidden"
              style={{
                borderRadius: 'var(--radius-xl)',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--separator-strong)',
                boxShadow: 'var(--shadow-lg)',
                overscrollBehavior: 'contain',
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              {/* Grabber */}
              <div className="flex justify-center pt-3 pb-1" aria-hidden="true">
                <div className="w-8 h-1 rounded-full bg-[var(--separator-strong)]" />
              </div>

              <div className="px-4 pb-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] text-[var(--label-quaternary)] tracking-wider uppercase font-mono">
                    Navigation
                  </p>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      menuTriggerRef.current?.focus();
                    }}
                    className="p-2 rounded-[var(--radius-xs)] text-[var(--label-tertiary)] hover:text-[var(--label-primary)] hover:bg-[var(--bg-hover)] min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"
                    aria-label="Close menu"
                  >
                    <X size={20} aria-hidden="true" />
                  </button>
                </div>

                <nav className="flex flex-col gap-0.5">
                  {NAV_LINKS.map((link) => {
                    const Icon = link.icon;
                    const active = getIsActive(link);
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        scroll={false}
                        onClick={(e) => {
                          setMobileMenuOpen(false);
                          if (
                            pathname === '/' &&
                            (link.href.startsWith('/#') || link.href === '/' || link.section)
                          ) {
                            e.preventDefault();
                            setTimeout(() => {
                              if (link.section === 'hero' || link.href === '/') {
                                window.history.pushState(null, '', '/');
                                scrollTo(0, { duration: 1.25 });
                              } else {
                                const targetId = link.href.startsWith('/#')
                                  ? link.href.replace('/#', '')
                                  : link.section || link.href.replace('/', '');
                                window.history.pushState(null, '', `/#${targetId}`);
                                scrollTo(targetId, { offset: -80, duration: 1.25 });
                              }
                            }, 160);
                          }
                        }}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded-[var(--radius-sm)] text-sm font-medium',
                          'transition-colors min-h-[48px]',
                          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]',
                          active
                            ? 'text-[var(--accent)] bg-[var(--accent-subtle)]'
                            : 'text-[var(--label-secondary)] hover:text-[var(--label-primary)] hover:bg-[var(--bg-hover)]'
                        )}
                      >
                        <Icon size={18} aria-hidden="true" />
                        <span>{link.name}</span>
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-4 pt-4 border-t border-[var(--separator)] flex items-center gap-3">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openCommandPalette();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-[var(--radius-sm)] text-xs font-medium text-[var(--label-primary)] bg-[var(--bg-grouped)] hover:bg-[var(--bg-hover)] border border-[var(--separator)] min-h-[44px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"
                  >
                    <Command size={14} aria-hidden="true" />
                    <span>Command Palette</span>
                  </button>
                  <ThemeToggle />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
