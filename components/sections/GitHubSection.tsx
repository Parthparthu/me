'use client';

import { useState, useEffect } from 'react';
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

export function GitHubSection() {
  const [user, setUser] = useState<GitHubUser | null>(null);
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
        // Degrades cleanly
      } finally {
        setLoading(false);
      }
    }

    fetchGitHubData();
  }, []);

  return (
    <section
      id="github"
      className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full scroll-mt-24"
      aria-label="GitHub Open Source Activity"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <span className="section-label">Open Source</span>
          <h2 className="section-title text-[var(--text-primary)] mt-1">
            GitHub Activity
          </h2>
          <p className="section-subtitle mt-2">
            Public repositories documenting system architectures, algorithmic solutions, and full-stack software.
          </p>
        </div>

        <a
          href="https://github.com/Parthparthu"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[var(--border-medium)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors w-fit min-h-[44px]"
        >
          <Github size={15} />
          <span>@Parthparthu on GitHub</span>
          <ArrowUpRight size={13} />
        </a>
      </div>

      {/* Stats row */}
      {user && (
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { icon: BookOpen, label: 'Public Repositories', value: user.public_repos },
            { icon: Activity, label: 'Followers', value: user.followers },
            { icon: Github, label: 'Following', value: user.following },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label}>
                <LiquidGlass
                  elevation={2}
                  tint="neutral"
                  radius={12}
                  className="p-5 text-center border border-[var(--border-subtle)]"
                >
                  <Icon size={18} className="mx-auto mb-2 text-[var(--accent-primary)]" />
                  <div className="text-xl md:text-2xl font-bold font-mono text-[var(--text-primary)] tabular-nums">
                    {loading ? '…' : stat.value}
                  </div>
                  <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider mt-1">
                    {stat.label}
                  </div>
                </LiquidGlass>
              </div>
            );
          })}
        </div>
      )}

      {/* Repositories grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-36 rounded-xl bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] animate-pulse"
              />
            ))
          : repos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
                aria-label={`Repository ${repo.name} on GitHub`}
              >
                <LiquidGlass
                  elevation={2}
                  tint="neutral"
                  radius={12}
                  className="p-5 h-full flex flex-col justify-between border border-[var(--border-subtle)] group-hover:border-[var(--border-medium)] transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors truncate">
                        {repo.name}
                      </h3>
                      <ArrowUpRight size={14} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors shrink-0" />
                    </div>

                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                      {repo.description || 'Public software engineering repository.'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-3 border-t border-[var(--border-subtle)] mt-4">
                    {repo.language ? (
                      <span className="font-mono text-[11px] text-[var(--accent-primary)]">
                        {repo.language}
                      </span>
                    ) : (
                      <span className="font-mono text-[11px] text-[var(--text-muted)]">Code</span>
                    )}

                    <div className="flex items-center gap-3 tabular-nums">
                      {repo.stargazers_count > 0 && (
                        <span className="flex items-center gap-1 font-mono text-[11px]">
                          <Star size={11} />
                          {repo.stargazers_count}
                        </span>
                      )}
                      {repo.forks_count > 0 && (
                        <span className="flex items-center gap-1 font-mono text-[11px]">
                          <GitFork size={11} />
                          {repo.forks_count}
                        </span>
                      )}
                    </div>
                  </div>
                </LiquidGlass>
              </a>
            ))}
      </div>
    </section>
  );
}
