import { Profile } from '@/types/profile';

export const profile: Profile = {
  name: 'Pradyumna',
  title: 'CSE (AI/ML) student at GL Bajaj ITM. Software and web application developer.',
  tagline: 'Computer Science and Engineering (AI/ML) student programming since 2019, building practical web applications, data tools, and systems.',
  education: {
    degree: 'Bachelor of Technology',
    field: 'Computer Science and Engineering (AI/ML)',
    institution: 'GL Bajaj Institute of Technology & Management',
    location: 'Greater Noida, Uttar Pradesh, India',
    period: '2026 - 2030',
    year: '1st Year (Expected Graduation: 2030)',
  },
  currentStatus: 'First-year B.Tech student open to software development and web internships across Greater Noida, Noida, Delhi NCR, and remote settings.',
  fullBio: [
    'I am Pradyumna, a first-year Computer Science and Engineering (AI/ML) student at GL Bajaj Institute of Technology & Management, Greater Noida (expected graduation 2030). My programming journey began in 2019 through structured foundational curriculum at WhiteHat Jr, completing tracks in algorithmic thinking, game logic, UI/UX interface architecture, and mobile application development before progressing into self-directed systems engineering.',
    'My public repositories span client-side PWAs, financial data pipelines, desktop software, and data visualization tools. Each project serves as a focused investigation into a specific engineering problem, such as offline data persistence, real-time streaming, or structured data parsing.',
    'I competed in the World Memory Championship and earned a Bronze Medal in 2023. The discipline of mental athletics through spatial mapping, structured pattern recognition, and systematic recall directly informs how I navigate large codebases, design data schemas, and troubleshoot software errors.',
    'I am currently exploring software development internships across Greater Noida, Noida, Delhi NCR, and remote settings. This portfolio documents my actual codebase implementations with transparent case studies detailing technical decisions, tradeoffs, and current limitations.',
  ],
  focusAreas: [
    {
      icon: 'Code2',
      label: 'Web & Full-Stack Applications',
      description: 'Building responsive web applications and PWAs using TypeScript, React, Next.js, and Python with local persistence and accessible UI architecture.',
      technologies: ['TypeScript', 'Next.js', 'React', 'Tailwind CSS', 'Python'],
    },
    {
      icon: 'Layers',
      label: 'Interactive 3D & Graphics',
      description: 'Constructing performant WebGL and React Three Fiber environments with single-canvas architecture, custom shaders, and graceful static fallbacks.',
      technologies: ['Three.js', 'React Three Fiber', 'GLSL', 'WebGL'],
    },
    {
      icon: 'TrendingUp',
      label: 'Financial Data & Systems',
      description: 'Engineering desktop and web utilities for market metrics, SEC EDGAR filing parsing, and real-time transaction tracking with structured schemas.',
      technologies: ['Python', 'FastAPI', 'SQLite', 'IndexedDB', 'Data Modeling'],
    },
    {
      icon: 'Trophy',
      label: 'Systematic Problem Solving',
      description: 'Applying spatial indexing and mnemonic discipline from competitive mental athletics (WMC 2023 Bronze Medal) to algorithms and system architecture.',
      technologies: ['Algorithms', 'Data Structures', 'Spatial Mapping', 'Debugging'],
    },
  ],
};
