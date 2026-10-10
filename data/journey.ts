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
      'Built over 20 early JavaScript canvas and game mechanics projects (2020)',
    ],
    badge: { label: 'Origins', variant: 'default' },
  },
  {
    id: 'self-directed-exploration',
    year: '2021 - 2023',
    title: 'Self-Directed Python & Web Exploration',
    subtitle: 'Client-Side Tools, Automation, and Countdown Utility',
    description: 'Progressed into self-directed development, building standalone Python scripts, desktop utilities, and early web projects while exploring local data management and client-side web mechanics.',
    highlights: [
      'Developed Countdown utility (July 2022) with custom birthday dictionary and persistent timing',
      'Self-directed Python development: automation scripts, mini-games, and desktop utilities',
      'Explored HTML, CSS, and modern JavaScript client-side DOM mechanics',
    ],
    badge: { label: 'Exploration', variant: 'default' },
  },
  {
    id: 'wmc',
    year: '2023',
    title: 'World Memory Championship',
    subtitle: 'Bronze Medal (Top Amateur)',
    description: 'Competed at the IAM World Memory Championship in Navi Mumbai (November 2023) and earned a Bronze Medal (Top Amateur). The mental athletics discipline (spatial loci, memory palaces, and number mapping) reinforced structured pattern recognition and systematic recall.',
    highlights: [
      'World Memory Championship 2023 Bronze Medalist (Amateur Category)',
      'Trained in mnemonic structures: spatial loci, memory palaces, and number mapping',
      'Applied systematic recall habits to debugging and codebase comprehension',
    ],
    badge: { label: 'Bronze Medal', variant: 'emerald' },
  },
  {
    id: 'production-systems',
    year: '2026',
    title: 'Production Systems & Modern Web Applications',
    subtitle: 'PWAs, Financial Pipelines, Desktop Software, and Algorithmic Practice',
    description: 'Engineered an array of focused software applications spanning mobile-first PWAs, financial data pipelines, desktop billing software with customer loyalty rewards, and algorithmic platforms.',
    highlights: [
      'Engineered Numora: mobile-number analysis PWA with custom TypeScript engine and 3D field',
      'Engineered Oweo: offline-first personal expense tracking PWA with IndexedDB and Firebase',
      'Engineered BilingSystem: Python/Tkinter desktop billing app with SQLite, 18% GST, and customer rewards',
      'Engineered InsiderTracker: SEC EDGAR Form 4 XML data pipeline with FastAPI and React',
      'Engineered StockScreener & BreakoutScanner: WebSocket market screener and 3D stock visualizer',
      'Systematic algorithmic practice: NeetCode DSA solutions in Python and 1v1 battle platform architecture',
    ],
    badge: { label: 'Systems', variant: 'amber' },
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
