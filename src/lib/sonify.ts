/**
 * Sonification of contribution days. Synthesized live with the Web Audio API: no recordings, nothing licensed.
 * One step per day. Pitch: a pentatonic note per weekday (Monday low … Sunday high). Loudness: square root of the
 * day's share of the busiest day, so the biggest days don't drown the rest. Zero days are rests. The busiest band
 * (41+) adds a soft low thump.
 */

export interface Step {
  count: number
  /** Monday-first weekday index, 0…6 */
  weekday: number
}

// C major pentatonic, C4 … D5
const SCALE = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33]

let shared: AudioContext | null = null
function audio(): AudioContext | null {
  if (shared) return shared
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  shared = new Ctor()
  return shared
}

export const audioSupported = () =>
  typeof window !== 'undefined' && !!(window.AudioContext ?? (window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext)

export interface Playback {
  stop: () => void
}

export function play(
  steps: Step[],
  { stepMs = 125, onStep, onEnd }: { stepMs?: number; onStep?: (i: number) => void; onEnd?: () => void } = {},
): Playback | null {
  const ctx = audio()
  if (!ctx) return null
  void ctx.resume()
  const max = Math.max(1, ...steps.map((s) => s.count))

  const master = ctx.createGain()
  master.gain.value = 0.55
  const comp = ctx.createDynamicsCompressor()
  comp.threshold.value = -18
  comp.ratio.value = 4
  master.connect(comp).connect(ctx.destination)

  const t0 = ctx.currentTime + 0.08
  const dt = stepMs / 1000
  const nodes: AudioScheduledSourceNode[] = []

  steps.forEach((s, i) => {
    if (s.count <= 0) return
    const at = t0 + i * dt
    const v = Math.sqrt(s.count / max)
    const f = SCALE[s.weekday] ?? SCALE[0]

    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, at)
    g.gain.exponentialRampToValueAtTime(0.05 + 0.3 * v, at + 0.006)
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.32)
    g.connect(master)

    const tri = ctx.createOscillator()
    tri.type = 'triangle'
    tri.frequency.value = f
    tri.connect(g)
    tri.start(at)
    tri.stop(at + 0.34)
    nodes.push(tri)

    const sub = ctx.createOscillator()
    const sg = ctx.createGain()
    sub.type = 'sine'
    sub.frequency.value = f / 2
    sg.gain.value = 0.5
    sub.connect(sg).connect(g)
    sub.start(at)
    sub.stop(at + 0.34)
    nodes.push(sub)

    if (s.count >= 41) {
      const k = ctx.createOscillator()
      const kg = ctx.createGain()
      k.type = 'sine'
      k.frequency.setValueAtTime(130, at)
      k.frequency.exponentialRampToValueAtTime(48, at + 0.14)
      kg.gain.setValueAtTime(0.0001, at)
      kg.gain.exponentialRampToValueAtTime(0.5, at + 0.005)
      kg.gain.exponentialRampToValueAtTime(0.0001, at + 0.18)
      k.connect(kg).connect(master)
      k.start(at)
      k.stop(at + 0.2)
      nodes.push(k)
    }
  })

  // Visual steps follow the audio clock.
  const timers: number[] = []
  const lead = (t0 - ctx.currentTime) * 1000
  steps.forEach((_, i) => timers.push(window.setTimeout(() => onStep?.(i), lead + i * stepMs)))
  timers.push(window.setTimeout(() => finish(), lead + steps.length * stepMs + 80))

  let done = false
  function finish() {
    if (done) return
    done = true
    timers.forEach((t) => window.clearTimeout(t))
    const now = ctx!.currentTime
    master.gain.cancelScheduledValues(now)
    master.gain.setTargetAtTime(0, now, 0.04)
    window.setTimeout(() => {
      nodes.forEach((n) => {
        try {
          n.stop()
        } catch {
          /* already stopped */
        }
      })
      master.disconnect()
    }, 200)
    onEnd?.()
  }

  return { stop: finish }
}
