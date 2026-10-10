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
    url: 'https://www.linkedin.com/in/pradyumna05',
    label: 'pradyumna05',
    show: true,
  },
  {
    id: 'instagram',
    platform: 'Instagram',
    icon: 'Instagram',
    url: 'https://www.instagram.com/pradyumna_in_/',
    label: '@pradyumna_in_',
    show: true,
  },
  {
    id: 'email',
    platform: 'Email',
    icon: 'Mail',
    url: 'mailto:pradyumna05@outlook.in',
    label: 'pradyumna05@outlook.in',
    show: true,
  },
];
