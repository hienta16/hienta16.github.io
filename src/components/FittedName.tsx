import { useLayoutEffect, useRef, useState } from 'react'

interface Fit {
  size: number
  widths: number[]
}

/** Solve the width axis (50–150%) so a line set at `size` px fills `target` px. */
function solveWidth(el: HTMLElement, size: number, target: number): number {
  el.style.fontSize = `${size}px`
  const at = (w: number) => {
    el.style.fontStretch = `${w}%`
    return el.getBoundingClientRect().width
  }
  // Regula falsi: width grows almost linearly with the axis, so each step lands close to the root.
  let a = 50
  let fa = at(a) - target
  if (fa >= 0) return a
  let b = 150
  let fb = at(b) - target
  if (fb <= 0) return b
  let w = a
  for (let i = 0; i < 8; i++) {
    w = a - (fa * (b - a)) / (fb - fa)
    const fw = at(w) - target
    if (Math.abs(fw) < 0.5) break
    if (fw > 0) {
      b = w
      fb = fw
    } else {
      a = w
      fa = fw
    }
  }
  return Math.round(w * 100) / 100
}

/**
 * The name, made to measure. One line on wide screens, two on narrow ones; each line's width axis is solved so it
 * fills the column exactly. Reports its fit so the backstage note can print the real numbers.
 */
export function FittedName({
  name,
  lines,
  maxSize,
  onFit,
}: {
  name: string
  /** The name split into lines, e.g. ['Tạ Minh', 'Hiền']; rendered on one line when `single` */
  lines: string[]
  maxSize: (containerWidth: number, single: boolean) => number
  onFit?: (fit: { size: number; width: number; measure: number }) => void
}) {
  const boxRef = useRef<HTMLHeadingElement>(null)
  const probeRef = useRef<HTMLSpanElement>(null)
  const [fit, setFit] = useState<Fit | null>(null)
  const [single, setSingle] = useState(true)
  const onFitRef = useRef(onFit)
  onFitRef.current = onFit

  useLayoutEffect(() => {
    const box = boxRef.current
    const probe = probeRef.current
    if (!box || !probe) return
    let raf = 0
    const run = () => {
      raf = 0
      const W = box.clientWidth
      if (!W) return
      const isSingle = W >= 820
      const set = isSingle ? [lines.join(' ')] : lines
      const cap = maxSize(W, isSingle)
      // Pick the size at which the longest line fits at a base width, capped by the layout's max size.
      // One line runs condensed (taller letters); stacked lines start wider so the short line can stretch to match.
      probe.style.fontStretch = isSingle ? '82%' : '74%'
      probe.style.fontSize = '100px'
      const longest = Math.max(
        ...set.map((l) => {
          probe.textContent = l
          return probe.getBoundingClientRect().width
        }),
      )
      const size = Math.min(cap, (W / longest) * 100)
      const widths = set.map((l) => {
        probe.textContent = l
        return solveWidth(probe, size, W)
      })
      setSingle(isSingle)
      setFit({ size, widths })
      onFitRef.current?.({ size: Math.round(size), width: Math.round(Math.max(...widths)), measure: Math.round(W) })
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(run)
    }
    const ro = new ResizeObserver(schedule)
    ro.observe(box)
    document.fonts?.ready.then(schedule)
    document.fonts?.load('800 100px "Anybody Variable"', name).then(schedule)
    run()
    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [lines, maxSize, name])

  const set = single ? [lines.join(' ')] : lines
  return (
    <h1 ref={boxRef} className="fitted" aria-label={name}>
      <span ref={probeRef} className="fitted__probe" aria-hidden="true" />
      {set.map((l, i) => (
        <span
          key={`${l}-${i}`}
          className="fitted__line"
          aria-hidden="true"
          style={fit ? { fontSize: `${fit.size}px`, fontStretch: `${fit.widths[i] ?? 100}%` } : undefined}
        >
          {l}
        </span>
      ))}
    </h1>
  )
}
