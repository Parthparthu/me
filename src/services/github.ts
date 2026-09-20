import { GitHubStats, GitHubUserProfile, GitHubRepo, LanguageDistribution } from '../types/github';

const CACHE_KEY = 'pradyumna_github_stats_v1';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Authoritative static fallback data.
 * Guarantees zero downtime even if GitHub API is offline or rate-limited.
 */
export const STATIC_FALLBACK_STATS: GitHubStats = {
  user: {
    login: 'Parthparthu',
    name: 'Pradyumna',
    avatar_url: 'https://avatars.githubusercontent.com/u/68063528?v=4',
    html_url: 'https://github.com/Parthparthu',
    public_repos: 52,
    followers: 2,
    following: 3,
    created_at: '2020-07-09T12:07:36Z'
  },
  repos: [
    {
      id: 93482341,
      name: 'Numora',
      full_name: 'Parthparthu/Numora',
      html_url: 'https://github.com/Parthparthu/Numora',
      description: 'A mobile-first Progressive Web App for analyzing 10-digit mobile numbers using customizable numerology totals and 43 forbidden-pattern rules.',
      language: 'TypeScript',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: '2025-02-15T12:00:00Z',
      pushed_at: '2025-02-15T12:00:00Z',
      homepage: 'https://parthparthu.github.io/Numora/'
    },
    {
      id: 93482342,
      name: 'InsiderTracker',
      full_name: 'Parthparthu/InsiderTracker',
      html_url: 'https://github.com/Parthparthu/InsiderTracker',
      description: 'Full-stack application tracking SEC EDGAR Insider Stock Transactions (Form 4) with differential alerting for trades >$500K.',
      language: 'TypeScript',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: '2025-02-10T10:00:00Z',
      pushed_at: '2025-02-10T10:00:00Z',
      homepage: null
    },
    {
      id: 93482343,
      name: 'MVP',
      full_name: 'Parthparthu/MVP',
      html_url: 'https://github.com/Parthparthu/MVP',
      description: '1v1 Python coding battle platform with secure evaluation microservice architecture (CodeClash AI).',
      language: 'TypeScript',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: '2025-01-20T15:00:00Z',
      pushed_at: '2025-01-20T15:00:00Z',
      homepage: null
    },
    {
      id: 93482344,
      name: 'Oweo',
      full_name: 'Parthparthu/Oweo',
      html_url: 'https://github.com/Parthparthu/Oweo',
      description: 'Offline-first expense tracking and group debt splitting PWA with heuristic text parsing.',
      language: 'TypeScript',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: '2025-02-12T09:00:00Z',
      pushed_at: '2025-02-12T09:00:00Z',
      homepage: null
    },
    {
      id: 93482345,
      name: 'StockScreener',
      full_name: 'Parthparthu/StockScreener',
      html_url: 'https://github.com/Parthparthu/StockScreener',
      description: 'Real-time stock screener filtering Nifty 500 and NYSE equities with WebSockets and FastAPI.',
      language: 'Python',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: '2025-01-25T11:00:00Z',
      pushed_at: '2025-01-25T11:00:00Z',
      homepage: null
    },
    {
      id: 93482346,
      name: 'BilingSystem',
      full_name: 'Parthparthu/BilingSystem',
      html_url: 'https://github.com/Parthparthu/BilingSystem',
      description: 'Small business billing software with PDF invoice creation and customer reward points in Python & SQLite.',
      language: 'Python',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: '2024-11-18T14:00:00Z',
      pushed_at: '2024-11-18T14:00:00Z',
      homepage: null
    }
  ],
  totalStars: 0,
  totalForks: 2,
  topLanguages: [
    { language: 'TypeScript', count: 18, percentage: 42 },
    { language: 'Python', count: 14, percentage: 33 },
    { language: 'JavaScript', count: 6, percentage: 14 },
    { language: 'HTML/CSS', count: 5, percentage: 11 }
  ],
  isFallback: true,
  lastUpdated: new Date().toISOString()
};

interface CacheRecord {
  timestamp: number;
  data: GitHubStats;
}

/**
 * Calculates language distribution percentages from repository data.
 */
function calculateTopLanguages(repos: GitHubRepo[]): LanguageDistribution[] {
  const langCounts: Record<string, number> = {};
  let totalValid = 0;

  for (const r of repos) {
    if (r.language) {
      langCounts[r.language] = (langCounts[r.language] || 0) + 1;
      totalValid++;
    }
  }

  if (totalValid === 0) return STATIC_FALLBACK_STATS.topLanguages;

  return Object.entries(langCounts)
    .map(([language, count]) => ({
      language,
      count,
      percentage: Math.round((count / totalValid) * 100)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

/**
 * Fetches GitHub profile and repo metrics with localStorage caching and safe fallback.
 */
export async function fetchGitHubStats(username: string = 'Parthparthu'): Promise<GitHubStats> {
  // 1. Check client cache first
  try {
    const cachedStr = localStorage.getItem(CACHE_KEY);
    if (cachedStr) {
      const cached: CacheRecord = JSON.parse(cachedStr);
      if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
        return cached.data;
      }
    }
  } catch {
    // localStorage may fail in strict privacy modes; proceed with fetch
  }

  // 2. Fetch fresh data from public GitHub API
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers: { Accept: 'application/vnd.github.v3+json' }
      }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`, {
        headers: { Accept: 'application/vnd.github.v3+json' }
      })
    ]);

    if (!userRes.ok || !reposRes.ok) {
      console.warn(`GitHub API responded with status: user=${userRes.status}, repos=${reposRes.status}. Using fallback.`);
      return STATIC_FALLBACK_STATS;
    }

    const user: GitHubUserProfile = await userRes.json();
    const rawRepos: GitHubRepo[] = await reposRes.json();

    const totalStars = rawRepos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
    const totalForks = rawRepos.reduce((acc, r) => acc + (r.forks_count || 0), 0);
    const topLanguages = calculateTopLanguages(rawRepos);

    const stats: GitHubStats = {
      user,
      repos: rawRepos.slice(0, 10), // Top 10 recently active
      totalStars,
      totalForks,
      topLanguages,
      isFallback: false,
      lastUpdated: new Date().toISOString()
    };

    // 3. Cache successful response
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        data: stats
      }));
    } catch {
      // Ignore cache write errors
    }

    return stats;
  } catch (err) {
    console.warn('Network error fetching GitHub stats, using resilient static fallback:', err);
    return STATIC_FALLBACK_STATS;
  }
}
