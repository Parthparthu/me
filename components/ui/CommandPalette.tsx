'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Terminal, 
  Sun, 
  Moon, 
  FolderKanban, 
  User, 
  Mail, 
  FileText, 
  Github, 
  X,
  type LucideIcon
} from 'lucide-react';
import { projects } from '@/data/projects';
import { useTheme } from '@/components/ui/ThemeProvider';
import { LiquidGlass } from '@/components/glass/LiquidGlass';

interface CommandItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Projects' | 'Theme' | 'Links';
  icon: LucideIcon;
  action: () => void;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  const commands = useMemo<CommandItem[]>(() => {
    const baseCommands: CommandItem[] = [
      {
        id: 'home',
        title: 'Home',
        category: 'Navigation',
        icon: User,
        action: () => { router.push('/'); close(); },
      },
      {
        id: 'projects',
        title: 'All Projects',
        category: 'Navigation',
        icon: FolderKanban,
        action: () => { router.push('/projects'); close(); },
      },
      {
        id: 'about',
        title: 'About Me',
        category: 'Navigation',
        icon: User,
        action: () => { router.push('/#about'); close(); },
      },
      {
        id: 'journey',
        title: 'My Journey',
        category: 'Navigation',
        icon: Terminal,
        action: () => { router.push('/#journey'); close(); },
      },
      {
        id: 'contact',
        title: 'Contact',
        category: 'Navigation',
        icon: Mail,
        action: () => { router.push('/#contact'); close(); },
      },
      {
        id: 'resume',
        title: 'View Resume',
        category: 'Navigation',
        icon: FileText,
        action: () => { router.push('/resume'); close(); },
      },
      {
        id: 'theme',
        title: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
        category: 'Theme',
        icon: theme === 'dark' ? Sun : Moon,
        action: () => { toggleTheme(); close(); },
      },
      {
        id: 'github',
        title: 'GitHub Profile (@Parthparthu)',
        category: 'Links',
        icon: Github,
        action: () => { window.open('https://github.com/Parthparthu', '_blank'); close(); },
      },
    ];

    const projectCommands: CommandItem[] = projects.map((p) => ({
      id: `project-${p.slug}`,
      title: `${p.name} — ${p.tagline}`,
      category: 'Projects',
      icon: FolderKanban,
      action: () => { router.push(`/projects/${p.slug}`); close(); },
    }));

    return [...baseCommands, ...projectCommands];
  }, [router, theme, toggleTheme, close]);

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (c) => c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    );
  }, [commands, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle arrow keys
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[var(--z-command-palette)] flex items-start justify-center pt-20 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-specular)] shadow-2xl overflow-hidden z-10"
          >
            {/* Search Input */}
            <div className="flex items-center px-4 py-3.5 border-b border-[var(--border-subtle)] gap-3">
              <Search className="w-5 h-5 text-[var(--accent-primary)] shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Type a command or search projects..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none"
              />
              <kbd className="px-2 py-0.5 text-xs font-mono bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded text-[var(--text-muted)]">
                ESC
              </kbd>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filteredCommands.length === 0 ? (
                <div className="py-8 text-center text-sm text-[var(--text-muted)]">
                  No commands matching &ldquo;{query}&rdquo;
                </div>
              ) : (
                filteredCommands.map((command, idx) => {
                  const Icon = command.icon;
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={command.id}
                      onClick={command.action}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-sm transition-colors ${
                        isSelected
                          ? 'bg-[var(--accent-primary-subtle)] text-[var(--accent-primary)]'
                          : 'text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'}`} />
                        <span className="truncate font-medium">{command.title}</span>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)] px-1.5 py-0.5 rounded bg-[var(--bg-surface-2)]">
                        {command.category}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-2)] text-xs text-[var(--text-muted)]">
              <span>Navigate with <kbd>↑</kbd> <kbd>↓</kbd></span>
              <span>Open with <kbd>↵</kbd></span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
