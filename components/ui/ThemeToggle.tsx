/**
 * ThemeToggle: Accessible dark/light mode toggle with 8px radius geometry.
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
      type="button"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className={cn(
        'relative flex items-center gap-1 p-1 rounded-[8px]',
        'border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)]',
        'hover:bg-white/10 transition-colors duration-200',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]',
        'min-h-[44px] px-2 cursor-pointer'
      )}
    >
      {/* Sun */}
      <span
        className={cn(
          'relative z-10 p-1.5 rounded-[6px] transition-colors duration-200',
          theme === 'light' ? 'text-amber-400' : 'text-[var(--text-muted)]'
        )}
      >
        <Sun size={15} />
      </span>

      {/* Moon */}
      <span
        className={cn(
          'relative z-10 p-1.5 rounded-[6px] transition-colors duration-200',
          theme === 'dark' ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'
        )}
      >
        <Moon size={15} />
      </span>

      {/* Sliding glass indicator */}
      <motion.span
        layout
        layoutId="theme-toggle-indicator"
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="absolute top-1.5 w-7 h-7 rounded-[6px] bg-white/15 backdrop-blur-sm border border-white/20"
        style={{
          left: theme === 'light' ? 6 : undefined,
          right: theme === 'dark' ? 6 : undefined,
        }}
        aria-hidden="true"
      />
    </button>
  );
}
