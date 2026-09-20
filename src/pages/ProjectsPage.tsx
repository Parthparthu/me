import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SEO } from '../components/common/SEO';
import { projectsData } from '../data/projects';
import { useProjectFilter } from '../hooks/useProjectFilter';
import { ProjectFilter } from '../components/projects/ProjectFilter';
import { ProjectCard } from '../components/projects/ProjectCard';
import { FolderGit2 } from 'lucide-react';

// ─── Variants ────────────────────────────────────────────────────────────────

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 260, damping: 22 },
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export const ProjectsPage: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    selectedTechnology,
    setSelectedTechnology,
    categories,
    allTechnologies,
    filteredProjects,
    resetFilters,
  } = useProjectFilter({ projects: projectsData });

  return (
    <>
      <SEO
        title="Projects & Case Studies | Pradyumna"
        description="Comprehensive project catalog and engineering case studies across Web/PWA, Full-Stack Systems, Real-Time Financial Screener, and Algorithms."
      />
      <div className="container" style={{ paddingTop: 'var(--space-12)', paddingBottom: 'var(--space-20)' }}>
        {/* Page Header */}
        <motion.header
          initial="hidden"
          animate="visible"
          variants={headerVariants}
          style={{ marginBottom: 'var(--space-8)' }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              color: 'var(--accent-primary)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 'var(--space-2)',
            }}
          >
            <FolderGit2 size={16} aria-hidden="true" />
            <span>Architecture Catalog</span>
          </div>
          <h1 style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-3)' }}>
            Projects &amp; Case Studies
          </h1>
          <p
            style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--text-secondary)',
              maxWidth: 'var(--max-w-prose)',
            }}
          >
            Explore deep architectural write-ups, trade-offs, and source repositories for production
            applications, algorithms, and microservices.
          </p>
        </motion.header>

        {/* Filter Toolbar */}
        <ProjectFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedTechnology={selectedTechnology}
          onSelectTechnology={setSelectedTechnology}
          allTechnologies={allTechnologies}
          totalResults={filteredProjects.length}
          onReset={resetFilters}
        />

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          {filteredProjects.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              role="status"
              style={{
                padding: 'var(--space-16) var(--space-4)',
                textAlign: 'center',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px dashed var(--border-subtle)',
              }}
            >
              <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>
                No projects found matching your criteria
              </h2>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  marginBottom: 'var(--space-4)',
                  fontSize: 'var(--text-sm)',
                }}
              >
                Try adjusting your search query, switching categories, or resetting the active filters.
              </p>
              <button type="button" onClick={resetFilters} className="btn btn-primary">
                Reset All Filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className="grid-responsive"
              initial="hidden"
              animate="visible"
              variants={gridVariants}
            >
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={cardVariants}
                  whileHover={{
                    y: -4,
                    boxShadow: '0 20px 48px rgba(91,124,246,0.12)',
                  }}
                  style={{ height: '100%' }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
