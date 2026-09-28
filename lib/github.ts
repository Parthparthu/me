export interface GitHubUser {
  login: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string;
  html_url: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics: string[];
}

const GITHUB_USERNAME = 'Parthparthu';
const GITHUB_API = 'https://api.github.com';

export async function fetchGitHubUser(): Promise<GitHubUser | null> {
  try {
    const res = await fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}`, {
      next: { revalidate: 3600 },
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(
      `${GITHUB_API}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6&type=public`,
      {
        next: { revalidate: 3600 },
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function fetchLanguageDistribution(): Promise<Record<string, number>> {
  try {
    const repos = await fetchGitHubRepos();
    const langs: Record<string, number> = {};
    for (const repo of repos) {
      if (repo.language) {
        langs[repo.language] = (langs[repo.language] || 0) + 1;
      }
    }
    return langs;
  } catch {
    return {};
  }
}
