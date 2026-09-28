/**
 * GitHubSection — Open Source and GitHub activity summary.
 * Features live repository metrics, language distribution, and direct repository cards.
 */
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Star, GitFork, BookOpen, Activity, ArrowUpRight } from 'lucide-react';
import { LiquidGlass } from '@/components/glass/LiquidGlass';

interface GitHubUser {
  public_repos: number;
  followers: number;
  following: number;
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  html_url: string;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Go: '#00ADD8',
  Rust: '#dea584',
};

const FALLBACK_USER: GitHubUser = {
  public_repos: 52,
  followers: 10,
  following: 15,
};

const SPRING = { type: 'spring', stiffness: 280, damping: 28 } as const;

export function GitHubSection() {
  const [user, setUser] = useState<GitHubUser>(FALLBACK_USER);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGitHubData() {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch('https://api.github.com/users/Parthparthu'),
          fetch('https://api.github.com/users/Parthparthu/repos?sort=updated&per_page=6'),
        ]);

        if (userRes.ok) {
          const userData = await userRes.json();
          setUser({
            public_repos: userData.public_repos,
            followers: userData.followers,
            following: userData.following,
          });
        }

        if (reposRes.ok) {
          const reposData = await reposRes.json();
          setRepos(reposData);
        }
      } catch {
        // Fallback already set
      } finally {
        setLoading(false);
      }
    }

    fetchGitHubData();
  }, []);

  return (
    <section
      id="github"
      className="py-24 px-4 md:px-8 max-w-6xl mx-auto w-full scroll-mt-24"
      aria-label="GitHub Open Source Activity"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={SPRING}
        >
          <span className="section-label">
            <span aria-hidden="true">◈</span>
            Open Source
          </span>
          <h2 className="section-title text-white mt-1">
            GitHub Activity
          </h2>
          <p className="section-subtitle mt-2">
            52+ public repositories documenting exploratory architectures, algorithms, and applications.
          </p>
        </motion.div>

        <a
          href="https://github.com/Parthparthu"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/12 text-sm text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-all w-fit min-h-[44px]"
        >
          <Github size={16} />
          <span>@Parthparthu</span>
          <ArrowUpRight size={14} />
        </a>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { icon: BookOpen, label: 'Repositories', value: user.public_repos, color: 'var(--accent-cyan)' },
          { icon: Activity, label: 'Followers', value: user.followers, color: 'var(--accent-violet)' },
          { icon: Github, label: 'Following', value: user.following, color: 'var(--text-secondary)' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ ...SPRING, delay: i * 0.08 }}
            >
              <LiquidGlass
                elevation={2}
                tint="neutral"
                radius={20}
                dynamicLight
                className="p-6 text-center"
              >
                <Icon size={22} className="mx-auto mb-2" style={{ color: stat.color }} />
                <div className="text-2xl md:text-3xl font-bold font-mono text-white tabular-nums">
                  {loading ? '…' : stat.value}
                </div>
                <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-semibold mt-1">
                  {stat.label}
                </div>
              </LiquidGlass>
            </motion.div>
          );
        })}
      </div>

      {/* Recent repositories grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-44 rounded-2xl bg-white/5 border border-white/8 animate-pulse"
              />
            ))
          : repos.map((repo, i) => {
              const langColor = LANG_COLORS[repo.language] || '#a5b4fc';

              return (
                <motion.a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ ...SPRING, delay: i * 0.06 }}
                  whileHover={{ y: -4, transition: SPRING }}
                  className="group block"
                  aria-label={`Repository ${repo.name} on GitHub`}
                >
                  <LiquidGlass
                    elevation={2}
                    tint="neutral"
                    radius={20}
                    dynamicLight
                    className="p-5 h-full flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-white group-hover:text-[var(--accent-cyan)] transition-colors truncate">
                          {repo.name}
                        </h3>
                        <ArrowUpRight size={14} className="text-[var(--text-muted)] group-hover:text-white transition-colors flex-shrink-0" />
                      </div>

                      <p className="text-xs text-[var(--text-tertiary)] line-clamp-2 leading-relaxed mb-4">
                        {repo.description || 'Public software engineering repository.'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-3 border-t border-white/8">
                      {repo.language && (
                        <span className="flex items-center gap-1.5 font-medium">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: langColor }}
                            aria-hidden="true"
                          />
                          {repo.language}
                        </span>
                      )}

                      <div className="flex items-center gap-3 tabular-nums">
                        {repo.stargazers_count > 0 && (
                          <span className="flex items-center gap-1">
                            <Star size={12} />
                            {repo.stargazers_count}
                          </span>
                        )}
                        {repo.forks_count > 0 && (
                          <span className="flex items-center gap-1">
                            <GitFork size={12} />
                            {repo.forks_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </LiquidGlass>
                </motion.a>
              );
            })}
      </div>
    </section>
  );
}
