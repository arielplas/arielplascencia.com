import { render, screen, act } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Reveal } from './Reveal'
import { intersect } from '../test/setup'

describe('Reveal', () => {
  it('is hidden until it intersects, then stays visible and stops observing', () => {
    render(
      <Reveal>
        <p>hello</p>
      </Reveal>
    )
    const el = screen.getByTestId('reveal')
    expect(el.className).toContain('opacity-0')

    let observer: ReturnType<typeof intersect>
    act(() => {
      observer = intersect(el)
    })
    expect(el.className).toContain('opacity-100')
    expect(observer!.disconnect).toHaveBeenCalledTimes(1)
  })
})
