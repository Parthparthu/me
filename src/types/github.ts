/**
 * GITHUB INTEGRATION TYPE DEFINITIONS
 */

export interface GitHubUserProfile {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  topics?: string[];
}

export interface LanguageDistribution {
  language: string;
  count: number;
  percentage: number;
}

export interface GitHubStats {
  user: GitHubUserProfile;
  repos: GitHubRepo[];
  totalStars: number;
  totalForks: number;
  topLanguages: LanguageDistribution[];
  isFallback: boolean;
  lastUpdated: string;
}
