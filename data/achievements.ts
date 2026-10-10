import { getAssetPath } from '@/lib/utils';

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  year: string;
  highlight: boolean;
  category: string;
  details?: string;
  image?: string;
}

export interface VerifiedCertificate {
  id: string;
  title: string;
  issuer: string;
  year: string;
  date?: string;
  category: 'Competition' | 'Certification' | 'Academic';
  description: string;
  imagePreview: string;
  documentUrl: string;
  recipient: string;
}

export const achievements: Achievement[] = [
  {
    id: 'wmc-bronze',
    icon: 'Trophy',
    title: 'World Memory Championship: Bronze Medal',
    description: 'Awarded Bronze Medal and Top Amateur Certificate of Achievement at the International Association of Memory (IAM) World Memory Championship 2023, held at Cidco Exhibition Centre, Navi Mumbai, India (25th to 26th November 2023). Verified by official medal and arbiters certificate.',
    year: '2023',
    highlight: true,
    category: 'Competitive',
    details: 'Sanctioned by IAM & Brain Infinite. Arbiters: Charifa Souissi (IAM Chief Arbiter), Corinna Draschl (WMC Main Arbiter), Amrut Jadhav (Founder Brain Infinite).',
    image: getAssetPath('/certificates/wmc-2023-bronze-medal.jpg'),
  },
  {
    id: 'btech-scholar',
    icon: 'GraduationCap',
    title: 'B.Tech Student: CSE (AI/ML)',
    description: 'Enrolled in B.Tech Computer Science and Engineering (AI/ML) at GL Bajaj Institute of Technology & Management, Greater Noida (2026 - 2030). Currently a first-year student with no semester examinations conducted yet.',
    year: '2026 - 2030',
    highlight: false,
    category: 'Academic',
    details: 'First-year student; university examinations pending as per academic schedule.',
  },
  {
    id: 'github-portfolio',
    icon: 'Github',
    title: 'Open Source Software Development',
    description: 'Creator of public repositories spanning client-side PWAs, financial data tools, desktop utilities, and algorithmic problem-solving. Each project is documented with honest technical case studies.',
    year: '2023 - Present',
    highlight: false,
    category: 'Open Source',
  },
];

export const verifiedCertificates: VerifiedCertificate[] = [
  {
    id: 'wmc-2023',
    title: 'IAM World Memory Championship 2023: Top Amateur & Bronze Medal',
    issuer: 'International Association of Memory (IAM) & Brain Infinite',
    year: '2023',
    date: '25th - 26th November 2023',
    category: 'Competition',
    description: 'Top Amateur Certificate of Achievement and Bronze Medal in the Amateur Category at Cidco Exhibition Centre, Navi Mumbai, India.',
    imagePreview: getAssetPath('/certificates/wmc-2023-bronze-medal.jpg'),
    documentUrl: getAssetPath('/certificates/wmc-2023-bronze-medal.jpg'),
    recipient: 'Pradyumna Singh',
  },
  {
    id: 'generative-ai',
    title: 'Generative AI Mastermind',
    issuer: 'Outskill',
    year: '2024',
    category: 'Certification',
    description: 'Certificate of Completion for successfully completing the Generative AI Mastermind curriculum, awarded by Founder Vaibhav Sisinty.',
    imagePreview: getAssetPath('/certificates/generative-ai-outskill.png'),
    documentUrl: getAssetPath('/certificates/generative-ai-outskill.pdf'),
    recipient: 'Pradyumna Singh',
  },
  {
    id: 'certified-app-dev',
    title: 'Certified Android and iOS App Developer',
    issuer: 'WhiteHat Jr',
    year: '2020',
    category: 'Certification',
    description: 'Certificate of Appreciation for exceptional performance in Core Programming, Design Thinking, and Advanced Application Development.',
    imagePreview: getAssetPath('/certificates/certified-app-developer-2020.png'),
    documentUrl: getAssetPath('/certificates/certified-app-developer-2020.pdf'),
    recipient: 'Pradyumna',
  },
  {
    id: 'certified-game-dev',
    title: 'Certified Game Developer',
    issuer: 'WhiteHat Jr',
    year: '2020',
    category: 'Certification',
    description: 'Certified Game Developer credential awarded for game development with deep UI/UX interface architecture.',
    imagePreview: getAssetPath('/certificates/certified-game-developer-2020.png'),
    documentUrl: getAssetPath('/certificates/certified-game-developer-2020.pdf'),
    recipient: 'Pradyumna',
  },
  {
    id: 'logic-coding-champ',
    title: 'Kids Logic & Coding Championship',
    issuer: 'WhiteHat Jr',
    year: '2020',
    category: 'Competition',
    description: 'Certificate of Participation in the global Kids Logic & Coding Championship.',
    imagePreview: getAssetPath('/certificates/logic-coding-championship-2020.png'),
    documentUrl: getAssetPath('/certificates/logic-coding-championship-2020.pdf'),
    recipient: 'Pradyumna',
  },
  {
    id: 'intro-coding',
    title: 'Introduction to Coding: Learn2Code',
    issuer: 'RoboGarden & Eupheus Learning',
    year: '2020',
    category: 'Certification',
    description: 'Certificate of Completion for completing the introductory programming course under the Learn2Code program.',
    imagePreview: getAssetPath('/certificates/intro-coding-eupheus.png'),
    documentUrl: getAssetPath('/certificates/intro-coding-eupheus.pdf'),
    recipient: 'Singh Pradyumna',
  },
  {
    id: 'nso-olympiad',
    title: 'SOF National Science Olympiad (NSO)',
    issuer: 'Science Olympiad Foundation (SOF)',
    year: '2019',
    date: 'November 2019',
    category: 'Academic',
    description: '1st level SOF National Science Olympiad Certificate of Participation representing Apeejay International School, Greater Noida.',
    imagePreview: getAssetPath('/certificates/nso-science-olympiad-2019.png'),
    documentUrl: getAssetPath('/certificates/nso-science-olympiad-2019.pdf'),
    recipient: 'Pradyumna Singh',
  },
];

