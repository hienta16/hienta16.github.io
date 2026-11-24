import { forwardRef, useEffect, useState, type CSSProperties } from 'react'

/**
 * Hien as a soft 3D art-toy bust. The images are rendered by Python (scripts/portrait3d.py, a signed-distance
 * ray-marcher): an open-eye frame and a blink frame, transparent WebP. Here they only blink now and then and lean a
 * touch toward the pointer, like the cats do. No photograph is used or shipped.
 */
const BASE = import.meta.env.BASE_URL

interface Props {
  /** Where the pointer is, each axis -1 … 1 */
  gaze?: { x: number; y: number }
  /** Blink and lean. Off for reduced motion. */
  alive?: boolean
  className?: string
  style?: CSSProperties
  label?: string
}

export const Portrait3D = forwardRef<HTMLDivElement, Props>(function Portrait3D({ gaze = { x: 0, y: 0 }, alive = true, className = '', style, label }, ref) {
  const [blink, setBlink] = useState(false)

  useEffect(() => {
    if (!alive) return
    let t = 0
    const loop = () => {
      t = window.setTimeout(() => {
        setBlink(true)
        window.setTimeout(() => setBlink(false), 140)
        loop()
      }, 3400 + Math.random() * 4200)
    }
    loop()
    return () => window.clearTimeout(t)
  }, [alive])

  const gx = Math.max(-1, Math.min(1, gaze.x))
  const gy = Math.max(-1, Math.min(1, gaze.y))
  const lean = alive ? `translate(${(gx * 1.2).toFixed(2)}%, ${(gy * 0.8).toFixed(2)}%) rotate(${(gx * 1.2).toFixed(2)}deg)` : undefined

  return (
    <div ref={ref} className={`portrait portrait--3d ${alive ? 'is-alive' : ''} ${className}`} style={style} role={label ? 'img' : undefined} aria-label={label}>
      <div className="portrait3d__lean" style={{ transform: lean }}>
        <img className="portrait3d__img" src={`${BASE}art/hien-3d.webp`} width="640" height="768" alt="" decoding="async" fetchPriority="high" />
        <img
          className="portrait3d__img portrait3d__blink"
          src={`${BASE}art/hien-3d-blink.webp`}
          width="640"
          height="768"
          alt=""
          decoding="async"
          style={{ opacity: blink ? 1 : 0 }}
        />
      </div>
    </div>
  )
})
