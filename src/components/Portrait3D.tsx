import { forwardRef, useEffect, useState, type CSSProperties } from 'react'

/**
 * Hien as a 3D art-toy bust in round glasses, always facing the visitor (the cat is the one who follows the pointer).
 * Every 10 seconds she winks. The renders were made with an image model from her own photos and cut out of their
 * green backdrop by scripts/portrait_cutout.py; the wink frame differs from the front one only around that eye.
 * No photograph is shipped.
 */
const BASE = import.meta.env.BASE_URL
/** How often she winks, and how long the wink holds */
export const WINK_EVERY_MS = 10_000
export const WINK_HOLD_MS = 650

interface Props {
  /** Wink every 10 s. Off for reduced motion. */
  alive?: boolean
  className?: string
  style?: CSSProperties
  label?: string
}

export const Portrait3D = forwardRef<HTMLDivElement, Props>(function Portrait3D({ alive = true, className = '', style, label }, ref) {
  const [wink, setWink] = useState(false)

  useEffect(() => {
    if (!alive) return
    let off = 0
    const every = window.setInterval(() => {
      if (document.hidden) return // nobody is looking: no wink to waste
      setWink(true)
      off = window.setTimeout(() => setWink(false), WINK_HOLD_MS)
    }, WINK_EVERY_MS)
    return () => {
      window.clearInterval(every)
      window.clearTimeout(off)
      setWink(false)
    }
  }, [alive])

  return (
    <div ref={ref} className={`portrait portrait--3d ${wink ? 'is-winking' : ''} ${className}`} style={style} role={label ? 'img' : undefined} aria-label={label}>
      <img className="portrait3d__img" src={`${BASE}art/hien-front.webp`} width="720" height="720" alt="" decoding="async" fetchPriority="high" />
      <img className="portrait3d__img portrait3d__wink" src={`${BASE}art/hien-wink.webp`} width="720" height="720" alt="" decoding="async" />
    </div>
  )
})
