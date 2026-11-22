import { forwardRef, useEffect, useId, useState, type CSSProperties } from 'react'

/**
 * The cat: a tortoiseshell, drawn for this site from a photo of Hien's own cat. Soft 2.5D: rounded volumes from
 * light-to-shadow gradients, soft-edged tortie mottling, an orange rim light, and a face that turns toward what the
 * cat is watching (features slide across the rounded head while the head tilts, so it reads as a turn in depth).
 * Pure SVG + CSS. `npm run export:art` renders static copies for the GitHub profile README (Python embeds them).
 */

export type CatMood = 'idle' | 'blink' | 'swat' | 'bob' | 'bow' | 'happy' | 'sleep' | 'crouch'

export const TORTIE = {
  base: '#221B1F',
  lit: '#3B3034',
  rust: '#9A4220',
  ginger: '#D2672A',
  tan: '#D9A06A',
  peach: '#EDBE97',
  earIn: '#B98683',
  earInDeep: '#7E5556',
  irisHi: '#F3F0A6',
  iris: '#D7DC72',
  irisLo: '#A3AD3D',
  irisRim: '#5E6422',
  nose: '#2A1F22',
  whisker: '#F4E9DF',
}

interface Props {
  /** Where the cat looks, each axis -1 … 1 */
  gaze?: { x: number; y: number }
  /** 0 calm … 1 very curious: the pupils widen */
  curious?: number
  mood?: CatMood
  /** Animate idle life (breathing, blinking, tail, ears). Off for static renders and reduced motion. */
  alive?: boolean
  className?: string
  style?: CSSProperties
  label?: string
}

const HEAD =
  'M160 62C206 62 240 92 242 134C244 158 236 176 222 190C206 205 184 214 160 214C136 214 114 205 98 190C84 176 76 158 78 134C80 92 114 62 160 62Z'
const BODY = 'M110 196C80 230 64 286 68 330C70 352 92 362 160 362C228 362 250 352 252 330C256 286 240 230 210 196Z'
const EAR_L = 'M92 112C84 84 80 50 88 22C112 34 132 52 146 72Z'
const EAR_R = 'M228 112C236 84 240 50 232 22C208 34 188 52 174 72Z'
const LEG_L = 'M125 300C124 290 150 290 150 300C152 322 152 338 151 352C147 360 131 360 125 352C121 336 122 318 125 300Z'
const LEG_R = 'M170 300C170 290 195 290 195 300C198 318 199 336 195 352C189 360 173 360 169 352C168 338 168 322 170 300Z'
/** Deterministic pseudo-random flecks in a region, angled with the fur: tortoiseshell is brindled, not spotted. */
function flecks(seed: number, cx: number, cy: number, rx: number, ry: number, n: number, colors: string[], angle = 70) {
  let x = seed
  const rnd = () => ((x = (x * 16807) % 2147483647) - 1) / 2147483646
  return Array.from({ length: n }, (_, i) => {
    const a = rnd() * Math.PI * 2
    const r = Math.sqrt(rnd())
    return {
      key: i,
      cx: cx + Math.cos(a) * rx * r,
      cy: cy + Math.sin(a) * ry * r,
      rx: 2.2 + rnd() * 6.5,
      ry: 1.1 + rnd() * 2.4,
      rot: angle + (rnd() - 0.5) * 50,
      fill: colors[Math.floor(rnd() * colors.length)],
      op: 0.55 + rnd() * 0.4,
    }
  })
}
const Flecks = ({ list }: { list: ReturnType<typeof flecks> }) => (
  <>
    {list.map((f, i) => (
      <ellipse key={i} cx={f.cx} cy={f.cy} rx={f.rx} ry={f.ry} fill={f.fill} opacity={f.op} transform={`rotate(${f.rot} ${f.cx} ${f.cy})`} />
    ))}
  </>
)
const WARM = [TORTIE.ginger, TORTIE.rust, TORTIE.rust, TORTIE.tan]
const BODY_FLECKS = [
  ...flecks(11, 106, 246, 30, 34, 46, WARM, 75),
  ...flecks(23, 222, 228, 22, 26, 30, WARM, 105),
  ...flecks(37, 222, 306, 30, 30, 44, WARM, 95),
  ...flecks(41, 96, 322, 26, 22, 26, WARM, 80),
  ...flecks(53, 190, 262, 14, 18, 14, [TORTIE.tan, TORTIE.ginger], 90),
]
const HEAD_FLECKS = [
  ...flecks(7, 104, 118, 18, 22, 26, [TORTIE.ginger, TORTIE.rust, TORTIE.tan], 60),
  ...flecks(19, 206, 86, 18, 12, 18, [TORTIE.rust, TORTIE.ginger], 120),
  ...flecks(29, 104, 164, 10, 8, 8, [TORTIE.rust, TORTIE.ginger], 40),
  ...flecks(31, 160, 80, 14, 6, 6, [TORTIE.tan], 90),
]
const TAIL_FLECKS = flecks(61, 276, 296, 16, 34, 26, WARM, 100)
const LEG_FLECKS = [...flecks(71, 136, 318, 9, 26, 10, WARM, 90), ...flecks(83, 184, 300, 9, 20, 7, WARM, 90)]

const TAIL = 'M232 346C282 350 304 312 292 276C285 255 265 249 258 262C253 273 268 280 272 296C278 320 260 334 230 332Z'

export const TortieCat = forwardRef<HTMLDivElement, Props>(function TortieCat(
  { gaze = { x: 0, y: 0 }, curious = 0.3, mood = 'idle', alive = true, className = '', style, label },
  ref,
) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const id = (n: string) => `${n}-${uid}`
  const [blink, setBlink] = useState(false)
  const [twitch, setTwitch] = useState<'l' | 'r' | null>(null)

  useEffect(() => {
    if (!alive) return
    let t1 = 0
    let t2 = 0
    const blinkLoop = () => {
      t1 = window.setTimeout(() => {
        setBlink(true)
        window.setTimeout(() => setBlink(false), 150)
        blinkLoop()
      }, 2400 + Math.random() * 3800)
    }
    const earLoop = () => {
      t2 = window.setTimeout(() => {
        setTwitch(Math.random() < 0.5 ? 'l' : 'r')
        window.setTimeout(() => setTwitch(null), 380)
        earLoop()
      }, 4200 + Math.random() * 5200)
    }
    blinkLoop()
    earLoop()
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [alive])

  const gx = Math.max(-1, Math.min(1, gaze.x))
  const gy = Math.max(-1, Math.min(1, gaze.y))
  const dil = 0.82 + 0.42 * Math.max(0, Math.min(1, curious))
  const lid = blink || mood === 'blink' || mood === 'sleep' ? 1 : mood === 'happy' ? 0.55 : 0
  const headT = `translate(${gx * 5} ${gy * 4}) rotate(${gx * 5} 160 200)`
  const faceT = `translate(${gx * 10} ${gy * 7})`
  const earT = (side: 1 | -1) => `translate(${gx * 3 - side * Math.abs(gx) * 2} ${gy * 2})`

  return (
    <div
      ref={ref}
      className={`tortie ${alive ? 'is-alive' : ''} tortie--${mood} ${className}`}
      style={style}
      role={label ? 'img' : undefined}
      aria-label={label}
    >
      <svg viewBox="0 0 320 380" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id={id('shade')} cx="36%" cy="28%" r="78%">
            <stop offset="0" stopColor="#fff3e8" stopOpacity=".26" />
            <stop offset=".42" stopColor="#fff3e8" stopOpacity="0" />
            <stop offset=".78" stopColor="#000" stopOpacity=".18" />
            <stop offset="1" stopColor="#000" stopOpacity=".5" />
          </radialGradient>
          <radialGradient id={id('shadeU')} gradientUnits="userSpaceOnUse" cx="128" cy="96" r="190">
            <stop offset="0" stopColor="#fff3e8" stopOpacity=".24" />
            <stop offset=".4" stopColor="#fff3e8" stopOpacity="0" />
            <stop offset=".75" stopColor="#000" stopOpacity=".16" />
            <stop offset="1" stopColor="#000" stopOpacity=".45" />
          </radialGradient>
          <radialGradient id={id('iris')} cx="50%" cy="62%" r="62%">
            <stop offset="0" stopColor={TORTIE.irisHi} />
            <stop offset=".55" stopColor={TORTIE.iris} />
            <stop offset=".9" stopColor={TORTIE.irisLo} />
            <stop offset="1" stopColor={TORTIE.irisRim} />
          </radialGradient>
          <radialGradient id={id('ear')} cx="50%" cy="80%" r="80%">
            <stop offset="0" stopColor={TORTIE.earIn} />
            <stop offset="1" stopColor={TORTIE.earInDeep} />
          </radialGradient>
          <filter id={id('soft')} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.6" />
          </filter>
          <filter id={id('fleck')} x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.35" />
          </filter>
          <filter id={id('blur6')} x="-40%" y="-200%" width="180%" height="500%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <clipPath id={id('head')}>
            <path d={HEAD} />
          </clipPath>
          <clipPath id={id('body')}>
            <path d={BODY} />
            <ellipse cx="100" cy="320" rx="42" ry="44" />
            <ellipse cx="220" cy="320" rx="42" ry="44" />
          </clipPath>
          <clipPath id={id('tail')}>
            <path d={TAIL} />
          </clipPath>
          {[128, 192].map((cx) => (
            <clipPath key={cx} id={id(`eye${cx}`)}>
              <circle cx={cx} cy="138" r="25" />
            </clipPath>
          ))}
          {[128, 192].map((cx) => (
            <clipPath key={`s${cx}`} id={id(`sock${cx}`)}>
              <circle cx={cx} cy="138" r="29" />
            </clipPath>
          ))}
          {/* rim light masks: the shape minus itself nudged left, leaving a crescent on the right edge */}
          <linearGradient id={id('legFadeG')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#000" />
            <stop offset=".34" stopColor="#fff" />
          </linearGradient>
          <mask id={id('legFade')} maskUnits="userSpaceOnUse" x="100" y="286" width="120" height="86">
            <rect x="100" y="286" width="120" height="86" fill={`url(#${id('legFadeG')})`} />
          </mask>
          <mask id={id('rimHead')}>
            <path d={HEAD} fill="#fff" />
            <path d={HEAD} fill="#000" transform="translate(-11 -3)" />
          </mask>
          <mask id={id('rimBody')}>
            <path d={BODY} fill="#fff" />
            <path d={BODY} fill="#000" transform="translate(-12 -3)" />
          </mask>
        </defs>

        {/* contact shadow */}
        <ellipse cx="160" cy="364" rx="118" ry="13" fill="#22243A" opacity=".28" filter={`url(#${id('blur6')})`} />

        {/* tail */}
        <g className="tortie__tail">
          <path d={TAIL} fill={TORTIE.base} />
          <g clipPath={`url(#${id('tail')})`}>
            <g filter={`url(#${id('fleck')})`}>
              <Flecks list={TAIL_FLECKS} />
            </g>
            <path d={TAIL} fill={`url(#${id('shade')})`} />
          </g>
        </g>

        {/* body */}
        <g className="tortie__body">
          <ellipse cx="100" cy="320" rx="42" ry="44" fill={TORTIE.base} />
          <ellipse cx="220" cy="320" rx="42" ry="44" fill={TORTIE.base} />
          <path d={BODY} fill={TORTIE.base} />
          <g clipPath={`url(#${id('body')})`}>
            <g filter={`url(#${id('soft')})`}>
              <path d="M160 206c-20 10-28 36-25 62 3 18 14 30 25 30s22-12 25-30c3-26-5-52-25-62z" fill={TORTIE.peach} opacity=".82" />
              <path d="M90 232c16-10 34-2 32 18-2 18-16 30-30 26-8-14-10-32-2-44z" fill={TORTIE.rust} opacity=".55" />
              <path d="M206 284c20-2 36 16 32 34-8 12-28 10-34-4-4-12-4-24 2-30z" fill={TORTIE.rust} opacity=".6" />
            </g>
            <g filter={`url(#${id('fleck')})`}>
              <Flecks list={BODY_FLECKS} />
            </g>
            <rect x="40" y="180" width="240" height="190" fill={`url(#${id('shade')})`} />
          </g>
          <path d={BODY} fill={TORTIE.ginger} opacity=".16" mask={`url(#${id('rimBody')})`} filter={`url(#${id('soft')})`} />
        </g>

        {/* front legs */}
        <g className="tortie__leg" mask={`url(#${id('legFade')})`}>
          <path d={LEG_L} fill={TORTIE.base} />
          <path d="M131 286c-2 22-2 44 0 58" stroke={TORTIE.lit} strokeWidth="5" strokeLinecap="round" opacity=".8" filter={`url(#${id('soft')})`} />
          <ellipse cx="138" cy="355" rx="16" ry="8.5" fill={TORTIE.base} />
          <path d="M127 352c5-4 12-4 16 0" fill="none" stroke={TORTIE.ginger} strokeWidth="3" strokeLinecap="round" opacity=".8" />
          <path d="M133 361v-4M143 361v-4" stroke="#6b5a5f" strokeWidth="1.4" strokeLinecap="round" />
        </g>
        <g className="tortie__paw" mask={`url(#${id('legFade')})`}>
          <path d={LEG_R} fill={TORTIE.base} />
          <path d="M176 286c-2 22-2 44 0 58" stroke={TORTIE.lit} strokeWidth="5" strokeLinecap="round" opacity=".8" filter={`url(#${id('soft')})`} />
          <ellipse cx="182" cy="355" rx="16" ry="8.5" fill={TORTIE.base} />
          <path d="M177 361v-4M187 361v-4" stroke="#6b5a5f" strokeWidth="1.4" strokeLinecap="round" />
        </g>

        <g clipPath={`url(#${id('body')})`} filter={`url(#${id('fleck')})`}>
          <Flecks list={LEG_FLECKS} />
        </g>

        {/* head */}
        <g className="tortie__head" transform={headT}>
          <g className={`tortie__ear tortie__ear--l ${twitch === 'l' ? 'is-twitch' : ''}`} transform={earT(-1)}>
            <path d={EAR_L} fill={TORTIE.base} stroke={TORTIE.base} strokeWidth="6" strokeLinejoin="round" />
            <path d="M101 98C97 78 96 57 100 41C114 51 126 63 134 75Z" fill={`url(#${id('ear')})`} />
            <path d="M106 86l9-12M110 94l11-10" stroke={TORTIE.whisker} strokeOpacity=".45" strokeWidth="1.3" strokeLinecap="round" />
          </g>
          <g className={`tortie__ear tortie__ear--r ${twitch === 'r' ? 'is-twitch' : ''}`} transform={earT(1)}>
            <path d={EAR_R} fill={TORTIE.base} stroke={TORTIE.base} strokeWidth="6" strokeLinejoin="round" />
            <path d="M219 98C223 78 224 57 220 41C206 51 194 63 186 75Z" fill={`url(#${id('ear')})`} />
            <path d="M214 86l-9-12M210 94l-11-10" stroke={TORTIE.whisker} strokeOpacity=".45" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M226 36c6 10 6 24 2 34" fill="none" stroke={TORTIE.rust} strokeWidth="5" strokeLinecap="round" opacity=".55" />
          </g>

          <path d="M82 158l-15 11 19 6zM238 158l15 11-19 6z" fill={TORTIE.base} />
          <path d={HEAD} fill={TORTIE.base} />
          <g clipPath={`url(#${id('head')})`}>
            <g filter={`url(#${id('fleck')})`} transform={`translate(${gx * 4} ${gy * 3})`}>
              <path d="M90 106c10-10 26-6 24 8-2 12-10 22-20 24-7-9-9-24-4-32z" fill={TORTIE.rust} opacity=".5" />
              <Flecks list={HEAD_FLECKS} />
            </g>
            <rect x="60" y="50" width="200" height="180" fill={`url(#${id('shadeU')})`} />
          </g>
          <path d={HEAD} fill={TORTIE.ginger} opacity=".2" mask={`url(#${id('rimHead')})`} filter={`url(#${id('soft')})`} />

          {/* the face slides across the rounded head as it turns */}
          <g className="tortie__face" transform={faceT}>
            {[128, 192].map((cx) => (
              <g key={cx}>
                <circle cx={cx} cy="138" r="28.5" fill="#1a1317" />
                <g clipPath={`url(#${id(`eye${cx}`)})`}>
                  <circle cx={cx} cy="138" r="25" fill={`url(#${id('iris')})`} />
                  <ellipse cx={cx} cy="117" rx="30" ry="12" fill="#000" opacity=".22" />
                  <g className="tortie__pupil" transform={`translate(${gx * 6} ${gy * 5})`}>
                    <ellipse cx={cx} cy="139" rx={10.5 * dil} ry={14 * dil} fill="#110c0f" />
                  </g>
                  <circle cx={cx - 9} cy="128" r="6.4" fill="#fff" opacity=".95" />
                  <circle cx={cx + 8} cy="148" r="2.6" fill="#fff" opacity=".7" />
                </g>
                <g clipPath={`url(#${id(`sock${cx}`)})`}>
                  <g className="tortie__lid" style={{ transform: `scaleY(${lid})` }}>
                    <rect x={cx - 31} y="108" width="62" height="62" fill={TORTIE.base} />
                    <rect x={cx - 31} y="108" width="62" height="62" fill={`url(#${id('shadeU')})`} />
                  </g>
                </g>
                {lid >= 1 && <path d={`M${cx - 18} 138q18 10 36 0`} fill="none" stroke="#9a868b" strokeWidth="3" strokeLinecap="round" />}
              </g>
            ))}
            <circle cx="146" cy="184" r="12" fill={TORTIE.lit} opacity=".55" />
            <circle cx="174" cy="184" r="12" fill={TORTIE.lit} opacity=".55" />
            <ellipse cx="152" cy="201" rx="15" ry="8" fill={TORTIE.peach} opacity=".85" filter={`url(#${id('soft')})`} />
            <path d="M151 168q9-4 18 0-3 8-9 11-6-3-9-11z" fill={TORTIE.nose} />
            <ellipse cx="157" cy="169.5" rx="3" ry="1.4" fill="#7a6266" />
            <path d="M160 179v6m0 0c-4 6-12 6-15 1m15-1c4 6 12 6 15 1" fill="none" stroke="#5f4c51" strokeWidth="2.2" strokeLinecap="round" />
            <g stroke={TORTIE.whisker} strokeOpacity=".62" strokeWidth="1.6" strokeLinecap="round">
              <path d="M134 186L70 176M134 192L72 199M186 186l64-10M186 192l62 7" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  )
})
