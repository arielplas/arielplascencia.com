import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

const subscribe = (callback: () => void) => {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {}
  const mql = window.matchMedia(QUERY)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

const getSnapshot = () =>
  typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(QUERY).matches

/** True when the OS asks for reduced motion. Updates live if the setting changes. */
export const useReducedMotion = () => useSyncExternalStore(subscribe, getSnapshot, () => false)

/** Non-hook variant for use inside effects and canvas loops. */
export const prefersReducedMotion = getSnapshot
