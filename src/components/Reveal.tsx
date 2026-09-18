import type { FC, ReactNode } from 'react'
import { useInView } from '../hooks/useInView'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface RevealProps {
  children: ReactNode
  delay?: number
  className?: string
}

/** Fades and slides content up when it scrolls into view. Static when motion is reduced. */
export const Reveal: FC<RevealProps> = ({ children, delay = 0, className = '' }) => {
  const [ref, inView] = useInView<HTMLDivElement>()
  const reduce = useReducedMotion()
  const visible = inView || reduce

  return (
    <div
      ref={ref}
      data-testid="reveal"
      style={{ transitionDelay: `${delay}ms` }}
      className={`${reduce ? '' : 'transition-all duration-700 ease-out'} ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  )
}
