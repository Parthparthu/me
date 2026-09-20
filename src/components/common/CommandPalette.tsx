import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Home,
  FolderGit2,
  User,
  GraduationCap,
  Award,
  Sparkles,
  Mail,
  SunMoon,
  X,
  ExternalLink,
  Code
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { useTheme } from '../../hooks/useTheme';
import { projectsData } from '../../data/projects';

interface CommandItem {
  id: string;
  label: string;
  category: 'Navigation' | 'Projects' | 'Actions' | 'External';
  icon: React.ReactNode;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate();
  const { toggleTheme } = useTheme();

  const commands: CommandItem[] = useMemo(() => {
    const base: CommandItem[] = [
      {
        id: 'home',
        label: 'Go to Home',
        category: 'Navigation',
        icon: <Home size={16} aria-hidden="true" />,
        action: () => { navigate('/'); onClose(); }
      },
      {
        id: 'projects',
        label: 'All Projects & Case Studies',
        category: 'Navigation',
        icon: <FolderGit2 size={16} aria-hidden="true" />,
        action: () => { navigate('/projects'); onClose(); }
      },
      {
        id: 'about',
        label: 'About & Background',
        category: 'Navigation',
        icon: <User size={16} aria-hidden="true" />,
        action: () => { navigate('/'); setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 100); onClose(); }
      },
      {
        id: 'skills',
        label: 'Technical Skills',
        category: 'Navigation',
        icon: <Code size={16} aria-hidden="true" />,
        action: () => { navigate('/'); setTimeout(() => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }), 100); onClose(); }
      },
      {
        id: 'journey',
        label: 'Journey & Timeline',
        category: 'Navigation',
        icon: <GraduationCap size={16} aria-hidden="true" />,
        action: () => { navigate('/'); setTimeout(() => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' }), 100); onClose(); }
      },
      {
        id: 'achievements',
        label: 'World Memory Championship & Achievements',
        category: 'Navigation',
        icon: <Award size={16} aria-hidden="true" />,
        action: () => { navigate('/'); setTimeout(() => document.getElementById('achievements')?.scrollIntoView({ behavior: 'smooth' }), 100); onClose(); }
      },
      {
        id: 'building',
        label: 'Currently Building',
        category: 'Navigation',
        icon: <Sparkles size={16} aria-hidden="true" />,
        action: () => { navigate('/'); setTimeout(() => document.getElementById('building')?.scrollIntoView({ behavior: 'smooth' }), 100); onClose(); }
      },
      {
        id: 'contact',
        label: 'Contact & Hire',
        category: 'Navigation',
        icon: <Mail size={16} aria-hidden="true" />,
        action: () => { navigate('/'); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100); onClose(); }
      },
      {
        id: 'theme',
        label: 'Toggle Dark / Light Theme',
        category: 'Actions',
        icon: <SunMoon size={16} aria-hidden="true" />,
        action: () => { toggleTheme(); onClose(); }
      },
      {
        id: 'github',
        label: 'GitHub @Parthparthu (52 repos)',
        category: 'External',
        icon: <GithubIcon size={16} aria-hidden="true" />,
        action: () => { window.open('https://github.com/Parthparthu', '_blank', 'noopener,noreferrer'); onClose(); }
      },
      ...(typeof import.meta !== 'undefined' && import.meta.env?.VITE_LINKEDIN_URL ? [{
        id: 'linkedin',
        label: 'LinkedIn Profile',
        category: 'External' as const,
        icon: <LinkedinIcon size={16} aria-hidden="true" />,
        action: () => { window.open(import.meta.env.VITE_LINKEDIN_URL, '_blank', 'noopener,noreferrer'); onClose(); }
      }] : [])
    ];

    const projectCmds: CommandItem[] = projectsData.map((p) => ({
      id: `proj-${p.slug}`,
      label: `${p.name} — ${p.tagline}`,
      category: 'Projects',
      icon: <FolderGit2 size={16} aria-hidden="true" />,
      action: () => { navigate(`/projects/${p.slug}`); onClose(); }
    }));

    return [...base, ...projectCmds];
  }, [navigate, onClose, toggleTheme]);

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase().trim();
    return commands.filter((c) =>
      c.label.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    );
  }, [commands, query]);

  // Group by category
  const grouped = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    filtered.forEach((item) => {
      const grp = map.get(item.category) ?? [];
      grp.push(item);
      map.set(item.category, grp);
    });
    return map;
  }, [filtered]);

  // Flat list index
  const flatList = useMemo(() => filtered, [filtered]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setMounted(true);
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      const t = setTimeout(() => setMounted(false), 250);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((p) => (p + 1) % Math.max(1, flatList.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((p) => (p - 1 + flatList.length) % Math.max(1, flatList.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      flatList[selectedIndex]?.action();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector('[aria-selected="true"]') as HTMLElement;
      activeEl?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!mounted && !isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      className={`cp-backdrop${isOpen ? ' cp-backdrop--open' : ''}`}
      onClick={onClose}
    >
      <div
        className={`cp-panel${isOpen ? ' cp-panel--open' : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {/* Search Input */}
        <div className="cp-header">
          <Search size={18} className="cp-search-icon" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or project name..."
            aria-label="Search commands"
            className="cp-input"
            autoComplete="off"
            spellCheck="false"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setSelectedIndex(0); inputRef.current?.focus(); }}
              className="cp-clear"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="cp-close"
            aria-label="Close command palette"
          >
            <kbd>esc</kbd>
          </button>
        </div>

        {/* Results */}
        <ul
          ref={listRef}
          role="listbox"
          aria-label="Commands"
          className="cp-list"
        >
          {flatList.length === 0 ? (
            <li className="cp-empty">No results for "{query}"</li>
          ) : (
            Array.from(grouped.entries()).map(([category, items]) => (
              <React.Fragment key={category}>
                <li role="presentation" className="cp-group-label">
                  {category}
                </li>
                {items.map((item) => {
                  const globalIdx = flatList.indexOf(item);
                  const isSelected = globalIdx === selectedIndex;
                  return (
                    <li
                      key={item.id}
                      role="option"
                      aria-selected={isSelected}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`cp-item${isSelected ? ' cp-item--selected' : ''}`}
                    >
                      <span className="cp-item-icon">{item.icon}</span>
                      <span className="cp-item-label">{item.label}</span>
                      {item.category === 'External' && (
                        <ExternalLink size={12} className="cp-item-external" aria-hidden="true" />
                      )}
                    </li>
                  );
                })}
              </React.Fragment>
            ))
          )}
        </ul>

        {/* Footer */}
        <div className="cp-footer">
          <div className="cp-footer-hints">
            <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
            <span><kbd>↵</kbd> open</span>
            <span><kbd>esc</kbd> close</span>
          </div>
          <span className="cp-footer-hint-meta">⌘K anywhere</span>
        </div>
      </div>

      <style>{`
        .cp-backdrop {
          position: fixed;
          inset: 0;
          z-index: var(--z-command-palette);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: clamp(var(--space-8), 8vh, var(--space-24)) var(--space-4);
          background-color: rgba(0, 0, 0, 0);
          backdrop-filter: blur(0px);
          transition:
            background-color var(--duration-normal) var(--ease-in-out),
            backdrop-filter var(--duration-normal) var(--ease-in-out);
          pointer-events: none;
        }

        .cp-backdrop--open {
          background-color: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(6px);
          pointer-events: auto;
        }

        .cp-panel {
          width: 100%;
          max-width: 600px;
          background-color: var(--bg-surface-elevated);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
          display: flex;
          flex-direction: column;
          max-height: min(560px, 80vh);
          overflow: hidden;
          opacity: 0;
          transform: scale(0.96) translateY(-8px);
          transition:
            opacity var(--duration-normal) var(--ease-standard),
            transform var(--duration-normal) var(--ease-standard);
        }

        .cp-panel--open {
          opacity: 1;
          transform: scale(1) translateY(0);
        }

        .cp-header {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-4) var(--space-5);
          border-bottom: 1px solid var(--border-subtle);
        }

        .cp-search-icon {
          color: var(--text-tertiary);
          flex-shrink: 0;
        }

        .cp-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-size: var(--text-base);
          font-family: var(--font-sans);
          caret-color: var(--accent-primary);
        }

        .cp-input::placeholder {
          color: var(--text-muted);
        }

        .cp-clear {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: var(--radius-sm);
          color: var(--text-muted);
          cursor: pointer;
          border: none;
          background: transparent;
          transition: background-color var(--duration-fast), color var(--duration-fast);
        }

        .cp-clear:hover {
          background-color: var(--bg-surface-hover);
          color: var(--text-primary);
        }

        .cp-close {
          display: inline-flex;
          align-items: center;
          border: none;
          background: transparent;
          cursor: pointer;
          color: var(--text-muted);
        }

        .cp-close kbd {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-xs);
          padding: 2px 6px;
          font-size: var(--text-2xs);
          font-family: var(--font-mono);
          color: var(--text-muted);
          line-height: 1.5;
        }

        .cp-list {
          overflow-y: auto;
          padding: var(--space-2);
          flex: 1;
          scrollbar-width: thin;
          scrollbar-color: var(--border-medium) transparent;
          list-style: none;
        }

        .cp-group-label {
          padding: var(--space-2) var(--space-3) var(--space-1);
          font-size: var(--text-2xs);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: var(--tracking-widest);
          color: var(--text-muted);
        }

        .cp-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-2-5, 0.625rem) var(--space-3);
          border-radius: var(--radius-md);
          cursor: pointer;
          color: var(--text-secondary);
          transition: background-color var(--duration-instant), color var(--duration-instant);
          list-style: none;
        }

        .cp-item--selected {
          background-color: var(--bg-surface-hover);
          color: var(--text-primary);
        }

        .cp-item-icon {
          display: flex;
          align-items: center;
          color: var(--text-tertiary);
          flex-shrink: 0;
          transition: color var(--duration-instant);
        }

        .cp-item--selected .cp-item-icon {
          color: var(--accent-primary);
        }

        .cp-item-label {
          flex: 1;
          font-size: var(--text-sm);
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cp-item-external {
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .cp-empty {
          padding: var(--space-8) var(--space-4);
          text-align: center;
          color: var(--text-tertiary);
          font-size: var(--text-sm);
          list-style: none;
        }

        .cp-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-3) var(--space-5);
          border-top: 1px solid var(--border-subtle);
          background-color: var(--bg-surface);
          font-size: var(--text-2xs);
          color: var(--text-muted);
        }

        .cp-footer-hints {
          display: flex;
          gap: var(--space-4);
        }

        .cp-footer-hints kbd {
          background-color: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xs);
          padding: 1px 4px;
          font-family: var(--font-mono);
          font-size: 10px;
        }

        .cp-footer-hint-meta {
          font-family: var(--font-mono);
        }

        @media (max-width: 480px) {
          .cp-footer-hints { display: none; }
        }
      `}</style>
    </div>
  );
};
