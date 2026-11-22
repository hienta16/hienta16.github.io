import { useMemo, useRef, useState } from 'react'
import { fill, useLang } from '../lib/i18n'
import type { WeekTotal } from '../lib/stats'

/** Perspective runway geometry, in viewBox units. Far end at the top, the audience at the bottom. */
const VB_W = 600
const VB_H = 660
const CX = VB_W / 2
const TOP_HALF = 40
const BOTTOM_HALF = 286
const Y_FAR = 4
const Y_NEAR = 576 // the last week ends here; below it is the front of the stage
const Z_FAR = 6
const Z_NEAR = 1

const halfAt = (y: number) => TOP_HALF + ((BOTTOM_HALF - TOP_HALF) * y) / VB_H

export function useRunwayGeometry(n: number) {
  return useMemo(() => {
    // y = a + b / z, through (Z_FAR, Y_FAR) and (Z_NEAR, Y_NEAR)
    const b = (Y_NEAR - Y_FAR) / (1 / Z_NEAR - 1 / Z_FAR)
    const a = Y_FAR - b / Z_FAR
    const yAt = (j: number) => a + b / (Z_FAR - ((Z_FAR - Z_NEAR) * j) / n)
    const bounds = Array.from({ length: n + 1 }, (_, j) => yAt(j))
    return bounds.slice(0, n).map((y0, i) => {
      const y1 = bounds[i + 1]
      const yc = (y0 + y1) / 2
      const scale = (yc - Y_FAR) / (Y_NEAR - Y_FAR) // 0 far … 1 near
      return { y0, y1, yc, scale }
    })
  }, [n])
}

interface Props {
  weeks: WeekTotal[]
  max: number
  animate: boolean
}

export function Runway({ weeks, max, animate }: Props) {
  const { t, num, date } = useLang()
  const bands = useRunwayGeometry(weeks.length)
  const [tip, setTip] = useState<{ i: number; x: number; y: number } | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const nowIndex = weeks.length - 1

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current
    if (!svg) return
    const r = svg.getBoundingClientRect()
    const vy = ((e.clientY - r.top) / r.height) * VB_H
    const i = bands.findIndex((b) => vy >= b.y0 && vy < b.y1)
    if (i < 0) return setTip(null)
    setTip({ i, x: e.clientX - r.left, y: e.clientY - r.top })
  }

  const trapezoid = `${CX - TOP_HALF},0 ${CX + TOP_HALF},0 ${CX + BOTTOM_HALF},${VB_H} ${CX - BOTTOM_HALF},${VB_H}`

  return (
    <div className={`runway ${animate ? 'is-animated' : ''}`}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMax meet"
        className="runway__svg"
        aria-hidden="true"
        focusable="false"
        onPointerMove={onMove}
        onPointerLeave={() => setTip(null)}
      >
        <polygon points={trapezoid} fill="var(--blue)" />
        {/* Floor stripes: each week's share of the busiest week, a single-hue ramp from blue to cream. */}
        {bands.map((b, i) => {
          const w = weeks[i]
          if (!w.total) return null
          const h0 = halfAt(b.y0)
          const h1 = halfAt(b.y1)
          const o = 0.1 + 0.62 * (w.total / max)
          return (
            <polygon
              key={`s${i}`}
              className="runway__stripe"
              style={{ ['--i' as string]: i, ['--o' as string]: o }}
              points={`${CX - h0},${b.y0} ${CX + h0},${b.y0} ${CX + h1},${b.y1} ${CX - h1},${b.y1}`}
              fill="var(--cream)"
              opacity={o}
            />
          )
        })}
        {/* Centre line, the tape down the middle of the runway */}
        <line x1={CX} y1={0} x2={CX} y2={VB_H} stroke="var(--cream)" strokeOpacity=".5" strokeWidth="1.5" strokeDasharray="2 7" />
        {/* Edge lights */}
        {bands.map((b, i) => {
          const w = weeks[i]
          const lit = w.total > 0
          const now = i === nowIndex
          const r = 1.6 + 7.4 * b.scale
          const inset = 9 + 16 * b.scale
          const h = halfAt(b.yc)
          return (
            <g key={`l${i}`} className={`runway__light ${lit ? 'is-lit' : ''}`} style={{ ['--i' as string]: i }}>
              {[-1, 1].map((side) => (
                <circle
                  key={side}
                  cx={CX + side * (h - inset)}
                  cy={b.yc}
                  r={r}
                  fill={now ? 'var(--orange)' : lit ? 'var(--cream)' : 'none'}
                  stroke={lit || now ? 'none' : 'var(--cream)'}
                  strokeOpacity=".42"
                  strokeWidth="1.2"
                />
              ))}
            </g>
          )
        })}
        {tip && (
          <polygon
            points={`${CX - halfAt(bands[tip.i].y0)},${bands[tip.i].y0} ${CX + halfAt(bands[tip.i].y0)},${bands[tip.i].y0} ${CX + halfAt(bands[tip.i].y1)},${bands[tip.i].y1} ${CX - halfAt(bands[tip.i].y1)},${bands[tip.i].y1}`}
            fill="none"
            stroke="var(--orange)"
            strokeWidth="2"
          />
        )}
      </svg>
      {tip && (
        <div className="runway__tip" style={{ left: tip.x, top: tip.y }} aria-hidden="true">
          <strong>{num(weeks[tip.i].total)}</strong>
          <span>{fill(t.hero.weekTip, { date: date(weeks[tip.i].start) })}</span>
        </div>
      )}
    </div>
  )
}
