export interface Milestone {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  badge?: {
    label: string;
    variant: 'default' | 'accent' | 'emerald' | 'amber';
  };
}

export const milestones: Milestone[] = [
  {
    id: 'coding-foundations',
    year: '2021 - 2023',
    title: 'Self-Directed Coding Foundations',
    subtitle: 'Python, Web Basics, and Logic',
    description: 'Began programming with self-directed study, starting with Python scripts, basic web tools, and algorithmic logic. Built an early curiosity about software architecture and automated utilities.',
    highlights: [
      'Self-directed Python development: scripts, calculators, and desktop experiments',
      'Explored HTML, CSS, and basic JavaScript client-side mechanics',
      'Built a foundational discipline around algorithmic problem-solving',
    ],
    badge: { label: 'Foundations', variant: 'default' },
  },
  {
    id: 'wmc',
    year: '2023',
    title: 'World Memory Championship',
    subtitle: 'Bronze Medal',
    description: 'Competed at the World Memory Championship and earned a Bronze Medal. The rigorous mental training reinforced structured pattern recognition, spatial organization, and information recall.',
    highlights: [
      'Self-reported World Memory Championship Bronze Medal (2023)',
      'Trained in mnemonic structures: spatial loci, memory palaces, and number mapping',
      'Applied systematic recall habits to debugging and codebase comprehension',
    ],
    badge: { label: 'Bronze Medal', variant: 'emerald' },
  },
  {
    id: 'project-development',
    year: '2023 - 2025',
    title: 'Practical Project Development',
    subtitle: 'Desktop Tools, PWAs, and Data Pipelines',
    description: 'Constructed an array of focused software applications across different domains before entering university, exploring local persistence, real-time communication, and data parsing.',
    highlights: [
      'Engineered BilingSystem: Python desktop billing app with SQLite and 18% GST',
      'Engineered Numora: mobile-number analysis PWA with custom TypeScript engine',
      'Engineered Oweo: offline-first personal expense tracking PWA with IndexedDB',
      'Engineered InsiderTracker: SEC EDGAR Form 4 XML data pipeline with FastAPI',
      'Engineered StockScreener: WebSocket real-time financial data dashboard',
      'Engineered BreakoutScanner: 3D stock data visualization with Three.js',
    ],
    badge: { label: 'Projects', variant: 'amber' },
  },
  {
    id: 'btech-studies',
    year: '2026 - 2030',
    title: 'B.Tech in CSE (AI/ML)',
    subtitle: 'GL Bajaj ITM, Greater Noida',
    description: 'Enrolled in the B.Tech Computer Science and Engineering program specializing in Artificial Intelligence and Machine Learning at GL Bajaj Institute of Technology & Management. Currently in first year with graduation anticipated in 2030.',
    highlights: [
      'First-year undergraduate (no semester examination results conducted yet)',
      'Deepening theoretical foundations in algorithms, mathematics, and systems',
      'Seeking software engineering and web internships (Noida, Greater Noida, Delhi NCR, Remote)',
    ],
    badge: { label: 'Current', variant: 'accent' },
  },
];
