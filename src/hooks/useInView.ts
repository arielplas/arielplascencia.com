import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

const subscribeNever = () => () => {}

/**
 * Returns a ref and a boolean that flips to `true` the first time the element intersects
 * the viewport. The observer disconnects after the first hit.
 */
export function useInView<T extends Element>(threshold = 0.15) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  // Without IntersectionObserver (old browsers) everything counts as in view. The server
  // snapshot assumes support, so the prerendered markup matches the first client render.
  const unsupported = useSyncExternalStore(
    subscribeNever,
    () => typeof IntersectionObserver === 'undefined',
    () => false
  )

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, inView || unsupported] as const
}
