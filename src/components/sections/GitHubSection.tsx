import React, { useRef } from 'react';
import { RefreshCw, ExternalLink, Star } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import { GithubIcon } from '../common/Icons';
import { useGitHubData } from '../../hooks/useGitHubData';

const LANG_COLORS: Record<string, string> = {
  Python:     '#3572a5',
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  CSS:        '#563d7c',
  HTML:       '#e34c26',
  C:          '#555555',
  'C++':      '#f34b7d',
  Jupyter:    '#da5b0b',
};

export const GitHubSection: React.FC = () => {
  const { data, isLoading, refresh } = useGitHubData('Parthparthu');
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.05 });

  const stats = [
    { label: 'Public Repositories', value: data.user.public_repos || 52, color: 'var(--accent-primary)' },
    { label: 'Core Languages', value: `${data.topLanguages.length || 4}+`, color: 'var(--accent-cyan)' },
    { label: 'Coding Trajectory', value: '5 Years', color: 'var(--accent-emerald)' },
  ];

  return (
    <section id="github" ref={sectionRef} className="section" aria-labelledby="github-title">
      <div className="container">
        <motion.div
          className="section-header"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 'var(--space-4)' }}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, type: 'spring', stiffness: 240, damping: 24 }}
        >
          <div>
            <div className="section-label">
              <GithubIcon size={14} aria-hidden="true" />
              <span>Open Source &amp; Version Control</span>
            </div>
            <h2 id="github-title" className="section-title">GitHub Activity</h2>
            <p className="section-subtitle">
              52 public repositories spanning full-stack applications, algorithmic solutions, and systems tooling.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span className={`badge ${data.isFallback ? '' : 'badge-emerald'}`}
              style={{ color: data.isFallback ? 'var(--accent-amber)' : undefined,
                       borderColor: data.isFallback ? 'var(--accent-amber-border, rgba(245,158,11,0.25))' : undefined,
                       backgroundColor: data.isFallback ? 'var(--accent-amber-subtle)' : undefined }}>
              {data.isFallback ? 'Snapshot' : '● Live'}
            </span>
            <button
              type="button"
              onClick={() => refresh()}
              disabled={isLoading}
              className="btn btn-ghost"
              style={{ minHeight: '36px', padding: '0 var(--space-3)', gap: 'var(--space-1-5)' }}
              aria-label="Refresh GitHub data"
            >
              <RefreshCw size={13} className={isLoading ? 'animate-status-pulse' : ''} aria-hidden="true" />
              <span className="sr-only">Refresh</span>
            </button>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          className="github-stats"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.18, type: 'spring', stiffness: 240, damping: 24 }}
        >
          {stats.map(({ label, value, color }, i) => (
            <motion.div
              key={label}
              className="github-stat card-surface"
              style={{ padding: 'var(--space-4) var(--space-5)' }}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.18 + i * 0.08, type: 'spring', stiffness: 240, damping: 24 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="github-stat-value" style={{ color }}>{value}</div>
              <div className="github-stat-label">{label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Two columns */}
        <motion.div
          className="github-details"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.26, type: 'spring', stiffness: 240, damping: 24 }}
        >
          {/* Language distribution */}
          <div className="card-surface" style={{ padding: 'var(--space-5)' }}>
            <h3 className="github-card-title">Language Distribution</h3>

            {/* Visual bar */}
            <div className="github-lang-bar" aria-label="Language distribution chart" role="img">
              {data.topLanguages.map((lang) => (
                <div
                  key={lang.language}
                  className="github-lang-segment"
                  style={{
                    width: `${lang.percentage}%`,
                    backgroundColor: LANG_COLORS[lang.language] ?? 'var(--accent-primary)',
                  }}
                  title={`${lang.language}: ${lang.percentage}%`}
                />
              ))}
            </div>

            <div className="github-lang-legend">
              {data.topLanguages.slice(0, 6).map((lang) => (
                <div key={lang.language} className="github-lang-item">
                  <span
                    className="github-lang-dot"
                    style={{ backgroundColor: LANG_COLORS[lang.language] ?? 'var(--accent-primary)' }}
                    aria-hidden="true"
                  />
                  <span className="github-lang-name">{lang.language}</span>
                  <span className="github-lang-pct">{lang.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Repositories */}
          <div className="card-surface" style={{ padding: 'var(--space-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h3 className="github-card-title" style={{ marginBottom: 0 }}>Featured Repositories</h3>
              <a
                href={data.user.html_url || 'https://github.com/Parthparthu'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
                style={{ fontSize: 'var(--text-xs)', minHeight: '32px', padding: '0 var(--space-3)', gap: 'var(--space-1)' }}
              >
                <span>View all {data.user.public_repos || 52}</span>
                <ExternalLink size={12} aria-hidden="true" />
              </a>
            </div>

            <div className="github-repo-list">
              {data.repos.slice(0, 5).map((repo, i) => (
                <motion.a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-repo-item"
                  initial={{ opacity: 0, y: 12 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.34 + i * 0.08, type: 'spring', stiffness: 240, damping: 24 }}
                >
                  <div className="github-repo-header">
                    <GithubIcon size={14} className="github-repo-icon" aria-hidden="true" />
                    <span className="github-repo-name">{repo.name}</span>
                    {repo.stargazers_count > 0 && (
                      <span className="github-repo-stars">
                        <Star size={11} aria-hidden="true" />
                        {repo.stargazers_count}
                      </span>
                    )}
                    {repo.language && (
                      <span
                        className="github-repo-lang"
                        style={{ backgroundColor: LANG_COLORS[repo.language] ?? 'var(--text-muted)' }}
                        aria-label={`Language: ${repo.language}`}
                      >
                        {repo.language}
                      </span>
                    )}
                  </div>
                  {repo.description && (
                    <p className="github-repo-desc">{repo.description}</p>
                  )}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .github-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 140px), 1fr));
          gap: var(--space-4);
          margin-bottom: var(--space-6);
        }

        .github-stat {
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xl);
          background-color: var(--bg-surface-elevated);
          transition: border-color var(--duration-fast) var(--ease-out);
        }

        .github-stat:hover {
          border-color: var(--border-medium);
        }

        .github-stat-value {
          font-size: var(--text-3xl);
          font-weight: 800;
          letter-spacing: var(--tracking-tight);
          line-height: 1;
          margin-bottom: var(--space-1);
        }

        .github-stat-label {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: var(--tracking-wider);
          font-weight: 500;
        }

        .github-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
          gap: var(--space-5);
        }

        .github-card-title {
          font-size: var(--text-base);
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: var(--space-4);
          letter-spacing: var(--tracking-snug);
        }

        .github-lang-bar {
          display: flex;
          height: 8px;
          border-radius: var(--radius-full);
          overflow: hidden;
          margin-bottom: var(--space-4);
          gap: 2px;
        }

        .github-lang-segment {
          border-radius: var(--radius-full);
          transition: opacity var(--duration-fast);
        }

        .github-lang-segment:hover { opacity: 0.8; }

        .github-lang-legend {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .github-lang-item {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-xs);
        }

        .github-lang-dot {
          width: 8px;
          height: 8px;
          border-radius: var(--radius-full);
          flex-shrink: 0;
        }

        .github-lang-name {
          font-weight: 600;
          color: var(--text-primary);
          flex: 1;
        }

        .github-lang-pct {
          color: var(--text-tertiary);
          font-family: var(--font-mono);
        }

        .github-repo-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .github-repo-item {
          display: block;
          padding: var(--space-3);
          background-color: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          text-decoration: none;
          transition: border-color var(--duration-fast), background-color var(--duration-fast);
        }

        .github-repo-item:hover {
          border-color: var(--border-medium);
          background-color: var(--bg-surface-hover);
        }

        .github-repo-header {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-1);
          flex-wrap: wrap;
        }

        .github-repo-icon {
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .github-repo-name {
          font-weight: 600;
          font-size: var(--text-sm);
          color: var(--text-primary);
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .github-repo-stars {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: var(--text-2xs);
          color: var(--accent-amber);
          font-family: var(--font-mono);
        }

        .github-repo-lang {
          font-size: var(--text-2xs);
          font-family: var(--font-mono);
          padding: 1px 6px;
          border-radius: var(--radius-full);
          color: white;
          font-weight: 600;
          opacity: 0.85;
        }

        .github-repo-desc {
          font-size: var(--text-xs);
          color: var(--text-secondary);
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
    </section>
  );
};
