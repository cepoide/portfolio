import type { TranslationKey } from './translations';

export interface Project {
  id: string;
  category: ('web' | 'apps' | 'design')[];
  image: string;
  images?: string[];
  logo?: string;
  technologies: string[];
  titleKey: TranslationKey;
  descKey: TranslationKey;
  catKey: TranslationKey;
  featured?: boolean;
  liveUrl?: string;
  githubUrl?: string;
}

export const projects: Project[] = [
  {
    id: 'panda_view',
    category: ['apps'],
    image: '/works/panda_view/01.png',
    logo: '/works/panda_view/logo.png',
    featured: true,
    images: [
      '/works/panda_view/logo.png',
      '/works/panda_view/01.png',
      '/works/panda_view/02.png',
      '/works/panda_view/03.png',
      '/works/panda_view/04.png',
      '/works/panda_view/05.png',
      '/works/panda_view/06.png',
      '/works/panda_view/07.png',
      '/works/panda_view/08.png'
    ],
    technologies: ['Tauri', 'React', 'TypeScript', 'SQL Server', 'Recharts', 'Framer Motion', 'Figma'],
    titleKey: 'projPandaTitle',
    descKey: 'projPandaDesc',
    catKey: 'filterApps'
  },
  {
    id: 'launcher_tauri',
    category: ['apps'],
    image: '/works/launcher_tauri/006.png',
    technologies: ['Tauri', 'Rust', 'React', 'TypeScript', 'Tailwind CSS', 'Figma'],
    titleKey: 'projLauncherTitle',
    descKey: 'projLauncherDesc',
    catKey: 'filterApps'
  },
  {
    id: 'elisa_online',
    category: ['web'],
    image: '/works/elisa_online/002.png',
    technologies: ['PHP', 'HTML5', 'CSS3', 'SQL Server', 'JavaScript', 'Figma'],
    titleKey: 'projElisaTitle',
    descKey: 'projElisaDesc',
    catKey: 'filterWeb',
    liveUrl: 'https://muelisa.com/'
  },
  {
    id: 'maharlika_mu',
    category: ['web'],
    image: '/works/maharlika_mu/001.png',
    technologies: ['PHP', 'HTML5', 'CSS3', 'MySQL', 'JavaScript', 'Figma', 'SQL Server'],
    titleKey: 'projMaharlikaTitle',
    descKey: 'projMaharlikaDesc',
    catKey: 'filterWeb',
    liveUrl: 'https://maharlikamu.com/'
  },
  {
    id: 'mu_classic',
    category: ['web'],
    image: '/works/mu_classic/005.png',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Figma', 'SQL Server'],
    titleKey: 'projClassicTitle',
    descKey: 'projClassicDesc',
    catKey: 'filterWeb'
  },
  {
    id: 'scasso',
    category: ['web'],
    image: '/works/scasso/007.png',
    technologies: ['PHP', 'WebEngine', 'CSS3', 'MySQL', 'JavaScript', 'Figma', 'SQL Server'],
    titleKey: 'projScassoTitle',
    descKey: 'projScassoDesc',
    catKey: 'filterWeb'
  },
  {
    id: 'diabloii',
    category: ['web'],
    image: '/works/diabloii/008.png',
    technologies: ['HTML5', 'Retro CSS3', 'JavaScript', 'Multimedia Archiving', 'Figma'],
    titleKey: 'projDiabloTitle',
    descKey: 'projDiabloDesc',
    catKey: 'filterWeb',
    githubUrl: 'https://github.com/cepoide/Diablo-II-HTML5'
  },
  {
    id: 'cepoidevs',
    category: ['web', 'design'],
    image: '/works/cepoidevs/004.png',
    technologies: ['HTML5', 'CSS', 'JavaScript', 'Figma'],
    titleKey: 'projIn33rTitle',
    descKey: 'projIn33rDesc',
    catKey: 'filterWeb',
    githubUrl: 'https://github.com/cepoide/cepoide.github.io'
  },
  {
    id: 'black_mountain',
    category: ['web'],
    image: '/works/black_mountain/003.png',
    technologies: ['PHP', 'HTML5', 'Tailwind CSS', 'JavaScript', 'Responsive Grid', 'Photoshop', 'Figma', 'Illustrator', 'SQL Server'],
    titleKey: 'projBlackTitle',
    descKey: 'projBlackDesc',
    catKey: 'filterWeb'
  }
];
