import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search, X } from 'lucide-react';

interface ProjectFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTechnology: string | null;
  onSelectTechnology: (tech: string | null) => void;
  allTechnologies: string[];
  totalResults: number;
  onReset: () => void;
}

export const ProjectFilter: React.FC<ProjectFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  selectedTechnology,
  onSelectTechnology,
  allTechnologies,
  totalResults,
  onReset,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        const target = e.target as HTMLElement | null;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
          return;
        }
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      } else if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const hasActiveFilters =
    selectedCategory !== 'All' || searchQuery.trim() !== '' || selectedTechnology !== null;

  return (
    <div
      className="project-filter-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        backgroundColor: 'rgba(12, 14, 21, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
        marginBottom: 'var(--space-8)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
      }}
    >
      {/* Top row: Search Bar & Tech Select */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search Input */}
        <div
          className="search-input-wrapper"
          style={{
            position: 'relative',
            flex: '1 1 280px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Search
            size={17}
            style={{
              position: 'absolute',
              left: '14px',
              color: isFocused ? '#00f0ff' : 'var(--text-tertiary)',
              transition: 'color 0.2s ease',
              pointerEvents: 'none',
            }}
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search projects by name, technology, or keywords..."
            aria-label="Filter projects by search term"
            style={{
              width: '100%',
              height: '44px',
              paddingLeft: '42px',
              paddingRight: searchQuery ? '42px' : '52px',
              backgroundColor: 'rgba(18, 22, 34, 0.85)',
              border: isFocused ? '1px solid #00f0ff' : '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: isFocused ? '0 0 16px rgba(0, 240, 255, 0.2)' : 'none',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-sm)',
              outline: 'none',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            }}
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                inputRef.current?.focus();
              }}
              className="touch-target"
              aria-label="Clear search input"
              style={{
                position: 'absolute',
                right: '6px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-tertiary)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <X size={15} />
            </button>
          ) : (
            <div
              style={{
                position: 'absolute',
                right: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                pointerEvents: 'none',
              }}
              title="Press / to search"
            >
              <kbd
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: 'var(--text-tertiary)',
                  lineHeight: '1',
                }}
              >
                /
              </kbd>
            </div>
          )}
        </div>

        {/* Technology Filter Dropdown */}
        <div style={{ position: 'relative', flex: '0 0 auto' }}>
          <label htmlFor="tech-filter-select" className="sr-only">
            Filter by technology
          </label>
          <select
            id="tech-filter-select"
            value={selectedTechnology || ''}
            onChange={(e) => onSelectTechnology(e.target.value ? e.target.value : null)}
            style={{
              height: '44px',
              paddingLeft: 'var(--space-4)',
              paddingRight: 'var(--space-8)',
              backgroundColor: 'rgba(18, 22, 34, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="">All Technologies</option>
            {allTechnologies.map((tech) => (
              <option key={tech} value={tech}>
                {tech}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filter button */}
        {hasActiveFilters && (
          <motion.button
            type="button"
            onClick={onReset}
            className="touch-target"
            whileHover={{ scale: 1.04, borderColor: '#00f0ff' }}
            whileTap={{ scale: 0.96 }}
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              color: '#00f0ff',
              padding: '0 var(--space-3)',
              borderRadius: 'var(--radius-sm)',
              border: '1px dashed rgba(0, 240, 255, 0.4)',
              backgroundColor: 'rgba(0, 240, 255, 0.06)',
              cursor: 'pointer',
            }}
          >
            Reset Filters
          </motion.button>
        )}
      </div>

      {/* Category Pills */}
      <div
        role="tablist"
        aria-label="Filter projects by category"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--space-2)',
        }}
      >
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <motion.button
              key={cat}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => onSelectCategory(cat)}
              className="touch-target"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{
                position: 'relative',
                height: '36px',
                padding: '0 var(--space-4)',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                border: '1px solid',
                borderColor: isActive ? 'var(--accent-primary)' : 'var(--border-subtle)',
                backgroundColor: isActive ? 'var(--accent-primary-subtle)' : 'var(--bg-surface-elevated)',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                transition: 'border-color var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard), background-color var(--duration-fast) var(--ease-standard)',
                overflow: 'hidden',
              }}
            >
              {/* Shared layout active indicator — slides under the active pill */}
              {isActive && (
                <motion.span
                  layoutId="filter-active"
                  aria-hidden="true"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--accent-primary-subtle)',
                    zIndex: 0,
                  }}
                />
              )}
              <span style={{ position: 'relative', zIndex: 1 }}>{cat}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Screen Reader & Visual Result Count */}
      <div
        aria-live="polite"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-tertiary)',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: 'var(--space-3)',
        }}
      >
        <span>
          Showing <strong>{totalResults}</strong> {totalResults === 1 ? 'project' : 'projects'}
        </span>
        {selectedTechnology && (
          <span>
            Filtered by technology: <strong>{selectedTechnology}</strong>
          </span>
        )}
      </div>
    </div>
  );
};
