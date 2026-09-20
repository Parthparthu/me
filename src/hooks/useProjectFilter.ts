import { useState, useMemo } from 'react';
import { Project } from '../types/project';

export interface UseProjectFilterProps {
  projects: Project[];
}

export function useProjectFilter({ projects }: UseProjectFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTechnology, setSelectedTechnology] = useState<string | null>(null);

  // Available unique categories extracted directly from data
  const categories = useMemo(() => {
    const unique = new Set<string>();
    projects.forEach((p) => unique.add(p.category));
    return ['All', ...Array.from(unique)];
  }, [projects]);

  // Available unique technologies
  const allTechnologies = useMemo(() => {
    const unique = new Set<string>();
    projects.forEach((p) => p.technologies.forEach((t) => unique.add(t)));
    return Array.from(unique).sort();
  }, [projects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Category filter
      if (selectedCategory !== 'All' && project.category !== selectedCategory) {
        return false;
      }

      // Technology filter
      if (selectedTechnology && !project.technologies.includes(selectedTechnology)) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = project.name.toLowerCase().includes(query);
        const matchesTagline = project.tagline.toLowerCase().includes(query);
        const matchesDescription = project.shortDescription.toLowerCase().includes(query);
        const matchesTech = project.technologies.some((t) => t.toLowerCase().includes(query));
        const matchesLang = project.primaryLanguage.toLowerCase().includes(query);

        if (!matchesName && !matchesTagline && !matchesDescription && !matchesTech && !matchesLang) {
          return false;
        }
      }

      return true;
    });
  }, [projects, selectedCategory, selectedTechnology, searchQuery]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSelectedTechnology(null);
  };

  return {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    selectedTechnology,
    setSelectedTechnology,
    categories,
    allTechnologies,
    filteredProjects,
    resetFilters
  };
}
