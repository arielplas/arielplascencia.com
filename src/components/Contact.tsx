import type { FC } from 'react'
import { Button, Text } from 'sukuna-ui'
import config from '../config/portfolio.config'
import { FireParticles } from './FireParticles'
import { MailIcon, SocialIcon } from './Icons'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

export const Contact: FC = () => {
  return (
    <section id="contact" className="relative py-32 overflow-clip">
      <div
        className="absolute inset-x-0 bottom-0 h-[60vh] bg-[radial-gradient(ellipse_at_bottom,rgba(255,90,31,0.32),rgba(255,45,111,0.08)_45%,transparent_70%)]"
        aria-hidden="true"
      />
      <FireParticles density={0.6} interactive={false} />

      <div className="relative max-w-6xl mx-auto px-6 text-center">
        <Reveal>
          <SectionHeading
            eyebrow="Get in touch"
            title={
              <>
                Let's build something <span className="text-fire text-glow">unstoppable</span>
              </>
            }
            subtitle="Have a project in mind or just want to say hi? My inbox is always open."
            className="mb-10"
          />

          <Button
            size="lg"
            leadingIcon={<MailIcon className="w-5 h-5" />}
            className="animate-pulse-glow text-lg px-8 h-14"
            onClick={() => {
              window.location.href = `mailto:${config.email}`
            }}
          >
            Say hello
          </Button>

          <Text as="p" size="sm" tone="faint" className="mt-4 font-mono">
            {config.email}
          </Text>
        </Reveal>

        <Reveal delay={200}>
          <div className="flex items-center justify-center gap-8 mt-14">
            {config.socials.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-text-dim hover:text-blaze text-sm font-semibold transition-all hover:-translate-y-0.5"
              >
                <SocialIcon icon={social.icon} className="w-4 h-4" />
                {social.label}
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
