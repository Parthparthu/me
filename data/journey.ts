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
    id: 'first-principles',
    year: '2020',
    title: 'First Principles',
    subtitle: 'Discovering Programming and Memory Athletics',
    description: 'Started with Python fundamentals and competitive memory techniques simultaneously, establishing cognitive foundations that inform my approach to software architecture.',
    highlights: [
      'Built first Python scripts, utilities, and automation tools',
      'Began training for memory championships, developing spatial mapping systems',
      'Identified connections between pattern recognition and system debugging',
    ],
    badge: { label: 'Origin', variant: 'default' },
  },
  {
    id: 'wmc',
    year: '2021 to 2022',
    title: 'World Memory Championship',
    subtitle: 'Bronze Medal and Disciplined Focus',
    description: 'Competed at the World Memory Championship and won a Bronze Medal, an experience that reinforced systematic pattern recognition, spatial mapping, and execution under pressure.',
    highlights: [
      'World Memory Championship Bronze Medal (2021)',
      'Developed structured mnemonic systems (memory palaces, PAO, number systems)',
      'Applied memory techniques to learn programming concepts and algorithms',
      'Maintained structured practice routines for competitive recall',
    ],
    badge: { label: 'Bronze Medal', variant: 'emerald' },
  },
  {
    id: 'btech-start',
    year: '2023',
    title: 'B.Tech Begins',
    subtitle: 'GL Bajaj ITM: CSE (AI/ML)',
    description: 'Enrolled in B.Tech Computer Science and Engineering with an AI/ML specialization, immediately applying theoretical concepts to real software projects.',
    highlights: [
      'Started B.Tech CSE (AI/ML) at GL Bajaj ITM, Greater Noida',
      'Built BilingSystem, a desktop invoicing application with SQLite',
      'Studied core data structures, algorithms, and discrete mathematics',
      'Began systematic problem-solving across core algorithmic patterns',
    ],
    badge: { label: 'B.Tech', variant: 'accent' },
  },
  {
    id: 'fullstack',
    year: '2024',
    title: 'Full-Stack Architecture',
    subtitle: 'Systems and Data Pipelines',
    description: 'Expanded from standalone applications to distributed data systems, focusing on throughput, protocol selection, and real-world performance constraints.',
    highlights: [
      'Built InsiderTracker: SEC EDGAR data pipeline with FastAPI and React',
      'Built Stock Screener: real-time WebSocket market data system',
      'Built BreakoutScanner: 3D data exploration tool with Three.js',
      'Implemented custom API parsers, WebSocket protocols, and data pipelines',
    ],
    badge: { label: 'Systems', variant: 'amber' },
  },
  {
    id: 'flagship',
    year: '2025',
    title: 'Production Applications',
    subtitle: 'Offline-First Systems and Real-Time Platforms',
    description: 'Current focus: building resilient applications emphasizing offline-first persistence, real-time collaboration, and applied machine learning.',
    highlights: [
      'Built Oweo: offline-first expense tracking PWA with IndexedDB and Firestore',
      'Built Numora: numerology PWA with pure TypeScript calculation engine',
      'Built CodeClash AI: 1v1 competitive coding platform prototype',
      'Built AURA: e-commerce storefront with Next.js 15 Server Components',
    ],
    badge: { label: 'Current', variant: 'emerald' },
  },
];
