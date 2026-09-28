/**
 * ThemeToggle — Animated glass-morph dark/light toggle.
 * Uses layoutId for the pill indicator to create a liquid slide effect.
 */
'use client';

import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/ui/ThemeProvider';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className={cn(
        'relative flex items-center gap-0.5 p-1 rounded-full',
        'border border-white/10 bg-white/5',
        'hover:bg-white/10 transition-colors duration-200',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]',
        'min-h-[32px]'
      )}
    >
      {/* Sun */}
      <span
        className={cn(
          'relative z-10 p-1.5 rounded-full transition-colors duration-200',
          theme === 'light' ? 'text-amber-400' : 'text-[var(--text-muted)]'
        )}
      >
        <Sun size={13} />
      </span>

      {/* Moon */}
      <span
        className={cn(
          'relative z-10 p-1.5 rounded-full transition-colors duration-200',
          theme === 'dark' ? 'text-blue-300' : 'text-[var(--text-muted)]'
        )}
      >
        <Moon size={13} />
      </span>

      {/* Sliding glass pill indicator */}
      <motion.span
        layout
        layoutId="theme-toggle-pill"
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="absolute top-1 w-6 h-6 rounded-full bg-white/15 backdrop-blur-sm border border-white/20"
        style={{
          left: theme === 'light' ? 4 : undefined,
          right: theme === 'dark' ? 4 : undefined,
        }}
        aria-hidden="true"
      />
    </button>
  );
}
