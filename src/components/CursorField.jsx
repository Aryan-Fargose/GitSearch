import { useEffect, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'

const DARK_PALETTE = [
  [168, 85, 247],
  [147, 51, 234],
  [192, 132, 252],
  [217, 70, 239],
  [20, 184, 166],
  [16, 185, 129],
]

// slightly deeper/richer tones for light mode so they read clearly via multiply blend
const LIGHT_PALETTE = [
  [59, 130, 246],
  [99, 102, 241],
  [139, 92, 246],
  [20, 184, 166],
  [16, 185, 129],
]

const CURSOR_GLOW_DARK = [192, 132, 252]
const CURSOR_GLOW_LIGHT = [99, 102, 241]

const RIBBON_COUNT = 18

export default function CursorField() {
  const canvasRef = useRef(null)
  const ribbonsRef = useRef([])
  const rawPointerRef = useRef({ x: -9999, y: -9999 })
  const smoothPointerRef = useRef({ x: -9999, y: -9999 })
  const prevSmoothPointerRef = useRef({ x: -9999, y: -9999 })
  const activityRef = useRef(0)
  const lastInputRef = useRef(0)
  const timeRef = useRef(0)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId
    const isDark = theme === 'dark'
    const blendMode = isDark ? 'lighter' : 'multiply'

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initRibbons()
    }

    function initRibbons() {
      const palette = isDark ? DARK_PALETTE : LIGHT_PALETTE
      const ribbons = []
      for (let i = 0; i < RIBBON_COUNT; i++) {
        const color = palette[i % palette.length]
        const homeX = Math.random() * canvas.width
        const homeY = Math.random() * canvas.height
        ribbons.push({
          homeX,
          homeY,
          x: homeX,
          y: homeY,
          angle: Math.random() * Math.PI * 2,
          length: 180 + Math.random() * 160,
          width: 30 + Math.random() * 24,
          color,
          layer: i % 2,
          phase: Math.random() * Math.PI * 2,
          flowSpeedX: 0.0006 + Math.random() * 0.0007,
          flowSpeedY: 0.0005 + Math.random() * 0.0006,
          flowRadiusX: 130 + Math.random() * 110,
          flowRadiusY: 100 + Math.random() * 90,
        })
      }
      ribbonsRef.current = ribbons
    }

    resize()
    window.addEventListener('resize', resize)

    function setPointer(x, y) {
      rawPointerRef.current = { x, y }
      lastInputRef.current = performance.now()
    }
    function handleMouseMove(e) { setPointer(e.clientX, e.clientY) }
    function handleTouchMove(e) {
      if (e.touches.length > 0) setPointer(e.touches[0].clientX, e.touches[0].clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchstart', handleTouchMove, { passive: true })

    function animate() {
      timeRef.current += 1

      prevSmoothPointerRef.current.x = smoothPointerRef.current.x
      prevSmoothPointerRef.current.y = smoothPointerRef.current.y
      smoothPointerRef.current.x += (rawPointerRef.current.x - smoothPointerRef.current.x) * 0.09
      smoothPointerRef.current.y += (rawPointerRef.current.y - smoothPointerRef.current.y) * 0.09

      const pvx = smoothPointerRef.current.x - prevSmoothPointerRef.current.x
      const pvy = smoothPointerRef.current.y - prevSmoothPointerRef.current.y
      const pointerSpeed = Math.min(Math.sqrt(pvx * pvx + pvy * pvy), 40)

      const idleFor = performance.now() - lastInputRef.current
      const targetActivity = idleFor < 800 ? 1 : 0
      const rate = targetActivity > activityRef.current ? 0.1 : 0.015
      activityRef.current += (targetActivity - activityRef.current) * rate

      // in light mode, painting a translucent white trail (via multiply) would do nothing,
      // so instead we clear + let a very light fade come from a low-alpha overlay in 'source-over'
      ctx.globalCompositeOperation = 'source-over'
      ctx.filter = 'none'
      if (isDark) {
        ctx.fillStyle = 'rgba(0,0,0,0.22)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      } else {
        ctx.fillStyle = 'rgba(255,255,255,0.30)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      ctx.globalCompositeOperation = blendMode

      const { x: px, y: py } = smoothPointerRef.current
      const activity = activityRef.current

      for (const rb of ribbonsRef.current) {
        const t = timeRef.current
        const flowX =
          Math.sin(t * rb.flowSpeedX + rb.phase) * rb.flowRadiusX +
          Math.sin(t * rb.flowSpeedX * 2.1 + rb.phase) * rb.flowRadiusX * 0.35
        const flowY =
          Math.cos(t * rb.flowSpeedY + rb.phase * 1.3) * rb.flowRadiusY +
          Math.cos(t * rb.flowSpeedY * 1.7 + rb.phase) * rb.flowRadiusY * 0.35

        const prevX = rb.x
        const prevY = rb.y
        const baseX = rb.homeX + flowX
        const baseY = rb.homeY + flowY

        const dx = px - baseX
        const dy = py - baseY
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        const falloff = Math.max(0, 1 - dist / 900)
        const pull = falloff * activity

        const targetX = baseX + dx * pull * 0.6
        const targetY = baseY + dy * pull * 0.6

        const ease = rb.layer === 1 ? 0.09 : 0.05
        rb.x += (targetX - rb.x) * ease
        rb.y += (targetY - rb.y) * ease

        const moveAngle = Math.atan2(rb.y - prevY, rb.x - prevX)
        rb.angle += (moveAngle - rb.angle) * 0.06

        const velocityStretch = Math.min(falloff * (pointerSpeed / 40) * 0.5, 0.6)

        const [r, g, b] = rb.color
        const layerBoost = rb.layer === 1 ? 1.0 : 0.6
        // multiply needs higher alpha to read clearly against white than additive needs against black
        const alphaScale = isDark ? 1 : 1.6
        const baseAlpha = (0.07 + pull * 0.1) * layerBoost * alphaScale
        const stretchedLength = rb.length * (1 + pull * 0.5 + velocityStretch)

        ctx.save()
        ctx.translate(rb.x, rb.y)
        ctx.rotate(rb.angle)

        ctx.filter = 'blur(14px)'
        const glowGrad = ctx.createLinearGradient(-stretchedLength / 2, 0, stretchedLength / 2, 0)
        glowGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`)
        glowGrad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${Math.min(baseAlpha, 0.6)})`)
        glowGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
        ctx.fillStyle = glowGrad
        ctx.beginPath()
        ctx.ellipse(0, 0, stretchedLength / 2, rb.width / 2, 0, 0, Math.PI * 2)
        ctx.fill()

        ctx.filter = 'blur(3px)'
        const coreAlpha = baseAlpha * 1.4
        const coreGrad = ctx.createLinearGradient(-stretchedLength * 0.42, 0, stretchedLength * 0.42, 0)
        coreGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`)
        coreGrad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${Math.min(coreAlpha, 0.7)})`)
        coreGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
        ctx.fillStyle = coreGrad
        ctx.beginPath()
        ctx.ellipse(0, 0, stretchedLength * 0.42, rb.width * 0.18, 0, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      }

      if (activity > 0.02) {
        const [r, g, b] = isDark ? CURSOR_GLOW_DARK : CURSOR_GLOW_LIGHT
        ctx.filter = 'blur(20px)'
        const alpha = (isDark ? 0.28 : 0.4) * activity
        const radius = 150 + activity * 60 + pointerSpeed
        const gradient = ctx.createRadialGradient(px, py, 0, px, py, radius)
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`)
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(px, py, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.filter = 'none'
      ctx.globalCompositeOperation = 'source-over'

      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchstart', handleTouchMove)
      cancelAnimationFrame(animationId)
    }
  }, [theme])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" aria-hidden="true" />
}