import type { FC } from 'react'
import { Card, Text, XpLevelUp } from '@sukunagg/ui'
import config, { levelProgress, yearsOfExperience } from '../config/portfolio.config'
import { useInView } from '../hooks/useInView'
import { PlayerCard } from './PlayerCard'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

const level = yearsOfExperience(config.experience)
const progress = levelProgress(config.experience)
const current = config.experience[0]
const careerStart = config.experience.at(-1)?.period.split(' - ')[0]

export const About: FC = () => {
  // XpLevelUp plays once on mount and does not wait for visibility, so hold it at rest until the
  // card scrolls into view, then remount it to play the level-up.
  const [ref, inView] = useInView<HTMLDivElement>(0.4)

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="relative overflow-clip py-24 sm:py-32"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-start gap-14 px-4 sm:px-6">
        <div className="min-w-0 flex-[1_1_560px]">
          <Reveal>
            <SectionHeading copy={config.sections.about} index={1} id="about-title" />
            <Text as="p" className="mt-7 max-w-2xl text-lg leading-relaxed text-text/80">
              {config.about}
            </Text>
          </Reveal>

          <div ref={ref} className="mt-10">
            <Card elevation="raised" padding="lg" className="overflow-hidden">
              <XpLevelUp
                key={inView ? 'play' : 'rest'}
                levelUp={inView}
                title={`Career pass · Season ${new Date().getFullYear()}`}
                prelude="Career pass"
                headline="Level up"
                level={level}
                from={inView ? 72 : progress}
                progress={progress}
                gain={
                  <>
                    <b>+1 LV</b> · {level} years shipping
                  </>
                }
                // A node, not a string: a string would become the bar's aria-valuetext.
                xp={<>Since {careerStart}</>}
              >
                <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-t border-line pt-5">
                  <span className="hud text-[11px] text-text-faint">Current team</span>
                  <span className="font-bold">
                    {current.company}{' '}
                    <span className="font-normal text-text-dim">· {current.role}</span>
                  </span>
                </div>
              </XpLevelUp>
            </Card>
          </div>
        </div>

        <div className="mx-auto flex min-w-[260px] flex-[0_1_340px] flex-col items-center gap-7 pt-10">
          <PlayerCard level={level} />
          <p className="hud m-0 text-[10px] text-text-faint">Tilt with pointer or arrow keys</p>
        </div>
      </div>
    </section>
  )
}
