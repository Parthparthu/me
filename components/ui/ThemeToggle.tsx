/**
 * ThemeToggle: Restrained dark/light theme switch.
 * Rectangular with 8px radius per design rules.
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
        'relative flex items-center gap-0.5 p-1 rounded-lg',
        'border border-white/10 bg-white/5',
        'hover:bg-white/10 transition-colors duration-150',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]',
        'min-h-[36px]'
      )}
    >
      {/* Sun */}
      <span
        className={cn(
          'relative z-10 p-1.5 rounded-md transition-colors duration-150',
          theme === 'light' ? 'text-amber-400' : 'text-[var(--text-muted)]'
        )}
      >
        <Sun size={14} aria-hidden="true" />
      </span>

      {/* Moon */}
      <span
        className={cn(
          'relative z-10 p-1.5 rounded-md transition-colors duration-150',
          theme === 'dark' ? 'text-sky-300' : 'text-[var(--text-muted)]'
        )}
      >
        <Moon size={14} aria-hidden="true" />
      </span>

      {/* Sliding indicator */}
      <motion.span
        layout
        layoutId="theme-toggle-slider"
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="absolute top-1 w-6 h-6 rounded-md bg-white/15 backdrop-blur-sm border border-white/20"
        style={{
          left: theme === 'light' ? 4 : undefined,
          right: theme === 'dark' ? 4 : undefined,
        }}
        aria-hidden="true"
      />
    </button>
  );
}
