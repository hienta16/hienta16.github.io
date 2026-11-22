import { useMemo, useRef, useState, type ReactNode } from 'react'
import { fill, useLang } from '../lib/i18n'
import { binOf, clampRange, longestStreak, type Day, type Range } from '../lib/stats'

/* Cell fills: one hue, blue → cream, mixed in advance so ghosting stays crisp. Zero days are drawn as dots. */
export const BIN_FILL = ['none', '#779CF5', '#9DB6F5', '#CCD7F4', '#FFF9F4'] as const

const P = 19 // pitch: 16px cell + 3px surface gap
const C = 16

type Orientation = 'h' | 'v'

interface Props {
  days: Day[]
  range: Range
  onRange: (r: Range) => void
  bin: number | null
  playing: number | null
  orientation: Orientation
  folded: boolean
  quietLeadWeeks: number
  /** The reading: what the handles measure. Hung under the measured span on the horizontal tape. */
  reading: ReactNode
}

interface Cell {
  x: number
  y: number
}

export function MeasuredYear({ days, range, onRange, bin, playing, orientation, folded, quietLeadWeeks, reading }: Props) {
  const { t, num, date, monthShort, weekday } = useLang()
  const svgRef = useRef<SVGSVGElement>(null)
  const [tip, setTip] = useState<{ day: Day; x: number; y: number } | null>(null)
  const [pending, setPending] = useState<number | null>(null)
  const drag = useRef<{ anchor: number; moved: boolean } | null>(null)

  const firstWeekday = days[0].weekday
  const weeks = days.at(-1)!.week + 1
  const n = days.length
  const isV = orientation === 'v'
  const fold = isV && folded && quietLeadWeeks > 0

  /* ── Layout ── */
  const L = useMemo(() => {
    if (!isV) {
      const left = 34
      const top = 52 // room for two rows of annotation above the grid
      const gridH = 7 * P - (P - C)
      const tapeY = top + gridH + 10
      const tapeH = 30
      return {
        vbW: left + weeks * P,
        vbH: tapeY + tapeH + 4,
        left,
        top,
        gridTop: top,
        gridH,
        tapeY,
        tapeH,
        pleatH: 0,
        cell: (d: Day): Cell | null => ({ x: left + d.week * P, y: top + d.weekday * P }),
        weekPos: (w: number) => left + w * P,
      }
    }
    const tapeW = 34
    const left = tapeW + 10
    const top = 26
    const pleatH = fold ? 34 : 0
    const shown = fold ? weeks - quietLeadWeeks : weeks
    const gridTop = top + (fold ? pleatH + 8 : 0)
    return {
      vbW: left + 7 * P - (P - C),
      vbH: gridTop + shown * P + 12,
      left,
      top,
      gridTop,
      gridH: shown * P,
      tapeY: 0,
      tapeH: tapeW,
      pleatH,
      cell: (d: Day): Cell | null => {
        if (fold && d.week < quietLeadWeeks) return null
        const row = d.week - (fold ? quietLeadWeeks : 0)
        return { x: left + d.weekday * P, y: gridTop + row * P }
      },
      weekPos: (w: number) => (fold && w < quietLeadWeeks ? top : gridTop + (w - (fold ? quietLeadWeeks : 0)) * P),
    }
  }, [isV, weeks, fold, quietLeadWeeks])

  const r = clampRange(range, n)
  const inRange = (i: number) => i >= r.start && i <= r.end

  /* Month marks: the first of each month, plus the window start when no month begins within three weeks of it. */
  const months = useMemo(
    () =>
      days
        .filter((d, i) => i === 0 || d.date.endsWith('-01'))
        .map((d) => ({ week: d.week, key: d.date.slice(0, 7), first: d.index === 0 }))
        .filter((m, i, all) => !(m.first && all[i + 1] && all[i + 1].week - m.week < 3)),
    [days],
  )

  const { busiest, streak } = useMemo(() => {
    let best: Day | undefined
    for (let i = r.start; i <= r.end; i++) if (days[i].count > 0 && (!best || days[i].count > best.count)) best = days[i]
    return { busiest: best, streak: longestStreak(days.slice(r.start, r.end + 1)) }
  }, [days, r.start, r.end])

  /* ── Pointer → day ── */
  const toLocal = (e: { clientX: number; clientY: number }) => {
    const box = svgRef.current!.getBoundingClientRect()
    return {
      x: ((e.clientX - box.left) / box.width) * L.vbW,
      y: ((e.clientY - box.top) / box.height) * L.vbH,
      px: e.clientX - box.left,
      py: e.clientY - box.top,
    }
  }
  const clampDay = (i: number) => Math.max(0, Math.min(n - 1, i))
  const dayAt = (x: number, y: number, edge: 'start' | 'end' = 'start'): number | null => {
    if (!isV) {
      const col = Math.floor((x - L.left) / P)
      if (col < 0 || col >= weeks) return null
      const inGrid = y >= L.top && y < L.top + L.gridH + 2
      const row = inGrid ? Math.min(6, Math.max(0, Math.floor((y - L.top) / P))) : edge === 'start' ? 0 : 6
      return clampDay(col * 7 + row - firstWeekday)
    }
    let wk: number
    if (fold && y < L.gridTop) wk = edge === 'start' ? 0 : quietLeadWeeks - 1
    else wk = Math.floor((y - L.gridTop) / P) + (fold ? quietLeadWeeks : 0)
    if (wk < 0 || wk >= weeks) return null
    const inGrid = x >= L.left && !(fold && y < L.gridTop)
    const col = inGrid ? Math.min(6, Math.max(0, Math.floor((x - L.left) / P))) : edge === 'start' ? 0 : 6
    return clampDay(wk * 7 + col - firstWeekday)
  }

  const onDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.button !== 0) return
    const p = toLocal(e)
    const d = dayAt(p.x, p.y)
    if (d == null) return
    drag.current = { anchor: d, moved: false }
    // On phones the page keeps scrolling; measuring there is tap-based.
    if (e.pointerType !== 'touch') svgRef.current?.setPointerCapture(e.pointerId)
  }
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const p = toLocal(e)
    const d = dayAt(p.x, p.y)
    if (d != null && e.pointerType !== 'touch') setTip(L.cell(days[d]) ? { day: days[d], x: p.px, y: p.py } : null)
    const g = drag.current
    if (!g || e.pointerType === 'touch' || d == null) return
    if (d !== g.anchor) g.moved = true
    if (g.moved) onRange(clampRange({ start: g.anchor, end: d }, n))
  }
  const onUp = (e: React.PointerEvent<SVGSVGElement>) => {
    const g = drag.current
    drag.current = null
    if (!g) return
    if (svgRef.current?.hasPointerCapture(e.pointerId)) svgRef.current.releasePointerCapture(e.pointerId)
    if (g.moved) {
      setPending(null)
      return
    }
    // A tap measures that day; a second tap measures from the first day to this one.
    const p = toLocal(e)
    const d = dayAt(p.x, p.y) ?? g.anchor
    if (pending != null && pending !== d) {
      onRange(clampRange({ start: pending, end: d }, n))
      setPending(null)
    } else {
      onRange({ start: d, end: d })
      setPending(d)
    }
    if (e.pointerType === 'touch') setTip(L.cell(days[d]) ? { day: days[d], x: p.px, y: p.py } : null)
  }

  /* ── Handles: HTML sliders over the SVG ── */
  const handlePct = (which: 'start' | 'end') => {
    const d = days[which === 'start' ? r.start : r.end]
    const pos = L.weekPos(d.week)
    if (!isV) return { left: `${((which === 'start' ? pos - 1.5 : pos + C + 1.5) / L.vbW) * 100}%` }
    const y = fold && d.week < quietLeadWeeks ? (which === 'start' ? L.top : L.top + L.pleatH) : which === 'start' ? pos - 1.5 : pos + C + 1.5
    return { top: `${(y / L.vbH) * 100}%` }
  }

  const keyStep = (which: 'start' | 'end', e: React.KeyboardEvent) => {
    const map: Record<string, number> = { ArrowLeft: -1, ArrowDown: isV ? 7 : -1, ArrowRight: 1, ArrowUp: isV ? -7 : 1, PageUp: -7, PageDown: 7 }
    let { start, end } = r
    const cur = which === 'start' ? start : end
    let next: number
    if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = n - 1
    else if (e.key in map) next = cur + map[e.key]
    else return
    e.preventDefault()
    next = clampDay(next)
    if (which === 'start') start = Math.min(next, end)
    else end = Math.max(next, start)
    setPending(null)
    onRange({ start, end })
  }

  const startHandleDrag = (which: 'start' | 'end') => (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const el = e.currentTarget
    el.setPointerCapture(e.pointerId)
    const move = (ev: PointerEvent) => {
      const p = toLocal(ev)
      const d = isV
        ? dayAt(L.left + (which === 'start' ? 0 : 6 * P), Math.max(0, p.y + (which === 'end' ? -C / 2 : C / 2)), which)
        : dayAt(Math.max(L.left, Math.min(L.vbW - 1, p.x + (which === 'end' ? -C / 2 : C / 2))), which === 'start' ? L.top : L.top + 6 * P, which)
      if (d == null) return
      setPending(null)
      onRange(which === 'start' ? { start: Math.min(d, r.end), end: r.end } : { start: r.start, end: Math.max(d, r.start) })
    }
    const up = () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
  }

  const sundayFirst = [6, 0, 1, 2, 3, 4, 5]
  const spanA = L.weekPos(days[r.start].week)
  const spanB = L.weekPos(days[r.end].week) + C

  /* Where the reading hangs: under the span's middle, or flush to the span's edge near the figure's edges. */
  const aPct = (spanA / L.vbW) * 100
  const bPct = (spanB / L.vbW) * 100
  const mid = (aPct + bPct) / 2
  const align = mid < 30 ? 'start' : mid > 70 ? 'end' : 'center'
  const readingPos =
    align === 'start' ? { left: `${Math.max(0, aPct)}%` } : align === 'end' ? { right: `${Math.max(0, 100 - bPct)}%` } : { left: `${mid}%` }

  const streakCells = streak.length >= 7 && streak.start && streak.end ? [days.find((d) => d.date === streak.start)!, days.find((d) => d.date === streak.end)!] : null

  return (
    <div className={`year year--${orientation}`}>
      {isV && <div className="year__reading year__reading--v">{reading}</div>}
      <div className="year__plot">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${L.vbW} ${L.vbH}`}
          className="year__svg"
          aria-hidden="true"
          focusable="false"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={() => (drag.current = null)}
          onPointerLeave={(e) => e.pointerType !== 'touch' && setTip(null)}
        >
          {/* weekday labels */}
          {!isV
            ? [1, 3, 5].map((row) => (
                <text key={row} x={L.left - 8} y={L.top + row * P + 12} className="year__wd" textAnchor="end">
                  {weekday((row + 6) % 7)}
                </text>
              ))
            : sundayFirst.map((wi, col) => (
                <text key={col} x={L.left + col * P + C / 2} y={L.top - 9} className="year__wd year__wd--narrow" textAnchor="middle">
                  {t.dates.weekdaysNarrow[wi]}
                </text>
              ))}

          {/* the tape, with the measured span read off in orange */}
          {!isV ? (
            <g>
              <rect x={L.left - 6} y={L.tapeY} width={L.vbW - L.left + 6} height={L.tapeH} fill="var(--pink)" />
              {Array.from({ length: weeks + 1 }, (_, w) => (
                <line key={w} x1={L.left + w * P - 1.5} x2={L.left + w * P - 1.5} y1={L.tapeY} y2={L.tapeY + (w % 4 === 0 ? 9 : 5)} stroke="var(--ink)" strokeWidth="1" />
              ))}
              {months.map((m) => (
                <g key={m.key}>
                  <line x1={L.left + m.week * P - 1.5} x2={L.left + m.week * P - 1.5} y1={L.tapeY} y2={L.tapeY + L.tapeH} stroke="var(--ink)" strokeWidth="1.5" />
                  <text x={L.left + m.week * P + 2} y={L.tapeY + L.tapeH - 9} className="year__month">
                    {monthShort(m.key)}
                    {(m.first || m.key.endsWith('-01')) && ` ${m.key.slice(2, 4)}`}
                  </text>
                </g>
              ))}
            </g>
          ) : (
            <g>
              <rect x={0} y={L.top - 4} width={L.tapeH} height={L.vbH - L.top} fill="var(--pink)" />
              <rect x={L.tapeH - 4} y={spanA} width={4} height={Math.max(2, spanB - spanA)} fill="var(--orange)" />
              {Array.from({ length: weeks }, (_, w) =>
                fold && w < quietLeadWeeks ? null : (
                  <line key={w} x1={0} x2={w % 4 === 0 ? 9 : 5} y1={L.weekPos(w) - 1.5} y2={L.weekPos(w) - 1.5} stroke="var(--ink)" strokeWidth="1" />
                ),
              )}
              {[
                ...(fold ? [{ week: quietLeadWeeks, key: days.find((d) => d.week === quietLeadWeeks)!.date.slice(0, 7), first: false }] : []),
                ...months.filter((m) => !(fold && m.week <= quietLeadWeeks)),
              ].map((m) => (
                <g key={`${m.key}-${m.week}`}>
                  <line x1={0} x2={L.tapeH} y1={L.weekPos(m.week) - 1.5} y2={L.weekPos(m.week) - 1.5} stroke="var(--ink)" strokeWidth="1.5" />
                  <text x={12} y={L.weekPos(m.week) + 11} className="year__month">
                    {monthShort(m.key)}
                  </text>
                </g>
              ))}
            </g>
          )}

          {/* the pleat: folded quiet weeks */}
          {fold && (
            <g className="year__pleat">
              <rect x={L.left} y={L.top} width={7 * P - (P - C)} height={L.pleatH} fill="none" stroke="var(--white)" strokeOpacity=".55" strokeDasharray="3 4" />
              <text x={L.left + (7 * P - 3) / 2} y={L.top + L.pleatH / 2 + 3} textAnchor="middle" className="year__pleat-text">
                {fill(t.metrics.pleat, { n: quietLeadWeeks })}
              </text>
            </g>
          )}

          {/* the days */}
          {days.map((d) => {
            const c = L.cell(d)
            if (!c) return null
            const b = binOf(d.count)
            const live = playing === d.index
            const dim = !inRange(d.index) || (bin !== null && bin !== b)
            if (b === 0 && !live)
              return <circle key={d.index} cx={c.x + C / 2} cy={c.y + C / 2} r={1.7} className={`year__cell ${dim ? 'is-dim' : ''}`} fill="var(--white)" fillOpacity=".42" />
            return <rect key={d.index} x={c.x} y={c.y} width={C} height={C} rx={3} className={`year__cell ${dim ? 'is-dim' : ''}`} fill={live ? 'var(--orange)' : BIN_FILL[b]} />
          })}

          {/* annotations: the longest streak in the stretch, and its busiest day */}
          {!isV && streakCells && (
            <g className="year__note">
              <path
                d={`M${L.cell(streakCells[0])!.x} ${L.top - 6}v-5H${L.cell(streakCells[1])!.x + C}v5`}
                fill="none"
                stroke="var(--white)"
                strokeWidth="1.5"
              />
              <text x={L.cell(streakCells[0])!.x} y={L.top - 15} className="year__note-text">
                {fill(t.metrics.streakMark, { n: num(streak.length) })}
                {streak.running && streak.end === days.at(-1)!.date ? `, ${t.metrics.streakRunning}` : ''}
              </text>
            </g>
          )}
          {busiest && L.cell(busiest) && (
            <g className="year__note">
              <rect x={L.cell(busiest)!.x - 2.5} y={L.cell(busiest)!.y - 2.5} width={C + 5} height={C + 5} rx={5} fill="none" stroke="var(--white)" strokeWidth="1.5" />
              {!isV && (
                <>
                  <line x1={L.cell(busiest)!.x + C / 2} x2={L.cell(busiest)!.x + C / 2} y1={L.top - 34} y2={L.top - 28} stroke="var(--white)" strokeWidth="1.5" />
                  <text
                    x={L.cell(busiest)!.x + C / 2 + (busiest.week > weeks - 8 ? 4 : -4)}
                    y={L.top - 38}
                    textAnchor={busiest.week > weeks - 8 ? 'end' : 'start'}
                    className="year__note-text"
                  >
                    {fill(t.metrics.peakMark, { count: num(busiest.count), date: date(busiest.date) })}
                  </text>
                </>
              )}
            </g>
          )}
        </svg>

        <button
          type="button"
          role="slider"
          className="year__handle year__handle--start"
          style={handlePct('start')}
          aria-label={t.metrics.handleStart}
          aria-valuemin={0}
          aria-valuemax={n - 1}
          aria-valuenow={r.start}
          aria-valuetext={date(days[r.start].date)}
          aria-orientation={isV ? 'vertical' : 'horizontal'}
          onKeyDown={(e) => keyStep('start', e)}
          onPointerDown={startHandleDrag('start')}
        />
        <button
          type="button"
          role="slider"
          className="year__handle year__handle--end"
          style={handlePct('end')}
          aria-label={t.metrics.handleEnd}
          aria-valuemin={0}
          aria-valuemax={n - 1}
          aria-valuenow={r.end}
          aria-valuetext={date(days[r.end].date)}
          aria-orientation={isV ? 'vertical' : 'horizontal'}
          onKeyDown={(e) => keyStep('end', e)}
          onPointerDown={startHandleDrag('end')}
        />

        {tip && (
          <div className="year__tip" style={{ left: tip.x, top: tip.y }} aria-hidden="true">
            <strong>{num(tip.day.count)}</strong>
            <span>
              {weekday((tip.day.weekday + 6) % 7)} {date(tip.day.date)}
            </span>
          </div>
        )}
      </div>

      {!isV && (
        <div className="year__reading" data-align={align}>
          <span className="year__bracket" style={{ left: `${aPct}%`, width: `${Math.max(0.3, bPct - aPct)}%` }} aria-hidden="true" />
          <div className="year__reading-box" style={readingPos}>
            {reading}
          </div>
        </div>
      )}
      <p className="year__hint" aria-live="polite">
        {pending != null ? t.metrics.tapHint : ''}
      </p>
    </div>
  )
}
