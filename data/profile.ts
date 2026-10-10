import { Profile } from '@/types/profile';

export const profile: Profile = {
  name: 'Pradyumna',
  title: 'CSE (AI/ML) student. Full-stack developer. Open to engineering internships.',
  tagline: 'B.Tech CS student building full-stack and AI/ML applications in React, Python, and Next.js. Open to software engineering internships.',
  education: {
    degree: 'Bachelor of Technology',
    field: 'Computer Science & Engineering (AI/ML)',
    institution: 'GL Bajaj Institute of Technology & Management',
    location: 'Greater Noida, India',
    period: '2026 - 2030',
    year: '1st Year',
  },
  currentStatus: 'Fresher, open to Software Engineering and AI/ML internships. Actively building production-grade full-stack, financial data, and applied ML projects.',
  fullBio: [
    'I\'m Pradyumna, a first-year B.Tech CSE (AI/ML) student at GL Bajaj ITM, Greater Noida. I build production-grade applications that bridge academic concepts with real engineering problems.',
    'My projects span offline-first PWAs, real-time financial data pipelines, competitive coding platforms, and numerology engines. Each one is chosen to deepen a specific engineering discipline, not just add a technology to a list.',
    'I\'m a World Memory Championship Bronze Medalist (2023). That experience shaped how I approach software architecture: pattern recognition, spatial mapping, and systematic recall are cognitive tools I apply when debugging complex systems, designing data models, and navigating large codebases.',
    'Every project in this portfolio includes a detailed engineering case study covering the problem, architectural decisions with rationale and tradeoffs, challenges encountered, and lessons learned. Transparent engineering decisions are more valuable than polished demos.',
  ],
  focusAreas: [
    {
      icon: 'Code2',
      label: 'Full-Stack Architecture',
      description: 'React/Next.js, Python/FastAPI, real-time systems, offline-first patterns',
    },
    {
      icon: 'TrendingUp',
      label: 'Financial Data Systems',
      description: 'SEC EDGAR, WebSocket market data, stock screening algorithms',
    },
    {
      icon: 'Brain',
      label: 'AI/ML Engineering',
      description: 'Applied ML, NLP pipelines, computer vision, model optimization',
    },
    {
      icon: 'Trophy',
      label: 'Competitive Problem Solving',
      description: 'Memory athletics, algorithmic challenges, systematic optimization',
    },
  ],
};
