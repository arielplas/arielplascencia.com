import { useEffect, useRef, useState } from 'react'

/**
 * Returns a ref and a boolean that flips to `true` the first time the element intersects
 * the viewport. The observer disconnects after the first hit.
 */
export function useInView<T extends Element>(threshold = 0.15) {
  const ref = useRef<T>(null)
  // Without IntersectionObserver (old browsers, jsdom) everything counts as in view.
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined')

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

  return [ref, inView] as const
}
