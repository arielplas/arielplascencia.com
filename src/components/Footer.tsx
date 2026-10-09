import type { FC } from 'react'
import config from '../config/portfolio.config'

export const Footer: FC = () => {
  return (
    <footer className="border-t border-line">
      <div className="hud mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-7 text-text-faint sm:flex-row sm:px-6">
        <p className="m-0">
          <b className="text-accent">GG</b> · © {new Date().getFullYear()} {config.name}
        </p>
        <p className="m-0">Built with @sukunagg/ui + @sukunagg/fx</p>
      </div>
    </footer>
  )
}
