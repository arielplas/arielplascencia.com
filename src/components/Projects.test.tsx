import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import config from '../config/portfolio.config'
import { Projects } from './Projects'

const featured = config.projects.find((p) => p.featured)!
const rest = config.projects.filter((p) => !p.featured)
const categoryOf = (p: (typeof config.projects)[number]) => p.category ?? 'My Projects'
const categories = [...new Set(rest.map(categoryOf))]

const gridTitles = () =>
  within(screen.getByRole('list', { name: 'Projects' }))
    .getAllByRole('heading')
    .map((h) => h.textContent)

describe('Projects', () => {
  it('shows the featured project on its own, outside the grid', () => {
    render(<Projects />)
    expect(screen.getByRole('article', { name: featured.title })).toBeInTheDocument()
    expect(gridTitles()).not.toContain(featured.title)
  })

  it('renders an "All" filter plus one per category, each with its count', () => {
    render(<Projects />)
    const group = screen.getByRole('group', { name: 'More missions' })
    const buttons = within(group).getAllByRole('button')
    expect(buttons).toHaveLength(categories.length + 1)
    expect(buttons[0]).toHaveTextContent(`All · ${rest.length}`)
    for (const category of categories) {
      const count = rest.filter((p) => categoryOf(p) === category).length
      expect(within(group).getByRole('button', { name: `${category} · ${count}` })).toBeVisible()
    }
  })

  it('shows every other project by default and filters by category on click', () => {
    render(<Projects />)
    expect(gridTitles()).toEqual(rest.map((p) => p.title))

    const [category] = categories
    const button = screen.getByRole('button', { name: new RegExp(`^${category}`) })
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(gridTitles()).toEqual(rest.filter((p) => categoryOf(p) === category).map((p) => p.title))
  })
})
