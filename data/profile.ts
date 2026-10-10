import { Profile } from '@/types/profile';

export const profile: Profile = {
  name: 'Pradyuma',
  title: 'CSE (AI/ML) student at GL Bajaj ITM. Software and web application developer.',
  tagline: 'Computer Science and Engineering (AI/ML) student with approximately five years of self-directed coding experience, building practical web applications, data tools, and systems.',
  education: {
    degree: 'Bachelor of Technology',
    field: 'Computer Science and Engineering (AI/ML)',
    institution: 'GL Bajaj Institute of Technology & Management',
    location: 'Greater Noida, Uttar Pradesh, India',
    period: '2026 - 2030',
    year: '1st Year (Expected Graduation: 2030)',
  },
  currentStatus: 'First-year B.Tech student open to software development and web internships. Preferred locations: Greater Noida, Noida, Delhi NCR, and Remote.',
  fullBio: [
    'I am Pradyuma, a first-year Computer Science and Engineering (AI/ML) student at GL Bajaj Institute of Technology & Management, Greater Noida (expected graduation 2030). With approximately five years of self-directed coding background, I focus on turning technical concepts into usable, functional applications.',
    'My public repositories span client-side PWAs, financial data pipelines, desktop software, and data visualization tools. Rather than chasing superficial breadth, each project serves as a focused investigation into a specific engineering problem: offline data persistence, real-time streaming, or structured data parsing.',
    'I competed in the World Memory Championship and earned a Bronze Medal in 2023. The discipline of mental athletics: spatial mapping, structured pattern recognition, and systematic recall: strongly informs how I navigate large codebases, design data schemas, and troubleshoot software errors.',
    'I am currently exploring software development internships across Greater Noida, Noida, Delhi NCR, and remote settings. This portfolio documents my actual codebase implementations with transparent case studies detailing technical decisions, tradeoffs, and current limitations.',
  ],
  focusAreas: [
    {
      icon: 'Code2',
      label: 'Software & Web Applications',
      description: 'Python, TypeScript, React, Next.js, FastAPI, and progressive web application development',
    },
    {
      icon: 'TrendingUp',
      label: 'Financial Data Tools',
      description: 'SEC EDGAR data parsing, market data pipelines, and interactive financial dashboards',
    },
    {
      icon: 'Brain',
      label: 'Academic AI/ML Specialization',
      description: 'Foundational coursework in algorithms, data structures, and machine learning principles',
    },
    {
      icon: 'Trophy',
      label: 'Systematic Problem Solving',
      description: 'Algorithmic practice, memory discipline, and structured analytical debugging',
    },
  ],
};
