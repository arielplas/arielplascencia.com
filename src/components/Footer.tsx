import type { FC } from 'react'
import { Divider, Text } from 'sukuna-ui'
import config from '../config/portfolio.config'
import { Flame } from './Flame'

export const Footer: FC = () => {
  return (
    <footer className="relative">
      <Divider decorative className="border-line" />
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <Text as="p" size="sm" tone="faint" className="inline-flex items-center gap-2">
          <Flame className="w-4" />© {new Date().getFullYear()} {config.name}. All rights reserved.
        </Text>
        <Text as="p" size="sm" tone="faint" className="font-mono">
          Built with <span className="text-blaze">React</span>
          {' + '}
          <span className="text-blaze">TypeScript</span>
          {' + '}
          <span className="text-blaze">sukuna-ui</span>
          {' — forged in fire, powered by AI'}
        </Text>
      </div>
    </footer>
  )
}
