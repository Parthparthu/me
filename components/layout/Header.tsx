/**
 * Header: Floating glass navigation bar.
 * Desktop: Centered glass nav with restrained geometry (radius 12px).
 * Mobile: Bottom glass nav with core links; full menu modal with focus trap.
 * Active section indicator via useScrollStore.
 * Command palette trigger (Ctrl/Cmd+K) accessible.
 */
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Command, House, Folder, User, BookOpen, Mail, FileText } from 'lucide-react';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useScrollStore } from '@/store/useScrollStore';
import { POINTER_REACTIVE_3D } from '@/lib/config';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { name: 'Home', href: '/', icon: House, section: 'hero' },
  { name: 'Work', href: '/#selected-work', icon: Folder, section: 'work' },
  { name: 'About', href: '/#about', icon: User, section: 'about' },
  { name: 'Journey', href: '/#journey', icon: BookOpen, section: 'journey' },
  { name: 'Resume', href: '/resume', icon: FileText, section: '' },
  { name: 'Contact', href: '/#contact', icon: Mail, section: 'contact' },
];

function NavItem({
  link,
  isActive,
}: {
  link: (typeof NAV_LINKS)[0];
  isActive: boolean;
}) {
  const Icon = link.icon;

  return (
    <div className="relative flex flex-col items-center">
      <Link
        href={link.href}
        aria-label={link.name}
        aria-current={isActive ? 'page' : undefined}
        className={cn(
          'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-150',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]',
          'touch-action-manipulation',
          isActive
            ? 'text-[var(--text-primary)] font-semibold bg-[var(--accent-primary-subtle)]'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
        )}
      >
        <Icon size={16} strokeWidth={isActive ? 2.25 : 1.75} aria-hidden="true" />
        <span className="tracking-wide">{link.name}</span>
      </Link>
      {isActive && (
        <span className="absolute -bottom-1 w-4 h-0.5 rounded-xs bg-[var(--accent-primary)]" aria-hidden="true" />
      )}
    </div>
  );
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const activeRoom = useScrollStore((s) => s.activeRoom);

  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const openCommandPalette = () => {
    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
    );
  };

  const getIsActive = (link: (typeof NAV_LINKS)[0]) => {
    if (link.section && activeRoom === link.section) return true;
    if (!link.section && pathname === link.href) return true;
    return false;
  };

  // Focus trap, body scroll lock, and escape key listener for mobile menu
  useEffect(() => {
    if (!mobileMenuOpen) return;

    // Lock body scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Handle Escape and Tab keys
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        menuTriggerRef.current?.focus();
      } else if (e.key === 'Tab' && dialogRef.current) {
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

    // Initial focus on close button or first interactive
    const timer = setTimeout(() => {
      const firstBtn = dialogRef.current?.querySelector<HTMLElement>('button, [href]');
      firstBtn?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Desktop floating nav (top center) */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[var(--z-header)] hidden md:block">
        <LiquidGlass
          elevation={3}
          tint="neutral"
          radius={12}
          dynamicLight={POINTER_REACTIVE_3D}
          className="px-2 py-1.5"
        >
          <nav
            aria-label="Main navigation"
            className="flex items-center gap-1"
          >
            {/* Logo */}
            <Link
              href="/"
              className="px-3 py-1.5 font-display font-bold text-sm text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors tracking-tight mr-1 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
              aria-label="Pradyumna: home"
            >
              P<span className="text-[var(--accent-primary)]">.</span>
            </Link>

            <div className="w-px h-5 bg-[var(--border-subtle)] mr-1" aria-hidden="true" />

            {NAV_LINKS.map((link) => (
              <NavItem
                key={link.name}
                link={link}
                isActive={getIsActive(link)}
              />
            ))}

            <div className="w-px h-5 bg-[var(--border-subtle)] mx-1" aria-hidden="true" />

            {/* Ctrl/Cmd+K trigger */}
            <button
              onClick={openCommandPalette}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)] min-h-[36px]"
              aria-label="Open command palette (Ctrl+K or Cmd+K)"
            >
              <Command size={12} aria-hidden="true" />
              <span>K</span>
            </button>

            <ThemeToggle />
          </nav>
        </LiquidGlass>
      </div>

      {/* Mobile bottom nav */}
      <div
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[var(--z-header)] md:hidden w-auto max-w-[calc(100vw-20px)]"
      >
        <LiquidGlass elevation={3} tint="neutral" radius={12} className="px-1.5 py-1">
          <nav aria-label="Mobile navigation" className="flex items-center gap-0.5">
            {NAV_LINKS.slice(0, 4).map((link) => {
              const Icon = link.icon;
              const active = getIsActive(link);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  aria-label={link.name}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-lg min-h-[44px] min-w-[44px] justify-center',
                    'text-[10px] font-medium transition-colors touch-action-manipulation',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]',
                    active
                      ? 'text-[var(--text-primary)] font-semibold bg-[var(--accent-primary-subtle)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
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
              className="flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-lg min-h-[44px] min-w-[44px] justify-center text-[10px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors touch-action-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
            >
              <Menu size={17} aria-hidden="true" />
              <span className="leading-tight">More</span>
            </button>
          </nav>
        </LiquidGlass>
      </div>

      {/* Mobile full-screen glass menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setMobileMenuOpen(false);
                menuTriggerRef.current?.focus();
              }}
              className="fixed inset-0 z-[var(--z-modal-backdrop)] bg-black/60 backdrop-blur-md md:hidden"
            />

            <motion.div
              ref={dialogRef}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-3 bottom-3 z-[var(--z-modal)] md:hidden rounded-xl overflow-hidden"
              style={{ overscrollBehavior: 'contain' }}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <LiquidGlass elevation={5} tint="neutral" radius={14} className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs text-[var(--text-muted)] tracking-wider uppercase font-mono">
                    Navigation
                  </p>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      menuTriggerRef.current?.focus();
                    }}
                    className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
                    aria-label="Close menu"
                  >
                    <X size={20} aria-hidden="true" />
                  </button>
                </div>

                <nav className="flex flex-col gap-1">
                  {NAV_LINKS.map((link) => {
                    const Icon = link.icon;
                    const active = getIsActive(link);
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium',
                          'transition-colors min-h-[48px] touch-action-manipulation',
                          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]',
                          active
                            ? 'text-[var(--text-primary)] font-semibold bg-[var(--accent-primary-subtle)]'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
                        )}
                      >
                        <Icon size={18} aria-hidden="true" />
                        <span>{link.name}</span>
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] flex items-center gap-3">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openCommandPalette();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-medium text-[var(--text-primary)] bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] min-h-[44px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]"
                  >
                    <Command size={14} aria-hidden="true" />
                    <span>Command Palette</span>
                  </button>
                  <ThemeToggle />
                </div>
              </LiquidGlass>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
