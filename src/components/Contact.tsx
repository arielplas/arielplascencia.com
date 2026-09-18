import { useState } from 'react'
import type { FC, FormEvent } from 'react'
import { Button, Card } from 'sukuna-ui'
import config from '../config/portfolio.config'
import { trackCta } from '../lib/analytics'
import { FireParticles } from './FireParticles'
import { MailIcon, SocialIcon } from './Icons'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const INTENTS = [
  { value: 'hiring', label: "I'm hiring for a role" },
  { value: 'project', label: 'I have a project' },
  { value: 'other', label: 'Something else' },
]

const field =
  'w-full rounded-md border border-line bg-well px-4 py-3 text-md text-text placeholder:text-text-faint ' +
  'transition-[border-color,box-shadow] duration-fast focus:outline-none focus:border-accent focus:ring-2 focus:ring-focus-ring/40'

const label = 'block text-sm font-semibold text-text-dim mb-1.5'

export const Contact: FC = () => {
  const [status, setStatus] = useState<Status>('idle')

  const mailtoFor = (data: FormData) => {
    const subject = encodeURIComponent(`[${data.get('intent')}] ${data.get('name')}`)
    const body = encodeURIComponent(
      `${data.get('message')}\n\n— ${data.get('name')} <${data.get('email')}>`
    )
    return `mailto:${config.email}?subject=${subject}&body=${body}`
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    setStatus('sending')
    trackCta('contact_submit', { intent: String(data.get('intent')) })
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          intent: data.get('intent'),
          message: data.get('message'),
          website: data.get('website'),
        }),
      })
      if (res.ok) {
        setStatus('sent')
        form.reset()
        return
      }
      throw new Error(String(res.status))
    } catch {
      // Endpoint missing or provider down: hand off to the visitor's mail client instead.
      setStatus('error')
      window.location.href = mailtoFor(data)
    }
  }

  return (
    <section id="contact" className="relative py-32 overflow-clip">
      <div
        className="absolute inset-x-0 bottom-0 h-[60vh] bg-[radial-gradient(ellipse_at_bottom,rgba(255,90,31,0.32),rgba(255,45,111,0.08)_45%,transparent_70%)]"
        aria-hidden="true"
      />
      <FireParticles density={0.6} interactive={false} />

      <div className="relative max-w-6xl mx-auto px-6">
        <Reveal>
          <SectionHeading
            copy={config.sections.contact}
            titleClassName="text-glow"
            className="mb-12"
          />
        </Reveal>

        <Reveal delay={150}>
          <Card elevation="raised" padding="lg" className="fire-card glass max-w-2xl mx-auto">
            <form onSubmit={onSubmit} noValidate={false} className="grid gap-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contact-name" className={label}>
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    required
                    autoComplete="name"
                    className={field}
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className={label}>
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className={field}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-intent" className={label}>
                  What is this about?
                </label>
                <select id="contact-intent" name="intent" className={field} defaultValue="hiring">
                  {INTENTS.map((i) => (
                    <option key={i.value} value={i.value}>
                      {i.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="contact-message" className={label}>
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  minLength={10}
                  className={`${field} resize-y`}
                  placeholder="Role, project, timeline, budget… whatever helps."
                />
              </div>
              {/* honeypot: hidden from people, filled by bots */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                  type="submit"
                  size="lg"
                  loading={status === 'sending'}
                  leadingIcon={<MailIcon className="w-5 h-5" />}
                  className="animate-pulse-glow"
                >
                  Send message
                </Button>
                <a
                  href={`mailto:${config.email}`}
                  onClick={() => trackCta('contact_mailto')}
                  className="text-sm font-mono text-text-dim hover:text-blaze transition-colors py-2"
                >
                  or email {config.email}
                </a>
              </div>

              <p role="status" aria-live="polite" className="text-sm min-h-5">
                {status === 'sent' && (
                  <span className="text-success">Sent. I'll reply within a day or two.</span>
                )}
                {status === 'error' && (
                  <span className="text-text-dim">
                    The form could not be sent, so I opened your mail client with the message
                    instead.
                  </span>
                )}
              </p>
            </form>
          </Card>
        </Reveal>

        <Reveal delay={250}>
          <div className="flex items-center justify-center gap-6 mt-14">
            {config.socials.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${social.label} (opens in a new tab)`}
                onClick={() => trackCta('social', { network: social.label })}
                className="inline-flex items-center gap-2 py-2 text-text-dim hover:text-blaze text-sm font-semibold transition-all hover:-translate-y-0.5"
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
