import { describe, expect, it } from 'vitest'
import config, { levelProgress, sectionTitle, yearsOfExperience } from './portfolio.config'

const ICONS = ['github', 'linkedin', 'resume'] as const

describe('portfolio config invariants', () => {
  it('every social link uses a known icon and an https URL', () => {
    for (const s of config.socials) {
      expect(ICONS).toContain(s.icon)
      expect(s.url).toMatch(/^https:\/\//)
    }
  })

  it('has exactly one resume link', () => {
    expect(config.socials.filter((s) => s.icon === 'resume')).toHaveLength(1)
  })

  it('every project has a live or repo URL and at least one tag', () => {
    for (const p of config.projects) {
      expect(p.liveUrl || p.repoUrl, `${p.title} needs a URL`).toBeTruthy()
      expect(p.tags.length, `${p.title} needs tags`).toBeGreaterThan(0)
    }
  })

  it('project titles are unique (they are used as React keys)', () => {
    const titles = config.projects.map((p) => p.title)
    expect(new Set(titles).size).toBe(titles.length)
  })

  it('every nav entry has section copy', () => {
    for (const id of config.nav) expect(config.sections[id]).toBeDefined()
  })

  it('section highlights are substrings of their titles', () => {
    for (const s of Object.values(config.sections)) {
      if (s.highlight) expect(s.title).toContain(s.highlight)
    }
  })

  it('experience periods parse and years of experience is derived from them', () => {
    for (const e of config.experience) {
      expect(e.period).toMatch(/^[A-Z][a-z]{2} \d{4} - ([A-Z][a-z]{2} \d{4}|Present)$/)
    }
    expect(yearsOfExperience(config.experience, new Date('2026-09-17'))).toBe(6)
  })

  it('level progress is the share of the current career year, 0–100', () => {
    // Career starts Oct 2019: mid-April is about half way through a year.
    expect(levelProgress(config.experience, new Date('2026-04-01'))).toBeGreaterThan(45)
    expect(levelProgress(config.experience, new Date('2026-04-01'))).toBeLessThan(55)
    expect(levelProgress(config.experience, new Date('2026-10-02'))).toBeLessThan(2)
  })

  it('fills {years} in section titles', () => {
    expect(sectionTitle(config.sections.about, 7)).toBe('7 years in the game')
  })

  it('marks exactly one featured project', () => {
    expect(config.projects.filter((p) => p.featured)).toHaveLength(1)
  })

  it('skill codes fit the card hexagon', () => {
    for (const group of config.skillGroups) {
      for (const skill of group.items) expect(skill.code.length, skill.name).toBeLessThanOrEqual(2)
    }
  })
})
