export interface Skill {
  name: string;
  context: string;
  verifiedIn: string[];
  docUrl: string;
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
      { name: 'Python', context: 'Primary backend and scripts', verifiedIn: ['BilingSystem', 'InsiderTracker', 'StockScreener'], docUrl: 'https://www.python.org/doc/' },
      { name: 'JavaScript', context: 'Web utilities and frontend logic', verifiedIn: ['Numora', 'BreakoutScanner', 'Dentist', 'Countdown'], docUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
      { name: 'HTML5 & CSS3', context: 'Semantic layout and responsive UI', verifiedIn: ['Dentist', 'Numora', 'Oweo'], docUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
      { name: 'C', context: 'Coursework and foundational programming', verifiedIn: ['Academic Coursework'], docUrl: 'https://en.cppreference.com/w/c' },
      { name: 'SQL', context: 'Relational data queries and schemas', verifiedIn: ['BilingSystem', 'AURA'], docUrl: 'https://www.sqlite.org/lang.html' },
    ],
  },
  {
    id: 'frameworks-libraries',
    title: 'Frameworks & Libraries',
    subtitle: 'Applied in client and server projects',
    icon: 'Layout',
    skills: [
      { name: 'React 19', context: 'Component state and PWA interfaces', verifiedIn: ['Numora', 'Oweo', 'InsiderTracker'], docUrl: 'https://react.dev/' },
      { name: 'TypeScript', context: 'Static typing and domain engines', verifiedIn: ['Numora', 'Oweo', 'CodeClash AI'], docUrl: 'https://www.typescriptlang.org/docs/' },
      { name: 'Next.js 15', context: 'Server components and SSR storefronts', verifiedIn: ['AURA', 'CodeClash AI'], docUrl: 'https://nextjs.org/docs' },
      { name: 'Vite', context: 'Client build bundling and tooling', verifiedIn: ['Numora', 'Oweo'], docUrl: 'https://vite.dev/' },
      { name: 'Tailwind CSS', context: 'Utility-first layout and responsive design', verifiedIn: ['AURA', 'CodeClash AI', 'Portfolio'], docUrl: 'https://tailwindcss.com/docs' },
      { name: 'Three.js / R3F', context: 'Interactive 3D geometry and WebGL', verifiedIn: ['Numora', 'BreakoutScanner', 'Portfolio'], docUrl: 'https://threejs.org/docs/' },
      { name: 'Framer Motion', context: 'Declarative component transitions', verifiedIn: ['Numora', 'Oweo', 'Portfolio'], docUrl: 'https://motion.dev/' },
      { name: 'GSAP', context: 'Timeline animation and ticker sync', verifiedIn: ['Portfolio'], docUrl: 'https://gsap.com/docs/' },
      { name: 'Recharts', context: 'Financial data charting', verifiedIn: ['InsiderTracker', 'StockScreener'], docUrl: 'https://recharts.org/' },
    ],
  },
  {
    id: 'backend-systems',
    title: 'Backend & Data Services',
    subtitle: 'APIs, real-time sync, and desktop services',
    icon: 'Server',
    skills: [
      { name: 'FastAPI', context: 'Asynchronous Python REST services', verifiedIn: ['InsiderTracker', 'StockScreener'], docUrl: 'https://fastapi.tiangolo.com/' },
      { name: 'Express / Node.js', context: 'API routing and server handlers', verifiedIn: ['BreakoutScanner'], docUrl: 'https://expressjs.com/' },
      { name: 'WebSockets', context: 'Real-time market feeds and state', verifiedIn: ['StockScreener', 'CodeClash AI'], docUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API' },
      { name: 'Tkinter', context: 'Desktop graphical user interface', verifiedIn: ['BilingSystem'], docUrl: 'https://docs.python.org/3/library/tkinter.html' },
    ],
  },
  {
    id: 'storage-state',
    title: 'Storage & State Architecture',
    subtitle: 'Local databases and client persistence',
    icon: 'Database',
    skills: [
      { name: 'SQLite', context: 'Relational embedded database', verifiedIn: ['BilingSystem', 'AURA'], docUrl: 'https://www.sqlite.org/docs.html' },
      { name: 'IndexedDB', context: 'Browser offline structured storage', verifiedIn: ['Oweo'], docUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API' },
      { name: 'Firebase Firestore', context: 'Cloud sync and document persistence', verifiedIn: ['Oweo'], docUrl: 'https://firebase.google.com/docs/firestore' },
      { name: 'Zustand', context: 'Client-side state management', verifiedIn: ['Oweo', 'StockScreener'], docUrl: 'https://zustand.docs.pmnd.rs/' },
    ],
  },
  {
    id: 'academic-learning',
    title: 'Academic Specialization',
    subtitle: 'Undergraduate CSE (AI/ML) coursework',
    icon: 'Brain',
    skills: [
      { name: 'AI/ML Fundamentals', context: 'Foundational concepts and principles', verifiedIn: ['1st Year B.Tech Studies'], docUrl: 'https://scikit-learn.org/stable/' },
      { name: 'Data Structures & Algorithms', context: 'Problem-solving and algorithmic complexity', verifiedIn: ['NeetCode Practice'], docUrl: 'https://en.wikipedia.org/wiki/Data_structure' },
      { name: 'Linux Basics', context: 'Command-line navigation and shell utilities', verifiedIn: ['Development Environment'], docUrl: 'https://www.kernel.org/doc/html/latest/' },
      { name: 'Cloud & Network Basics', context: 'HTTP protocols, REST, and cloud hosting', verifiedIn: ['Deployment Workflows'], docUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTTP' },
    ],
  },
  {
    id: 'tools-workflow',
    title: 'Tools & Workflow',
    subtitle: 'Development environment and deployment',
    icon: 'Wrench',
    skills: [
      { name: 'Git & GitHub', context: 'Version control, branches, and releases', verifiedIn: ['Public Repositories'], docUrl: 'https://git-scm.com/doc' },
      { name: 'GitHub Actions', context: 'Automated CI/CD build and deploy workflows', verifiedIn: ['Portfolio Deployment'], docUrl: 'https://docs.github.com/en/actions' },
      { name: 'Vitest', context: 'Unit and integration testing', verifiedIn: ['Numora Logic'], docUrl: 'https://vitest.dev/' },
      { name: 'VS Code', context: 'Primary code editor and debugging', verifiedIn: ['All Projects'], docUrl: 'https://code.visualstudio.com/docs' },
    ],
  },
];
