import { useId } from 'react'
import { TORTIE } from './TortieCat'

/* ───────── The ruler cat: the same tortoiseshell, side view, five poses ───────── */

export type RulerPose = 'walk' | 'run' | 'sit' | 'sleep' | 'play'

const Patches = ({ d }: { d: string[] }) => (
  <g>
    {d.map((p, i) => (
      <path key={i} d={p} fill={i % 2 ? TORTIE.rust : TORTIE.ginger} opacity=".95" />
    ))}
  </g>
)

export function RulerCat({ pose }: { pose: RulerPose }) {
  const moving = pose === 'walk' || pose === 'run'
  return (
    <svg viewBox="0 0 76 46" className={`rcat rcat--${pose}`} aria-hidden="true" focusable="false">
      {moving && (
        <g>
          <path className="rcat__tail" d="M16 24C8 22 4 15 8 6" fill="none" stroke={TORTIE.base} strokeWidth="3.6" strokeLinecap="round" />
          <g strokeWidth="3.8" strokeLinecap="round">
            <path className="rcat__leg rcat__leg--a" d="M21 30v11" stroke={TORTIE.base} />
            <path className="rcat__leg rcat__leg--b" d="M27 30v11" stroke={TORTIE.base} />
            <path className="rcat__leg rcat__leg--b" d="M47 30v11" stroke={TORTIE.base} />
            <path className="rcat__leg rcat__leg--a" d="M53 30v11" stroke={TORTIE.base} />
          </g>
          <path d="M14 25c0-8 10-10 20-10h14c8 0 12 4 12 10s-4 8-10 8H23c-6 0-9-3-9-8z" fill={TORTIE.base} />
          <Patches d={['M22 17c5-2 10 0 10 4s-5 6-10 5c-3-3-3-7 0-9z', 'M38 26c4-1 8 1 8 3h-9z', 'M42 16c3 0 6 1 7 3-3 1-6 1-8-1z']} />
          <path d="M51 22c5 2 7 7 4 10h-5z" fill={TORTIE.peach} />
          <g className="rcat__head">
            <path d="M54 9l1-8 6 6zM65 7l5-6 1 9z" fill={TORTIE.base} />
            <circle cx="62" cy="14" r="9" fill={TORTIE.base} />
            <path d="M56 8c3-2 6-2 8 0-2 2-5 2-8 0z" fill={TORTIE.ginger} />
            <ellipse cx="67.5" cy="19" rx="3.6" ry="2.4" fill={TORTIE.peach} opacity=".9" />
            <circle cx="65" cy="12.5" r="2.4" fill={TORTIE.iris} />
            <circle cx="65.5" cy="12.6" r="1.1" fill="#110c0f" />
          </g>
        </g>
      )}
      {(pose === 'sit' || pose === 'play') && (
        <g>
          <path className="rcat__tail" d="M24 42c-10 0-14-6-9-11" fill="none" stroke={TORTIE.base} strokeWidth="3.6" strokeLinecap="round" />
          <path d="M24 42c-4-12 2-24 12-26s16 6 16 16v10z" fill={TORTIE.base} />
          <Patches d={['M27 30c3-4 8-4 9 0 0 4-4 7-8 6-2-2-2-4-1-6z', 'M30 20c3-1 6 0 7 2-2 2-5 2-7 1z']} />
          <path d="M44 22c5 4 6 12 3 19h-5z" fill={TORTIE.peach} />
          <ellipse cx="45" cy="40.5" rx="5" ry="2.6" fill={TORTIE.base} />
          <g className="rcat__head">
            <path d="M40 9l1-8 6 6zM51 7l5-6 1 9z" fill={TORTIE.base} />
            <circle cx="48" cy="14" r="9" fill={TORTIE.base} />
            <path d="M42 8c3-2 6-2 8 0-2 2-5 2-8 0z" fill={TORTIE.ginger} />
            <ellipse cx="53" cy="19" rx="3.6" ry="2.4" fill={TORTIE.peach} opacity=".9" />
            <circle cx="51" cy="12.5" r="2.4" fill={TORTIE.iris} />
            <circle cx="51.5" cy="12.6" r="1.1" fill="#110c0f" />
          </g>
          {pose === 'play' && (
            <g className="rcat__yarn">
              <circle cx="66" cy="38" r="6" fill="#FF7029" stroke="#22243A" strokeWidth="1" />
              <path d="M61 36.5c3 2 7 2 10-1M61.5 40.5c3-2 6-2 9 0" fill="none" stroke="#B9440F" strokeWidth="1" />
            </g>
          )}
        </g>
      )}
      {pose === 'sleep' && (
        <g>
          <path d="M14 42c-2-11 9-18 24-18s26 6 26 18z" fill={TORTIE.base} />
          <Patches d={['M22 34c4-5 10-5 12 0-2 4-8 6-12 4z', 'M36 28c4-2 9-1 10 2-3 2-7 2-10 0z']} />
          <path d="M16 42c8 2 22 2 30 0" stroke={TORTIE.base} strokeWidth="3.6" strokeLinecap="round" />
          <path d="M48 26l1-8 6 6zM59 24l5-6 1 9z" fill={TORTIE.base} />
          <circle cx="56" cy="32" r="9" fill={TORTIE.base} />
          <ellipse cx="61" cy="36.5" rx="3.6" ry="2.3" fill={TORTIE.peach} opacity=".9" />
          <path d="M55 30.5q2.5 2 5 0" fill="none" stroke={TORTIE.irisLo} strokeWidth="1.6" strokeLinecap="round" />
          <text x="66" y="14" className="rcat__z">z</text>
          <text x="71" y="7" className="rcat__z rcat__z--2">z</text>
        </g>
      )}
    </svg>
  )
}

/* ───────── Toys: soft 2.5D, the same light as the cat (from the top left) ───────── */

export type ToyKind = 'yarn' | 'feather' | 'box'
export type YarnColor = 'pink' | 'blue'

export const TOY_COLORS = {
  yarn: {
    pink: { base: '#F49CB6', deep: '#C95F80', lit: '#FFE5EE' },
    blue: { base: '#2463F6', deep: '#163A9E', lit: '#9BBBFF' },
  },
  feather: { base: '#FF7029', deep: '#C94E16', lit: '#FFC09C' },
  box: { front: '#D49A5E', side: '#B07738', inside: '#5E3D1E', flap: '#E8B77E', tape: '#F3D9AE', line: '#8A5A2B' },
}

function useToyId(prefix: string) {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
}

/** A wound ball of yarn with a loose end. Strands wrap the sphere at three angles, shaded like the cat. */
export function YarnBall({ color = 'pink', className = '' }: { color?: YarnColor; className?: string }) {
  const c = TOY_COLORS.yarn[color]
  const id = useToyId('yarn')
  const strands = [
    { r: -28, ry: 9 },
    { r: -28, ry: 21 },
    { r: 32, ry: 13 },
    { r: 32, ry: 26 },
    { r: 84, ry: 17 },
  ]
  return (
    <svg viewBox="0 0 100 100" className={`toy toy--yarn ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${id}-s`} cx="36%" cy="30%" r="74%">
          <stop offset="0" stopColor={c.lit} />
          <stop offset=".45" stopColor={c.base} />
          <stop offset="1" stopColor={c.deep} />
        </radialGradient>
        <clipPath id={`${id}-c`}>
          <circle cx="50" cy="52" r="33" />
        </clipPath>
      </defs>
      <ellipse cx="52" cy="89" rx="30" ry="6" fill="#22243A" opacity=".18" />
      <path d="M74 74c8 6 14 10 22 9" fill="none" stroke={c.deep} strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="52" r="33" fill={`url(#${id}-s)`} />
      <g clipPath={`url(#${id}-c)`} fill="none" strokeLinecap="round">
        {strands.map((s, i) => (
          <ellipse key={i} cx="50" cy="52" rx="35" ry={s.ry} transform={`rotate(${s.r} 50 52)`} stroke={c.deep} strokeWidth="2.6" opacity=".55" />
        ))}
        {strands.slice(0, 3).map((s, i) => (
          <ellipse key={`h${i}`} cx="50" cy="52" rx="35" ry={s.ry + 2} transform={`rotate(${s.r} 50 52)`} stroke={c.lit} strokeWidth="1.4" opacity=".55" strokeDasharray="18 70" />
        ))}
      </g>
      <path d="M30 34c5-6 12-9 20-9" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" opacity=".6" />
    </svg>
  )
}

/** A bright orange feather (two plumes on a short cord), as hung from a wand. */
export function Feather({ className = '' }: { className?: string }) {
  const c = TOY_COLORS.feather
  const id = useToyId('feather')
  return (
    <svg viewBox="0 0 100 100" className={`toy toy--feather ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.base} />
          <stop offset="1" stopColor={c.lit} />
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="93" rx="20" ry="4" fill="#22243A" opacity=".14" />
      <path d="M50 4v14" stroke="#22243A" strokeWidth="2" strokeLinecap="round" />
      <circle cx="50" cy="19" r="4" fill="#22243A" />
      <path d="M50 22c-14 8-24 30-20 52 2 8 6 12 10 14 2-22 6-44 10-66z" fill={c.deep} opacity=".55" transform="rotate(-14 50 22)" />
      <path d="M50 22c14 10 22 32 16 54-2 8-8 12-12 14-2-22-4-46-4-68z" fill={`url(#${id}-g)`} />
      <path d="M50 22c-12 10-18 32-14 54 2 8 8 12 14 14V22z" fill={`url(#${id}-g)`} />
      <path d="M50 24v66" stroke={c.deep} strokeWidth="1.8" strokeLinecap="round" />
      <g stroke={c.deep} strokeWidth="1.1" opacity=".55" strokeLinecap="round">
        <path d="M50 40l-9 6M50 52l-11 7M50 64l-10 7M50 76l-7 6M50 40l9 5M50 52l11 6M50 64l10 6M50 76l7 6" />
      </g>
      <path d="M44 30c-4 8-6 18-5 28" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".55" fill="none" />
    </svg>
  )
}

/**
 * A small open cardboard box. `part` splits it so the cat can sit inside: render 'back' behind the cat and 'front'
 * in front of it. 'whole' is both at once (toy cards, README).
 */
export function CardboardBox({ part = 'whole', className = '' }: { part?: 'whole' | 'back' | 'front'; className?: string }) {
  const c = TOY_COLORS.box
  const id = useToyId('box')
  const back = part !== 'front'
  const front = part !== 'back'
  return (
    <svg viewBox="0 0 120 100" className={`toy toy--box toy--box-${part} ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.flap} />
          <stop offset=".25" stopColor={c.front} />
          <stop offset="1" stopColor={c.side} />
        </linearGradient>
        <linearGradient id={`${id}-i`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.inside} />
          <stop offset="1" stopColor="#3A2512" />
        </linearGradient>
      </defs>
      {back && (
        <g>
          <ellipse cx="62" cy="94" rx="54" ry="6" fill="#22243A" opacity=".18" />
          {/* back flap, leaning away */}
          <path d="M18 40L30 20H96L104 40Z" fill={c.side} />
          <path d="M18 40H104L112 34V40Z" fill={c.side} opacity=".6" />
          {/* the dark inside */}
          <path d="M18 40H104L112 34H26Z" fill={`url(#${id}-i)`} />
        </g>
      )}
      {front && (
        <g>
          {/* side wall */}
          <path d="M104 40L112 34V82L104 90Z" fill={c.side} />
          {/* front wall */}
          <path d="M18 40H104V90H18Z" fill={`url(#${id}-f)`} />
          <path d="M54 40h14v50H54z" fill={c.tape} opacity=".75" />
          <path d="M18 40h86" stroke={c.line} strokeWidth="1.4" />
          {/* front flaps, folded open toward us */}
          <path d="M18 40L6 54L56 54L61 40Z" fill={c.flap} />
          <path d="M61 40L66 54L116 54L104 40Z" fill={c.flap} opacity=".92" />
          <path d="M6 54H56M66 54H116" stroke={c.line} strokeWidth="1.2" opacity=".5" />
          <path d="M26 70c8 3 18 3 26 0" fill="none" stroke={c.line} strokeWidth="1.6" strokeLinecap="round" opacity=".5" />
        </g>
      )}
    </svg>
  )
}

/** One entry point for lists of toys. */
export function Toy({ kind, color = 'pink', className = '' }: { kind: ToyKind; color?: YarnColor; className?: string }) {
  if (kind === 'yarn') return <YarnBall color={color} className={className} />
  if (kind === 'feather') return <Feather className={className} />
  return <CardboardBox className={className} />
}
