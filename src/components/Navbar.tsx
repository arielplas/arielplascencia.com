import { useState } from 'react'
import type { FC } from 'react'
import { Avatar, AvatarFrame, Button, CloseIcon, Drawer } from '@sukunagg/ui'
import config, { yearsOfExperience } from '../config/portfolio.config'
import { trackCta } from '../lib/analytics'

const level = yearsOfExperience(config.experience)
const initials = config.name
  .split(' ')
  .map((w) => w[0])
  .join('')
// "Ariel P." on phones, where the full name would wrap.
const shortName = `${config.name.split(' ')[0]} ${initials.slice(1)}.`

/** The hexagon "AP" mark. */
const Logo: FC = () => (
  <span
    aria-hidden="true"
    className="hex grid size-9 place-items-center bg-gradient-accent font-display text-[13px] font-black italic text-on-accent"
  >
    {initials}
  </span>
)

const MenuIcon: FC = () => (
  <svg
    className="size-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
)

export const Navbar: FC = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/80 backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="mx-auto flex min-h-16 max-w-6xl items-center gap-6 px-4 sm:px-6"
      >
        <a
          href="#hero"
          className="flex items-center gap-3 whitespace-nowrap text-text no-underline"
        >
          <Logo />
          <span className="font-display text-sm font-extrabold uppercase tracking-[0.06em] [font-stretch:125%]">
            <span className="sm:hidden">{shortName}</span>
            <span className="hidden sm:inline">{config.name}</span>
          </span>
        </a>

        <ul className="m-0 ml-auto hidden list-none gap-1 p-0 lg:flex">
          {config.nav.map((id, i) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className="hud flex min-h-11 items-center gap-2 px-3 text-text-dim no-underline transition-colors hover:text-text hover:shadow-[inset_0_-2px_0_var(--sk-accent)]"
              >
                <span className="text-[10px] text-accent">{String(i + 1).padStart(2, '0')}</span>
                {config.sections[id].nav}
              </a>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <span className="hud whitespace-nowrap rounded-sm border border-premium/40 px-2 py-1 text-[11px] font-bold text-premium">
            LV {level}
          </span>
          <AvatarFrame status="online" statusLabel="Open to work">
            <Avatar fallback={initials} alt={config.name} size="md" />
          </AvatarFrame>

          <div className="lg:hidden">
            {/* trap-focus, not a full modal: a modal's scroll lock swallows the anchor jump when a
                menu link closes the drawer. */}
            <Drawer open={menuOpen} onOpenChange={setMenuOpen} modal="trap-focus">
              <Drawer.Trigger>
                <Button
                  variant="secondary"
                  iconOnly
                  aria-label="Open menu"
                  leadingIcon={<MenuIcon />}
                />
              </Drawer.Trigger>
              <Drawer.Content side="right" className="flex flex-col">
                <Drawer.Title className="hud text-text-dim">Menu</Drawer.Title>
                <Drawer.Close aria-label="Close menu">
                  <CloseIcon />
                </Drawer.Close>
                <ul className="m-0 mt-6 flex list-none flex-col p-0">
                  {config.nav.map((id, i) => (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        onClick={() => setMenuOpen(false)}
                        className="flex min-h-13 items-baseline gap-4 border-b border-line-soft px-2 py-3 text-text no-underline hover:text-accent"
                      >
                        <span className="hud text-[11px] text-accent">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="display-caps text-2xl">{config.sections[id].nav}</span>
                      </a>
                    </li>
                  ))}
                </ul>
                <Button
                  as="a"
                  href="#contact"
                  size="lg"
                  fullWidth
                  className="mt-auto"
                  onClick={() => {
                    trackCta('nav_hire')
                    setMenuOpen(false)
                  }}
                >
                  Send party invite
                </Button>
              </Drawer.Content>
            </Drawer>
          </div>
        </div>
      </nav>
    </header>
  )
}
