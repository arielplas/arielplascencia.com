import { useState } from 'react'
import type { FC, FormEvent } from 'react'
import { FlowField } from '@sukunagg/fx'
import { Button, Card, Spinner } from '@sukunagg/ui'
import config from '../config/portfolio.config'
import { trackCta } from '../lib/analytics'
import { MailIcon, SocialIcon } from './Icons'
import { SectionHeading } from './SectionHeading'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const INTENTS = [
  { value: 'hiring', label: "I'm hiring for a role" },
  { value: 'project', label: 'I have a project' },
  { value: 'other', label: 'Something else' },
]

const field =
  'w-full rounded-md border border-line bg-well/80 px-4 py-3 text-md text-text placeholder:text-text-faint ' +
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
    <section id="contact" aria-labelledby="contact-title" className="relative">
      {/* The field calms once the invite is sent: the search is over. */}
      <FlowField calm={status === 'sent'} className="min-h-0 py-24 sm:py-32">
        <div className="mx-auto w-full max-w-2xl px-4 sm:px-6">
          <SectionHeading
            copy={config.sections.contact}
            index={5}
            id="contact-title"
            align="center"
          />

          <p className="hud mt-7 flex items-center justify-center gap-3 text-text-dim">
            {status === 'sent' ? (
              <span className="text-success">Invite sent — I'll reply within a day or two.</span>
            ) : (
              <>
                <Spinner size="sm" aria-hidden="true" />
                Searching for my next team…
              </>
            )}
          </p>

          <Card elevation="raised" padding="lg" className="mt-10 bg-surface/85 backdrop-blur-sm">
            <form onSubmit={onSubmit} noValidate={false} className="grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
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

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Button
                  type="submit"
                  size="lg"
                  loading={status === 'sending'}
                  leadingIcon={<MailIcon className="size-5" />}
                >
                  Accept — send invite
                </Button>
                <a
                  href={`mailto:${config.email}`}
                  onClick={() => trackCta('contact_mailto')}
                  className="hud py-2 text-[12px] tracking-[0.08em] text-premium normal-case no-underline hover:text-text"
                >
                  or email {config.email}
                </a>
              </div>

              <p role="status" aria-live="polite" className="m-0 min-h-5 text-sm">
                {status === 'error' && (
                  <span className="text-text-dim">
                    The form could not be sent, so I opened your mail client with the message
                    instead.
                  </span>
                )}
              </p>
            </form>
          </Card>

          <ul className="m-0 mt-8 flex list-none flex-wrap justify-center gap-2.5 p-0">
            {config.socials.map((social) => (
              <li key={social.label}>
                <Button
                  as="a"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  leadingIcon={<SocialIcon icon={social.icon} className="size-4" />}
                  onClick={() => trackCta('social', { network: social.label })}
                >
                  {social.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </FlowField>
    </section>
  )
}
