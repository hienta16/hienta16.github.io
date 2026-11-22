import { useEffect, useMemo, useRef, useState } from 'react'
import { copy } from '../content/site'
import { fill, monthShort, num, weekdayDate } from '../lib/format'
import { binOf, type Day } from '../lib/stats'

/**
 * The contribution year as a 3D runway: one block per day, height = that day's count, set on a runway that recedes
 * from this week (near, right) to a year ago (far, left). A small perspective camera projects it into SVG; no WebGL.
 */

type V3 = [number, number, number]
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const norm = (a: V3): V3 => {
  const l = Math.hypot(...a)
  return [a[0] / l, a[1] / l, a[2] / l]
}

interface Camera {
  eye: V3
  target: V3
}
const CAMERAS: Record<'wide' | 'tall', Camera> = {
  wide: { eye: [-16, 20, -26], target: [22, 0, 3.5] },
  tall: { eye: [-9, 30, -12], target: [14, 0, 3.5] },
}

const BOX = 0.84 // footprint of a day block, out of a 1 × 1 cell
const MAX_H = 9 // height of the busiest day, in cells

/* Fill colours: a pink ramp by band, the busiest day and the hovered day in orange. */
const TOP = ['#3B74F8', '#FFE5EE', '#F9C2D3', '#F49CB6', '#EE6F9A']
const ORANGE = '#FF7029'
const mix = (hex: string, k: number) => {
  // darken toward Dark Ink (#22243A) by k
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  const ink = [0x22, 0x24, 0x3a]
  return `rgb(${c.map((v, i) => Math.round(v + (ink[i] - v) * k)).join(',')})`
}

interface Face {
  pts: string
  fill: string
}
interface Block {
  day: Day
  depth: number
  faces: Face[]
  top: [number, number]
}

export function ContributionRunway({ days, compact, rise }: { days: Day[]; compact: boolean; rise: number }) {
  const [hover, setHover] = useState<number | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [tipPos, setTipPos] = useState<{ x: number; y: number } | null>(null)

  const weeks = days.at(-1)!.week + 1
  const max = Math.max(1, ...days.map((d) => d.count))
  const best = useMemo(() => days.reduce((b, d) => (d.count > b.count ? d : b), days[0]), [days])

  const scene = useMemo(() => {
    const cam = CAMERAS[compact ? 'tall' : 'wide']
    const f = norm(sub(cam.target, cam.eye))
    const r = norm(cross(f, [0, 1, 0]))
    const u = cross(r, f)
    const project = (p: V3): [number, number] => {
      const d = sub(p, cam.eye)
      const zc = dot(d, f)
      return [(dot(d, r) / zc) * 1000, (-dot(d, u) / zc) * 1000]
    }
    const poly = (pts: V3[]) =>
      pts
        .map(project)
        .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
        .join(' ')

    // This week sits at X = 0, nearest the camera; a year ago at X = weeks - 1, far away on the left.
    // Weekday d at Z = d (Sunday nearest the tape).
    const wx = (week: number) => weeks - 1 - week
    const cell = (d: Day) => ({ x0: wx(d.week) + (1 - BOX) / 2, z0: d.weekday + (1 - BOX) / 2 })

    const floor = poly([
      [-0.6, 0, -0.4],
      [weeks + 0.6, 0, -0.4],
      [weeks + 0.6, 0, 7.4],
      [-0.6, 0, 7.4],
    ])
    const tape = poly([
      [-0.6, 0, -1.7],
      [weeks + 0.6, 0, -1.7],
      [weeks + 0.6, 0, -0.4],
      [-0.6, 0, -0.4],
    ])
    const ticks = Array.from({ length: weeks + 1 }, (_, w) => {
      const a = project([w, 0, -0.4])
      const b = project([w, 0, w % 4 === 0 ? -1.05 : -0.75])
      return { a, b }
    })
    const months = days
      .filter((d, i) => d.date.endsWith('-01') && i > 6)
      .map((d) => ({ key: d.date.slice(0, 7), at: project([wx(d.week) + 0.85, 0, -1.25]), line: [project([wx(d.week) + 1, 0, -0.4]), project([wx(d.week) + 1, 0, -1.7])] }))

    const eye = cam.eye
    const blocks: Block[] = days.map((day) => {
      const { x0, z0 } = cell(day)
      const x1 = x0 + BOX
      const z1 = z0 + BOX
      const h = day.count ? Math.max(0.16, (day.count / max) * MAX_H) : 0
      const b = binOf(day.count)
      const base = day.index === best.index && day.count ? ORANGE : TOP[b]
      const center: V3 = [(x0 + x1) / 2, h / 2, (z0 + z1) / 2]
      const depth = dot(sub(center, eye), f)
      if (!h) return { day, depth, faces: [{ pts: poly([[x0, 0, z0], [x1, 0, z0], [x1, 0, z1], [x0, 0, z1]]), fill: TOP[0] }], top: project([(x0 + x1) / 2, 0, (z0 + z1) / 2]) }
      const faces: Face[] = []
      // Only faces turned toward the camera are drawn.
      const sides: { n: V3; c: V3; pts: V3[]; k: number }[] = [
        { n: [0, 0, -1], c: [(x0 + x1) / 2, h / 2, z0], pts: [[x0, 0, z0], [x1, 0, z0], [x1, h, z0], [x0, h, z0]], k: 0.14 },
        { n: [0, 0, 1], c: [(x0 + x1) / 2, h / 2, z1], pts: [[x0, 0, z1], [x1, 0, z1], [x1, h, z1], [x0, h, z1]], k: 0.3 },
        { n: [1, 0, 0], c: [x1, h / 2, (z0 + z1) / 2], pts: [[x1, 0, z0], [x1, 0, z1], [x1, h, z1], [x1, h, z0]], k: 0.3 },
        { n: [-1, 0, 0], c: [x0, h / 2, (z0 + z1) / 2], pts: [[x0, 0, z0], [x0, 0, z1], [x0, h, z1], [x0, h, z0]], k: 0.3 },
      ]
      for (const s of sides) if (dot(sub(s.c, eye), s.n) < 0) faces.push({ pts: poly(s.pts), fill: mix(base, s.k) })
      faces.push({ pts: poly([[x0, h, z0], [x1, h, z0], [x1, h, z1], [x0, h, z1]]), fill: base })
      return { day, depth, faces, top: project([(x0 + x1) / 2, h, (z0 + z1) / 2]) }
    })
    blocks.sort((a, b) => b.depth - a.depth)

    // Fit the view box to everything drawn.
    const all = [floor, tape, ...blocks.flatMap((b) => b.faces.map((f) => f.pts))].join(' ').split(' ').map((p) => p.split(',').map(Number))
    const xs = all.map((p) => p[0])
    const ys = all.map((p) => p[1])
    const pad = 24
    const vb = { x: Math.min(...xs) - pad, y: Math.min(...ys) - pad - 40, w: Math.max(...xs) - Math.min(...xs) + pad * 2, h: Math.max(...ys) - Math.min(...ys) + pad * 2 + 40 }
    return { floor, tape, ticks, months, blocks, vb, project, cell }
  }, [days, weeks, max, best.index, compact])

  // Rise: blocks grow from the floor once, by scaling their projected faces toward their base. Cheap and good enough.
  const bestBlock = scene.blocks.find((b) => b.day.index === best.index)

  useEffect(() => setTipPos(null), [compact])

  const onEnter = (b: Block) => {
    setHover(b.day.index)
    const svg = wrapRef.current?.querySelector('svg')
    if (!svg) return
    const box = svg.getBoundingClientRect()
    setTipPos({ x: ((b.top[0] - scene.vb.x) / scene.vb.w) * box.width, y: ((b.top[1] - scene.vb.y) / scene.vb.h) * box.height })
  }
  const hovered = hover != null ? days[hover] : null

  return (
    <div className="runway3d" ref={wrapRef} onPointerLeave={() => setHover(null)}>
      <svg
        viewBox={`${scene.vb.x} ${scene.vb.y} ${scene.vb.w} ${scene.vb.h}`}
        className="runway3d__svg"
        role="img"
        aria-label={fill(copy.github.runwayLabel, { n: num(days.reduce((a, d) => a + d.count, 0)), best: num(best.count), bestDate: weekdayDate(best.date) })}
      >
        <polygon points={scene.floor} fill="var(--blue)" />
        <polygon points={scene.tape} fill="var(--pink)" />
        {scene.ticks.map((t, i) => (
          <line key={i} x1={t.a[0]} y1={t.a[1]} x2={t.b[0]} y2={t.b[1]} stroke="var(--ink)" strokeWidth={1} />
        ))}
        {scene.months.map((m) => (
          <g key={m.key}>
            <line x1={m.line[0][0]} y1={m.line[0][1]} x2={m.line[1][0]} y2={m.line[1][1]} stroke="var(--ink)" strokeWidth={1.6} />
            <text x={m.at[0]} y={m.at[1]} className="runway3d__month" style={{ fontSize: Math.max(9, 15 * (m.at[1] - scene.vb.y) / scene.vb.h + 6) }}>
              {monthShort(m.key)}
            </text>
          </g>
        ))}
        <g style={{ ['--rise' as string]: rise }} className="runway3d__blocks">
          {scene.blocks.map((b) => (
            <g
              key={b.day.index}
              className={`runway3d__block ${hover === b.day.index ? 'is-hover' : ''}`}
              onPointerEnter={() => onEnter(b)}
              style={{ transformOrigin: `${b.top[0]}px ${scene.project([weeks - 1 - b.day.week + 0.5, 0, b.day.weekday + 0.5])[1]}px` }}
            >
              {b.faces.map((f, i) => (
                <polygon key={i} points={f.pts} fill={hover === b.day.index && b.day.count ? (i === b.faces.length - 1 ? ORANGE : mix(ORANGE, 0.25)) : f.fill} />
              ))}
            </g>
          ))}
        </g>
        {bestBlock && (
          <g className="runway3d__peak" aria-hidden="true">
            <line x1={bestBlock.top[0]} y1={bestBlock.top[1] - 8} x2={bestBlock.top[0]} y2={bestBlock.top[1] - 46} stroke="var(--orange)" strokeWidth={2} />
            <text
              x={bestBlock.top[0] + (bestBlock.top[0] > scene.vb.x + scene.vb.w * 0.62 ? -10 : 10)}
              y={bestBlock.top[1] - 40}
              textAnchor={bestBlock.top[0] > scene.vb.x + scene.vb.w * 0.62 ? 'end' : 'start'}
              className="runway3d__peak-text"
            >
              {fill(copy.github.peak, { n: num(best.count), date: weekdayDate(best.date) })}
            </text>
          </g>
        )}
      </svg>
      {hovered && tipPos && (
        <div className="runway3d__tip" style={{ left: tipPos.x, top: tipPos.y }} aria-hidden="true">
          <strong>{num(hovered.count)}</strong>
          <span>{weekdayDate(hovered.date)}</span>
        </div>
      )}
    </div>
  )
}
