import { useEffect, useMemo, useState } from 'react'
import type { FC } from 'react'
import { Badge, Button, Text, Tooltip } from 'sukuna-ui'
import config from '../config/portfolio.config'
import { FireParticles } from './FireParticles'
import { BoltIcon, MailIcon, ResumeIcon, SocialIcon } from './Icons'

const WORDS = ['fast', 'powerful', 'AI-assisted', 'accessible', 'beautiful']

/** Cycles through WORDS with a typewriter effect. */
const useTypewriter = (words: string[]) => {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[index]
    const done = !deleting && text === word
    const cleared = deleting && text === ''
    const delay = done ? 1600 : deleting ? 45 : 90

    const t = setTimeout(() => {
      if (done) {
        setDeleting(true)
      } else if (cleared) {
        setDeleting(false)
        setIndex((i) => (i + 1) % words.length)
      } else {
        setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1))
      }
    }, delay)
    return () => clearTimeout(t)
  }, [text, deleting, index, words])

  return text
}

export const Hero: FC = () => {
  const resumeLink = config.socials.find((social) => social.label.toLowerCase() === 'resume')
  const word = useTypewriter(WORDS)

  const heatBars = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        left: `${(i * 41 + 9) % 100}%`,
        delay: `${(i % 9) * 0.35}s`,
        duration: `${2.4 + (i % 5) * 0.4}s`,
      })),
    []
  )

  const go = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      className="scanlines relative min-h-screen flex flex-col items-center justify-center overflow-clip bg-void"
    >
      {/* background layers */}
      <div className="grid-bg absolute inset-0" aria-hidden="true" />
      <div
        className="absolute inset-x-0 bottom-0 h-[70vh] bg-[radial-gradient(ellipse_at_bottom,rgba(255,90,31,0.35),rgba(201,34,15,0.12)_40%,transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="animate-float-slow absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(255,45,111,0.18),transparent_60%)] blur-2xl"
        aria-hidden="true"
      />
      <div className="scan-beam" aria-hidden="true" />
      <FireParticles density={1.1} />
      <div className="absolute inset-x-0 bottom-0 h-40" aria-hidden="true">
        {heatBars.map((bar, i) => (
          <span
            key={i}
            className="heat"
            style={{ left: bar.left, animationDelay: bar.delay, animationDuration: bar.duration }}
          />
        ))}
      </div>

      {/* content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-28 text-center">
        <div className="mb-8 inline-flex">
          <Badge tone="premium" size="md" dot className="animate-pulse-glow border-premium/30">
            Available for work
          </Badge>
        </div>

        <Text
          as="h1"
          font="display"
          weight="black"
          leading="tight"
          tracking="tight"
          className="text-5xl md:text-7xl lg:text-8xl mb-6"
        >
          Hi, I'm{' '}
          <span className="text-fire text-glow">{config.name}</span>
        </Text>

        <Text
          as="p"
          font="display"
          weight="bold"
          className="text-xl md:text-2xl text-blaze mb-4 inline-flex items-center gap-2"
        >
          <BoltIcon className="w-5 h-5 text-accent" />
          {config.title}
        </Text>

        <Text as="p" tone="dim" className="text-lg md:text-xl max-w-2xl mx-auto mb-10 font-mono">
          I forge <span className="text-text font-semibold">{word}</span>
          <span className="animate-blink text-accent">|</span> web experiences.
        </Text>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <Button size="lg" onClick={() => go('#projects')} className="animate-pulse-glow">
            View my work
          </Button>
          {resumeLink && (
            <Button
              size="lg"
              variant="secondary"
              leadingIcon={<ResumeIcon className="w-4 h-4" />}
              onClick={() => window.open(resumeLink.url, '_blank', 'noopener,noreferrer')}
            >
              View Resume
            </Button>
          )}
          <Button
            size="lg"
            variant="ghost"
            leadingIcon={<MailIcon className="w-4 h-4" />}
            onClick={() => {
              window.location.href = `mailto:${config.email}`
            }}
          >
            Get in touch
          </Button>
        </div>

        <div className="flex items-center justify-center gap-6">
          {config.socials.map((social) => (
            <Tooltip key={social.label} content={social.label}>
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-text-dim hover:text-blaze transition-all hover:scale-125 hover:drop-shadow-[0_0_10px_rgba(255,138,61,0.8)]"
              >
                <SocialIcon icon={social.icon} className="w-6 h-6" />
              </a>
            </Tooltip>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <svg className="w-6 h-6 text-accent/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}
