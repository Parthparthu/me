import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { projectsData } from '../data/projects';
import { CaseStudyView } from '../components/projects/CaseStudyView';
import { SEO } from '../components/common/SEO';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = projectsData.find((p) => p.slug === slug);

  if (!project) {
    return (
      <motion.div
        className="container"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
        style={{ paddingTop: 'var(--space-20)', paddingBottom: 'var(--space-20)', textAlign: 'center' }}
      >
        <SEO title="Project Not Found | Pradyumna" />
        <div
          style={{
            maxWidth: '500px',
            margin: '0 auto',
            backgroundColor: 'var(--bg-surface)',
            padding: 'var(--space-10)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <AlertCircle
            size={40}
            style={{ color: 'var(--accent-amber)', margin: '0 auto var(--space-4)' }}
            aria-hidden="true"
          />
          <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>
            Project Not Found
          </h1>
          <p
            style={{
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-6)',
              fontSize: 'var(--text-sm)',
            }}
          >
            The case study with slug <code>&quot;{slug}&quot;</code> does not exist or has been relocated.
          </p>
          <Link to="/projects" className="btn btn-primary">
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Return to All Projects</span>
          </Link>
        </div>
      </motion.div>
    );
  }

  // Schema for SoftwareApplication
  const projectSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.name,
    description: project.shortDescription,
    applicationCategory: project.category,
    operatingSystem: 'All',
    url: project.liveUrl || project.repositoryUrl,
    author: {
      '@type': 'Person',
      name: 'Pradyumna',
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
    >
      <SEO
        title={`${project.name} — Architecture Case Study | Pradyumna`}
        description={project.shortDescription}
        schema={projectSchema}
      />
      <CaseStudyView project={project} />
    </motion.div>
  );
};
