import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import config from '../config/portfolio.config'
import { Projects } from './Projects'

const byCategory = (category: string) =>
  config.projects.filter((p) => (p.category ?? 'My Projects') === category)

describe('Projects', () => {
  it('renders one tab per category with the project count', () => {
    render(<Projects />)
    const tabs = screen.getAllByRole('tab')
    const categories = [...new Set(config.projects.map((p) => p.category ?? 'My Projects'))]
    expect(tabs).toHaveLength(categories.length)
    for (const category of categories) {
      const tab = screen.getByRole('tab', { name: new RegExp(category) })
      expect(tab).toHaveTextContent(String(byCategory(category).length))
    }
  })

  it('shows the first category by default and switches on click', () => {
    render(<Projects />)
    const [first, second] = screen.getAllByRole('tab')
    expect(first).toHaveAttribute('aria-selected', 'true')

    const panel = screen.getByRole('tabpanel')
    const firstTitles = byCategory(first.textContent!.replace(/\d+$/, '').trim()).map(
      (p) => p.title
    )
    for (const title of firstTitles) {
      expect(within(panel).getByRole('heading', { name: title })).toBeInTheDocument()
    }

    fireEvent.click(second)
    expect(second).toHaveAttribute('aria-selected', 'true')
    expect(first).toHaveAttribute('aria-selected', 'false')
    const secondTitles = byCategory(second.textContent!.replace(/\d+$/, '').trim()).map(
      (p) => p.title
    )
    const newPanel = screen.getByRole('tabpanel')
    for (const title of secondTitles) {
      expect(within(newPanel).getByRole('heading', { name: title })).toBeInTheDocument()
    }
    expect(newPanel).toHaveAttribute('aria-labelledby', second.id)
  })

  it('moves between tabs with the arrow keys', () => {
    render(<Projects />)
    const tablist = screen.getByRole('tablist')
    const [first, second] = screen.getAllByRole('tab')
    fireEvent.keyDown(tablist, { key: 'ArrowRight' })
    expect(second).toHaveAttribute('aria-selected', 'true')
    fireEvent.keyDown(tablist, { key: 'ArrowLeft' })
    expect(first).toHaveAttribute('aria-selected', 'true')
  })
})
