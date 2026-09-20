import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchGitHubStats, STATIC_FALLBACK_STATS } from '../src/services/github';

describe('GitHub Resilience & Fallback Service', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('should return authoritative fallback when network request fails', async () => {
    // Mock fetch to reject
    global.fetch = vi.fn().mockRejectedValue(new Error('Network disconnected'));

    const stats = await fetchGitHubStats('Parthparthu');

    expect(stats.isFallback).toBe(true);
    expect(stats.user.login).toBe('Parthparthu');
    expect(stats.repos.length).toBeGreaterThan(0);
    expect(stats.user.public_repos).toBe(52);
  });

  it('should return fallback when API responds with rate limit status (403)', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
      json: async () => ({ message: 'API rate limit exceeded' })
    });

    const stats = await fetchGitHubStats('Parthparthu');

    expect(stats.isFallback).toBe(true);
    expect(stats.user.login).toBe('Parthparthu');
  });

  it('should read from localStorage cache when available and valid', async () => {
    const cachedRecord = {
      timestamp: Date.now(),
      data: {
        ...STATIC_FALLBACK_STATS,
        totalStars: 42,
        isFallback: false
      }
    };
    localStorage.setItem('pradyumna_github_stats_v1', JSON.stringify(cachedRecord));

    // fetch should not be called if cache is valid
    const fetchSpy = vi.fn();
    global.fetch = fetchSpy;

    const stats = await fetchGitHubStats('Parthparthu');

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(stats.totalStars).toBe(42);
  });
});
