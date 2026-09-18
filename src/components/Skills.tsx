import type { FC } from 'react'
import { Card, Chip, Text } from 'sukuna-ui'
import config from '../config/portfolio.config'
import { ChipIcon } from './Icons'
import { NeuralNet } from './NeuralNet'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

const TONES = ['accent', 'premium', 'neutral'] as const

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
          <SectionHeading copy={config.sections.skills} className="mb-14" />
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {config.skillGroups.map((group, g) => (
            <Reveal key={group.label} delay={100 + g * 100} className="h-full">
              <Card elevation="raised" padding="lg" className="fire-card glass h-full">
                <div className="flex items-center gap-3 mb-6">
                  <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
                  </span>
                  <Text as="h3" font="display" weight="bold" size="lg">
                    {group.label}
                  </Text>
                </div>
                <ul className="flex flex-wrap gap-2.5">
                  {group.items.map((skill, i) => (
                    <li key={skill}>
                      <Chip
                        tone={TONES[(g + i) % TONES.length]}
                        size="md"
                        leadingIcon={<ChipIcon className="w-3.5 h-3.5" />}
                        className="cursor-default transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(255,90,31,0.45)] hover:border-ember/60"
                      >
                        {skill}
                      </Chip>
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
