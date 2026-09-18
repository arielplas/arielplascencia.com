import type { FC } from 'react'

interface FlameProps {
  className?: string
  /** Adds the flicker animation. */
  animate?: boolean
}

/** Gradient flame mark used as the logo and as a decorative icon. */
export const Flame: FC<FlameProps> = ({ className = '', animate = false }) => (
  <svg
    viewBox="0 0 64 64"
    className={`${animate ? 'animate-flicker' : ''} ${className}`}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="flame-g" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#c9220f" />
        <stop offset="0.5" stopColor="#ff5a1f" />
        <stop offset="1" stopColor="#ffd166" />
      </linearGradient>
    </defs>
    <path
      fill="url(#flame-g)"
      d="M32 4c2 10 12 14 12 26 0 4-1 7-3 10 5-2 8-7 8-13 6 6 9 13 9 20 0 11-11 17-26 17S6 58 6 47c0-9 5-15 10-20 0 5 2 8 5 10-2-14 6-22 11-33z"
    />
    <path
      fill="#fff7ed"
      opacity="0.9"
      d="M32 30c2 6 8 8 8 15 0 6-4 9-8 9s-8-3-8-9c0-4 2-6 4-8 0 3 1 4 3 5-1-5 0-8 1-12z"
    />
  </svg>
)
