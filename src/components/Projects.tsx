import { useState } from 'react'
import type { FC, KeyboardEvent } from 'react'
import { Badge, Button, Card, Text } from 'sukuna-ui'
import type { Project, ProjectCategory } from '../config/portfolio.config'
import config from '../config/portfolio.config'
import { trackCta } from '../lib/analytics'
import { Flame } from './Flame'
import { ExternalIcon, GithubIcon } from './Icons'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

const slug = (s: string) => s.replace(/\s+/g, '-').toLowerCase()
const tabId = (c: string) => `projects-tab-${slug(c)}`
const panelId = (c: string) => `projects-panel-${slug(c)}`

const ProjectCard: FC<{ project: Project; index: number }> = ({ project, index }) => {
  const meta = [project.role, project.year].filter(Boolean).join(' · ')
  return (
    <Reveal delay={index * 100} className="h-full">
      <Card
        elevation="raised"
        padding={project.image ? 'none' : 'md'}
        className="fire-card group h-full flex flex-col overflow-clip hover:-translate-y-1.5 hover:bg-surface-2 transition-all duration-300"
      >
        {project.image && (
          <img
            src={project.image}
            alt={`${project.title} screenshot`}
            loading="lazy"
            width={800}
            height={500}
            className="aspect-[8/5] w-full object-cover border-b border-line"
          />
        )}
        <div className={`flex-1 flex flex-col ${project.image ? 'p-6' : ''}`}>
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 rounded-md bg-accent/10 border border-accent/25 group-hover:shadow-[0_0_18px_rgba(255,90,31,0.5)] transition-shadow">
              <Flame className="w-6 transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div className="flex gap-1">
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} repository (opens in a new tab)`}
                  data-tip="Repository"
                  onClick={() => trackCta('project_repo', { project: project.title })}
                  className="tip p-2 rounded-md text-text-faint hover:text-blaze transition-colors"
                >
                  <GithubIcon />
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} live site (opens in a new tab)`}
                  data-tip="Live site"
                  onClick={() => trackCta('project_live', { project: project.title })}
                  className="tip p-2 rounded-md text-text-faint hover:text-blaze transition-colors"
                >
                  <ExternalIcon />
                </a>
              )}
            </div>
          </div>

          <Text
            as="h3"
            font="display"
            weight="bold"
            size="xl"
            className="mb-1 group-hover:text-blaze transition-colors"
          >
            {project.title}
          </Text>
          {meta && (
            <Text as="p" size="xs" tone="faint" className="font-mono mb-3">
              {meta}
            </Text>
          )}
          <Text as="p" size="md" tone="dim" leading="normal" className="mb-4">
            {project.description}
          </Text>
          {project.outcome && (
            <Text as="p" size="sm" tone="premium" weight="semibold" className="mb-4">
              {project.outcome}
            </Text>
          )}
          {project.stack && (
            <Text as="p" size="xs" tone="faint" className="font-mono mb-4">
              {project.stack.join(' · ')}
            </Text>
          )}

          <div className="flex flex-wrap gap-2 mt-auto">
            {project.tags.map((tag, i) => (
              <Badge key={tag} tone={i === 0 ? 'accent' : 'neutral'} size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </Reveal>
  )
}

export const Projects: FC = () => {
  const grouped = config.projects.reduce<Partial<Record<ProjectCategory, Project[]>>>(
    (acc, project) => {
      const category = project.category ?? 'My Projects'
      ;(acc[category] ??= []).push(project)
      return acc
    },
    {}
  )
  const categories = Object.keys(grouped) as ProjectCategory[]
  const [active, setActive] = useState<ProjectCategory>(categories[0])
  const projects = grouped[active] ?? []

  // WAI-ARIA tabs: one tab stop, arrow keys move between tabs.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = categories.indexOf(active)
    const last = categories.length - 1
    const next =
      e.key === 'ArrowRight'
        ? (i + 1) % categories.length
        : e.key === 'ArrowLeft'
          ? (i - 1 + categories.length) % categories.length
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? last
              : -1
    if (next < 0) return
    e.preventDefault()
    setActive(categories[next])
    document.getElementById(tabId(categories[next]))?.focus()
  }

  return (
    <section id="projects" className="relative py-28 overflow-clip">
      <div
        className="absolute -right-40 top-10 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(255,45,111,0.14),transparent_65%)] blur-3xl"
        aria-hidden="true"
      />
      <div className="relative max-w-6xl mx-auto px-6">
        <Reveal>
          <SectionHeading copy={config.sections.projects} className="mb-12" />
        </Reveal>

        <Reveal delay={100} className="flex justify-center">
          <div
            role="tablist"
            aria-label="Project categories"
            onKeyDown={onKeyDown}
            className="glass inline-flex gap-1 p-1 rounded-pill border border-line mb-10"
          >
            {categories.map((category) => {
              const selected = active === category
              return (
                <Button
                  key={category}
                  id={tabId(category)}
                  role="tab"
                  aria-selected={selected}
                  aria-controls={panelId(category)}
                  tabIndex={selected ? 0 : -1}
                  size="sm"
                  variant={selected ? 'primary' : 'ghost'}
                  className="rounded-pill"
                  onClick={() => setActive(category)}
                  trailingIcon={
                    <Badge tone="neutral" size="sm">
                      {grouped[category]?.length}
                    </Badge>
                  }
                >
                  {category}
                </Button>
              )
            })}
          </div>
        </Reveal>

        <div
          key={active}
          role="tabpanel"
          id={panelId(active)}
          aria-labelledby={tabId(active)}
          tabIndex={0}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 focus-visible:outline-none"
        >
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
