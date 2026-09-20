export interface SkillCategory {
  title: string;
  description: string;
  skills: Array<{
    name: string;
    description: string;
    verifiedIn: string[]; // Project IDs/slugs proving practical usage
  }>;
}

export const skillsData: SkillCategory[] = [
  {
    title: 'Core Languages',
    description: 'Languages used across production projects, algorithmic problem solving, and system microservices.',
    skills: [
      { name: 'Python', description: 'FastAPI microservices, SEC data pipelines, algorithm implementations, desktop tooling', verifiedIn: ['insidertracker', 'stockscreener', 'codeclash-ai', 'bilingsystem', 'neetcode-dsa'] },
      { name: 'TypeScript', description: 'Strict-mode type-safe frontend engines, monorepo architectures, and web apps', verifiedIn: ['numora', 'oweo', 'codeclash-ai', 'insidertracker', 'aura-ecommerce'] },
      { name: 'JavaScript (ESNext)', description: 'Modern asynchronous web applications, DOM APIs, and Node.js servers', verifiedIn: ['breakoutscanner', 'stockscreener'] },
      { name: 'C / C++', description: 'Academic systems coursework, memory management, and low-level computing principles', verifiedIn: ['academic-coursework'] },
      { name: 'SQL', description: 'Relational database schema modeling, queries, and constraints', verifiedIn: ['codeclash-ai', 'bilingsystem', 'aura-ecommerce'] },
      { name: 'HTML5 & CSS3', description: 'Semantic markup, modern CSS variables, container queries, and responsive grid layouts', verifiedIn: ['numora', 'oweo', 'portfolio'] }
    ]
  },
  {
    title: 'Frontend Architecture',
    description: 'Component-driven user interfaces, offline-first client engines, and responsive web applications.',
    skills: [
      { name: 'React (18 / 19)', description: 'Hooks, custom state management, performance profiling, and component boundaries', verifiedIn: ['numora', 'oweo', 'insidertracker', 'breakoutscanner', 'stockscreener'] },
      { name: 'Next.js (14 / 15)', description: 'App Router, Server Components, API route handlers, and SSR optimization', verifiedIn: ['codeclash-ai', 'aura-ecommerce'] },
      { name: 'Vite', description: 'High-speed build toolchain, hot module replacement, and production asset optimization', verifiedIn: ['numora', 'oweo', 'insidertracker', 'portfolio'] },
      { name: 'Progressive Web Apps (PWA)', description: 'Service worker lifecycle, offline asset caching, and web app manifests', verifiedIn: ['numora', 'oweo'] },
      { name: 'Tailwind CSS', description: 'Utility-first responsive layouts, design token customization, and dark mode systems', verifiedIn: ['numora', 'oweo', 'insidertracker', 'aura-ecommerce'] },
      { name: 'Three.js / WebGL', description: '3D canvas rendering, camera manipulation, and visual data representations', verifiedIn: ['breakoutscanner', 'numora'] },
      { name: 'Motion (Framer Motion)', description: 'Declarative layout transitions, spring physics, and accessible motion controls', verifiedIn: ['numora', 'portfolio'] }
    ]
  },
  {
    title: 'Backend & Systems',
    description: 'Asynchronous API servers, streaming data protocols, and isolated execution services.',
    skills: [
      { name: 'FastAPI (Python)', description: 'Async RESTful endpoints, Pydantic data validation, and microservice backends', verifiedIn: ['insidertracker', 'codeclash-ai', 'stockscreener'] },
      { name: 'Node.js & Express', description: 'Lightweight API servers, proxy caching, and script automation', verifiedIn: ['breakoutscanner'] },
      { name: 'WebSockets', description: 'Real-time bidirectional event streaming and low-latency client synchronization', verifiedIn: ['stockscreener'] },
      { name: 'RESTful API Design', description: 'Resource modeling, query filtering, pagination, and error contract standards', verifiedIn: ['insidertracker', 'codeclash-ai'] },
      { name: 'Isolated Code Evaluation', description: 'Building secure sandboxed evaluation microservices with execution guardrails', verifiedIn: ['codeclash-ai'] }
    ]
  },
  {
    title: 'Databases & State Management',
    description: 'Data modeling, client state persistence, and real-time backend synchronization.',
    skills: [
      { name: 'SQLite', description: 'Zero-config embedded relational database storage with ACID transactions', verifiedIn: ['bilingsystem', 'aura-ecommerce'] },
      { name: 'Supabase (PostgreSQL)', description: 'Relational schemas, Row Level Security, and Realtime event subscriptions', verifiedIn: ['codeclash-ai'] },
      { name: 'Firebase Firestore', description: 'Document-based cloud database and client-side offline persistence integration', verifiedIn: ['oweo'] },
      { name: 'Zustand v5', description: 'Lightweight client-side state slices with local storage persistence', verifiedIn: ['oweo'] }
    ]
  },
  {
    title: 'AI / ML & Academic Foundations',
    description: 'Coursework and applied exploration in Computer Science & Engineering (AI/ML).',
    skills: [
      { name: 'Data Structures & Algorithms', description: 'Asymptotic complexity analysis (Time & Space), graph traversal, dynamic programming', verifiedIn: ['neetcode-dsa'] },
      { name: 'Machine Learning Concepts', description: 'Supervised/unsupervised algorithms, evaluation metrics, feature representation', verifiedIn: ['academic-coursework'] },
      { name: 'Data Pipeline Engineering', description: 'Government and financial feed ingestion, XML/RSS parsing, and differential snapshot engines', verifiedIn: ['insidertracker', 'stockscreener'] }
    ]
  },
  {
    title: 'Development Tools & DevOps',
    description: 'Professional tooling for version control, testing, automation, and deployment.',
    skills: [
      { name: 'Git & GitHub', description: 'Branching workflows, monorepos, release tags, and automated GitHub Actions CI/CD', verifiedIn: ['all-repositories'] },
      { name: 'Vitest & Testing Library', description: 'Automated unit testing, mock environments, and component integration tests', verifiedIn: ['numora', 'oweo', 'portfolio'] },
      { name: 'Linux / CLI & Shell', description: 'Terminal-first development, environment configuration, and process management', verifiedIn: ['development-workflows'] },
      { name: 'VS Code & Tooling', description: 'Strict TypeScript IDE configuration, linting rules, and debugger workflows', verifiedIn: ['all-projects'] }
    ]
  }
];
