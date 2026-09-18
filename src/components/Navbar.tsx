import { useEffect, useRef, useState } from 'react'
import type { FC } from 'react'
import config from '../config/portfolio.config'
import { trackCta } from '../lib/analytics'
import { Flame } from './Flame'
import { LinkButton } from './LinkButton'

const MENU_ID = 'mobile-menu'

export const Navbar: FC = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Escape closes the mobile menu and returns focus to the toggle; resizing to desktop closes it.
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        toggleRef.current?.focus()
      }
    }
    const mql = window.matchMedia('(min-width: 768px)')
    const onChange = () => mql.matches && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    mql.addEventListener('change', onChange)
    return () => {
      window.removeEventListener('keydown', onKey)
      mql.removeEventListener('change', onChange)
    }
  }, [menuOpen])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass border-b border-line-soft shadow-[0_10px_40px_-20px_rgba(255,90,31,0.35)]'
          : 'bg-transparent'
      }`}
    >
      <nav
        className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between"
        aria-label="Primary"
      >
        <a
          href="#hero"
          className="group flex items-center gap-2 font-display text-xl font-black tracking-tight text-text hover:text-blaze transition-colors"
        >
          <Flame
            className="w-8 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
            animate
          />
          {config.name.split(' ')[0]}
          <span className="-ml-1 text-accent" aria-hidden="true">
            _
          </span>
        </a>

        <ul className="hidden md:flex gap-8">
          {config.nav.map((link) => (
            <li key={link}>
              <a
                href={`#${link}`}
                className="relative text-sm font-semibold text-text-dim capitalize hover:text-text transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-gradient-accent after:transition-all hover:after:w-full"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <LinkButton href="#contact" size="sm" onClick={() => trackCta('nav_hire')}>
            Hire me
          </LinkButton>
        </div>

        <button
          ref={toggleRef}
          onClick={() => setMenuOpen((open) => !open)}
          className="md:hidden p-2 -m-2 text-text-dim hover:text-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring rounded-md"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls={MENU_ID}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div id={MENU_ID} className="md:hidden glass border-t border-line px-6 py-4">
          <ul className="flex flex-col gap-4">
            {config.nav.map((link) => (
              <li key={link}>
                <a
                  href={`#${link}`}
                  onClick={() => setMenuOpen(false)}
                  className="block py-1 text-text-dim font-semibold capitalize hover:text-blaze transition-colors"
                >
                  {link}
                </a>
              </li>
            ))}
            <li>
              <LinkButton
                href="#contact"
                size="sm"
                onClick={() => {
                  trackCta('nav_hire')
                  setMenuOpen(false)
                }}
              >
                Hire me
              </LinkButton>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
