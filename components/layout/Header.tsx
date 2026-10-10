'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Command, House, Folder, User, BookOpen, Mail, FileText } from 'lucide-react';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { name: 'Home', href: '/', icon: House },
  { name: 'Work', href: '/#selected-work', icon: Folder },
  { name: 'About', href: '/#about', icon: User },
  { name: 'Journey', href: '/#journey', icon: BookOpen },
  { name: 'Resume', href: '/resume', icon: FileText },
  { name: 'Contact', href: '/#contact', icon: Mail },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const openCommandPalette = () => {
    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
    );
  };

  const getIsActive = (link: (typeof NAV_LINKS)[0]) => {
    if (link.href === '/' && pathname === '/') return true;
    if (link.href !== '/' && pathname.startsWith(link.href)) return true;
    return false;
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-[var(--z-header)] px-4 flex justify-center pointer-events-none">
      {/* Desktop Navigation */}
      <div className="hidden md:block pointer-events-auto">
        <LiquidGlass
          elevation={3}
          tint="neutral"
          radius={12}
          className="px-3 py-2 border border-[var(--border-specular)] shadow-lg"
        >
          <nav aria-label="Main navigation" className="flex items-center gap-1">
            <Link
              href="/"
              className="px-3 py-2 font-display font-bold text-sm text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors mr-1"
              aria-label="Pradyumna home"
            >
              P<span className="text-[var(--accent-primary)]">.</span>
            </Link>

            <div className="w-px h-4 bg-[var(--border-medium)] mx-1" aria-hidden="true" />

            {NAV_LINKS.map((link) => {
              const isActive = getIsActive(link);
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  aria-label={link.name}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors min-h-[36px]',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]',
                    isActive
                      ? 'text-[var(--accent-primary)] bg-[var(--accent-primary-subtle)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                  )}
                >
                  <Icon size={15} />
                  <span>{link.name}</span>
                </Link>
              );
            })}

            <div className="w-px h-4 bg-[var(--border-medium)] mx-1" aria-hidden="true" />

            {/* ⌘K trigger */}
            <button
              onClick={openCommandPalette}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors min-h-[36px]"
              aria-label="Open command palette (Ctrl+K or Cmd+K)"
            >
              <Command size={13} />
              <span className="hidden lg:inline text-[11px]">K</span>
            </button>

            <ThemeToggle />
          </nav>
        </LiquidGlass>
      </div>

      {/* Mobile Top Bar */}
      <div className="md:hidden w-full flex items-center justify-between pointer-events-auto">
        <Link
          href="/"
          className="px-3 py-2 font-display font-bold text-lg text-[var(--text-primary)]"
          aria-label="Pradyumna home"
        >
          P<span className="text-[var(--accent-primary)]">.</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={openCommandPalette}
            className="p-2.5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Open command palette"
          >
            <Command size={18} />
          </button>
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2.5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[var(--z-modal)] pointer-events-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 right-0 bottom-0 w-72 bg-[var(--bg-surface)] border-l border-[var(--border-subtle)] p-6 flex flex-col justify-between"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-[var(--border-subtle)]">
                  <span className="font-display font-bold text-sm tracking-wider uppercase text-[var(--text-muted)]">
                    Navigation
                  </span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Close navigation menu"
                  >
                    <X size={20} />
                  </button>
                </div>

                <nav className="flex flex-col gap-2 mt-6">
                  {NAV_LINKS.map((link) => {
                    const Icon = link.icon;
                    const isActive = getIsActive(link);
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-colors min-h-[44px]',
                          isActive
                            ? 'text-[var(--accent-primary)] bg-[var(--accent-primary-subtle)]'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                        )}
                      >
                        <Icon size={18} />
                        <span>{link.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-6 border-t border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
                Press Esc or tap outside to close.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
