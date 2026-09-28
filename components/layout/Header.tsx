/**
 * Header — Floating glass dock navigation.
 * Desktop: centered glass pill with magnification on hover (Apple dock style).
 * Mobile: bottom glass dock with core links; hamburger → full glass menu.
 * Active section indicator via useScrollStore.
 * Command palette trigger (⌘K) always visible.
 */
'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Menu, X, Command, House, Folder, User, BookOpen, Mail, FileText } from 'lucide-react';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useScrollStore } from '@/store/useScrollStore';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { name: 'Home', href: '/', icon: House, section: 'hero' },
  { name: 'Work', href: '/#selected-work', icon: Folder, section: 'work' },
  { name: 'About', href: '/#about', icon: User, section: 'about' },
  { name: 'Journey', href: '/#journey', icon: BookOpen, section: 'journey' },
  { name: 'Resume', href: '/resume', icon: FileText, section: '' },
  { name: 'Contact', href: '/#contact', icon: Mail, section: 'contact' },
];

// ── Dock Item with Apple-style magnification ─────────────────────────────────
function DockItem({
  link,
  mouseX,
  isActive,
}: {
  link: (typeof NAV_LINKS)[0];
  mouseX: ReturnType<typeof useMotionValue<number>>;
  isActive: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    if (!ref.current) return 0;
    const rect = ref.current.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    return Math.abs(val - center);
  });

  const scale = useSpring(
    useTransform(distance, [0, 80, 160], [1.35, 1.12, 1.0]),
    { stiffness: 300, damping: 28 }
  );

  const Icon = link.icon;

  return (
    <motion.div
      ref={ref}
      style={{ scale }}
      className="relative flex flex-col items-center"
    >
      {/* Active indicator dot */}
      {isActive && (
        <motion.div
          layoutId="nav-active-dot"
          className="absolute -bottom-3 w-1 h-1 rounded-full bg-[var(--accent-primary)]"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}

      <Link
        href={link.href}
        aria-label={link.name}
        aria-current={isActive ? 'page' : undefined}
        className={cn(
          'flex flex-col items-center gap-1 px-3 py-2 rounded-xl',
          'text-xs font-medium transition-colors duration-150',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]',
          'touch-action-manipulation',
          isActive
            ? 'text-[var(--accent-primary)]'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
        )}
      >
        <Icon size={18} strokeWidth={isActive ? 2.5 : 1.75} />
        <span className="hidden lg:block text-[10px] tracking-wide">{link.name}</span>
      </Link>
    </motion.div>
  );
}

// ── Main Header ───────────────────────────────────────────────────────────────
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const activeRoom = useScrollStore((s) => s.activeRoom);
  const mouseX = useMotionValue(Infinity);

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

  return (
    <>
      {/* ── Desktop floating dock (top center) ─────────────────────────────── */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[var(--z-header)] hidden md:block">
        <LiquidGlass
          elevation={3}
          tint="neutral"
          radius={999}
          dynamicLight
          className="px-2 py-2"
        >
          <nav
            aria-label="Main navigation"
            className="flex items-center gap-1"
            onMouseMove={(e) => mouseX.set(e.clientX)}
            onMouseLeave={() => mouseX.set(Infinity)}
          >
            {/* Logo */}
            <Link
              href="/"
              className="px-3 py-2 font-display font-bold text-sm text-white/90 hover:text-white transition-colors tracking-tight mr-1"
              aria-label="Pradyumna — home"
            >
              P<span className="text-[var(--accent-cyan)]">.</span>
            </Link>

            {/* Divider */}
            <div className="w-px h-5 bg-white/10 mr-1" aria-hidden="true" />

            {NAV_LINKS.map((link) => (
              <DockItem
                key={link.name}
                link={link}
                mouseX={mouseX}
                isActive={getIsActive(link)}
              />
            ))}

            {/* Divider */}
            <div className="w-px h-5 bg-white/10 mx-1" aria-hidden="true" />

            {/* ⌘K trigger */}
            <button
              onClick={openCommandPalette}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Open command palette (⌘K)"
            >
              <Command size={11} />
              <span className="hidden lg:inline">K</span>
            </button>

            <ThemeToggle />
          </nav>
        </LiquidGlass>
      </div>

      {/* ── Mobile bottom dock ──────────────────────────────────────────────── */}
      <div
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[var(--z-header)] md:hidden"
        style={{ maxWidth: 'calc(100vw - 32px)' }}
      >
        <LiquidGlass elevation={3} tint="neutral" radius={999} className="px-3 py-2">
          <nav aria-label="Mobile navigation" className="flex items-center gap-1">
            {NAV_LINKS.slice(0, 4).map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  aria-label={link.name}
                  aria-current={getIsActive(link) ? 'page' : undefined}
                  className={cn(
                    'flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl min-h-[44px] min-w-[44px] justify-center',
                    'text-[10px] font-medium transition-colors',
                    'touch-action-manipulation',
                    getIsActive(link)
                      ? 'text-[var(--accent-primary)]'
                      : 'text-[var(--text-secondary)]'
                  )}
                >
                  <Icon size={20} />
                  <span>{link.name}</span>
                </Link>
              );
            })}

            {/* Menu button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open full menu"
              aria-expanded={mobileMenuOpen}
              className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl min-h-[44px] min-w-[44px] justify-center text-[10px] font-medium text-[var(--text-secondary)] transition-colors touch-action-manipulation"
            >
              <Menu size={20} />
              <span>More</span>
            </button>
          </nav>
        </LiquidGlass>
      </div>

      {/* ── Mobile full-screen glass menu ───────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-[var(--z-modal-backdrop)] bg-black/60 backdrop-blur-md md:hidden"
            />

            {/* Glass menu panel */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed inset-x-4 bottom-4 z-[var(--z-modal)] md:hidden rounded-3xl overflow-hidden"
              style={{ overscrollBehavior: 'contain' }}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <LiquidGlass elevation={5} tint="neutral" radius={28} className="p-6">
                {/* Close */}
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="absolute top-5 right-5 p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>

                <p className="text-xs text-[var(--text-muted)] tracking-widest uppercase mb-6">
                  Navigation
                </p>

                <nav className="flex flex-col gap-1">
                  {NAV_LINKS.map((link, i) => {
                    const Icon = link.icon;
                    return (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            'flex items-center gap-4 px-4 py-4 rounded-2xl text-base font-medium',
                            'transition-colors min-h-[56px]',
                            getIsActive(link)
                              ? 'text-[var(--accent-primary)] bg-[var(--accent-primary-subtle)]'
                              : 'text-[var(--text-primary)] hover:bg-white/5'
                          )}
                        >
                          <Icon size={20} />
                          {link.name}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() => { openCommandPalette(); setMobileMenuOpen(false); }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm text-[var(--text-secondary)] bg-white/5 min-h-[44px]"
                  >
                    <Command size={14} />
                    Command Palette
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
