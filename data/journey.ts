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
    id: 'whitehat-foundations',
    year: '2019 - 2021',
    title: 'Coding Foundations & WhiteHat Jr',
    subtitle: 'Algorithmic Logic, App Architecture, and Game Mechanics',
    description: 'Began programming journey in 2019 through structured foundational curriculum with WhiteHat Jr, completing rigorous modules in core algorithmic thinking, UI/UX interface design, and mobile application development. Verified by official certifications awarded near the conclusion of the curriculum in 2020.',
    highlights: [
      'Started programming journey in 2019 through WhiteHat Jr structured curriculum',
      'Earned Certified Android & iOS App Developer credential in 2020',
      'Earned Certified Game Developer credential and Logic Championship honors in 2020',
      'Established foundational discipline in algorithmic logic and modular code structure',
    ],
    badge: { label: 'Origins', variant: 'default' },
  },
  {
    id: 'self-directed-exploration',
    year: '2021 - 2023',
    title: 'Self-Directed Python & Web Exploration',
    subtitle: 'Automation, Scripting, and Client-Side Mechanics',
    description: 'Progressed into self-directed development, building standalone Python scripts, desktop utilities, and early web projects while exploring local data management and client-side web mechanics.',
    highlights: [
      'Self-directed Python development: scripts, calculators, and desktop experiments',
      'Explored HTML, CSS, and modern JavaScript client-side mechanics',
      'Cultivated habits of independent investigation, debugging, and continuous practice',
    ],
    badge: { label: 'Exploration', variant: 'default' },
  },
  {
    id: 'wmc',
    year: '2023',
    title: 'World Memory Championship',
    subtitle: 'Bronze Medal (Top Amateur)',
    description: 'Competed at the IAM World Memory Championship in Navi Mumbai and earned a Bronze Medal (Top Amateur). The mental athletics discipline: spatial loci, memory palaces, and number mapping: reinforced structured pattern recognition and systematic recall.',
    highlights: [
      'World Memory Championship 2023 Bronze Medalist (Amateur Category)',
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
