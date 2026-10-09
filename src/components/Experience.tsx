import type { FC } from 'react'
import { Badge, Text } from '@sukunagg/ui'
import config from '../config/portfolio.config'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

/** "Mar 2023 - Present" → "Mar 2023 — now". */
const formatPeriod = (period: string) => period.replace(' - ', ' — ').replace('Present', 'now')

export const Experience: FC = () => {
  const seasons = config.experience.length

  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="relative overflow-clip border-y border-line-soft bg-surface/40 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading copy={config.sections.experience} index={4} id="experience-title" />
        </Reveal>

        <ol className="m-0 mt-12 flex list-none flex-col gap-3 p-0">
          {config.experience.map((exp, index) => {
            const current = exp.period.endsWith('Present')
            return (
              <li key={exp.company}>
                <Reveal delay={index * 80}>
                  <article
                    aria-labelledby={`exp-${index}`}
                    className={`flex flex-wrap gap-x-8 gap-y-5 rounded-lg border p-6 sm:p-7 ${
                      current
                        ? 'border-accent/40 bg-[linear-gradient(90deg,color-mix(in_oklab,var(--sk-accent)_12%,transparent),var(--sk-surface)_45%)]'
                        : 'border-line bg-surface'
                    }`}
                  >
                    <div className="flex flex-[0_0_150px] flex-col gap-1.5">
                      <span
                        className={`display-caps text-5xl leading-[0.9] ${current ? 'text-accent' : ''}`}
                        aria-hidden="true"
                      >
                        S{seasons - index}
                      </span>
                      <span className="hud text-[11px] tracking-[0.14em] text-text-dim">
                        {formatPeriod(exp.period)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-[1_1_440px]">
                      <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2">
                        <h3
                          id={`exp-${index}`}
                          className="m-0 font-display text-2xl font-black leading-tight [font-stretch:115%]"
                        >
                          {exp.company}
                        </h3>
                        <span className="hud text-[11px] tracking-[0.12em] text-premium">
                          {exp.role}
                        </span>
                        {current && (
                          <Badge
                            tone="accent"
                            variant="solid"
                            pulse
                            dot
                            size="sm"
                            className="hud ml-auto text-[10px]"
                          >
                            In progress
                          </Badge>
                        )}
                      </div>
                      <Text
                        as="p"
                        className={`mt-3 leading-relaxed ${current ? 'text-text/80' : 'text-text-dim'}`}
                      >
                        {exp.description}
                      </Text>
                    </div>
                  </article>
                </Reveal>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
