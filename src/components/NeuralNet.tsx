import { useEffect, useRef } from 'react'
import type { FC } from 'react'

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  pulse: number
}

interface NeuralNetProps {
  className?: string
  /** Nodes per 10k px². */
  density?: number
  /** Max link distance in px. */
  linkDistance?: number
}

/**
 * Drifting nodes connected by glowing links, with signal pulses travelling along edges. Reads as
 * a neural network / constellation. Pointer proximity brightens nearby links.
 */
export const NeuralNet: FC<NeuralNetProps> = ({
  className = '',
  density = 0.12,
  linkDistance = 150,
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
    let nodes: Node[] = []
    let raf = 0
    let tick = 0
    const pointer = { x: -9999, y: -9999 }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.max(18, Math.floor(((width * height) / 10000) * density))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1.4 + Math.random() * 1.8,
        pulse: Math.random() * Math.PI * 2,
      }))
    }

    const step = () => {
      tick++
      ctx.clearRect(0, 0, width, height)

      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > width) n.vx *= -1
        if (n.y < 0 || n.y > height) n.vy *= -1
      }

      // links
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d = Math.hypot(dx, dy)
          if (d > linkDistance) continue
          const strength = 1 - d / linkDistance
          const mx = (a.x + b.x) / 2
          const my = (a.y + b.y) / 2
          const pd = Math.hypot(pointer.x - mx, pointer.y - my)
          const near = pd < 180 ? 1 - pd / 180 : 0
          const alpha = 0.08 + strength * 0.22 + near * 0.5

          ctx.strokeStyle = near > 0.05
            ? `rgba(255, 138, 61, ${alpha})`
            : `rgba(255, 90, 31, ${alpha})`
          ctx.lineWidth = 0.6 + near
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()

          // travelling pulse along some edges
          if ((i + j) % 5 === 0) {
            const p = ((tick * 0.008 + (i * 13 + j * 7) * 0.05) % 1 + 1) % 1
            const px = a.x + (b.x - a.x) * p
            const py = a.y + (b.y - a.y) * p
            ctx.beginPath()
            ctx.fillStyle = `rgba(255, 210, 120, ${0.35 + strength * 0.5})`
            ctx.arc(px, py, 1.4, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }

      // nodes
      for (const n of nodes) {
        n.pulse += 0.03
        const glow = 0.6 + Math.sin(n.pulse) * 0.4
        ctx.beginPath()
        ctx.fillStyle = `rgba(255, 138, 61, ${0.45 + glow * 0.45})`
        ctx.shadowBlur = 10 * glow
        ctx.shadowColor = 'rgba(255, 90, 31, 0.9)'
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.shadowBlur = 0

      raf = requestAnimationFrame(step)
    }

    const onMove = (ev: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = ev.clientX - rect.left
      pointer.y = ev.clientY - rect.top
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove)

    if (reduceMotion) {
      step()
      cancelAnimationFrame(raf)
    } else {
      raf = requestAnimationFrame(step)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [density, linkDistance])

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  )
}
