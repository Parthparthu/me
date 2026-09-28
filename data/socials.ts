export interface SocialLink {
  id: string;
  platform: string;
  icon: string;
  url: string;
  label: string;
  show: boolean;
}

export const socials: SocialLink[] = [
  {
    id: 'github',
    platform: 'GitHub',
    icon: 'Github',
    url: 'https://github.com/Parthparthu',
    label: '@Parthparthu',
    show: true,
  },
  {
    id: 'linkedin',
    platform: 'LinkedIn',
    icon: 'Linkedin',
    url: 'https://linkedin.com/in/pradyumna',
    label: 'Pradyumna',
    show: true,
  },
  {
    id: 'email',
    platform: 'Email',
    icon: 'Mail',
    url: 'mailto:pradyumna@example.com',
    label: 'pradyumna@example.com',
    show: true,
  },
];
