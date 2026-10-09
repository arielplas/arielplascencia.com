import type { FC } from 'react'
import { Badge, Button, GlitchText, RetroGrid, ScrambleText } from '@sukunagg/ui'
import config, { yearsOfExperience } from '../config/portfolio.config'
import { trackCta } from '../lib/analytics'

// Every number on the floor is derived from config so it cannot drift from the real history.
const FLOOR_STATS = [
  { value: String(yearsOfExperience(config.experience)), label: 'yrs in the game' },
  { value: String(config.projects.length), label: 'missions shipped' },
  { value: String(config.experience.length), label: 'teams' },
  { value: config.region, label: 'region', premium: true },
]

export const Hero: FC = () => {
  return (
    <section id="hero" aria-label="Intro" className="relative">
      <RetroGrid className="min-h-[max(640px,calc(100svh-4rem))]">
        <div className="flex flex-col items-center px-4 pt-10 text-center sm:pt-16">
          <Badge tone="success" dot pulse size="md" className="hud text-[11px] tracking-[0.16em]">
            Player one · ready
            <span className="hidden sm:inline">&nbsp;· {config.availability}</span>
          </Badge>

          <GlitchText
            as="h1"
            intro={false}
            className="display-caps mt-6 text-[clamp(44px,7.2vw,104px)] leading-[0.9] tracking-[-0.03em] [text-shadow:0_0_60px_var(--sk-accent-glow)]"
          >
            {config.name}
          </GlitchText>

          <p className="hud mt-5 text-[clamp(14px,1.6vw,22px)] font-bold tracking-[0.28em] text-accent">
            <ScrambleText text={config.title} duration={900} delay={200} />
            <span
              className="animate-blink ml-1.5 inline-block h-[0.9em] w-[0.55em] bg-accent align-[-0.1em]"
              aria-hidden="true"
            />
          </p>

          <p className="mt-4 max-w-xl text-base text-text/80 sm:text-lg">{config.tagline}</p>

          <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <Button as="a" href="#contact" size="lg" onClick={() => trackCta('hero_contact')}>
              Press start
            </Button>
            <Button
              as="a"
              href="#projects"
              size="lg"
              variant="secondary"
              onClick={() => trackCta('hero_work')}
            >
              View missions
            </Button>
          </div>
        </div>
      </RetroGrid>

      {/* Stats on the grid floor, under the horizon. */}
      <ul
        aria-label="At a glance"
        className="hud absolute inset-x-4 bottom-6 m-0 grid list-none grid-cols-2 gap-x-3 gap-y-2.5 p-0 text-[10px] text-text/85 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-14 sm:text-xs"
      >
        {FLOOR_STATS.map((stat) => (
          <li key={stat.label}>
            <b className={stat.premium ? 'text-premium' : 'text-text'}>{stat.value}</b> {stat.label}
          </li>
        ))}
      </ul>
    </section>
  )
}
