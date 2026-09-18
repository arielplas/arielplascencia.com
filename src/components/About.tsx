import { useEffect, useRef, useState } from 'react'
import type { FC } from 'react'
import { Card, Text } from 'sukuna-ui'
import config from '../config/portfolio.config'
import { MailIcon } from './Icons'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

const STATS = [
  { value: 5, suffix: '+', label: 'Years of experience' },
  { value: 30, suffix: '+', label: 'Projects shipped' },
  { value: 15, suffix: '+', label: 'Happy clients' },
  { value: 100, suffix: '%', label: 'Powered by caffeine & AI' },
]

/** Counts from 0 to `target` the first time the element scrolls into view. */
const CountUp: FC<{ target: number; suffix: string }> = ({ target, suffix }) => {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const duration = 1400
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - t, 3)
          setValue(Math.round(target * eased))
          if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref}>
      {value}
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
            <SectionHeading
              align="start"
              eyebrow="About me"
              title={
                <>
                  Engineering with <span className="text-fire">firepower</span>
                </>
              }
              className="mb-6"
            />
            <Text as="p" tone="dim" size="lg" leading="normal" className="mb-8">
              {config.about}
            </Text>
            <a
              href={`mailto:${config.email}`}
              className="inline-flex items-center gap-2 text-blaze hover:text-text font-semibold transition-colors"
            >
              <MailIcon className="w-4 h-4" />
              {config.email}
            </a>
          </Reveal>

          <Reveal delay={150}>
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((stat, i) => (
                <Card
                  key={stat.label}
                  elevation="raised"
                  padding="lg"
                  className="fire-card text-center hover:-translate-y-1 transition-transform duration-300"
                  style={{ transitionDelay: `${i * 40}ms` }}
                >
                  <Text
                    as="p"
                    font="display"
                    weight="black"
                    className="text-4xl text-fire mb-1 tabular-nums"
                  >
                    <CountUp target={stat.value} suffix={stat.suffix} />
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
