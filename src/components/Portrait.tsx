import { forwardRef, useEffect, useId, useState, type CSSProperties } from 'react'

/**
 * Hien, illustrated for this site in the same rounded 2.5D language as the cats: big soft volumes lit from the upper
 * left, gentle gradients, no outlines. Drawn by hand as vector shapes from her own features: a round face with full
 * cheeks, smiling eyes with a lifted outer lash line, a small rounded nose, a closed-lip coral smile and a light flush
 * of blush; dark layered hair with see-through curtain bangs, face-framing locks that flick outward at the jaw and
 * again at the chest; the black tweed jacket with gold buttons from her photos. No photograph is embedded.
 *
 * The coordinate space is the portrait's own (0 0 400 460): head, hair and shoulders, the head tilted a little
 * toward the cat. The eyes blink now and then and follow the pointer, like the cats' eyes do.
 */

export const HIEN = {
  skin: '#F8D9C9',
  skinLit: '#FFEDE3',
  skinShade: '#EDB59F',
  skinDeep: '#D69480',
  blush: '#F28F98',
  lip: '#D84B5B',
  lipLow: '#EA6670',
  lipLit: '#FFD0CB',
  iris: '#2E1D1A',
  irisLit: '#7B5143',
  lash: '#1B1315',
  brow: '#3B2B27',
  hair: '#1D1618',
  hairMid: '#2E2426',
  hairLit: '#5C4740',
  hairRim: '#B9764F',
  jacket: '#1C1A22',
  jacketLit: '#3A3644',
  gold: '#E3A64C',
  goldLit: '#FFE4A6',
  goldDeep: '#9C6A28',
}

/** A tapered ribbon along a cubic Bézier: how every strand of hair is drawn. Width eases from `w0` to `w1`. */
export function ribbon(p0: number[], p1: number[], p2: number[], p3: number[], w0: number, w1 = 0, steps = 16) {
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
    const w = (w1 + (w0 - w1) * (1 - t * t)) / 2
    left.push([x - ((y2 - y1) / len) * w, y + ((x2 - x1) / len) * w])
    right.push([x + ((y2 - y1) / len) * w, y - ((x2 - x1) / len) * w])
  }
  const f = (n: number) => n.toFixed(1)
  return `M${left.map((p) => `${f(p[0])} ${f(p[1])}`).join('L')}L${right
    .reverse()
    .map((p) => `${f(p[0])} ${f(p[1])}`)
    .join('L')}Z`
}

type Strand = [number[], number[], number[], number[], number, number?]
const strands = (list: Strand[]) => list.map((s) => ribbon(...s))

/* ── Shapes ── */
const FACE =
  'M200 104C252 104 289 138 291 198C293 246 279 279 255 299C237 313 219 319 200 319C181 319 163 313 145 299C121 279 107 246 109 198C111 138 148 104 200 104Z'
const NECK = 'M170 268C172 300 170 326 160 346C158 362 168 384 200 386C232 384 242 362 240 346C230 326 228 300 230 268Z'
const JACKET =
  'M14 460C18 404 56 372 118 358C142 353 154 348 160 340C170 358 186 364 200 364C214 364 230 358 240 340C246 348 258 353 282 358C344 372 382 404 386 460Z'
/** The mass of hair behind her head and neck */
const HAIR_BACK = 'M200 50C290 50 340 112 338 204C336 268 336 330 322 392L78 392C64 330 64 268 62 204C60 112 110 50 200 50Z'
/** Crown and hairline: volume on top, a soft parting a little left of centre */
const CAP =
  'M80 204C72 112 128 48 200 48C274 48 330 112 320 204C312 198 298 196 286 200C278 168 262 146 236 134C222 128 212 127 203 129L197 139L191 129C182 127 170 128 160 134C136 146 122 168 114 200C102 196 88 198 80 204Z'
/** Where the bangs leave the hairline, before they separate into strands: one lobe each side of the parting */
const BANG_ROOTS = [
  'M195 130C184 126 160 128 142 140C134 150 130 162 131 172C150 160 168 152 186 150C190 144 193 137 195 130Z',
  'M199 130C210 126 236 128 256 140C265 150 270 162 269 172C250 160 230 152 212 150C207 144 202 137 199 130Z',
]
/** Face-framing locks: down the cheek, an outward flick at the jaw, then a longer layer over the shoulder */
const LOCK_L =
  'M120 142C104 192 102 244 116 282C126 310 140 332 142 360C144 388 138 412 150 436C128 432 112 420 104 404C96 420 78 432 52 436C70 416 78 394 82 372C70 360 50 356 42 346C37 339 43 332 52 330C64 326 72 316 74 300C62 266 60 222 72 186C82 160 100 144 120 142Z'
const LOCK_R =
  'M280 142C296 192 298 244 284 282C274 310 260 332 258 360C256 388 264 414 252 438C276 432 292 420 300 404C308 422 328 434 354 434C334 414 324 392 320 372C330 356 350 352 358 342C363 335 357 328 348 326C336 322 328 314 326 298C338 264 340 220 328 186C318 160 300 144 280 142Z'

/** See-through curtain bangs, swept out from the parting */
const BANGS = strands([
  [[156, 136], [130, 150], [110, 196], [112, 250], 22, 2],
  [[170, 132], [150, 146], [126, 180], [120, 226], 24, 2],
  [[182, 130], [172, 150], [152, 176], [138, 204], 22, 1],
  [[190, 130], [186, 150], [176, 174], [160, 192], 18, 1],
  [[194, 132], [192, 150], [188, 170], [184, 186], 9, 0.5],
  [[232, 136], [262, 150], [290, 196], [288, 250], 22, 2],
  [[218, 132], [246, 146], [272, 180], [280, 226], 24, 2],
  [[206, 130], [220, 150], [244, 176], [256, 204], 22, 1],
  [[198, 130], [204, 150], [220, 174], [232, 190], 18, 1],
  [[200, 134], [202, 150], [206, 168], [208, 182], 8, 0.5],
])
/** Darker strands inside the locks, so the layers read as hair and not as a cut-out */
const LOCK_LINES = strands([
  [[100, 180], [92, 240], [96, 300], [64, 336], 3, 0.5],
  [[114, 300], [126, 340], [118, 380], [84, 420], 3, 0.5],
  [[128, 330], [136, 370], [130, 400], [140, 428], 2.5, 0.5],
  [[300, 180], [308, 240], [304, 300], [340, 334], 3, 0.5],
  [[286, 300], [274, 340], [282, 380], [318, 420], 3, 0.5],
  [[272, 330], [264, 370], [270, 402], [262, 428], 2.5, 0.5],
])
/** The soft halo of light across the crown, and a sheen down each lock */
const SHEEN = strands([
  [[128, 92], [158, 70], [196, 64], [226, 66], 7, 1],
  [[214, 68], [244, 72], [270, 88], [288, 110], 5, 0.5],
  [[90, 196], [86, 236], [88, 270], [84, 296], 4, 0.5],
  [[106, 330], [98, 360], [86, 388], [70, 414], 3.5, 0.5],
  [[312, 196], [316, 236], [314, 266], [318, 292], 3.5, 0.5],
])

const EYES: { cx: number; cy: number; white: string; lash: string; wing: number[][] }[] = [
  { cx: 158, cy: 213, white: 'M133 216C140 201 170 197 181 215C170 221 146 223 133 216Z', lash: 'M130 218C138 200 170 194 183 214', wing: [[134, 213], [130, 210], [126, 206], [121, 203]] },
  { cx: 242, cy: 213, white: 'M267 216C260 201 230 197 219 215C230 221 254 223 267 216Z', lash: 'M270 218C262 200 230 194 217 214', wing: [[266, 213], [270, 210], [274, 206], [279, 203]] },
]

interface Props {
  /** Where she looks, each axis -1 … 1 (a gentle follow) */
  gaze?: { x: number; y: number }
  /** Blink and breathe. Off for static renders and reduced motion. */
  alive?: boolean
  className?: string
  style?: CSSProperties
  label?: string
}

export const Portrait = forwardRef<HTMLDivElement, Props>(function Portrait({ gaze = { x: 0, y: 0 }, alive = true, className = '', style, label }, ref) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const id = (n: string) => `${n}-${uid}`
  const url = (n: string) => `url(#${id(n)})`
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
  const look = `translate(${(gx * 3.2).toFixed(2)} ${(gy * 1.8).toFixed(2)})`
  const tilt = 'rotate(4 200 340)'

  return (
    <div ref={ref} className={`portrait ${alive ? 'is-alive' : ''} ${className}`} style={style} role={label ? 'img' : undefined} aria-label={label}>
      <svg viewBox="0 0 400 460" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id={id('skin')} gradientUnits="userSpaceOnUse" cx="170" cy="180" r="190">
            <stop offset="0" stopColor={HIEN.skinLit} />
            <stop offset=".6" stopColor={HIEN.skin} />
            <stop offset="1" stopColor={HIEN.skinShade} />
          </radialGradient>
          <linearGradient id={id('neck')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={HIEN.skinDeep} />
            <stop offset=".45" stopColor={HIEN.skinShade} />
            <stop offset="1" stopColor={HIEN.skin} />
          </linearGradient>
          <linearGradient id={id('hair')} gradientUnits="userSpaceOnUse" x1="120" y1="40" x2="300" y2="440">
            <stop offset="0" stopColor={HIEN.hairMid} />
            <stop offset=".55" stopColor={HIEN.hair} />
            <stop offset="1" stopColor="#140F11" />
          </linearGradient>
          <radialGradient id={id('cap')} gradientUnits="userSpaceOnUse" cx="170" cy="70" r="180">
            <stop offset="0" stopColor="#3A2E2E" />
            <stop offset=".6" stopColor={HIEN.hair} />
            <stop offset="1" stopColor="#120D0F" />
          </radialGradient>
          <linearGradient id={id('bang')} gradientUnits="userSpaceOnUse" x1="0" y1="128" x2="0" y2="224">
            <stop offset="0" stopColor={HIEN.hairMid} />
            <stop offset=".7" stopColor={HIEN.hair} />
            <stop offset="1" stopColor={HIEN.hair} stopOpacity=".7" />
          </linearGradient>
          <linearGradient id={id('jacket')} gradientUnits="userSpaceOnUse" x1="60" y1="350" x2="300" y2="460">
            <stop offset="0" stopColor={HIEN.jacketLit} />
            <stop offset=".55" stopColor={HIEN.jacket} />
            <stop offset="1" stopColor="#121118" />
          </linearGradient>
          <pattern id={id('tweed')} width="7" height="7" patternUnits="userSpaceOnUse">
            <path d="M0 3.5h3.5M3.5 0v3.5M5 6.2l1.4-1.4" stroke="#5B5668" strokeWidth=".8" />
            <circle cx="5.6" cy="1.6" r=".7" fill="#77718A" />
          </pattern>
          <radialGradient id={id('gold')} cx=".38" cy=".34" r=".7">
            <stop offset="0" stopColor={HIEN.goldLit} />
            <stop offset=".5" stopColor={HIEN.gold} />
            <stop offset="1" stopColor={HIEN.goldDeep} />
          </radialGradient>
          <radialGradient id={id('iris')} cx=".5" cy=".62" r=".6">
            <stop offset="0" stopColor={HIEN.irisLit} />
            <stop offset=".75" stopColor={HIEN.iris} />
          </radialGradient>
          <radialGradient id={id('blush')}>
            <stop offset="0" stopColor={HIEN.blush} stopOpacity=".75" />
            <stop offset="1" stopColor={HIEN.blush} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={id('lip')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={HIEN.lip} />
            <stop offset="1" stopColor={HIEN.lipLow} />
          </linearGradient>
          <filter id={id('soft')} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <filter id={id('edge')} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.4" />
          </filter>
          {EYES.map((e, i) => (
            <clipPath key={i} id={id(`eye${i}`)}>
              <path d={e.white} />
            </clipPath>
          ))}
          <clipPath id={id('face')}>
            <path d={FACE} />
          </clipPath>
        </defs>

        {/* hair behind */}
        <g transform={tilt}>
          <g className="portrait__hair">
            <path d={HAIR_BACK} fill={url('hair')} />
          </g>
        </g>

        {/* neck and jacket */}
        <path d={NECK} fill={url('neck')} />
        <ellipse cx="200" cy="300" rx="42" ry="16" fill={HIEN.skinDeep} opacity=".4" filter={url('soft')} />
        <g className="portrait__jacket">
          <path d={JACKET} fill={url('jacket')} />
          <path d={JACKET} fill={url('tweed')} opacity=".55" />
          {/* the neckline trim and the opening */}
          <path d="M160 340C170 358 186 364 200 364C214 364 230 358 240 340" fill="none" stroke="#4E4959" strokeWidth="3" strokeLinecap="round" />
          <path d="M206 364C208 396 210 430 212 460" fill="none" stroke="#0E0D12" strokeWidth="2" opacity=".7" />
          <path d="M60 392C90 380 116 372 140 368" fill="none" stroke="#FFFFFF" strokeOpacity=".08" strokeWidth="6" strokeLinecap="round" filter={url('edge')} />
          <g>
            <circle cx="222" cy="418" r="8" fill={url('gold')} />
            <circle cx="222" cy="418" r="4.6" fill="none" stroke={HIEN.goldDeep} strokeWidth="1.2" opacity=".75" />
            <circle cx="219.5" cy="415" r="1.8" fill="#FFF6DC" opacity=".9" />
          </g>
        </g>

        <g transform={tilt}>
          {/* face */}
          <g className="portrait__head">
            <path d={FACE} fill={url('skin')} />
            <g clipPath={url('face')}>
              {/* shade where the hair and the jaw turn away from the light */}
              <path d="M291 150C296 230 282 290 236 322L300 330Z" fill={HIEN.skinShade} opacity=".6" filter={url('soft')} />
              <path d="M109 200C110 250 128 290 168 316L120 330Z" fill={HIEN.skinShade} opacity=".35" filter={url('soft')} />
              <path d="M100 120H300V176C250 160 150 160 100 176Z" fill={HIEN.skinDeep} opacity=".3" filter={url('soft')} />
            </g>
            <ellipse cx="146" cy="254" rx="30" ry="20" fill={url('blush')} />
            <ellipse cx="256" cy="254" rx="30" ry="20" fill={url('blush')} />
            <ellipse cx="150" cy="246" rx="9" ry="4" fill="#FFFFFF" opacity=".35" filter={url('edge')} />
            <ellipse cx="204" cy="306" rx="12" ry="4" fill={HIEN.skinLit} opacity=".7" filter={url('edge')} />

            {/* brows, mostly behind the bangs */}
            <path d={ribbon([132, 188], [142, 180], [162, 178], [180, 184], 5.5, 2.5)} fill={HIEN.brow} opacity=".8" />
            <path d={ribbon([268, 188], [258, 180], [238, 178], [220, 184], 5.5, 2.5)} fill={HIEN.brow} opacity=".8" />

            {/* eyes: smiling, with the lower lid lifted */}
            {EYES.map((e, i) => (
              <g key={i} className="portrait__eye">
                <path d={e.white} fill="#FFFDFB" />
                <g clipPath={url(`eye${i}`)}>
                  <g className="portrait__iris" transform={look}>
                    <circle cx={e.cx} cy={e.cy} r="12.5" fill={url('iris')} />
                    <circle cx={e.cx} cy={e.cy} r="5.6" fill="#120B0A" />
                    <circle cx={e.cx + 4} cy={e.cy - 4.5} r="3.6" fill="#FFFFFF" />
                    <circle cx={e.cx - 3.5} cy={e.cy + 4.5} r="1.6" fill="#FFFFFF" opacity=".8" />
                  </g>
                  <path d={`M${e.cx - 30} ${e.cy - 16}H${e.cx + 30}V${e.cy - 6}C${e.cx + 14} ${e.cy - 11} ${e.cx - 14} ${e.cy - 11} ${e.cx - 30} ${e.cy - 6}Z`} fill={HIEN.lash} opacity=".18" />
                  <path
                    d={`M${e.cx - 32} ${e.cy - 20}H${e.cx + 32}V${e.cy + 18}H${e.cx - 32}Z`}
                    fill={HIEN.skin}
                    className="portrait__lid"
                    style={{ transform: blink ? 'scaleY(1)' : 'scaleY(0)' }}
                  />
                </g>
                <path d={e.lash} fill="none" stroke={HIEN.lash} strokeWidth="4.2" strokeLinecap="round" />
                <path d={ribbon(e.wing[0], e.wing[1], e.wing[2], e.wing[3], 4, 0.6)} fill={HIEN.lash} />
                {/* the crease above, and the smile fold below */}
                <path
                  d={i === 0 ? 'M139 201C150 191 168 191 179 202' : 'M261 201C250 191 232 191 221 202'}
                  fill="none"
                  stroke={HIEN.skinDeep}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  opacity=".55"
                />
                <path
                  d={i === 0 ? 'M139 223C149 230 167 230 177 222' : 'M261 223C251 230 233 230 223 222'}
                  fill="none"
                  stroke={HIEN.skinShade}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  opacity=".45"
                />
                <path
                  d={i === 0 ? 'M142 227C151 232 165 232 174 227' : 'M258 227C249 232 235 232 226 227'}
                  fill="none"
                  stroke={HIEN.skinLit}
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity=".8"
                />
              </g>
            ))}

            {/* nose: a soft rounded tip, light on the bridge, shade on the far side */}
            <path d={ribbon([212, 222], [215, 234], [215, 246], [211, 254], 4, 1.5)} fill={HIEN.skinShade} opacity=".5" filter={url('edge')} />
            <ellipse cx="199" cy="251" rx="7" ry="5" fill={HIEN.skinLit} opacity=".9" filter={url('edge')} />
            <path d="M188 258C193 266 207 266 213 257" fill="none" stroke={HIEN.skinShade} strokeWidth="3" strokeLinecap="round" opacity=".85" filter={url('edge')} />
            <path d="M193 259.5C195 261.5 197 261.5 198 260.5M203 260.5C204.5 261.5 206.5 261.5 208.5 259.5" fill="none" stroke={HIEN.skinDeep} strokeWidth="2" strokeLinecap="round" opacity=".8" />

            {/* a closed-lip smile, a little higher on her left */}
            <path d="M170 280C180 288 218 290 230 275C222 293 208 299 198 299C186 299 176 292 170 280Z" fill={HIEN.lipLow} />
            <path d="M170 280C179 274 190 272 198 276C206 272 218 271 230 275C218 285 184 287 170 280Z" fill={url('lip')} />
            <path d="M172 280.5C186 285.5 216 285.5 228 276" fill="none" stroke="#B23443" strokeWidth="1.6" strokeLinecap="round" opacity=".7" />
            <ellipse cx="203" cy="291" rx="9" ry="2.4" fill={HIEN.lipLit} opacity=".6" filter={url('edge')} />
            <path d="M166 276C167.5 280.5 170 282.5 173 282M234 270.5C236 274.5 235.5 278 232.5 279" fill="none" stroke={HIEN.skinDeep} strokeWidth="2" strokeLinecap="round" opacity=".55" />
          </g>

          {/* hair in front */}
          <g className="portrait__hair">
            {/* the shadow the hair casts on her face */}
            <g clipPath={url('face')} opacity=".55">
              <path d={CAP} fill={HIEN.skinDeep} transform="translate(2 10)" filter={url('edge')} />
              {BANGS.map((d, i) => (
                <path key={`bs${i}`} d={d} fill={HIEN.skinDeep} transform="translate(1 5)" filter={url('edge')} opacity=".6" />
              ))}
              <path d={LOCK_L} fill={HIEN.skinDeep} transform="translate(8 2)" filter={url('edge')} />
              <path d={LOCK_R} fill={HIEN.skinDeep} transform="translate(-8 2)" filter={url('edge')} />
            </g>
            <path d={CAP} fill={url('hair')} />
            <path d={CAP} fill={url('cap')} opacity=".55" />
            <path d={LOCK_L} fill={url('hair')} />
            <path d={LOCK_R} fill={url('hair')} />
            {LOCK_LINES.map((d, i) => (
              <path key={`ll${i}`} d={d} fill="#0F0B0C" opacity=".55" />
            ))}
            {BANG_ROOTS.map((d, i) => (
              <path key={`r${i}`} d={d} fill={url('bang')} />
            ))}
            {BANGS.map((d, i) => (
              <path key={`b${i}`} d={d} fill={url('bang')} />
            ))}
            {SHEEN.map((d, i) => (
              <path key={`s${i}`} d={d} fill={HIEN.hairLit} opacity=".7" filter={url('edge')} />
            ))}
          </g>
        </g>
      </svg>
    </div>
  )
})
