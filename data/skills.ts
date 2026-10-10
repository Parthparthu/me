export interface Skill {
  name: string;
  context: string;
  verifiedIn: string[];
}

export interface SkillCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'languages',
    title: 'Languages',
    subtitle: 'Self-reported and implemented in codebases',
    icon: 'Terminal',
    skills: [
      { name: 'Python', context: 'Primary backend and scripts', verifiedIn: ['BilingSystem', 'InsiderTracker', 'StockScreener'] },
      { name: 'JavaScript', context: 'Web utilities and frontend logic', verifiedIn: ['Numora', 'BreakoutScanner', 'Dentist', 'Countdown'] },
      { name: 'HTML5 & CSS3', context: 'Semantic layout and responsive UI', verifiedIn: ['Dentist', 'Numora', 'Oweo'] },
      { name: 'C', context: 'Coursework and foundational programming', verifiedIn: ['Academic Coursework'] },
      { name: 'SQL', context: 'Relational data queries and schemas', verifiedIn: ['BilingSystem', 'AURA'] },
    ],
  },
  {
    id: 'frameworks-libraries',
    title: 'Frameworks & Libraries',
    subtitle: 'Applied in client and server projects',
    icon: 'Layout',
    skills: [
      { name: 'React 19', context: 'Component state and PWA interfaces', verifiedIn: ['Numora', 'Oweo', 'InsiderTracker'] },
      { name: 'TypeScript', context: 'Static typing and domain engines', verifiedIn: ['Numora', 'Oweo', 'CodeClash AI'] },
      { name: 'Next.js 15', context: 'Server components and SSR storefronts', verifiedIn: ['AURA', 'CodeClash AI'] },
      { name: 'Vite', context: 'Client build bundling and tooling', verifiedIn: ['Numora', 'Oweo'] },
      { name: 'Tailwind CSS', context: 'Utility-first layout and responsive design', verifiedIn: ['AURA', 'CodeClash AI', 'Portfolio'] },
      { name: 'Three.js / R3F', context: 'Interactive 3D geometry and WebGL', verifiedIn: ['Numora', 'BreakoutScanner', 'Portfolio'] },
      { name: 'Framer Motion', context: 'Declarative component transitions', verifiedIn: ['Numora', 'Oweo', 'Portfolio'] },
      { name: 'GSAP', context: 'Timeline animation and ticker sync', verifiedIn: ['Portfolio'] },
      { name: 'Recharts', context: 'Financial data charting', verifiedIn: ['InsiderTracker', 'StockScreener'] },
    ],
  },
  {
    id: 'backend-systems',
    title: 'Backend & Data Services',
    subtitle: 'APIs, real-time sync, and desktop services',
    icon: 'Server',
    skills: [
      { name: 'FastAPI', context: 'Asynchronous Python REST services', verifiedIn: ['InsiderTracker', 'StockScreener'] },
      { name: 'Express / Node.js', context: 'API routing and server handlers', verifiedIn: ['BreakoutScanner'] },
      { name: 'WebSockets', context: 'Real-time market feeds and state', verifiedIn: ['StockScreener', 'CodeClash AI'] },
      { name: 'Tkinter', context: 'Desktop graphical user interface', verifiedIn: ['BilingSystem'] },
    ],
  },
  {
    id: 'storage-state',
    title: 'Storage & State Architecture',
    subtitle: 'Local databases and client persistence',
    icon: 'Database',
    skills: [
      { name: 'SQLite', context: 'Relational embedded database', verifiedIn: ['BilingSystem', 'AURA'] },
      { name: 'IndexedDB', context: 'Browser offline structured storage', verifiedIn: ['Oweo'] },
      { name: 'Firebase Firestore', context: 'Cloud sync and document persistence', verifiedIn: ['Oweo'] },
      { name: 'Zustand', context: 'Client-side state management', verifiedIn: ['Oweo', 'StockScreener'] },
    ],
  },
  {
    id: 'academic-learning',
    title: 'Academic Specialization',
    subtitle: 'Undergraduate CSE (AI/ML) coursework',
    icon: 'Brain',
    skills: [
      { name: 'AI/ML Fundamentals', context: 'Foundational concepts and principles', verifiedIn: ['1st Year B.Tech Studies'] },
      { name: 'Data Structures & Algorithms', context: 'Problem-solving and algorithmic complexity', verifiedIn: ['NeetCode Practice'] },
      { name: 'Linux Basics', context: 'Command-line navigation and shell utilities', verifiedIn: ['Development Environment'] },
      { name: 'Cloud & Network Basics', context: 'HTTP protocols, REST, and cloud hosting', verifiedIn: ['Deployment Workflows'] },
    ],
  },
  {
    id: 'tools-workflow',
    title: 'Tools & Workflow',
    subtitle: 'Development environment and deployment',
    icon: 'Wrench',
    skills: [
      { name: 'Git & GitHub', context: 'Version control, branches, and releases', verifiedIn: ['Public Repositories'] },
      { name: 'GitHub Actions', context: 'Automated CI/CD build and deploy workflows', verifiedIn: ['Portfolio Deployment'] },
      { name: 'Vitest', context: 'Unit and integration testing', verifiedIn: ['Numora Logic'] },
      { name: 'VS Code', context: 'Primary code editor and debugging', verifiedIn: ['All Projects'] },
    ],
  },
];
