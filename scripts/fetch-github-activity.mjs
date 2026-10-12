import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const TARGET_FILE = path.join(ROOT, 'data', 'github-activity.json');

const USERNAME = 'Parthparthu';

async function fetchActivity() {
  console.log(`Fetching build-time GitHub activity for ${USERNAME}...`);

  const headers = {
    'User-Agent': 'Antigravity-Portfolio-Build',
    Accept: 'application/vnd.github.v3+json',
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${USERNAME}`, { headers }),
      fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=8`, { headers }),
    ]);

    if (!userRes.ok || !reposRes.ok) {
      console.warn(`GitHub API responded with status user:${userRes.status}, repos:${reposRes.status}. Using existing or fallback cache.`);
      return;
    }

    const user = await userRes.json();
    const repos = await reposRes.json();

    if (!Array.isArray(repos)) {
      console.warn('Repos response was not an array. Keeping existing data.');
      return;
    }

    const filteredRepos = repos
      .filter((r) => r.name !== 'me') // Don't list the portfolio repo itself in the activity grid
      .slice(0, 6)
      .map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description || 'Public software repository on GitHub.',
        language: r.language || 'TypeScript',
        stargazers_count: r.stargazers_count || 0,
        forks_count: r.forks_count || 0,
        updated_at: r.updated_at,
        html_url: r.html_url,
      }));

    const outputData = {
      username: USERNAME,
      fetchedAt: new Date().toISOString(),
      user: {
        public_repos: user.public_repos || 53,
        followers: user.followers || 2,
        following: user.following || 3,
      },
      repos: filteredRepos,
    };

    fs.writeFileSync(TARGET_FILE, JSON.stringify(outputData, null, 2) + '\n', 'utf8');
    console.log(`Successfully saved GitHub activity to ${path.relative(ROOT, TARGET_FILE)}`);
  } catch (error) {
    console.warn('Failed to fetch from GitHub API:', error.message);
    if (!fs.existsSync(TARGET_FILE)) {
      console.log('Writing fallback github-activity.json...');
      const fallback = {
        username: USERNAME,
        fetchedAt: new Date().toISOString(),
        user: { public_repos: 53, followers: 2, following: 3 },
        repos: [
          {
            id: 1,
            name: 'Numora',
            description: 'Mobile-number utility Progressive Web App with custom digit reduction logic and 3D spatial field.',
            language: 'TypeScript',
            stargazers_count: 0,
            forks_count: 0,
            updated_at: '2026-10-13T00:00:00Z',
            html_url: 'https://github.com/Parthparthu/Numora',
          },
          {
            id: 2,
            name: 'Oweo',
            description: 'Offline-first expense tracking Progressive Web App with IndexedDB persistence and Firebase sync.',
            language: 'TypeScript',
            stargazers_count: 0,
            forks_count: 0,
            updated_at: '2026-10-13T00:00:00Z',
            html_url: 'https://github.com/Parthparthu/Oweo',
          },
          {
            id: 3,
            name: 'InsiderTracker',
            description: 'SEC EDGAR Form 4 XML data ingestion pipeline and searchable React transaction dashboard.',
            language: 'Python',
            stargazers_count: 0,
            forks_count: 0,
            updated_at: '2026-10-13T00:00:00Z',
            html_url: 'https://github.com/Parthparthu/InsiderTracker',
          },
          {
            id: 4,
            name: 'StockScreener',
            description: 'WebSocket-driven stock screening engine with Python/FastAPI backend and React dashboard.',
            language: 'Python',
            stargazers_count: 0,
            forks_count: 0,
            updated_at: '2026-10-13T00:00:00Z',
            html_url: 'https://github.com/Parthparthu/StockScreener',
          },
          {
            id: 5,
            name: 'BilingSystem',
            description: 'Python desktop billing application with Tkinter, SQLite, 18% GST math, and customer rewards.',
            language: 'Python',
            stargazers_count: 0,
            forks_count: 0,
            updated_at: '2026-10-13T00:00:00Z',
            html_url: 'https://github.com/Parthparthu/BilingSystem',
          },
          {
            id: 6,
            name: 'dentist',
            description: 'Clean responsive dental clinic portal with appointment booking inquiry flow.',
            language: 'JavaScript',
            stargazers_count: 0,
            forks_count: 0,
            updated_at: '2026-10-13T00:00:00Z',
            html_url: 'https://github.com/Parthparthu/dentist',
          },
        ],
      };
      fs.writeFileSync(TARGET_FILE, JSON.stringify(fallback, null, 2) + '\n', 'utf8');
    }
  }
}

fetchActivity();
