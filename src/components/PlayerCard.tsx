import type { FC } from 'react'
import { HoloCard } from '@sukunagg/fx'
import config from '../config/portfolio.config'

const MAIN_SKILL = config.skillGroups[0]?.items[0]
const initials = config.name
  .split(' ')
  .map((w) => w[0])
  .join('')

/** The holographic "player card" with Ariel's level, region and main language. */
export const PlayerCard: FC<{ level: number }> = ({ level }) => {
  const stats = [
    { label: 'LV', value: String(level) },
    { label: 'Region', value: 'MX' },
    { label: 'Main', value: MAIN_SKILL?.code ?? '—' },
    { label: 'Status', value: 'LFG', success: true },
  ]

  return (
    <HoloCard
      aria-label={`${config.name}, ${config.title}, level ${level}, ${config.location}, looking for a team`}
      className="w-[min(20rem,100%)]"
    >
      <div className="flex size-full flex-col bg-[linear-gradient(165deg,#2a1a1e_0%,var(--sk-surface)_42%,var(--sk-bg)_100%)] px-5 py-4.5">
        <div className="hud flex justify-between text-[10px] text-text-dim">
          <span>Player card</span>
          <span>No. 001</span>
        </div>

        <div className="relative grid flex-1 place-items-center">
          <div
            aria-hidden="true"
            className="absolute size-48 rounded-full bg-[radial-gradient(closest-side,var(--sk-accent-glow),transparent)] opacity-60"
          />
          <div className="hex relative grid size-33 place-items-center bg-[linear-gradient(135deg,var(--sk-accent),var(--sk-accent-deep)_60%,var(--sk-premium))]">
            <span className="hex grid size-[122px] place-items-center bg-[linear-gradient(160deg,var(--sk-surface-2),var(--sk-bg))] font-display text-[50px] font-black italic tracking-[-0.04em] [font-stretch:125%] [text-shadow:0_0_24px_var(--sk-accent-glow)]">
              {initials}
            </span>
          </div>
        </div>

        <p className="display-caps m-0 text-xl leading-none">{config.name}</p>
        <p className="hud m-0 mt-1.5 text-[11px] text-premium">{config.title}</p>

        <dl className="m-0 mt-3.5 grid grid-cols-4 gap-px overflow-hidden rounded-md bg-line">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-surface py-2 text-center">
              <dt className="hud text-[9px] tracking-[0.14em] text-text-faint">{stat.label}</dt>
              <dd
                className={`display-caps m-0 mt-0.5 text-lg ${stat.success ? 'text-success' : ''}`}
              >
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </HoloCard>
  )
}
