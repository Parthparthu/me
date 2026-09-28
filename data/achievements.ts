export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  year: string;
  highlight: boolean;
  category: string;
  details?: string;
}

export const achievements: Achievement[] = [
  {
    id: 'wmc-bronze',
    icon: 'Trophy',
    title: 'World Memory Championship — Bronze Medal',
    description: 'Competed at the World Memory Championship and won a Bronze Medal, demonstrating elite-level pattern recognition, spatial memory mapping, and performance under competitive pressure — cognitive skills directly transferable to software architecture and debugging.',
    year: '2021',
    highlight: true,
    category: 'Competitive',
    details: 'Disciplines included: Speed Numbers, Speed Cards, Random Words, Binary Digits, Historic Dates, Abstract Images, Names & Faces, Spoken Numbers',
  },
  {
    id: 'btech-scholar',
    icon: 'GraduationCap',
    title: 'B.Tech Scholar — CSE (AI/ML)',
    description: 'Pursuing B.Tech in Computer Science & Engineering with specialization in Artificial Intelligence and Machine Learning at GL Bajaj Institute of Technology & Management.',
    year: '2023-Present',
    highlight: false,
    category: 'Academic',
  },
  {
    id: 'github-portfolio',
    icon: 'Github',
    title: '52+ Public Repositories',
    description: 'Active open-source contributor with 52+ public repositories spanning full-stack applications, financial data systems, PWAs, and algorithmic problem-solving.',
    year: '2020-Present',
    highlight: false,
    category: 'Open Source',
  },
];
