import { useState, useEffect, useCallback } from 'react';
import { GitHubStats } from '../types/github';
import { fetchGitHubStats, STATIC_FALLBACK_STATS } from '../services/github';

export function useGitHubData(username: string = 'Parthparthu') {
  const [data, setData] = useState<GitHubStats>(STATIC_FALLBACK_STATS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const stats = await fetchGitHubStats(username);
      setData(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch GitHub data');
      setData(STATIC_FALLBACK_STATS);
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, isLoading, error, refresh: loadData };
}
