import { Profile } from '@/types/profile';

export const profile: Profile = {
  name: 'Pradyumna',
  title: 'CSE (AI/ML) · Software Developer · Product Builder',
  tagline: 'Crafting thoughtful digital experiences through clean architecture and relentless curiosity.',
  education: {
    degree: 'Bachelor of Technology',
    field: 'Computer Science & Engineering (AI/ML)',
    institution: 'GL Bajaj Institute of Technology & Management',
    location: 'Greater Noida, India',
    period: '2023 — 2027',
    year: '2nd Year',
  },
  currentStatus: 'Open to Software Engineering and AI/ML Internships — actively exploring full-stack architecture, financial data systems, and applied machine learning.',
  fullBio: [
    'I\'m Pradyumna, a B.Tech CSE (AI/ML) student building production-grade applications that bridge academic concepts with real-world engineering challenges.',
    'My work spans offline-first PWAs, real-time financial data pipelines, competitive coding platforms, and numerology engines — each project chosen to deepen a specific engineering discipline rather than simply check a technology box.',
    'What sets me apart: I\'m a World Memory Championship Bronze Medalist (2021), which has fundamentally shaped how I approach software architecture. Pattern recognition, spatial mapping, and systematic recall aren\'t just memory sports techniques — they\'re cognitive tools I apply daily when debugging complex systems, designing data models, and navigating large codebases.',
    'Every project in my portfolio includes a detailed engineering case study documenting the problem space, architectural decisions (with rationale and tradeoffs), challenges encountered, and lessons learned. I believe transparent engineering decisions are more valuable than polished demos.',
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
