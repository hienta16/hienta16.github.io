import { forwardRef, type CSSProperties } from 'react'
import './Cat.css'

export type Look = 'none' | 'bow' | 'beret' | 'scarf' | 'sunglasses'

interface FrontProps {
  look?: Look
  /** Pupil offset in px, each axis -1…1 */
  gaze?: { x: number; y: number }
  className?: string
  style?: CSSProperties
  title?: string
}

/**
 * The show cat, front view, sitting. One flat ink silhouette with cream eyes and pink ears.
 * Drawn for this site. Parts are grouped so CSS can move the head, tail and paws.
 */
export const CatFront = forwardRef<SVGSVGElement, FrontProps>(function CatFront(
  { look = 'none', gaze = { x: 0, y: 0 }, className = '', style, title },
  ref,
) {
  const px = gaze.x * 4
  const py = gaze.y * 2.5
  return (
    <svg
      ref={ref}
      viewBox="0 0 200 250"
      className={`cat-front ${className}`}
      style={style}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      <g className="cat-tail">
        <path
          d="M146 226c34 2 50-22 40-50-6-16-22-22-30-12-5 6 2 12 8 16 10 8 10 30-20 34"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="15"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <g className="cat-body">
        <path d="M74 98c-24 30-34 78-30 118 1 16 14 24 56 24s55-8 56-24c4-40-6-88-30-118z" fill="var(--ink)" />
        <path d="M100 196v40" stroke="var(--cream)" strokeOpacity=".55" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      <g className="cat-paws">
        <ellipse className="cat-paw cat-paw--l" cx="82" cy="239" rx="17" ry="8" fill="var(--ink)" />
        <ellipse className="cat-paw cat-paw--r" cx="118" cy="239" rx="17" ry="8" fill="var(--ink)" />
      </g>
      {look === 'scarf' && (
        <g className="cat-look">
          <path d="M60 104c26 14 54 14 80 0l4 16c-28 16-60 16-88 0z" fill="var(--pink)" />
          <path d="M72 112l-8 52 20 4 6-50z" fill="var(--pink)" />
          <path d="M70 128l18 3M67 146l18 3" stroke="var(--cream)" strokeWidth="4" />
        </g>
      )}
      <g className="cat-head">
        <path d="M56 54L64 4l36 30z" fill="var(--ink)" strokeLinejoin="round" stroke="var(--ink)" strokeWidth="6" />
        <path d="M144 54L136 4l-36 30z" fill="var(--ink)" strokeLinejoin="round" stroke="var(--ink)" strokeWidth="6" />
        <path d="M66 46l4-28 18 16z" fill="var(--pink)" />
        <path d="M134 46l-4-28-18 16z" fill="var(--pink)" />
        <ellipse cx="100" cy="70" rx="52" ry="44" fill="var(--ink)" />
        <g className="cat-eyes">
          <path d="M68 70q14-11 28 0q-14 11-28 0z" fill="var(--cream)" />
          <path d="M104 70q14-11 28 0q-14 11-28 0z" fill="var(--cream)" />
          <g style={{ transform: `translate(${px}px, ${py}px)` }} className="cat-pupils">
            <ellipse cx="82" cy="70" rx="2.8" ry="7.5" fill="var(--ink)" />
            <ellipse cx="118" cy="70" rx="2.8" ry="7.5" fill="var(--ink)" />
          </g>
        </g>
        <path d="M94 86h12l-6 7z" fill="var(--pink)" />
        <g stroke="var(--cream)" strokeOpacity=".7" strokeWidth="1.6" strokeLinecap="round">
          <path d="M70 90L38 84M70 96L40 102M130 90l32-6M130 96l30 6" />
        </g>
        {look === 'beret' && (
          <g className="cat-look">
            <path d="M48 36c4-22 46-34 82-22 14 5 20 14 14 22-18 10-74 14-96 0z" fill="var(--blue)" />
            <path d="M96 12l4-9 5 9z" fill="var(--blue)" />
          </g>
        )}
        {look === 'sunglasses' && (
          <g className="cat-look">
            <path d="M96 68h8" stroke="var(--blue)" strokeWidth="4" />
            <path d="M64 70c0-9 7-14 17-14s17 5 17 14-7 14-17 14-17-5-17-14z" fill="var(--pink)" stroke="var(--blue)" strokeWidth="4" />
            <path d="M102 70c0-9 7-14 17-14s17 5 17 14-7 14-17 14-17-5-17-14z" fill="var(--pink)" stroke="var(--blue)" strokeWidth="4" />
            <path d="M64 66l-14-6M136 66l14-6" stroke="var(--blue)" strokeWidth="4" strokeLinecap="round" />
          </g>
        )}
      </g>
      {look === 'bow' && (
        <g className="cat-look">
          <path d="M100 110l-30-14v30zM100 110l30-14v30z" fill="var(--pink)" />
          <rect x="93" y="103" width="14" height="14" rx="4" fill="var(--cream)" />
        </g>
      )}
    </svg>
  )
})

/** Side view for the tape: a small walking cat. Legs swing in diagonal pairs. */
export function CatSide({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 36" className={`cat-side ${className}`} aria-hidden="true" focusable="false">
      <path className="cs-tail" d="M14 17C6 15 3 9 6 2" fill="none" stroke="var(--ink)" strokeWidth="3.2" strokeLinecap="round" />
      <g stroke="var(--ink)" strokeWidth="3.4" strokeLinecap="round">
        <path className="cs-leg cs-leg--a" d="M20 24v9" />
        <path className="cs-leg cs-leg--b" d="M25 24v9" />
        <path className="cs-leg cs-leg--b" d="M41 24v9" />
        <path className="cs-leg cs-leg--a" d="M46 24v9" />
      </g>
      <path d="M14 18c2-6 10-8 20-8h10c6 0 9 4 9 9 0 5-4 7-9 7H22c-6 0-9-3-8-8z" fill="var(--ink)" />
      <g className="cs-head">
        <path d="M46 8l1-7 6 5zM58 8l-1-7-6 5z" fill="var(--ink)" />
        <circle cx="52" cy="12" r="8" fill="var(--ink)" />
        <circle cx="55.5" cy="11" r="1.6" fill="var(--cream)" />
      </g>
    </svg>
  )
}
