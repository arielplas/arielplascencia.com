import type { FC, ReactNode } from 'react'
import { Text } from 'sukuna-ui'

interface SectionHeadingProps {
  eyebrow: string
  title: ReactNode
  subtitle?: string
  align?: 'start' | 'center'
  className?: string
}

/** Eyebrow + display title + optional subtitle, shared by every section. */
export const SectionHeading: FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className = '',
}) => (
  <div className={`${align === 'center' ? 'text-center' : ''} ${className}`}>
    <Text
      as="p"
      size="sm"
      tone="accent"
      tracking="eyebrow"
      weight="semibold"
      className="font-mono mb-4 inline-flex items-center gap-2"
    >
      <span className="inline-block h-px w-6 bg-accent" aria-hidden="true" />
      {eyebrow}
      <span className="inline-block h-px w-6 bg-accent" aria-hidden="true" />
    </Text>
    <Text
      as="h2"
      font="display"
      weight="black"
      leading="tight"
      tracking="tight"
      className="text-4xl md:text-5xl"
    >
      {title}
    </Text>
    {subtitle && (
      <Text as="p" tone="dim" size="lg" className="mt-4 max-w-2xl mx-auto">
        {subtitle}
      </Text>
    )}
  </div>
)
