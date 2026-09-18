import type { FC } from 'react'
import { Badge, Card, Text } from 'sukuna-ui'
import config from '../config/portfolio.config'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

export const Experience: FC = () => {
  return (
    <section id="experience" className="relative py-28 overflow-clip">
      <div className="grid-bg absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative max-w-6xl mx-auto px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Career"
            title={
              <>
                Trail of <span className="text-fire">Fire</span>
              </>
            }
            subtitle="Where I've been leveling up."
            className="mb-16"
          />
        </Reveal>

        <div className="relative max-w-3xl mx-auto">
          {/* glowing spine */}
          <div
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blaze via-accent to-transparent shadow-[0_0_14px_rgba(255,90,31,0.8)]"
            aria-hidden="true"
          />

          <div className="flex flex-col gap-12">
            {config.experience.map((exp, index) => (
              <div
                key={exp.company}
                className={`relative flex flex-col md:flex-row gap-6 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* node */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 mt-6 z-10">
                  <span className="relative flex h-4 w-4">
                    <span
                      className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 animate-ping"
                      style={{ animationDelay: `${index * 0.4}s` }}
                    />
                    <span className="relative inline-flex h-4 w-4 rounded-full bg-gradient-accent shadow-[0_0_16px_rgba(255,138,61,0.9)]" />
                  </span>
                </div>

                <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                  <Reveal delay={index * 80}>
                    <Card
                      elevation="raised"
                      padding="md"
                      className="fire-card hover:-translate-y-1 transition-transform duration-300"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <Text as="h3" font="display" weight="bold" size="xl">
                          {exp.role}
                        </Text>
                        <Badge tone={index === 0 ? 'accent' : 'neutral'} size="sm" className="font-mono">
                          {exp.period}
                        </Badge>
                      </div>
                      <Text as="p" size="sm" tone="premium" weight="semibold" className="mb-3">
                        {exp.company}
                      </Text>
                      <Text as="p" size="md" tone="dim" leading="normal">
                        {exp.description}
                      </Text>
                    </Card>
                  </Reveal>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
