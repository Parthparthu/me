import { SocialLink } from '../types/profile';

const contactEmail = typeof import.meta !== 'undefined' && import.meta.env?.VITE_CONTACT_EMAIL;
const linkedinUrl = typeof import.meta !== 'undefined' && import.meta.env?.VITE_LINKEDIN_URL;

export const socialsData: SocialLink[] = [
  {
    id: 'github',
    platform: 'GitHub',
    url: 'https://github.com/Parthparthu',
    username: 'Parthparthu',
    iconName: 'github',
    isConfigured: true
  },
  ...(linkedinUrl ? [{
    id: 'linkedin',
    platform: 'LinkedIn',
    url: linkedinUrl,
    username: 'Pradyumna',
    iconName: 'linkedin' as const,
    isConfigured: true
  }] : []),
  ...(contactEmail ? [{
    id: 'mail',
    platform: 'Email',
    url: `mailto:${contactEmail}`,
    username: contactEmail,
    iconName: 'mail' as const,
    isConfigured: true
  }] : [])
];

