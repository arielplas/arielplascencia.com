import type { FC } from 'react'
import { LootReveal, Tabs } from '@sukunagg/ui'
import type { LootRarity, LootRevealItem } from '@sukunagg/ui'
import type { SkillGroup, SkillTier } from '../config/portfolio.config'
import config from '../config/portfolio.config'
import { useInView } from '../hooks/useInView'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

const RARITY: Record<SkillTier, LootRarity> = {
  main: 'legendary',
  daily: 'epic',
  proficient: 'rare',
}

const RARITY_LABELS: Partial<Record<LootRarity, string>> = {
  legendary: 'Main',
  epic: 'Daily',
  rare: 'Proficient',
}

const LEGEND = [
  { label: 'Main — first pick', swatch: 'bg-premium' },
  { label: 'Daily — in every project', swatch: 'bg-chart-5' },
  { label: 'Proficient — shipped with it', swatch: 'bg-chart-2' },
]

const toItems = (group: SkillGroup): LootRevealItem[] =>
  group.items.map((skill) => ({
    name: skill.name,
    kind: skill.kind,
    rarity: RARITY[skill.tier],
    icon: <span className="display-caps text-2xl">{skill.code}</span>,
  }))

/** A skill group's cards. LootReveal plays on mount, so nothing mounts until it is on screen. */
const Loadout: FC<{ group: SkillGroup; play: boolean }> = ({ group, play }) =>
  play ? (
    <LootReveal
      aria-label={`${group.label} loadout`}
      items={toItems(group)}
      rarityLabels={RARITY_LABELS}
      className="mx-auto max-w-3xl overflow-x-visible"
    />
  ) : (
    <div className="min-h-56" aria-hidden="true" />
  )

export const Skills: FC = () => {
  const [ref, inView] = useInView<HTMLDivElement>(0.3)

  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="relative overflow-clip border-y border-line-soft bg-[linear-gradient(180deg,var(--sk-bg),var(--sk-surface)_50%,var(--sk-bg))] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading copy={config.sections.skills} index={2} id="skills-title" />
        </Reveal>

        <div ref={ref} className="mt-12">
          <Tabs
            aria-label="Skill groups"
            variant="pill"
            defaultValue={config.skillGroups[0].label}
            items={config.skillGroups.map((group) => ({
              value: group.label,
              label: group.label,
              content: (
                <div className="pt-12">
                  <Loadout group={group} play={inView} />
                </div>
              ),
            }))}
          />
        </div>

        <ul className="hud m-0 mt-10 flex list-none flex-wrap justify-center gap-x-7 gap-y-2.5 p-0 text-[11px] text-text-dim">
          {LEGEND.map((item) => (
            <li key={item.label} className="inline-flex items-center gap-2">
              <span className={`size-2.5 rounded-[2px] ${item.swatch}`} aria-hidden="true" />
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
