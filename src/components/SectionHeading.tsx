import type { FC } from 'react'
import { Text } from '@sukunagg/ui'
import type { SectionCopy } from '../config/portfolio.config'
import config, { sectionTitle, yearsOfExperience } from '../config/portfolio.config'

interface SectionHeadingProps {
  copy: SectionCopy
  /** Section number shown before the eyebrow ("01"). */
  index: number
  /** Id for the `h2`, so the section can point `aria-labelledby` at it. */
  id: string
  align?: 'start' | 'center'
  className?: string
}

/** Paints `highlight` in the accent color; the rest of the title stays plain. */
export const Highlight: FC<{ text: string; highlight?: string }> = ({ text, highlight }) => {
  if (!highlight || !text.includes(highlight)) return <>{text}</>
  const [before, after] = text.split(highlight)
  return (
    <>
      {before}
      <span className="text-accent">{highlight}</span>
      {after}
    </>
  )
}

/** HUD eyebrow + expanded display title + optional subtitle, shared by every section. */
export const SectionHeading: FC<SectionHeadingProps> = ({
  copy,
  index,
  id,
  align = 'start',
  className = '',
}) => {
  const center = align === 'center'
  return (
    <div className={`${center ? 'text-center' : ''} ${className}`}>
      <p
        className={`hud m-0 flex items-center gap-3 text-accent ${center ? 'justify-center' : ''}`}
      >
        <span>{String(index).padStart(2, '0')}</span>
        <span className="h-px w-10 bg-accent/60" aria-hidden="true" />
        <span>{copy.eyebrow}</span>
      </p>
      <h2 id={id} className="display-caps mt-4 text-4xl sm:text-5xl lg:text-6xl">
        <Highlight
          text={sectionTitle(copy, yearsOfExperience(config.experience))}
          highlight={copy.highlight}
        />
      </h2>
      {copy.subtitle && (
        <Text as="p" tone="dim" className={`mt-4 text-lg ${center ? 'mx-auto max-w-2xl' : ''}`}>
          {copy.subtitle}
        </Text>
      )}
    </div>
  )
}
