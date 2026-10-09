import { useState } from 'react'
import type { FC } from 'react'
import { Badge, BorderBeam, Button, Card, Chip, Text, ToggleGroup } from '@sukunagg/ui'
import type { Project } from '../config/portfolio.config'
import config from '../config/portfolio.config'
import { trackCta } from '../lib/analytics'
import { ExternalIcon, GithubIcon } from './Icons'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

const ALL = 'all'

const glyphFor = (project: Project) =>
  project.glyph ??
  (project.title.includes(' ')
    ? project.title
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
    : project.title.slice(0, 2))

/** Screenshot when there is one, otherwise a gridded cover with the project's mark. */
const Cover: FC<{ project: Project; className?: string; glyphClassName?: string }> = ({
  project,
  className = '',
  glyphClassName = 'text-6xl',
}) =>
  project.image ? (
    <img
      src={project.image}
      alt={`${project.title} screenshot`}
      loading="lazy"
      width={800}
      height={500}
      className={`w-full object-cover ${className}`}
    />
  ) : (
    <div
      aria-hidden="true"
      className={`relative grid place-items-center overflow-hidden bg-[radial-gradient(80%_90%_at_70%_100%,color-mix(in_oklab,var(--sk-accent)_28%,transparent),transparent_70%),linear-gradient(160deg,var(--sk-surface-2),var(--sk-bg))] ${className}`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(var(--sk-line-soft)_1px,transparent_1px),linear-gradient(90deg,var(--sk-line-soft)_1px,transparent_1px)] bg-size-[28px_28px]" />
      <span
        className={`display-caps relative text-text/90 [text-shadow:0_0_32px_var(--sk-accent-glow)] ${glyphClassName}`}
      >
        {glyphFor(project)}
      </span>
    </div>
  )

const Status: FC<{ project: Project }> = ({ project }) =>
  project.liveUrl ? (
    <Badge tone="success" variant="outline" dot size="sm" className="hud text-[10px]">
      Live
    </Badge>
  ) : (
    <Badge tone="premium" variant="outline" size="sm" className="hud text-[10px]">
      Open source
    </Badge>
  )

const ProjectLinks: FC<{ project: Project; primary?: boolean }> = ({ project, primary }) => (
  <div className="flex flex-wrap gap-2">
    {project.liveUrl && (
      <Button
        as="a"
        href={project.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        size={primary ? 'lg' : 'sm'}
        variant={primary ? 'primary' : 'ghost'}
        trailingIcon={<ExternalIcon className="size-4" />}
        onClick={() => trackCta('project_live', { project: project.title })}
      >
        Play live<span className="sr-only"> {project.title} (opens in a new tab)</span>
      </Button>
    )}
    {project.repoUrl && (
      <Button
        as="a"
        href={project.repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        size={primary ? 'lg' : 'sm'}
        variant={primary ? 'secondary' : 'ghost'}
        leadingIcon={<GithubIcon className="size-4" />}
        onClick={() => trackCta('project_repo', { project: project.title })}
      >
        Source<span className="sr-only"> of {project.title} (opens in a new tab)</span>
      </Button>
    )}
  </div>
)

const Tags: FC<{ tags: string[] }> = ({ tags }) => (
  <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
    {tags.map((tag) => (
      <li key={tag}>
        <Chip size="sm">{tag}</Chip>
      </li>
    ))}
  </ul>
)

const Featured: FC<{ project: Project }> = ({ project }) => (
  <BorderBeam
    as="article"
    tone="premium"
    speed="slow"
    aria-labelledby="featured-title"
    className="mt-12 rounded-[20px]"
  >
    <Card
      elevation="raised"
      padding="none"
      className="flex h-full flex-wrap overflow-hidden rounded-[20px]"
    >
      <Cover project={project} className="min-h-72 flex-[1_1_440px]" glyphClassName="text-8xl" />
      <div className="flex min-w-0 flex-[1_1_400px] flex-col gap-4 p-6 sm:p-10">
        <div className="flex flex-wrap gap-2">
          <Badge tone="premium" variant="solid" size="sm" className="hud text-[10px]">
            Featured mission
          </Badge>
          <Status project={project} />
        </div>
        <h3 id="featured-title" className="display-caps m-0 text-4xl sm:text-5xl">
          {project.title}
        </h3>
        <Text as="p" className="text-lg leading-relaxed text-text/80">
          {project.description}
        </Text>
        {project.role && <p className="hud m-0 text-premium">Role: {project.role}</p>}
        <Tags tags={project.tags} />
        <div className="mt-auto pt-2">
          <ProjectLinks project={project} primary />
        </div>
      </div>
    </Card>
  </BorderBeam>
)

const ProjectCard: FC<{ project: Project }> = ({ project }) => (
  <Card
    elevation="raised"
    padding="none"
    className="flex h-full flex-col overflow-hidden transition-colors hover:border-accent/45"
  >
    <Cover project={project} className="aspect-video border-b border-line-soft" />
    <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
      <div className="flex items-center justify-between gap-2">
        <span className="hud rounded-sm border border-line px-2 py-0.5 text-[10px] text-text-dim">
          {project.category}
        </span>
        <Status project={project} />
      </div>
      <h3 className="display-caps m-0 text-2xl [font-stretch:120%]">{project.title}</h3>
      <Text as="p" tone="dim" className="leading-relaxed">
        {project.description}
      </Text>
      {project.stack && (
        <p className="hud m-0 text-[11px] tracking-[0.12em] text-text-faint">
          {project.stack.join(' · ')}
        </p>
      )}
      <Tags tags={project.tags} />
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-line-soft pt-3.5">
        <span className="hud text-[11px] tracking-[0.12em] text-premium">{project.role}</span>
        <ProjectLinks project={project} />
      </div>
    </div>
  </Card>
)

export const Projects: FC = () => {
  const featured = config.projects.find((p) => p.featured)
  const rest = config.projects.filter((p) => p !== featured)
  const categories = [...new Set(rest.map((p) => p.category ?? 'My Projects'))]
  const [filter, setFilter] = useState(ALL)
  const shown = filter === ALL ? rest : rest.filter((p) => (p.category ?? 'My Projects') === filter)

  const filters = [
    { value: ALL, label: `All · ${rest.length}` },
    ...categories.map((c) => ({
      value: c,
      label: `${c} · ${rest.filter((p) => (p.category ?? 'My Projects') === c).length}`,
    })),
  ]

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="relative overflow-clip py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading copy={config.sections.projects} index={3} id="projects-title" />
        </Reveal>

        {featured && <Featured project={featured} />}

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4">
          <p id="more-missions" className="hud m-0 text-text-dim">
            More missions
          </p>
          <ToggleGroup
            aria-labelledby="more-missions"
            value={filter}
            onValueChange={(value) => value[0] && setFilter(value[0])}
            items={filters}
          />
        </div>

        <ul
          aria-label="Projects"
          className="m-0 mt-6 grid list-none grid-cols-[repeat(auto-fill,minmax(min(330px,100%),1fr))] gap-5 p-0"
        >
          {shown.map((project) => (
            <li key={project.title}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
