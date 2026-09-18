export interface SocialLink {
  label: string
  url: string
  icon: string
}

export interface Project {
  title: string
  category?: string
  description: string
  tags: string[]
  liveUrl?: string
  repoUrl?: string
}

export interface Experience {
  company: string
  role: string
  period: string
  description: string
}

export interface SkillLevel {
  name: string
  /** 0-100, shown as a power meter. */
  level: number
}

export interface PortfolioConfig {
  name: string
  title: string
  tagline: string
  about: string
  avatarUrl: string
  email: string
  socials: SocialLink[]
  skills: string[]
  skillLevels: SkillLevel[]
  projects: Project[]
  experience: Experience[]
}

const config: PortfolioConfig = {
  name: 'Ariel Plascencia',
  title: 'Full-Stack Developer',
  tagline: 'I build fast, beautiful, and accessible web experiences.',
  about:
    "Hi! I'm a passionate developer with experience building modern web applications. " +
    'I love working with TypeScript, React, and Node.js, and I care deeply about clean code, ' +
    'great UX, and developer experience.',
  avatarUrl: 'https://avatars.githubusercontent.com/u/583231?v=4',
  email: 'imariel2d@gmail.com',

  socials: [
    { label: 'GitHub', url: 'https://github.com/arielplas', icon: 'github' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/arielplascencia/', icon: 'linkedin' },
    {
      label: 'Resume',
      url: 'https://drive.google.com/file/d/1Zth_nmEYDz8W-9REuYUNZSF7hlCX6dt-/view?usp=sharing',
      icon: 'resume',
    },
  ],

  skills: [
    'TypeScript',
    'React',
    'Node.js',
    'Next.js',
    'Tailwind CSS',
    'PostgreSQL',
    'Docker',
    'Git',
  ],

  skillLevels: [
    { name: 'TypeScript', level: 95 },
    { name: 'React / Next.js', level: 95 },
    { name: 'Node.js', level: 88 },
    { name: 'AI-assisted tooling', level: 90 },
    { name: 'Tailwind CSS', level: 92 },
    { name: 'PostgreSQL', level: 78 },
    { name: 'Docker', level: 72 },
    { name: 'CI/CD & Testing', level: 85 },
  ],

  projects: [
    {
      title: 'Centavos',
      category: 'My Projects',
      description: 'Budgeting app to help people track their money and take control of their finances.',
      tags: ['Fintech', 'Budgeting', 'Web App'],
      liveUrl: 'https://centavos.mx/',
    },
    {
      title: 'Duckstore',
      category: 'My Projects',
      description: 'Online shopping project.',
      tags: ['E-commerce', 'Social Commerce'],
      liveUrl: 'https://www.instagram.com/duckstore.mx/',
    },
    {
      title: 'Chess Analysis',
      category: 'My Projects',
      description:
        'A fully offline chess analysis assistant with a desktop UI. Enter moves by dragging pieces, typing (natural language or algebraic), or speaking them — the app tracks the position, shows an eval bar, and tells you Stockfish\'s best move on screen and, optionally, out loud.',
      tags: ['Chess', 'Stockfish', 'Desktop App', 'Offline'],
      repoUrl: 'https://github.com/imariel2d/chess-analysis',
    },
    {
      title: 'Culto Perro Cafe',
      category: 'Tepache Projects',
      description:
        'Worked as a project manager to help lead the development of this coffee shop website.',
      tags: ['Project Management', 'E-commerce', 'Team Leadership'],
      liveUrl: 'https://www.perro.cafe/',
    },
    {
      title: 'Dolar en Bancos',
      category: 'Tepache Projects',
      description:
        'App for tracking dollar to peso conversion rates across different Mexican banks.',
      tags: ['Fintech', 'Web App', 'Mexico'],
      liveUrl: 'https://dolarenbancos.com/',
    },
    {
      title: 'Es Legal Mi Trabajo',
      category: 'Tepache Projects',
      description:
        'Website to help workers understand if labor conditions at their job are legal in Mexico.',
      tags: ['Legal Tech', 'Information Platform', 'Mexico'],
      liveUrl: 'https://eslegalmitrabajo.com/',
    },
  ],

  experience: [
    {
      company: 'The Shift Network',
      role: 'Software Engineer',
      period: 'Mar 2023 - Present',
      description:
        'Leading full-stack product initiatives with Next.js and TypeScript, designing reliable integrations across internal platforms, and building AI-assisted tools that reduce repetitive work and accelerate delivery.',
    },
    {
      company: 'Framework Science',
      role: 'Frontend Engineer',
      period: 'Jul 2021 - Jan 2023',
      description:
        'Owned frontend architecture across multiple React products, mentored junior teammates, improved release confidence through automated testing, and modernized CI pipelines for dramatically faster deployments.',
    },
    {
      company: 'Guaostudio',
      role: 'Frontend Developer',
      period: 'Feb 2021 - May 2021',
      description:
        'Built a client-facing MVP from zero to production with Next.js, integrated CMS-driven content workflows, and partnered with design and PM teams to deliver polished features on aggressive timelines.',
    },
    {
      company: 'El Culto al Perro Cafe',
      role: 'Software Engineer',
      period: 'Oct 2019 - Feb 2021',
      description:
        'Engineered and scaled customer-facing web experiences, improved performance through React refactors, implemented resilient authentication flows, and standardized frontend tooling to support faster team execution.',
    },
  ],
}

export default config
