import { forwardRef, type CSSProperties } from 'react'

/**
 * Hien as a 3D art-toy bust. Three renders of the same figure (made with an image model from her own photos, then cut
 * out of their green backdrop by scripts/portrait_cutout.py): facing the visitor, looking left, looking right. Like
 * the cats, she watches your pointer: the view follows it, with a soft cross-fade. With reduced motion she stays front.
 * No photograph is shipped.
 */
const BASE = import.meta.env.BASE_URL
const VIEWS = ['left', 'front', 'right'] as const
type View = (typeof VIEWS)[number]

/** Which way to look for a pointer at x (-1 … 1, relative to the portrait) */
export const viewFor = (x: number): View => (x < -0.35 ? 'left' : x > 0.35 ? 'right' : 'front')

interface Props {
  /** Where the pointer is, each axis -1 … 1 */
  gaze?: { x: number; y: number }
  /** Follow the pointer. Off for reduced motion. */
  alive?: boolean
  className?: string
  style?: CSSProperties
  label?: string
}

export const Portrait3D = forwardRef<HTMLDivElement, Props>(function Portrait3D({ gaze = { x: 0, y: 0 }, alive = true, className = '', style, label }, ref) {
  const view: View = alive ? viewFor(gaze.x) : 'front'
  return (
    <div ref={ref} className={`portrait portrait--3d ${className}`} style={style} role={label ? 'img' : undefined} aria-label={label}>
      {VIEWS.map((v) => (
        <img
          key={v}
          className={`portrait3d__img ${v === 'front' ? '' : 'portrait3d__alt'} ${v === view ? 'is-on' : ''}`}
          src={`${BASE}art/hien-${v}.webp`}
          width="720"
          height="720"
          alt=""
          decoding="async"
          fetchPriority={v === 'front' ? 'high' : 'low'}
        />
      ))}
    </div>
  )
})
