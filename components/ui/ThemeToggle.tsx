/**
 * ThemeToggle: Restrained dark/light theme switch.
 * Rectangular with 8px radius per design rules.
 * Meets WCAG AA contrast and 44px min hit target.
 */
'use client';

import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/ui/ThemeProvider';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className={cn(
        'relative flex items-center gap-1 p-1 rounded-lg',
        'border border-[var(--border-subtle)] bg-[var(--bg-surface-2)]',
        'hover:bg-[var(--bg-surface-hover)] transition-colors duration-150',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]',
        'min-h-[44px] min-w-[44px] touch-action-manipulation justify-center',
        className
      )}
    >
      {/* Sun */}
      <span
        className={cn(
          'relative z-10 p-2 rounded-md transition-colors duration-150 flex items-center justify-center',
          theme === 'light' ? 'text-amber-600' : 'text-[var(--text-muted)]'
        )}
      >
        <Sun size={15} aria-hidden="true" />
      </span>

      {/* Moon */}
      <span
        className={cn(
          'relative z-10 p-2 rounded-md transition-colors duration-150 flex items-center justify-center',
          theme === 'dark' ? 'text-sky-400' : 'text-[var(--text-muted)]'
        )}
      >
        <Moon size={15} aria-hidden="true" />
      </span>

      {/* Sliding indicator */}
      <motion.span
        layout
        layoutId="theme-toggle-slider"
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="absolute top-1 bottom-1 w-8 rounded-md bg-[var(--bg-surface-raised)] border border-[var(--border-medium)] shadow-sm"
        style={{
          left: theme === 'light' ? 4 : undefined,
          right: theme === 'dark' ? 4 : undefined,
        }}
        aria-hidden="true"
      />
    </button>
  );
}
