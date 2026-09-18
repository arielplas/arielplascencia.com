import { useEffect, useRef } from 'react'
import type { FC } from 'react'
import { prefersReducedMotion } from '../hooks/useReducedMotion'

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
  /** Hard cap on node count; the link loop is O(n²). */
  maxNodes?: number
}

const ALPHA_BUCKETS = 6
const NODE_SPRITE = 24

const makeNodeSprite = () => {
  const c = document.createElement('canvas')
  c.width = c.height = NODE_SPRITE
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(
    NODE_SPRITE / 2,
    NODE_SPRITE / 2,
    0,
    NODE_SPRITE / 2,
    NODE_SPRITE / 2,
    NODE_SPRITE / 2
  )
  grad.addColorStop(0, 'rgba(255, 200, 140, 1)')
  grad.addColorStop(0.3, 'rgba(255, 138, 61, 0.9)')
  grad.addColorStop(1, 'rgba(255, 90, 31, 0)')
  g.fillStyle = grad
  g.fillRect(0, 0, NODE_SPRITE, NODE_SPRITE)
  return c
}

/**
 * Drifting nodes connected by glowing links, with signal pulses travelling along edges. Reads as
 * a neural network / constellation. Pointer proximity brightens nearby links. Runs only while on
 * screen; links are batched into a handful of stroke calls instead of one per pair.
 */
export const NeuralNet: FC<NeuralNetProps> = ({
  className = '',
  density = 0.12,
  linkDistance = 150,
  maxNodes = 90,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = prefersReducedMotion()
    const sprite = makeNodeSprite()
    const linkD2 = linkDistance * linkDistance
    let width = 0
    let height = 0
    let nodes: Node[] = []
    let raf = 0
    let tick = 0
    let visible = false
    let resizeTimer = 0
    const pointer = { x: -9999, y: -9999 }
    const buckets: Path2D[] = []

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(
        maxNodes,
        Math.max(18, Math.floor(((width * height) / 10000) * density))
      )
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1.4 + Math.random() * 1.8,
        pulse: Math.random() * Math.PI * 2,
      }))
    }

    const draw = () => {
      tick++
      ctx.clearRect(0, 0, width, height)

      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > width) n.vx *= -1
        if (n.y < 0 || n.y > height) n.vy *= -1
      }

      // Links, batched by quantized alpha so we stroke ~7 paths instead of hundreds.
      for (let b = 0; b < ALPHA_BUCKETS; b++) buckets[b] = new Path2D()
      const near = new Path2D()
      const pulses: [number, number, number][] = []

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 > linkD2) continue
          const strength = 1 - Math.sqrt(d2) / linkDistance
          const mx = (a.x + b.x) / 2
          const my = (a.y + b.y) / 2
          const pdx = pointer.x - mx
          const pdy = pointer.y - my
          const nearPointer = pdx * pdx + pdy * pdy < 180 * 180

          const path = nearPointer
            ? near
            : buckets[Math.min(ALPHA_BUCKETS - 1, Math.floor(strength * ALPHA_BUCKETS))]
          path.moveTo(a.x, a.y)
          path.lineTo(b.x, b.y)

          if ((i + j) % 5 === 0) {
            const p = (((tick * 0.008 + (i * 13 + j * 7) * 0.05) % 1) + 1) % 1
            pulses.push([a.x + (b.x - a.x) * p, a.y + (b.y - a.y) * p, 0.35 + strength * 0.5])
          }
        }
      }

      ctx.lineWidth = 0.7
      for (let b = 0; b < ALPHA_BUCKETS; b++) {
        const alpha = 0.08 + ((b + 0.5) / ALPHA_BUCKETS) * 0.22
        ctx.strokeStyle = `rgba(255, 90, 31, ${alpha.toFixed(3)})`
        ctx.stroke(buckets[b])
      }
      ctx.lineWidth = 1.4
      ctx.strokeStyle = 'rgba(255, 138, 61, 0.6)'
      ctx.stroke(near)

      for (const [px, py, alpha] of pulses) {
        ctx.globalAlpha = alpha
        ctx.fillStyle = 'rgb(255, 210, 120)'
        ctx.fillRect(px - 1.2, py - 1.2, 2.4, 2.4)
      }

      for (const n of nodes) {
        n.pulse += 0.03
        const glow = 0.6 + Math.sin(n.pulse) * 0.4
        const s = n.r * 6 * glow
        ctx.globalAlpha = 0.5 + glow * 0.5
        ctx.drawImage(sprite, n.x - s / 2, n.y - s / 2, s, s)
      }
      ctx.globalAlpha = 1
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
    if (reduceMotion) draw()
    io.observe(canvas)
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)
    if (!reduceMotion) window.addEventListener('pointermove', onMove, { passive: true })

    return () => {
      stop()
      io.disconnect()
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onMove)
    }
  }, [density, linkDistance, maxNodes])

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  )
}
