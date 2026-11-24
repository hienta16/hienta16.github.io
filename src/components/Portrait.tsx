import { forwardRef, useEffect, useId, useState, type CSSProperties } from 'react'

/**
 * Hien, illustrated for this site from her own features: a soft oval face with full cheeks, almond eyes that smile,
 * soft straight brows, a small nose, a small closed smile; dark layered hair with volume at the crown, see-through
 * curtain bangs and face-framing locks that flick out at the jaw and again at the chest; the black tweed jacket with
 * gold buttons from her photos. No photograph is embedded.
 *
 * Two looks share one drawing, so the likeness is the same in both:
 *   'editorial'  A: a soft 2D editorial illustration: flat colour, fine warm line work, graphic hair highlights.
 *   'soft'       B: a gently dimensional 2.5D character: rounded gradients, a warm rim light, glossy highlights.
 *
 * Coordinates are the portrait's own (0 0 400 480): head, hair and shoulders, the head tilted a little toward the cat.
 * The eyes blink now and then and follow the pointer, like the cats' eyes do.
 */

export type PortraitLook = 'editorial' | 'soft'

export const HIEN = {
  skin: '#F8DFD1',
  skinLit: '#FFF1E9',
  skinShade: '#EDC0AD',
  skinDeep: '#D9A08C',
  line: '#B97E6C',
  blush: '#F29A9C',
  lipTop: '#D46E78',
  lipLow: '#E68A8E',
  lipLine: '#B5525E',
  irisDark: '#2B1A17',
  irisLit: '#7A4F3E',
  lash: '#2A1B19',
  brow: '#4A3530',
  hair: '#221A1B',
  hairDeep: '#150F11',
  hairMid: '#35292A',
  hairLit: '#6E5751',
  hairRim: '#C08562',
  jacket: '#1E1C24',
  jacketLit: '#383541',
  gold: '#E3A64C',
  goldLit: '#FFE4A6',
  goldDeep: '#9C6A28',
}

/** A tapered ribbon along a cubic Bézier, wide at the start and tapering near the end. */
export function ribbon(p0: number[], p1: number[], p2: number[], p3: number[], w0: number, w1 = 0, steps = 18, swell = false) {
  const pt = (t: number) => {
    const u = 1 - t
    return [0, 1].map((k) => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k])
  }
  const left: number[][] = []
  const right: number[][] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const [x, y] = pt(t)
    const [x2, y2] = pt(Math.min(1, t + 0.01))
    const [x1, y1] = pt(Math.max(0, t - 0.01))
    const len = Math.hypot(x2 - x1, y2 - y1) || 1
    // `swell`: start narrow at the root (a lock growing out from under the crown), full by a fifth of the way down
    const w = ((w1 + (w0 - w1) * (1 - t * t)) * (swell ? Math.min(1, 0.2 + t * 4) : 1)) / 2
    left.push([x - ((y2 - y1) / len) * w, y + ((x2 - x1) / len) * w])
    right.push([x + ((y2 - y1) / len) * w, y - ((x2 - x1) / len) * w])
  }
  const f = (n: number) => n.toFixed(1)
  return `M${left.map((p) => `${f(p[0])} ${f(p[1])}`).join('L')}L${right
    .reverse()
    .map((p) => `${f(p[0])} ${f(p[1])}`)
    .join('L')}Z`
}

type Strand = [number[], number[], number[], number[], number, number]
const strands = (list: Strand[]) => list.map((s) => ribbon(...s))
/** Mirror a point around the centre line */
const mx = (p: number[]) => [400 - p[0], p[1]]
/** Mirror every "x y" pair of a path around the centre line */
const mirrorPath = (d: string) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x: string, y: string) => `${400 - +x} ${y}`)

/* ── Face ── */
const FACE =
  'M200 140C238 140 266 162 268 200C270 234 267 262 255 284C242 302 224 311 200 312C176 311 158 302 145 284C133 262 130 234 132 200C134 162 162 140 200 140Z'
/** The shade side (light comes from the upper left, like the cats) */
const FACE_SHADE = 'M268 196C270 234 267 262 255 284C242 302 224 311 200 312C226 298 248 276 254 246C258 224 258 208 256 196Z'
const NECK = 'M184 290C186 316 184 336 176 356C184 372 216 372 224 356C216 336 214 316 216 290Z'
const JACKET =
  'M36 480C40 430 78 400 138 386C158 381 170 372 176 356C184 366 192 371 200 371C208 371 216 366 224 356C230 372 242 381 262 386C322 400 360 430 364 480Z'
const NECKLINE = 'M176 356C184 366 192 371 200 371C208 371 216 366 224 356'

/* ── Hair ── */
const HAIR_BACK = 'M200 76C266 76 306 122 308 192C310 262 308 334 300 398C280 404 260 400 240 392L160 392C140 400 120 404 100 398C92 334 90 262 92 192C94 122 134 76 200 76Z'
/** Crown down to the hairline, the parting a little left of centre */
const CROWN =
  'M100 214C92 142 136 76 200 76C264 76 308 142 300 214C292 200 282 192 270 192C262 170 238 154 204 150L199 156L194 150C162 154 138 170 130 192C118 192 108 200 100 214Z'
const CROWN_RIM = 'M104 206C96 140 138 78 200 78C262 78 304 140 296 206'
/** One side's locks, outermost first: [p0, p1, p2, p3, width at the root, width at the tip] */
const SIDE: Strand[] = [
  [[120, 128], [80, 230], [96, 312], [60, 356], 44, 3],
  [[126, 136], [90, 250], [118, 340], [82, 426], 46, 3],
  [[136, 232], [158, 310], [156, 384], [138, 448], 34, 2],
  [[136, 148], [118, 228], [126, 284], [100, 330], 32, 2],
]
const SIDE_L = SIDE.map((s) => ribbon(...s, 24, true))
const SIDE_R = SIDE.map(([a, b, c, d, w0, w1]) => ribbon(mx(a), mx(b), mx(c), mx(d), w0, w1, 24, true))
/** Curtain bangs: tapered locks swept out from the parting, the longest to the cheekbones, gaps between */
const BANG: Strand[] = [
  [[174, 154], [150, 162], [130, 192], [126, 252], 18, 2],
  [[184, 150], [162, 160], [142, 188], [136, 238], 20, 1.5],
  [[192, 150], [176, 164], [158, 186], [151, 214], 16, 1],
  [[197, 152], [188, 170], [178, 190], [170, 208], 11, 0.6],
]
const BANGS = [...strands(BANG), ...strands(BANG.map(([a, b, c, d, w0, w1]) => [mx([a[0] - 2, a[1]]), mx([b[0] - 2, b[1]]), mx(c), mx(d), w0, w1] as Strand))]
/** Fine wisps where the curtain parts */
const WISPS = strands([
  [[197, 154], [195, 170], [192, 186], [189, 200], 4.5, 0.4],
  [[203, 154], [206, 170], [209, 184], [212, 198], 4, 0.4],
])
/** Fine lines along each lock (A: lighter; B: darker) */
const LOCK_LINES = strands([
  [[110, 196], [94, 250], [100, 312], [74, 356], 1.8, 0.3],
  [[124, 230], [110, 290], [124, 352], [98, 414], 1.8, 0.3],
  [[140, 280], [150, 330], [150, 384], [136, 436], 1.6, 0.3],
  [[128, 204], [122, 240], [122, 280], [106, 318], 1.6, 0.3],
  [mx([110, 196]), mx([94, 250]), mx([100, 312]), mx([74, 356]), 1.8, 0.3],
  [mx([124, 230]), mx([110, 290]), mx([124, 352]), mx([98, 414]), 1.8, 0.3],
  [mx([140, 280]), mx([150, 330]), mx([150, 384]), mx([136, 436]), 1.6, 0.3],
  [mx([128, 204]), mx([122, 240]), mx([122, 280]), mx([106, 318]), 1.6, 0.3],
  [[178, 86], [152, 96], [126, 128], [114, 176], 1.8, 0.3],
  [[222, 86], [248, 96], [274, 128], [286, 176], 1.8, 0.3],
  [[186, 156], [166, 168], [148, 192], [142, 226], 1.4, 0.3],
  [[214, 156], [234, 168], [252, 192], [258, 226], 1.4, 0.3],
])
/** Light on the hair: across the crown, and down the outer locks */
const SHINE = strands([
  [[136, 112], [152, 94], [176, 86], [198, 84], 7, 1],
  [[206, 84], [230, 88], [252, 100], [266, 120], 5, 0.5],
  [[100, 222], [92, 260], [98, 300], [86, 330], 4, 0.4],
  [[108, 340], [106, 368], [100, 392], [90, 410], 3.5, 0.4],
  [[300, 222], [308, 260], [302, 300], [314, 330], 3.5, 0.4],
])

/* ── Features ── */
interface Eye {
  cx: number
  cy: number
  white: string
  lash: string
  wing: number[][]
  crease: string
  lower: string
  fold: string
  brow: Strand
}
const EYE_L: Eye = {
  cx: 168.5,
  cy: 224.5,
  white: 'M184 227C179 217 161 214 152 225C160 231 176 232 184 227Z',
  lash: 'M185 226.5C179 215.5 160 212.5 150.5 224.5',
  wing: [[152, 223.5], [148.5, 222.5], [146, 220.5], [143, 218]],
  crease: 'M182 216.5C176 210 162 209 155 215.5',
  lower: 'M155 228.5C163 232.5 176 232.5 182 229',
  fold: 'M156 234C164 238.5 175 238.5 181 234.5',
  brow: [[186, 206], [176, 200.5], [162, 199.5], [150, 204], 4.4, 1.4],
}
const EYE_R: Eye = {
  cx: 400 - EYE_L.cx,
  cy: EYE_L.cy,
  white: mirrorPath(EYE_L.white),
  lash: mirrorPath(EYE_L.lash),
  wing: EYE_L.wing.map(mx),
  crease: mirrorPath(EYE_L.crease),
  lower: mirrorPath(EYE_L.lower),
  fold: mirrorPath(EYE_L.fold),
  brow: [mx(EYE_L.brow[0]), mx(EYE_L.brow[1]), mx(EYE_L.brow[2]), mx(EYE_L.brow[3]), 4.4, 1.4],
}
const EYES = [EYE_L, EYE_R]

interface Props {
  /** A (editorial) or B (soft 2.5D) */
  look?: PortraitLook
  /** Where she looks, each axis -1 … 1 (a gentle follow) */
  gaze?: { x: number; y: number }
  /** Blink and breathe. Off for static renders and reduced motion. */
  alive?: boolean
  className?: string
  style?: CSSProperties
  label?: string
}

export const Portrait = forwardRef<HTMLDivElement, Props>(function Portrait(
  { look = 'editorial', gaze = { x: 0, y: 0 }, alive = true, className = '', style, label },
  ref,
) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const id = (n: string) => `${n}-${uid}`
  const url = (n: string) => `url(#${id(n)})`
  const soft = look === 'soft'
  const [blink, setBlink] = useState(false)

  useEffect(() => {
    if (!alive) return
    let t = 0
    const loop = () => {
      t = window.setTimeout(() => {
        setBlink(true)
        window.setTimeout(() => setBlink(false), 150)
        loop()
      }, 3400 + Math.random() * 4200)
    }
    loop()
    return () => window.clearTimeout(t)
  }, [alive])

  const gx = Math.max(-1, Math.min(1, gaze.x))
  const gy = Math.max(-1, Math.min(1, gaze.y))
  const lookAt = `translate(${(gx * 2.4).toFixed(2)} ${(gy * 1.2).toFixed(2)})`
  const tilt = 'rotate(3 200 340)'
  const hairFill = soft ? url('hairGrad') : HIEN.hair
  const skinFill = soft ? url('skinGrad') : HIEN.skin

  return (
    <div ref={ref} className={`portrait portrait--${look} ${alive ? 'is-alive' : ''} ${className}`} style={style} role={label ? 'img' : undefined} aria-label={label}>
      <svg viewBox="0 0 400 480" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id={id('skinGrad')} gradientUnits="userSpaceOnUse" cx="176" cy="200" r="150">
            <stop offset="0" stopColor={HIEN.skinLit} />
            <stop offset=".62" stopColor={HIEN.skin} />
            <stop offset="1" stopColor={HIEN.skinShade} />
          </radialGradient>
          <linearGradient id={id('hairGrad')} gradientUnits="userSpaceOnUse" x1="140" y1="70" x2="260" y2="440">
            <stop offset="0" stopColor={HIEN.hairMid} />
            <stop offset=".5" stopColor={HIEN.hair} />
            <stop offset="1" stopColor={HIEN.hairDeep} />
          </linearGradient>
          {(['bang', 'bangMid'] as const).map((n) => (
            <linearGradient key={n} id={id(n)} gradientUnits="userSpaceOnUse" x1="0" y1="150" x2="0" y2="252">
              <stop offset="0" stopColor={n === 'bang' ? HIEN.hair : HIEN.hairMid} />
              <stop offset=".5" stopColor={n === 'bang' ? HIEN.hair : HIEN.hairMid} />
              <stop offset="1" stopColor={n === 'bang' ? HIEN.hair : HIEN.hairMid} stopOpacity=".3" />
            </linearGradient>
          ))}
          <linearGradient id={id('neck')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={HIEN.skinDeep} />
            <stop offset=".5" stopColor={HIEN.skinShade} />
            <stop offset="1" stopColor={HIEN.skin} />
          </linearGradient>
          <linearGradient id={id('jacket')} gradientUnits="userSpaceOnUse" x1="80" y1="380" x2="300" y2="480">
            <stop offset="0" stopColor={soft ? HIEN.jacketLit : HIEN.jacket} />
            <stop offset=".6" stopColor={HIEN.jacket} />
            <stop offset="1" stopColor="#14131A" />
          </linearGradient>
          <pattern id={id('tweed')} width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M0 3h3M3 0v3M4.4 5.4l1.2-1.2" stroke="#5B5668" strokeWidth=".7" />
            <circle cx="4.8" cy="1.4" r=".6" fill="#7A748C" />
          </pattern>
          <radialGradient id={id('gold')} cx=".38" cy=".34" r=".7">
            <stop offset="0" stopColor={HIEN.goldLit} />
            <stop offset=".5" stopColor={HIEN.gold} />
            <stop offset="1" stopColor={HIEN.goldDeep} />
          </radialGradient>
          <radialGradient id={id('iris')} cx=".5" cy=".72" r=".62">
            <stop offset="0" stopColor={HIEN.irisLit} />
            <stop offset=".8" stopColor={HIEN.irisDark} />
          </radialGradient>
          <radialGradient id={id('blush')}>
            <stop offset="0" stopColor={HIEN.blush} stopOpacity={soft ? 0.6 : 0.45} />
            <stop offset="1" stopColor={HIEN.blush} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={id('lipLow')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={HIEN.lipTop} />
            <stop offset="1" stopColor={HIEN.lipLow} />
          </linearGradient>
          <filter id={id('soft')} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
          <filter id={id('blur2')} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.4" />
          </filter>
          <filter id={id('edge')} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
          <clipPath id={id('face')}>
            <path d={FACE} />
          </clipPath>
          {EYES.map((e, i) => (
            <clipPath key={i} id={id(`eye${i}`)}>
              <path d={e.white} />
            </clipPath>
          ))}
        </defs>

        {/* hair behind */}
        <g transform={tilt}>
          <g className="portrait__hair">
            <path d={HAIR_BACK} fill={soft ? HIEN.hairDeep : '#1A1415'} />
          </g>
        </g>

        {/* neck and jacket */}
        <path d={NECK} fill={url('neck')} />
        <g className="portrait__jacket">
          <path d={JACKET} fill={url('jacket')} />
          <path d={JACKET} fill={url('tweed')} opacity=".5" />
          <path d={NECKLINE} fill="none" stroke="#4E4959" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M205 371C207 404 209 444 211 480" fill="none" stroke="#0E0D12" strokeWidth="1.6" opacity=".7" />
          {[414, 462].map((y) => (
            <g key={y}>
              <circle cx="216" cy={y} r="6.5" fill={url('gold')} />
              <circle cx="216" cy={y} r="3.6" fill="none" stroke={HIEN.goldDeep} strokeWidth="1" opacity=".7" />
            </g>
          ))}
        </g>

        <g transform={tilt}>
          <g className="portrait__head">
            {/* face */}
            <path d={FACE} fill={skinFill} />
            <g clipPath={url('face')}>
              <path d={FACE_SHADE} fill={HIEN.skinShade} opacity={soft ? 0.55 : 0.55} filter={soft ? url('soft') : url('blur2')} />
              {/* the shadow the bangs cast on the forehead */}
              <path d="M120 150H280V212C246 192 154 192 120 212Z" fill={HIEN.skinDeep} opacity=".28" filter={url('soft')} />
              <ellipse cx="152" cy="258" rx="24" ry="12" fill={url('blush')} />
              <ellipse cx="248" cy="258" rx="24" ry="12" fill={url('blush')} />
              {soft && <ellipse cx="156" cy="250" rx="9" ry="4" fill="#FFFFFF" opacity=".35" filter={url('edge')} />}
              {soft && <ellipse cx="204" cy="306" rx="12" ry="4" fill={HIEN.skinLit} opacity=".7" filter={url('edge')} />}
            </g>
            {/* the jaw line on the shade side, drawn fine (A only) */}
            {!soft && <path d="M262 246C258 270 244 294 224 308" fill="none" stroke={HIEN.line} strokeWidth="1.2" strokeLinecap="round" opacity=".45" />}

            {/* brows */}
            {EYES.map((e, i) => (
              <path key={`b${i}`} d={ribbon(...e.brow)} fill={HIEN.brow} opacity=".78" />
            ))}

            {/* eyes: almond, mostly iris, a fine lash line with a small lift at the outer corner */}
            {EYES.map((e, i) => (
              <g key={`e${i}`} className="portrait__eye">
                <path d={e.white} fill="#FFFBF8" />
                <g clipPath={url(`eye${i}`)}>
                  <g className="portrait__iris" transform={lookAt}>
                    <circle cx={e.cx} cy={e.cy} r={soft ? 8.2 : 7.6} fill={url('iris')} />
                    <circle cx={e.cx} cy={e.cy} r="3.4" fill="#140C0B" />
                    <circle cx={e.cx + 2.6} cy={e.cy - 2.8} r={soft ? 2.4 : 1.9} fill="#FFFFFF" />
                    <circle cx={e.cx - 2.4} cy={e.cy + 2.8} r=".9" fill="#FFFFFF" opacity=".75" />
                  </g>
                  {/* the upper lid's shadow on the eye */}
                  <path
                    d={`M${e.cx - 20} ${e.cy - 14}H${e.cx + 20}V${e.cy - 4}C${e.cx + 8} ${e.cy - 7} ${e.cx - 8} ${e.cy - 7} ${e.cx - 20} ${e.cy - 4}Z`}
                    fill={HIEN.lash}
                    opacity=".22"
                  />
                  <path
                    d={`M${e.cx - 22} ${e.cy - 14}H${e.cx + 22}V${e.cy + 12}H${e.cx - 22}Z`}
                    fill={HIEN.skin}
                    className="portrait__lid"
                    style={{ transform: blink ? 'scaleY(1)' : 'scaleY(0)' }}
                  />
                </g>
                <path d={e.lash} fill="none" stroke={HIEN.lash} strokeWidth="2.6" strokeLinecap="round" />
                <path d={ribbon(e.wing[0], e.wing[1], e.wing[2], e.wing[3], 2.6, 0.4)} fill={HIEN.lash} />
                <path d={e.crease} fill="none" stroke={HIEN.line} strokeWidth="1" strokeLinecap="round" opacity=".55" />
                <path d={e.lower} fill="none" stroke={HIEN.line} strokeWidth="1" strokeLinecap="round" opacity=".5" />
                <path d={e.fold} fill="none" stroke={HIEN.skinLit} strokeWidth="2" strokeLinecap="round" opacity=".75" />
              </g>
            ))}

            {/* nose: a whisper of shade and a soft tip */}
            <path d={ribbon([207, 232], [209, 242], [209, 250], [207, 257], 3, 1)} fill={HIEN.skinShade} opacity=".7" filter={url('edge')} />
            {soft && <ellipse cx="199" cy="255" rx="4.5" ry="3.2" fill={HIEN.skinLit} opacity=".85" filter={url('edge')} />}
            <path d="M193.5 261C197 264.5 203.5 264.5 207 260.5" fill="none" stroke={HIEN.line} strokeWidth="1.4" strokeLinecap="round" opacity=".7" />

            {/* a small closed smile */}
            <path d="M184 284C192 287 208 287 216 284C212 292 205 295.5 200 295.5C195 295.5 188 292 184 284Z" fill={url('lipLow')} />
            <path d="M183 283C189 279 195 278 200 280C205 278 211 279 217 283C208 285.6 192 285.6 183 283Z" fill={HIEN.lipTop} />
            <path d="M182.5 282.6C191 286.4 209 286.4 217.5 282.6" fill="none" stroke={HIEN.lipLine} strokeWidth="1.2" strokeLinecap="round" />
            <path d="M180 280.6C181 283 182.6 284 184.6 284M220 280.6C219 283 217.4 284 215.4 284" fill="none" stroke={HIEN.line} strokeWidth="1.1" strokeLinecap="round" opacity=".7" />
            <ellipse cx="203" cy="290.5" rx={soft ? 5 : 4} ry="1.4" fill="#FFFFFF" opacity={soft ? 0.6 : 0.4} />
          </g>

          {/* hair in front */}
          <g className="portrait__hair">
            <g clipPath={url('face')} opacity=".3">
              {[...BANGS, ...SIDE_L, ...SIDE_R].map((d, i) => (
                <path key={`c${i}`} d={d} fill={HIEN.skinDeep} transform="translate(2 5)" filter={url('edge')} />
              ))}
            </g>
            {[...SIDE_L, ...SIDE_R].map((d, i) => (
              <path key={`s${i}`} d={d} fill={i % 4 === 1 ? (soft ? url('hairGrad') : HIEN.hairMid) : hairFill} />
            ))}
            <path d={CROWN} fill={hairFill} />
            {soft && <path d={CROWN_RIM} fill="none" stroke={HIEN.hairRim} strokeOpacity=".35" strokeWidth="3" filter={url('edge')} />}
            {LOCK_LINES.map((d, i) => (
              <path key={`l${i}`} d={d} fill={soft ? HIEN.hairDeep : HIEN.hairLit} opacity={soft ? 0.8 : 0.45} />
            ))}
            {WISPS.map((d, i) => (
              <path key={`w${i}`} d={d} fill={hairFill} />
            ))}
            {BANGS.map((d, i) => (
              <path key={`b${i}`} d={d} fill={url(i % 4 === 1 ? 'bangMid' : 'bang')} />
            ))}
            {SHINE.map((d, i) => (
              <path key={`h${i}`} d={d} fill={soft ? '#8A716A' : HIEN.hairLit} opacity={soft ? 0.45 : 0.7} filter={soft ? url('blur2') : undefined} />
            ))}
          </g>
        </g>
      </svg>
    </div>
  )
})
