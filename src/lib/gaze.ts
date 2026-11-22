import { useEffect, useRef, useState } from 'react'

/**
 * Where a cat should look: the pointer's position relative to an anchor element, each axis -1 … 1.
 * Smoothed with a light spring unless reduced motion is on. With no pointer (touch), the cat glances around now and then.
 */
export function useGaze<T extends Element>(anchor: React.RefObject<T | null>, { active = true, reduced = false, reach = 340 } = {}) {
  const [gaze, setGaze] = useState({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })
  const cur = useRef({ x: 0, y: 0 })
  const lastPointer = useRef(0)

  useEffect(() => {
    if (!active) return
    let raf = 0
    const onMove = (e: PointerEvent) => {
      const el = anchor.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height * 0.32
      target.current = {
        x: Math.max(-1, Math.min(1, (e.clientX - cx) / reach)),
        y: Math.max(-1, Math.min(1, (e.clientY - cy) / reach)),
      }
      lastPointer.current = performance.now()
      if (!raf) raf = requestAnimationFrame(step)
    }
    const step = () => {
      raf = 0
      const k = reduced ? 1 : 0.18
      cur.current = { x: cur.current.x + (target.current.x - cur.current.x) * k, y: cur.current.y + (target.current.y - cur.current.y) * k }
      setGaze({ ...cur.current })
      if (Math.abs(target.current.x - cur.current.x) + Math.abs(target.current.y - cur.current.y) > 0.004) raf = requestAnimationFrame(step)
    }
    // Idle glances when nobody is pointing (phones), skipped under reduced motion.
    const glance = window.setInterval(() => {
      if (reduced || performance.now() - lastPointer.current < 4000) return
      target.current = { x: (Math.random() * 2 - 1) * 0.7, y: (Math.random() * 2 - 1) * 0.4 }
      if (!raf) raf = requestAnimationFrame(step)
    }, 2600)
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.clearInterval(glance)
      cancelAnimationFrame(raf)
    }
  }, [anchor, active, reduced, reach])

  return gaze
}
