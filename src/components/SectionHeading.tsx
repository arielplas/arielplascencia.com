import type { FC } from 'react'
import { Text } from 'sukuna-ui'
import type { SectionCopy } from '../config/portfolio.config'

interface SectionHeadingProps {
  copy: SectionCopy
  align?: 'start' | 'center'
  className?: string
  /** Extra classes for the title (e.g. text-glow on the contact section). */
  titleClassName?: string
}

/** Wraps `highlight` in the fire gradient; the rest of the title stays plain. */
export const Highlight: FC<{ text: string; highlight?: string; className?: string }> = ({
  text,
  highlight,
  className = 'text-fire',
}) => {
  if (!highlight || !text.includes(highlight)) return <>{text}</>
  const [before, after] = text.split(highlight)
  return (
    <>
      {before}
      <span className={className}>{highlight}</span>
      {after}
    </>
  )
}

/** Eyebrow + display title + optional subtitle, shared by every section. */
export const SectionHeading: FC<SectionHeadingProps> = ({
  copy,
  align = 'center',
  className = '',
  titleClassName = '',
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
      {copy.eyebrow}
      <span className="inline-block h-px w-6 bg-accent" aria-hidden="true" />
    </Text>
    <Text
      as="h2"
      font="display"
      weight="black"
      leading="tight"
      tracking="tight"
      className={`text-4xl md:text-5xl ${titleClassName}`}
    >
      <Highlight text={copy.title} highlight={copy.highlight} />
    </Text>
    {copy.subtitle && (
      <Text as="p" tone="dim" size="lg" className="mt-4 max-w-2xl mx-auto">
        {copy.subtitle}
      </Text>
    )}
  </div>
)
