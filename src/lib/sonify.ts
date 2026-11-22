/**
 * The contribution beat, synthesized live with the Web Audio API: no recordings, nothing licensed, never autoplayed.
 * One step per day. Pitch: a bright pentatonic note per weekday, high register (C6 … D7), so it rings light rather
 * than booms. Loudness: square root of the day's share of the busiest day. Zero days rest. The busiest band (41+)
 * adds a soft clap.
 */

export interface Step {
  count: number
  /** Monday-first weekday index, 0…6 */
  weekday: number
}

// C major pentatonic, high: C6 D6 E6 G6 A6 C7 D7
const SCALE = [1046.5, 1174.66, 1318.51, 1567.98, 1760.0, 2093.0, 2349.32]

let shared: AudioContext | null = null
let noise: AudioBuffer | null = null
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
  { stepMs = 112, onStep, onEnd, sound = true }: { stepMs?: number; onStep?: (i: number) => void; onEnd?: () => void; sound?: boolean } = {},
): Playback {
  const ctx = sound ? audio() : null
  const max = Math.max(1, ...steps.map((s) => s.count))
  const nodes: AudioScheduledSourceNode[] = []
  let master: GainNode | null = null
  let t0Ms = 60

  if (ctx) {
    void ctx.resume()
    master = ctx.createGain()
    master.gain.value = 0.32
    const comp = ctx.createDynamicsCompressor()
    comp.threshold.value = -20
    comp.ratio.value = 4
    master.connect(comp).connect(ctx.destination)
    if (!noise) {
      noise = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate)
      const ch = noise.getChannelData(0)
      for (let i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / ch.length)
    }
    const t0 = ctx.currentTime + 0.06
    t0Ms = (t0 - ctx.currentTime) * 1000
    const dt = stepMs / 1000
    steps.forEach((s, i) => {
      if (s.count <= 0) return
      const at = t0 + i * dt
      const v = Math.sqrt(s.count / max)
      const f = SCALE[s.weekday] ?? SCALE[0]
      // bell: a triangle with a fast decay, plus a soft sine an octave up for sparkle
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.0001, at)
      g.gain.exponentialRampToValueAtTime(0.04 + 0.26 * v, at + 0.004)
      g.gain.exponentialRampToValueAtTime(0.0001, at + 0.2)
      g.connect(master!)
      const tri = ctx.createOscillator()
      tri.type = 'triangle'
      tri.frequency.value = f
      tri.connect(g)
      tri.start(at)
      tri.stop(at + 0.22)
      nodes.push(tri)
      const sp = ctx.createOscillator()
      const sg = ctx.createGain()
      sp.type = 'sine'
      sp.frequency.value = f * 2
      sg.gain.value = 0.18
      sp.connect(sg).connect(g)
      sp.start(at)
      sp.stop(at + 0.22)
      nodes.push(sp)
      if (s.count >= 41 && noise) {
        const n = ctx.createBufferSource()
        n.buffer = noise
        const bp = ctx.createBiquadFilter()
        bp.type = 'bandpass'
        bp.frequency.value = 2600
        bp.Q.value = 0.9
        const ng = ctx.createGain()
        ng.gain.setValueAtTime(0.22, at)
        ng.gain.exponentialRampToValueAtTime(0.0001, at + 0.12)
        n.connect(bp).connect(ng).connect(master!)
        n.start(at)
        n.stop(at + 0.14)
        nodes.push(n)
      }
    })
  }

  // The visual steps follow the same clock, with or without sound.
  const timers: number[] = []
  steps.forEach((_, i) => timers.push(window.setTimeout(() => onStep?.(i), t0Ms + i * stepMs)))
  timers.push(window.setTimeout(() => finish(), t0Ms + steps.length * stepMs + 80))

  let done = false
  function finish() {
    if (done) return
    done = true
    timers.forEach((t) => window.clearTimeout(t))
    if (ctx && master) {
      const now = ctx.currentTime
      master.gain.cancelScheduledValues(now)
      master.gain.setTargetAtTime(0, now, 0.03)
      const m = master
      window.setTimeout(() => {
        nodes.forEach((n) => {
          try {
            n.stop()
          } catch {
            /* already stopped */
          }
        })
        m.disconnect()
      }, 200)
    }
    onEnd?.()
  }
  return { stop: finish }
}
