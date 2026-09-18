import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface LinkButtonProps extends ComponentPropsWithoutRef<'a'> {
  variant?: Variant
  size?: Size
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
}

// Mirrors sukuna-ui's Button classes so an <a> can look like a Button. Interim until sukuna-ui's
// Button supports Base UI's `render` prop (see docs/ai-improvements.md, item 6).
const base =
  'inline-flex items-center justify-center gap-2 select-none font-display font-bold tracking-tight ' +
  'transition-[background-color,box-shadow,transform] motion-reduce:transition-none duration-fast ease-sukuna ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg ' +
  'active:scale-[.98] motion-reduce:active:scale-100 no-underline'

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-accent text-on-accent hover:brightness-110 hover:shadow-[0_0_22px_4px_var(--sk-accent-glow)]',
  secondary: 'bg-surface-2 text-text border border-line hover:bg-well',
  ghost: 'bg-transparent text-text-dim hover:text-text hover:bg-line-soft',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm rounded-sm',
  md: 'h-10 px-5 text-md rounded-md',
  lg: 'h-12 px-6 text-lg rounded-lg',
}

/** An anchor styled like a sukuna-ui Button. Keeps middle-click, hover URL and the link role. */
export const LinkButton: FC<LinkButtonProps> = ({
  variant = 'primary',
  size = 'md',
  leadingIcon,
  trailingIcon,
  className = '',
  children,
  target,
  rel,
  ...rest
}) => {
  const external = target === '_blank'
  return (
    <a
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      target={target}
      rel={external ? (rel ?? 'noopener noreferrer') : rel}
      {...rest}
    >
      {leadingIcon}
      {children}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
      {trailingIcon}
    </a>
  )
}
