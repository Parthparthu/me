import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProjectFilter } from '../src/hooks/useProjectFilter';
import { projectsData } from '../src/data/projects';

describe('Project Filtering Engine', () => {
  it('should return all projects when default filters are active', () => {
    const { result } = renderHook(() => useProjectFilter({ projects: projectsData }));
    expect(result.current.filteredProjects.length).toBe(projectsData.length);
    expect(result.current.selectedCategory).toBe('All');
  });

  it('should filter projects by category accurately', () => {
    const { result } = renderHook(() => useProjectFilter({ projects: projectsData }));

    act(() => {
      result.current.setSelectedCategory('Full-Stack / Systems');
    });

    expect(result.current.filteredProjects.length).toBeGreaterThan(0);
    expect(
      result.current.filteredProjects.every((p) => p.category === 'Full-Stack / Systems')
    ).toBe(true);
  });

  it('should filter projects by text search query', () => {
    const { result } = renderHook(() => useProjectFilter({ projects: projectsData }));

    act(() => {
      result.current.setSearchQuery('Numora');
    });

    expect(result.current.filteredProjects.length).toBe(1);
    expect(result.current.filteredProjects[0].name).toBe('Numora');
  });

  it('should filter projects by technology query', () => {
    const { result } = renderHook(() => useProjectFilter({ projects: projectsData }));

    act(() => {
      result.current.setSearchQuery('FastAPI');
    });

    expect(result.current.filteredProjects.length).toBeGreaterThanOrEqual(2);
    expect(
      result.current.filteredProjects.some((p) => p.name === 'InsiderTracker')
    ).toBe(true);
  });

  it('should reset filters properly', () => {
    const { result } = renderHook(() => useProjectFilter({ projects: projectsData }));

    act(() => {
      result.current.setSelectedCategory('Web / PWA');
      result.current.setSearchQuery('xyz non-existent');
    });

    expect(result.current.filteredProjects.length).toBe(0);

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.filteredProjects.length).toBe(projectsData.length);
    expect(result.current.selectedCategory).toBe('All');
    expect(result.current.searchQuery).toBe('');
  });
});
