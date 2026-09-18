import { useState } from 'react'
import type { FC } from 'react'
import { Badge, Button, Card, Text, Tooltip } from 'sukuna-ui'
import type { Project } from '../config/portfolio.config'
import config from '../config/portfolio.config'
import { Flame } from './Flame'
import { ExternalIcon, GithubIcon } from './Icons'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

const ProjectCard: FC<{ project: Project; index: number }> = ({ project, index }) => (
  <Reveal delay={index * 100} className="h-full">
    <Card
      elevation="raised"
      padding="md"
      className="fire-card group h-full flex flex-col hover:-translate-y-1.5 hover:bg-surface-2 transition-all duration-300"
    >
      <div className="flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 rounded-md bg-accent/10 border border-accent/25 group-hover:shadow-[0_0_18px_rgba(255,90,31,0.5)] transition-shadow">
            <Flame className="w-6 transition-transform duration-300 group-hover:scale-110" />
          </div>
          <div className="flex gap-3">
            {project.repoUrl && (
              <Tooltip content="Repository">
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} repository`}
                  className="text-text-faint hover:text-blaze transition-colors"
                >
                  <GithubIcon />
                </a>
              </Tooltip>
            )}
            {project.liveUrl && (
              <Tooltip content="Live site">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} live site`}
                  className="text-text-faint hover:text-blaze transition-colors"
                >
                  <ExternalIcon />
                </a>
              </Tooltip>
            )}
          </div>
        </div>

        <Text
          as="h4"
          font="display"
          weight="bold"
          size="xl"
          className="mb-2 group-hover:text-blaze transition-colors"
        >
          {project.title}
        </Text>
        <Text as="p" size="md" tone="dim" leading="normal" className="mb-5">
          {project.description}
        </Text>
      </div>

      <div className="flex flex-wrap gap-2 mt-auto">
        {project.tags.map((tag, i) => (
          <Badge key={tag} tone={i === 0 ? 'accent' : 'neutral'} size="sm">
            {tag}
          </Badge>
        ))}
      </div>
    </Card>
  </Reveal>
)

export const Projects: FC = () => {
  const grouped = config.projects.reduce<Record<string, Project[]>>((acc, project) => {
    const category = project.category ?? 'Projects'
    ;(acc[category] ??= []).push(project)
    return acc
  }, {})

  const categories = Object.keys(grouped)
  const [active, setActive] = useState(categories[0])
  const projects = grouped[active] ?? []

  return (
    <section id="projects" className="relative py-28 overflow-clip">
      <div
        className="absolute -right-40 top-10 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(255,45,111,0.14),transparent_65%)] blur-3xl"
        aria-hidden="true"
      />
      <div className="relative max-w-6xl mx-auto px-6">
        <Reveal>
          <SectionHeading
            eyebrow="My work"
            title={
              <>
                Featured <span className="text-fire">Projects</span>
              </>
            }
            subtitle="Things I've built, shipped and set on fire (in a good way)."
            className="mb-12"
          />
        </Reveal>

        <Reveal delay={100} className="flex justify-center">
          <div
            role="tablist"
            aria-label="Project categories"
            className="glass inline-flex gap-1 p-1 rounded-pill border border-line mb-10"
          >
            {categories.map((category) => (
              <Button
                key={category}
                role="tab"
                aria-selected={active === category}
                size="sm"
                variant={active === category ? 'primary' : 'ghost'}
                className="rounded-pill"
                onClick={() => setActive(category)}
                trailingIcon={
                  <Badge tone="neutral" size="sm">
                    {grouped[category].length}
                  </Badge>
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </Reveal>

        <div key={active} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
