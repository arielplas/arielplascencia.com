import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})

/** Minimal IntersectionObserver stub. Tests can trigger entries via `intersect(el)`. */
type Callback = (entries: IntersectionObserverEntry[]) => void
const observers = new Map<Element, { cb: Callback; instance: MockObserver }>()

class MockObserver {
  disconnect = vi.fn(() => {
    for (const [el, rec] of observers) if (rec.instance === this) observers.delete(el)
  })
  unobserve = vi.fn()
  takeRecords = vi.fn(() => [])
  root = null
  rootMargin = ''
  thresholds = []
  cb: Callback
  constructor(cb: Callback) {
    this.cb = cb
  }
  observe = vi.fn((el: Element) => {
    observers.set(el, { cb: this.cb, instance: this })
  })
}

vi.stubGlobal('IntersectionObserver', MockObserver)

export const intersect = (el: Element) => {
  const rec = observers.get(el)
  rec?.cb([{ isIntersecting: true, target: el } as unknown as IntersectionObserverEntry])
  return rec?.instance
}

if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}

// jsdom has no canvas; the effect components bail out when getContext returns null.
HTMLCanvasElement.prototype.getContext = (() =>
  null) as unknown as typeof HTMLCanvasElement.prototype.getContext
