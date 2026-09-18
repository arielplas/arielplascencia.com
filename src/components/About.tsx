import { useEffect, useState } from 'react'
import type { FC } from 'react'
import { Card, Text } from 'sukuna-ui'
import config, { yearsOfExperience } from '../config/portfolio.config'
import { useInView } from '../hooks/useInView'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { trackCta } from '../lib/analytics'
import { MailIcon } from './Icons'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

interface Stat {
  value: number | string
  suffix?: string
  label: string
}

// Every number here is derived from config so it cannot drift from the real history.
const STATS: Stat[] = [
  { value: yearsOfExperience(config.experience), suffix: '+', label: 'Years of experience' },
  { value: config.projects.length, label: 'Products shipped' },
  { value: config.experience.length, label: 'Companies' },
  { value: config.location, label: 'Based in' },
]

/** Counts from 0 to `target` the first time the element scrolls into view. */
const CountUp: FC<{ target: number; suffix?: string }> = ({ target, suffix = '' }) => {
  const [ref, inView] = useInView<HTMLSpanElement>(0.4)
  const reduce = useReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView || reduce) return
    const start = performance.now()
    const duration = 1400
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(target * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduce, target])

  // Reduced motion: no count-up, show the final number as soon as it is on screen.
  const shown = reduce && inView ? target : value
  return (
    <span ref={ref}>
      {shown}
      {suffix}
    </span>
  )
}

export const About: FC = () => {
  return (
    <section id="about" className="relative py-28 overflow-clip">
      <div
        className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(255,90,31,0.16),transparent_65%)] blur-2xl"
        aria-hidden="true"
      />
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <Reveal>
            <SectionHeading align="start" copy={config.sections.about} className="mb-6" />
            <Text as="p" tone="dim" size="lg" leading="normal" className="mb-8">
              {config.about}
            </Text>
            <a
              href={`mailto:${config.email}`}
              onClick={() => trackCta('about_email')}
              className="inline-flex items-center gap-2 py-2 text-blaze hover:text-text font-semibold transition-colors"
            >
              <MailIcon className="w-4 h-4" />
              {config.email}
            </a>
          </Reveal>

          <Reveal delay={150}>
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((stat) => (
                <Card
                  key={stat.label}
                  elevation="raised"
                  padding="lg"
                  className="fire-card text-center hover:-translate-y-1 transition-transform duration-300"
                >
                  <Text
                    as="p"
                    font="display"
                    weight="black"
                    className="text-4xl text-fire mb-1 tabular-nums"
                  >
                    {typeof stat.value === 'number' ? (
                      <CountUp target={stat.value} suffix={stat.suffix} />
                    ) : (
                      stat.value
                    )}
                  </Text>
                  <Text as="p" size="sm" tone="dim" weight="semibold">
                    {stat.label}
                  </Text>
                </Card>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
