export type SocialIconName = 'github' | 'linkedin' | 'resume'

export type ProjectCategory = 'My Projects' | 'Tepache Projects'

export type SectionId = 'about' | 'skills' | 'projects' | 'experience' | 'contact'

export interface SocialLink {
  label: string
  url: string
  icon: SocialIconName
}

export interface Project {
  title: string
  category?: ProjectCategory
  description: string
  tags: string[]
  liveUrl?: string
  repoUrl?: string
  /** Your role on the project, e.g. "Sole developer". */
  role?: string
  /** Tech actually used (separate from the marketing `tags`). */
  stack?: string[]
  year?: string
  /** One measurable line: "Tracks 12 banks daily", "0 → 1 MVP in 6 weeks". */
  outcome?: string
  /** Path under public/, e.g. "/projects/centavos.webp" (800×500). */
  image?: string
}

export interface Experience {
  company: string
  role: string
  period: string
  description: string
}

export interface SkillGroup {
  label: string
  items: string[]
}

export interface SectionCopy {
  eyebrow: string
  /** Full title. The `highlight` substring is rendered with the fire gradient. */
  title: string
  highlight?: string
  subtitle?: string
}

export interface PortfolioConfig {
  name: string
  title: string
  siteUrl: string
  location: string
  /** Shown in the hero badge. Be specific: what kind of work, which time zones. */
  availability: string
  about: string
  email: string
  /** Words cycled by the hero typewriter. The first one is shown when motion is reduced. */
  heroWords: string[]
  nav: SectionId[]
  socials: SocialLink[]
  skillGroups: SkillGroup[]
  projects: Project[]
  experience: Experience[]
  sections: Record<SectionId, SectionCopy>
}

const config: PortfolioConfig = {
  name: 'Ariel Plascencia',
  title: 'Full-Stack Developer',
  siteUrl: 'https://arielplascencia.com',
  location: 'Mexico',
  availability: 'Open to remote full-time and contract work',
  // TODO(ariel): this is a draft written from your experience entries. Make it yours.
  about:
    "I'm a full-stack engineer based in Mexico. Since 2023 I've been at The Shift Network, " +
    'leading Next.js and TypeScript product work and building AI-assisted tools that remove ' +
    'repetitive work from the team. Before that I owned frontend architecture at Framework ' +
    'Science and shipped zero-to-one products for startups and agencies. I care about clean ' +
    'code, great UX and fast delivery, and I work well with US and Mexico time zones.',
  email: 'imariel2d@gmail.com',
  heroWords: ['fast', 'powerful', 'AI-assisted', 'accessible', 'beautiful'],
  nav: ['about', 'skills', 'projects', 'experience', 'contact'],

  socials: [
    { label: 'GitHub', url: 'https://github.com/arielplas', icon: 'github' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/arielplascencia/', icon: 'linkedin' },
    {
      label: 'Resume',
      // TODO(ariel): commit public/Ariel-Plascencia-CV.pdf and point this at "/Ariel-Plascencia-CV.pdf".
      url: 'https://drive.google.com/file/d/1Zth_nmEYDz8W-9REuYUNZSF7hlCX6dt-/view?usp=sharing',
      icon: 'resume',
    },
  ],

  skillGroups: [
    { label: 'Core', items: ['TypeScript', 'React', 'Next.js', 'Node.js'] },
    { label: 'Data & infra', items: ['PostgreSQL', 'Docker', 'CI/CD', 'Vercel'] },
    { label: 'Tooling & AI', items: ['Tailwind CSS', 'Testing', 'AI-assisted tooling', 'Git'] },
  ],

  projects: [
    {
      title: 'Centavos',
      category: 'My Projects',
      description:
        'Budgeting app to help people track their money and take control of their finances.',
      tags: ['Fintech', 'Budgeting', 'Web App'],
      liveUrl: 'https://centavos.mx/',
      role: 'Founder & developer',
    },
    {
      title: 'Duckstore',
      category: 'My Projects',
      // TODO(ariel): say what you built (storefront? checkout? ops tooling?) or drop this card.
      description: 'Online shopping project.',
      tags: ['E-commerce', 'Social Commerce'],
      liveUrl: 'https://www.instagram.com/duckstore.mx/',
    },
    {
      title: 'Chess Analysis',
      category: 'My Projects',
      description:
        "A fully offline chess analysis assistant with a desktop UI. Enter moves by dragging pieces, typing (natural language or algebraic), or speaking them — the app tracks the position, shows an eval bar, and tells you Stockfish's best move on screen and, optionally, out loud.",
      tags: ['Chess', 'Stockfish', 'Desktop App', 'Offline'],
      repoUrl: 'https://github.com/imariel2d/chess-analysis',
      role: 'Sole developer',
      stack: ['Stockfish', 'Speech recognition', 'Desktop UI'],
    },
    {
      title: 'Culto Perro Cafe',
      category: 'Tepache Projects',
      description:
        'Worked as a project manager to help lead the development of this coffee shop website.',
      tags: ['Project Management', 'E-commerce', 'Team Leadership'],
      liveUrl: 'https://www.perro.cafe/',
      role: 'Project manager',
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

  sections: {
    about: {
      eyebrow: 'About me',
      title: 'Engineering with firepower',
      highlight: 'firepower',
    },
    skills: {
      eyebrow: 'Tech stack',
      title: 'Skills & Technologies',
      highlight: 'Technologies',
      subtitle: 'The tools I reach for daily, grouped by where they fit.',
    },
    projects: {
      eyebrow: 'My work',
      title: 'Featured Projects',
      highlight: 'Projects',
      subtitle: "Things I've built, shipped and set on fire (in a good way).",
    },
    experience: {
      eyebrow: 'Career',
      title: 'Trail of Fire',
      highlight: 'Fire',
      subtitle: "Where I've been leveling up.",
    },
    contact: {
      eyebrow: 'Get in touch',
      title: "Let's build something unstoppable",
      highlight: 'unstoppable',
      subtitle: 'Hiring for a role or have a project in mind? Tell me about it.',
    },
  },
}

/** Whole years since the earliest experience entry started. */
export const yearsOfExperience = (experience: Experience[], now = new Date()): number => {
  const starts = experience.map((e) => Date.parse(`1 ${e.period.split(' - ')[0]}`))
  const earliest = Math.min(...starts.filter((t) => !Number.isNaN(t)))
  if (!Number.isFinite(earliest)) return 0
  return Math.floor((now.getTime() - earliest) / (365.25 * 24 * 3600 * 1000))
}

export default config
