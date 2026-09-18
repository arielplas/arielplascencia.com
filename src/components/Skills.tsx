import { useEffect, useRef, useState } from 'react'
import type { FC } from 'react'
import { Card, Chip, Progress, Text } from 'sukuna-ui'
import config from '../config/portfolio.config'
import { ChipIcon } from './Icons'
import { NeuralNet } from './NeuralNet'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

/** Progress bars that fill only once the panel is on screen. */
const PowerMeters: FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArmed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
      {config.skillLevels.map((skill) => (
        <div key={skill.name}>
          <div className="flex items-center justify-between mb-2">
            <Text as="span" size="sm" weight="semibold">
              {skill.name}
            </Text>
            <Text as="span" size="xs" tone="accent" className="font-mono tabular-nums">
              {armed ? skill.level : 0}%
            </Text>
          </div>
          <Progress
            value={armed ? skill.level : 0}
            size="sm"
            aria-label={`${skill.name} proficiency`}
            className="[&_[data-slot=indicator]]:duration-1000 [&>div>div]:transition-[width] [&>div>div]:duration-1000 [&>div>div]:ease-out [&>div>div]:bg-gradient-accent [&>div>div]:shadow-[0_0_12px_rgba(255,90,31,0.7)]"
          />
        </div>
      ))}
    </div>
  )
}

export const Skills: FC = () => {
  return (
    <section id="skills" className="relative py-28 overflow-clip">
      <NeuralNet density={0.14} />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--sk-bg)_85%)]"
        aria-hidden="true"
      />
      <div className="relative max-w-6xl mx-auto px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Tech stack"
            title={
              <>
                Skills &amp; <span className="text-fire">Technologies</span>
              </>
            }
            subtitle="A neural net of tools I reach for daily, with a power reading for each."
            className="mb-14"
          />
        </Reveal>

        <Reveal delay={100}>
          <div className="flex flex-wrap justify-center gap-3 mb-14">
            {config.skills.map((skill, i) => (
              <Chip
                key={skill}
                tone={i % 3 === 0 ? 'accent' : i % 3 === 1 ? 'premium' : 'neutral'}
                size="md"
                leadingIcon={<ChipIcon className="w-3.5 h-3.5" />}
                className="glass cursor-default transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,90,31,0.45)] hover:border-ember/60 px-4 h-9"
              >
                {skill}
              </Chip>
            ))}
          </div>
        </Reveal>

        <Reveal delay={200}>
          <Card elevation="raised" padding="lg" className="fire-card glass max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 animate-ping" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-accent" />
              </span>
              <Text as="h3" font="display" weight="bold" size="xl">
                Power levels
              </Text>
              <Text as="span" size="xs" tone="faint" className="font-mono ml-auto hidden sm:inline">
                sys.diagnostics --live
              </Text>
            </div>
            <PowerMeters />
          </Card>
        </Reveal>
      </div>
    </section>
  )
}
