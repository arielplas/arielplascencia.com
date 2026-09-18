import { useEffect, useRef } from 'react'
import type { FC } from 'react'

interface Ember {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  life: number
  maxLife: number
  hue: number
}

interface FireParticlesProps {
  /** Particles per 10k px² of canvas. */
  density?: number
  className?: string
  /** Pull embers toward the pointer. */
  interactive?: boolean
}

/**
 * Rising ember particles on a full-size canvas. Embers spawn at the bottom, drift upward with
 * turbulence, and are pulled toward the pointer when `interactive`.
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

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let embers: Ember[] = []
    let raf = 0
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
        hue: 10 + Math.random() * 35,
      }
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const target = Math.floor(((width * height) / 10000) * density)
      embers = Array.from({ length: target }, () => spawn(false))
    }

    const step = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'lighter'

      for (let i = 0; i < embers.length; i++) {
        const e = embers[i]
        e.life++
        // turbulence
        e.vx += (Math.random() - 0.5) * 0.08
        e.vx *= 0.98
        // attraction to pointer
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
        const light = 55 + (1 - t) * 20
        ctx.beginPath()
        ctx.fillStyle = `hsla(${e.hue}, 100%, ${light}%, ${Math.max(alpha, 0) * 0.9})`
        ctx.shadowBlur = 12
        ctx.shadowColor = `hsla(${e.hue}, 100%, 55%, ${alpha})`
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2)
        ctx.fill()

        if (e.life >= e.maxLife || e.y < -20 || e.x < -20 || e.x > width + 20) {
          embers[i] = spawn(true)
        }
      }
      ctx.shadowBlur = 0
      ctx.globalCompositeOperation = 'source-over'
      raf = requestAnimationFrame(step)
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

    resize()
    window.addEventListener('resize', resize)
    if (interactive) {
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerleave', onLeave)
    }

    if (reduceMotion) {
      // draw a single static frame
      step()
      cancelAnimationFrame(raf)
    } else {
      raf = requestAnimationFrame(step)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
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
