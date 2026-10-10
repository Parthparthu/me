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
    title: 'World Memory Championship: Bronze Medal',
    description: 'Competed at the World Memory Championship and won a Bronze Medal in 2023. Disciplines included Speed Numbers, Speed Cards, Random Words, Binary Digits, Historic Dates, Abstract Images, Names and Faces, and Spoken Numbers. The training built systematic pattern recognition and spatial memory skills that directly transfer to software architecture and debugging.',
    year: '2023',
    highlight: true,
    category: 'Competitive',
    details: 'Disciplines: Speed Numbers, Speed Cards, Random Words, Binary Digits, Historic Dates, Abstract Images, Names and Faces, Spoken Numbers',
  },
  {
    id: 'btech-scholar',
    icon: 'GraduationCap',
    title: 'B.Tech Scholar: CSE (AI/ML)',
    description: 'Pursuing B.Tech in Computer Science and Engineering with specialization in Artificial Intelligence and Machine Learning at GL Bajaj Institute of Technology and Management, Greater Noida.',
    year: '2026-Present',
    highlight: false,
    category: 'Academic',
  },
  {
    id: 'github-portfolio',
    icon: 'Github',
    title: 'Open Source Developer',
    description: 'Active GitHub contributor with public repositories spanning full-stack applications, financial data systems, PWAs, and algorithmic problem-solving. All projects linked with engineering case studies.',
    year: '2023-Present',
    highlight: false,
    category: 'Open Source',
  },
];
