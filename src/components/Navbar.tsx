import { useEffect, useState } from 'react'
import type { FC } from 'react'
import { Button } from 'sukuna-ui'
import config from '../config/portfolio.config'
import { Flame } from './Flame'

const links = ['about', 'skills', 'projects', 'experience', 'contact']

export const Navbar: FC = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const hire = () => {
    window.location.href = `mailto:${config.email}`
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-line-soft shadow-[0_10px_40px_-20px_rgba(255,90,31,0.35)]' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a
          href="#hero"
          className="group flex items-center gap-2 font-display text-xl font-black tracking-tight text-text hover:text-blaze transition-colors"
        >
          <Flame className="w-8 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" animate />
          {config.name.split(' ')[0]}
          <span className="-ml-1 text-accent">_</span>
        </a>

        <ul className="hidden md:flex gap-8">
          {links.map((link) => (
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
          <Button size="sm" onClick={hire}>
            Hire me
          </Button>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-text-dim hover:text-text transition-colors"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden glass border-t border-line px-6 py-4">
          <ul className="flex flex-col gap-4">
            {links.map((link) => (
              <li key={link}>
                <a
                  href={`#${link}`}
                  onClick={() => setMenuOpen(false)}
                  className="text-text-dim font-semibold capitalize hover:text-blaze transition-colors"
                >
                  {link}
                </a>
              </li>
            ))}
            <li>
              <Button size="sm" onClick={hire}>
                Hire me
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
