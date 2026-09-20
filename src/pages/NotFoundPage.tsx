import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/common/SEO';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <>
      <SEO title="Page Not Found (404) | Pradyumna" />
      <div
        className="container"
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          paddingTop: 'var(--space-20)',
          paddingBottom: 'var(--space-20)'
        }}
      >
        <span style={{ fontSize: 'var(--text-5xl)', fontWeight: 900, color: 'var(--accent-primary)', marginBottom: 'var(--space-2)' }}>
          404
        </span>
        <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-3)' }}>
          Page Not Found
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '45ch', marginBottom: 'var(--space-8)', fontSize: 'var(--text-base)' }}>
          The requested path does not exist. You can navigate back home or browse the project catalog.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={16} aria-hidden="true" />
            <span>Go to Homepage</span>
          </Link>
          <Link to="/projects" className="btn btn-secondary">
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Browse Projects</span>
          </Link>
        </div>
      </div>
    </>
  );
};
