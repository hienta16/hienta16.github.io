import { forwardRef, type CSSProperties } from 'react'

/**
 * Hien as a 3D art-toy bust, always facing the visitor (the cat is the one who moves). The render was made with an
 * image model from her own photos and cut out of its green backdrop by scripts/portrait_cutout.py.
 * No photograph is shipped.
 */
const BASE = import.meta.env.BASE_URL

interface Props {
  className?: string
  style?: CSSProperties
  label?: string
}

export const Portrait3D = forwardRef<HTMLDivElement, Props>(function Portrait3D({ className = '', style, label }, ref) {
  return (
    <div ref={ref} className={`portrait portrait--3d ${className}`} style={style} role={label ? 'img' : undefined} aria-label={label}>
      <img className="portrait3d__img" src={`${BASE}art/hien-front.webp`} width="720" height="720" alt="" decoding="async" fetchPriority="high" />
    </div>
  )
})
