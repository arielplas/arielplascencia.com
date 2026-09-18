import { useEffect, useRef } from 'react'
import type { FC } from 'react'
import { prefersReducedMotion } from '../hooks/useReducedMotion'

interface Ember {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  life: number
  maxLife: number
  sprite: number
}

interface FireParticlesProps {
  /** Particles per 10k px² of canvas. */
  density?: number
  className?: string
  /** Pull embers toward the pointer. */
  interactive?: boolean
}

const SPRITE = 48
const HUES = [12, 22, 32, 42]

/** One pre-rendered radial glow per hue. Drawing a sprite is far cheaper than shadowBlur per particle. */
const makeSprites = () =>
  HUES.map((hue) => {
    const c = document.createElement('canvas')
    c.width = c.height = SPRITE
    const g = c.getContext('2d')!
    const grad = g.createRadialGradient(
      SPRITE / 2,
      SPRITE / 2,
      0,
      SPRITE / 2,
      SPRITE / 2,
      SPRITE / 2
    )
    grad.addColorStop(0, `hsla(${hue}, 100%, 80%, 1)`)
    grad.addColorStop(0.25, `hsla(${hue}, 100%, 62%, 0.85)`)
    grad.addColorStop(0.6, `hsla(${hue}, 100%, 55%, 0.25)`)
    grad.addColorStop(1, `hsla(${hue}, 100%, 50%, 0)`)
    g.fillStyle = grad
    g.fillRect(0, 0, SPRITE, SPRITE)
    return c
  })

/**
 * Rising ember particles on a full-size canvas. Embers spawn at the bottom, drift upward with
 * turbulence, and are pulled toward the pointer when `interactive`. The loop only runs while the
 * canvas is on screen and the tab is visible.
 */
export const FireParticles: FC<FireParticlesProps> = ({
  density = 0.9,
  className = '',
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = prefersReducedMotion()
    const sprites = makeSprites()
    let width = 0
    let height = 0
    let embers: Ember[] = []
    let raf = 0
    let visible = false
    let resizeTimer = 0
    const pointer = { x: -9999, y: -9999, active: false }

    const spawn = (fromBottom = true): Ember => {
      const maxLife = 180 + Math.random() * 240
      return {
        x: Math.random() * width,
        y: fromBottom ? height + Math.random() * 40 : Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(0.6 + Math.random() * 1.6),
        size: 1 + Math.random() * 2.6,
        life: fromBottom ? 0 : Math.random() * maxLife,
        maxLife,
        sprite: Math.floor(Math.random() * sprites.length),
      }
    }

    const resize = () => {
      // Decorative layer: 1.5× is plenty and halves the fill area versus 2× on retina screens.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const target = Math.floor(((width * height) / 10000) * density)
      embers = Array.from({ length: target }, () => spawn(false))
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'lighter'
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i]
        e.life++
        e.vx += (Math.random() - 0.5) * 0.08
        e.vx *= 0.98
        if (pointer.active) {
          const dx = pointer.x - e.x
          const dy = pointer.y - e.y
          const d2 = dx * dx + dy * dy
          if (d2 < 220 * 220) {
            const d = Math.sqrt(d2) || 1
            const f = (1 - d / 220) * 0.35
            e.vx += (dx / d) * f
            e.vy += (dy / d) * f
          }
        }
        e.x += e.vx
        e.y += e.vy

        const t = e.life / e.maxLife
        const alpha = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85
        const s = e.size * 5
        ctx.globalAlpha = Math.max(alpha, 0) * 0.9
        ctx.drawImage(sprites[e.sprite], e.x - s / 2, e.y - s / 2, s, s)

        if (e.life >= e.maxLife || e.y < -20 || e.x < -20 || e.x > width + 20) {
          embers[i] = spawn(true)
        }
      }
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
    }

    const loop = () => {
      draw()
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      if (reduceMotion || raf || !visible || document.hidden) return
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const onMove = (ev: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = ev.clientX - rect.left
      pointer.y = ev.clientY - rect.top
      pointer.active = true
    }
    const onLeave = () => {
      pointer.active = false
    }
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(resize, 150)
    }
    const onVisibility = () => (document.hidden ? stop() : start())

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else stop()
    })

    resize()
    if (reduceMotion) draw() // one static frame
    io.observe(canvas)
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)
    if (interactive && !reduceMotion) {
      window.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('pointerleave', onLeave)
    }

    return () => {
      stop()
      io.disconnect()
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [density, interactive])

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  )
}
