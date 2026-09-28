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
    subtitle: 'Discovering Programming & Memory Athletics',
    description: 'Started with Python fundamentals and competitive memory techniques simultaneously — building the cognitive foundations that would later inform my approach to software architecture.',
    highlights: [
      'First Python programs — calculators, games, automation scripts',
      'Began training for memory championships — developed spatial memory systems',
      'Discovered the connection between pattern recognition and debugging',
    ],
    badge: { label: 'Origin', variant: 'default' },
  },
  {
    id: 'wmc',
    year: '2021-2022',
    title: 'World Memory Championship',
    subtitle: 'Bronze Medal & Cognitive Engineering',
    description: 'Competed at the World Memory Championship and won a Bronze Medal — a discipline that fundamentally shaped my engineering mindset around systematic pattern recognition, spatial mapping, and optimization under constraints.',
    highlights: [
      'World Memory Championship Bronze Medal (2021)',
      'Developed advanced mnemonic systems — memory palaces, PAO, number systems',
      'Applied memory techniques to learning programming concepts and algorithms',
      'Built discipline of systematic practice — 4+ hours daily structured training',
    ],
    badge: { label: 'Bronze Medal', variant: 'emerald' },
  },
  {
    id: 'btech-start',
    year: '2023',
    title: 'B.Tech Begins',
    subtitle: 'GL Bajaj ITM — CSE (AI/ML)',
    description: 'Enrolled in B.Tech Computer Science & Engineering with AI/ML specialization. Immediately began applying theoretical concepts to real projects rather than waiting for curriculum progression.',
    highlights: [
      'Started B.Tech CSE (AI/ML) at GL Bajaj ITM, Greater Noida',
      'Built BilingSystem — first production Python desktop application',
      'Deep dive into data structures, algorithms, and mathematical foundations',
      'Began NeetCode 150 systematic problem-solving journey',
    ],
    badge: { label: 'B.Tech', variant: 'accent' },
  },
  {
    id: 'fullstack',
    year: '2024',
    title: 'Full-Stack Architecture',
    subtitle: 'From Concepts to Production Systems',
    description: 'Transitioned from learning individual technologies to designing complete systems — focusing on architecture, performance, and real-world constraints.',
    highlights: [
      'Built InsiderTracker — SEC EDGAR data pipeline with FastAPI + React',
      'Built Stock Screener — real-time WebSocket financial data system',
      'Built BreakoutScanner — 3D data visualization with Three.js',
      'Developed expertise in API design, WebSocket protocols, and data pipelines',
    ],
    badge: { label: 'Systems', variant: 'amber' },
  },
  {
    id: 'flagship',
    year: '2025',
    title: 'Flagship Work',
    subtitle: 'Production-Grade Applications',
    description: 'Current phase — building production-grade applications with focus on offline-first patterns, competitive platforms, and applied AI/ML integration.',
    highlights: [
      'Built Oweo — offline-first expense tracking PWA with conflict resolution',
      'Built Numora — numerology PWA with pure TypeScript calculation engine',
      'Built CodeClash AI — 1v1 competitive coding platform with real-time sync',
      'Built AURA — luxury e-commerce storefront with Next.js 15',
      'Portfolio redesign with Three.js, GSAP, and Framer Motion',
    ],
    badge: { label: 'Current', variant: 'emerald' },
  },
];
