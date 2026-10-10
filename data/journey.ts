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
    year: '2023',
    title: 'First Principles',
    subtitle: 'Programming and Memory Athletics',
    description: 'Started with Python fundamentals and competitive memory training simultaneously, building the cognitive foundations that would later inform my approach to software architecture.',
    highlights: [
      'First Python programs: calculators, games, automation scripts',
      'Trained for memory championships, developed spatial memory systems',
      'Discovered the connection between pattern recognition and debugging',
    ],
    badge: { label: 'Origin', variant: 'default' },
  },
  {
    id: 'wmc',
    year: '2023',
    title: 'World Memory Championship',
    subtitle: 'Bronze Medal',
    description: 'Competed at the World Memory Championship and won a Bronze Medal. A discipline that shaped my engineering mindset around systematic pattern recognition, spatial mapping, and optimization under constraints.',
    highlights: [
      'World Memory Championship Bronze Medal (2023)',
      'Developed advanced mnemonic systems: memory palaces, PAO, number systems',
      'Applied memory techniques to learning programming concepts and algorithms',
    ],
    badge: { label: 'Bronze Medal', variant: 'emerald' },
  },
  {
    id: 'systems-phase',
    year: '2023 - 2025',
    title: 'Building Systems',
    subtitle: 'From Concepts to Production',
    description: 'Built a series of production-grade projects spanning desktop software, financial data pipelines, 3D visualization, and PWAs before starting college. Each project targeted a specific engineering discipline.',
    highlights: [
      'Built BilingSystem: Python desktop billing application with SQLite',
      'Built InsiderTracker: SEC EDGAR data pipeline with FastAPI and React',
      'Built Real-Time Stock Screener: WebSocket financial data system',
      'Built BreakoutScanner: 3D stock data visualization with Three.js',
      'Built Oweo: offline-first expense tracking PWA with conflict resolution',
      'Built Numora: numerology PWA with pure TypeScript calculation engine',
      'Built CodeClash AI: 1v1 competitive coding platform with real-time sync',
      'Built AURA: luxury e-commerce storefront with Next.js 15',
    ],
    badge: { label: 'Systems', variant: 'amber' },
  },
  {
    id: 'btech-start',
    year: '2026',
    title: 'B.Tech Begins',
    subtitle: 'GL Bajaj ITM: CSE (AI/ML)',
    description: 'Enrolled in B.Tech Computer Science and Engineering with AI/ML specialization at GL Bajaj Institute of Technology and Management, Greater Noida. Continuing to build production projects alongside coursework.',
    highlights: [
      'Started B.Tech CSE (AI/ML) at GL Bajaj ITM, Greater Noida',
      'Applying practical systems experience to deepen ML and algorithm foundations',
      'Open to software engineering and AI/ML internships',
    ],
    badge: { label: 'Current', variant: 'accent' },
  },
];
