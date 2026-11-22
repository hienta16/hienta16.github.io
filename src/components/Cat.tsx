import { forwardRef, useEffect, useState, type CSSProperties } from 'react'
import './Cat.css'

/**
 * The tuxedo cat, drawn for this site as flat paper-cut layers. Each layer is its own SVG at its own depth inside a
 * CSS 3D rig, so the cat turns toward what it is watching (the pointer, the yarn) and reads as a pop-up papercraft.
 * One viewBox (300 × 360) for every layer; the hero shows the same cat cropped to a bust.
 */

export type CatMood = 'idle' | 'swat' | 'bob' | 'sway' | 'blink' | 'shades' | 'bow'

interface Props {
  /** Where the cat is looking, each axis -1 … 1 */
  gaze?: { x: number; y: number }
  mood?: CatMood
  /** 0 … 1: how much the whole rig turns toward the gaze */
  turn?: number
  className?: string
  style?: CSSProperties
  label?: string
}

const VB = '0 0 300 360'
const Layer = ({ z, className = '', children }: { z: number; className?: string; children: React.ReactNode }) => (
  <div className={`cat__layer ${className}`} style={{ transform: `translateZ(${z}px)` }}>
    <svg viewBox={VB} aria-hidden="true" focusable="false">
      {children}
    </svg>
  </div>
)

export const Cat = forwardRef<HTMLDivElement, Props>(function Cat({ gaze = { x: 0, y: 0 }, mood = 'idle', turn = 1, className = '', style, label }, ref) {
  const [blink, setBlink] = useState(false)

  // A natural blink every few seconds.
  useEffect(() => {
    let t: number
    const loop = () => {
      t = window.setTimeout(() => {
        setBlink(true)
        window.setTimeout(() => setBlink(false), 140)
        loop()
      }, 2600 + Math.random() * 3600)
    }
    loop()
    return () => window.clearTimeout(t)
  }, [])

  const gx = Math.max(-1, Math.min(1, gaze.x))
  const gy = Math.max(-1, Math.min(1, gaze.y))
  const rig = { transform: `rotateY(${gx * 18 * turn}deg) rotateX(${-gy * 9 * turn}deg)` }
  const head = { transform: `translate(${gx * 7}px, ${gy * 5}px) rotate(${gx * 5}deg)` }
  const pupils = { transform: `translate(${gx * 6}px, ${gy * 4}px)` }
  const closed = blink || mood === 'blink'

  return (
    <div ref={ref} className={`cat cat--${mood} ${className}`} style={style} role={label ? 'img' : undefined} aria-label={label}>
      <div className="cat__rig" style={rig}>
        <Layer z={-34} className="cat__tail">
          <path d="M218 338c52 2 72-40 60-80-7-22-25-27-30-12" fill="none" stroke="var(--ink)" strokeWidth="21" strokeLinecap="round" strokeLinejoin="round" />
        </Layer>

        <Layer z={0}>
          <ellipse cx="88" cy="318" rx="32" ry="34" fill="var(--ink)" />
          <ellipse cx="212" cy="318" rx="32" ry="34" fill="var(--ink)" />
          <path d="M98 186c-28 36-40 90-36 136 2 22 24 30 88 30s86-8 88-30c4-46-8-100-36-136z" fill="var(--ink)" />
        </Layer>

        <Layer z={12}>
          <path d="M150 200c-24 14-34 52-30 96 2 26 12 44 30 48 18-4 28-22 30-48 4-44-6-82-30-96z" fill="var(--cream)" />
          <path d="M108 262c-4 30-2 60 2 80h30c3-22 2-52-2-76z" fill="var(--ink)" />
          <rect x="105" y="328" width="37" height="20" rx="10" fill="var(--cream)" />
          <path d="M118 338v8M129 338v8" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
        </Layer>

        <Layer z={16} className="cat__paw">
          <path d="M192 262c4 30 2 60-2 80h-30c-3-22-2-52 2-76z" fill="var(--ink)" />
          <rect x="158" y="328" width="37" height="20" rx="10" fill="var(--cream)" />
          <path d="M171 338v8M182 338v8" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
        </Layer>

        <Layer z={22} className="cat__collar">
          <path d="M103 186c28 15 66 15 94 0l3 13c-30 17-70 17-100 0z" fill="var(--orange)" />
          <circle cx="150" cy="217" r="11" fill="var(--cream)" />
          <path d="M150 223l-5.5-5.5a3.2 3.2 0 1 1 5.5-3.6 3.2 3.2 0 1 1 5.5 3.6z" fill="var(--pink)" />
        </Layer>

        <div className="cat__head" style={head}>
          <Layer z={30}>
            <path d="M84 104L76 22l58 44z" fill="var(--ink)" stroke="var(--ink)" strokeWidth="8" strokeLinejoin="round" />
            <path d="M216 104l8-82-58 44z" fill="var(--ink)" stroke="var(--ink)" strokeWidth="8" strokeLinejoin="round" />
            <path d="M93 92l-4-46 33 24z" fill="var(--pink)" />
            <path d="M207 92l4-46-33 24z" fill="var(--pink)" />
            <path d="M78 128c0-44 32-68 72-68s72 24 72 68c0 40-30 66-72 66s-72-26-72-66z" fill="var(--ink)" />
            <path d="M82 138l-16 12 20 6zM218 138l16 12-20 6z" fill="var(--ink)" />
          </Layer>
          <Layer z={46} className="cat__face">
            <path d="M150 96c-7 16-19 34-25 52-6 20 7 44 25 44s31-24 25-44c-6-18-18-36-25-52z" fill="var(--cream)" />
            <path d="M141 150q9-4 18 0-4 8-9 10-5-2-9-10z" fill="var(--pink)" />
            <path d="M150 160v7m0 0c-4 6-11 6-14 1m14-1c4 6 11 6 14 1" fill="none" stroke="var(--ink)" strokeWidth="2.6" strokeLinecap="round" />
            <path d="M131 160L52 148M131 167l-76 8M169 160l79-12M169 167l76 8" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" />
          </Layer>
          <Layer z={40} className="cat__eyes">
            {[116, 184].map((cx) => (
              <g key={cx}>
                <ellipse cx={cx} cy="124" rx="16.5" ry="17.5" fill="var(--orange)" />
                <g style={pupils} className="cat__pupil">
                  <ellipse cx={cx} cy="124" rx="5" ry="12.5" fill="var(--ink)" />
                </g>
                <circle cx={cx - 5} cy="117" r="3.4" fill="var(--cream)" />
                <rect x={cx - 19} y="105" width="38" height="38" fill="var(--ink)" className={`cat__lid ${closed ? 'is-closed' : ''}`} />
                {mood === 'blink' && <path d={`M${cx - 15} 124q15 9 30 0`} fill="none" stroke="var(--orange)" strokeWidth="3" strokeLinecap="round" />}
              </g>
            ))}
          </Layer>
          {mood === 'shades' && (
            <Layer z={54} className="cat__shades">
              <path d="M132 120h36" stroke="var(--blue)" strokeWidth="5" />
              <path d="M116 142l-19-19a12 12 0 1 1 19-14 12 12 0 1 1 19 14z" fill="var(--pink)" stroke="var(--blue)" strokeWidth="4" strokeLinejoin="round" />
              <path d="M184 142l-19-19a12 12 0 1 1 19-14 12 12 0 1 1 19 14z" fill="var(--pink)" stroke="var(--blue)" strokeWidth="4" strokeLinejoin="round" />
              <path d="M97 114l-20-6M203 114l20-6" stroke="var(--blue)" strokeWidth="4" strokeLinecap="round" />
            </Layer>
          )}
        </div>
      </div>
    </div>
  )
})

/* ───────── The ruler cat: side view, four poses ───────── */

export type RulerPose = 'walk' | 'run' | 'sit' | 'sleep' | 'play'

export function RulerCat({ pose }: { pose: RulerPose }) {
  const moving = pose === 'walk' || pose === 'run'
  return (
    <svg viewBox="0 0 76 46" className={`rcat rcat--${pose}`} aria-hidden="true" focusable="false">
      {moving && (
        <g>
          <path className="rcat__tail" d="M16 24C8 22 4 15 8 6" fill="none" stroke="var(--ink)" strokeWidth="3.6" strokeLinecap="round" />
          <g strokeWidth="3.8" strokeLinecap="round">
            <path className="rcat__leg rcat__leg--a" d="M21 30v11" stroke="var(--ink)" />
            <path className="rcat__leg rcat__leg--b" d="M27 30v11" stroke="var(--ink)" />
            <path className="rcat__leg rcat__leg--b" d="M47 30v11" stroke="var(--ink)" />
            <path className="rcat__leg rcat__leg--a" d="M53 30v11" stroke="var(--ink)" />
          </g>
          <path d="M14 25c0-8 10-10 20-10h14c8 0 12 4 12 10s-4 8-10 8H23c-6 0-9-3-9-8z" fill="var(--ink)" />
          <path d="M51 21c6 2 8 8 4 11h-5z" fill="var(--cream)" />
          <g className="rcat__head">
            <path d="M54 9l1-8 6 6zM65 7l5-6 1 9z" fill="var(--ink)" />
            <circle cx="62" cy="14" r="9" fill="var(--ink)" />
            <ellipse cx="67.5" cy="18.5" rx="4.5" ry="3.2" fill="var(--cream)" />
            <circle cx="65" cy="12" r="1.9" fill="var(--orange)" />
            <path d="M55 21l-2 7" stroke="var(--orange)" strokeWidth="3" strokeLinecap="round" />
          </g>
        </g>
      )}
      {(pose === 'sit' || pose === 'play') && (
        <g>
          <path className="rcat__tail" d="M24 42c-10 0-14-6-9-11" fill="none" stroke="var(--ink)" strokeWidth="3.6" strokeLinecap="round" />
          <path d="M24 42c-4-12 2-24 12-26s16 6 16 16v10z" fill="var(--ink)" />
          <path d="M44 22c5 4 6 12 3 19h-5z" fill="var(--cream)" />
          <rect x="40" y="38" width="10" height="5" rx="2.5" fill="var(--cream)" />
          <g className="rcat__head">
            <path d="M40 9l1-8 6 6zM51 7l5-6 1 9z" fill="var(--ink)" />
            <circle cx="48" cy="14" r="9" fill="var(--ink)" />
            <ellipse cx="53" cy="18.5" rx="4.5" ry="3.2" fill="var(--cream)" />
            <circle cx="51" cy="12" r="1.9" fill="var(--orange)" />
            <path d="M42 22l-1 6" stroke="var(--orange)" strokeWidth="3" strokeLinecap="round" />
          </g>
          {pose === 'play' && (
            <g className="rcat__yarn">
              <circle cx="66" cy="38" r="6" fill="var(--pink)" />
              <path d="M61 36c3 2 7 2 10-1M62 41c3-2 6-2 9 0" fill="none" stroke="var(--ink)" strokeWidth="1" />
            </g>
          )}
        </g>
      )}
      {pose === 'sleep' && (
        <g>
          <path d="M14 42c-2-11 9-18 24-18s26 6 26 18z" fill="var(--ink)" />
          <path d="M16 42c8 2 22 2 30 0" stroke="var(--ink)" strokeWidth="3.6" strokeLinecap="round" />
          <path d="M48 26l1-8 6 6zM59 24l5-6 1 9z" fill="var(--ink)" />
          <circle cx="56" cy="32" r="9" fill="var(--ink)" />
          <ellipse cx="61" cy="36" rx="4.5" ry="3" fill="var(--cream)" />
          <path d="M55 30.5q2.5 2 5 0" fill="none" stroke="var(--orange)" strokeWidth="1.6" strokeLinecap="round" />
          <text x="66" y="14" className="rcat__z">z</text>
          <text x="71" y="7" className="rcat__z rcat__z--2">z</text>
        </g>
      )}
    </svg>
  )
}

/* ───────── Toys ───────── */

export function Toy({ kind, className = '' }: { kind: 'yarn' | 'feather' | 'mouse' | 'box'; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={`toy toy--${kind} ${className}`} aria-hidden="true" focusable="false">
      {kind === 'yarn' && (
        <g>
          <circle cx="24" cy="26" r="16" fill="var(--pink)" />
          <path d="M11 20c8 4 18 4 26-2M9 28c10 6 22 6 30-2M15 37c6-6 16-14 20-24M22 41c2-8 8-18 16-22" fill="none" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M38 34c4 4 6 8 4 11" fill="none" stroke="var(--pink)" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      )}
      {kind === 'feather' && (
        <g>
          <path d="M10 42L36 8" stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M36 6c6 8 2 20-10 26l-6 2c-2-12 4-24 16-28z" fill="var(--blue)" />
          <path d="M33 12l-8 18" stroke="var(--cream)" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      )}
      {kind === 'mouse' && (
        <g>
          <path d="M6 34c6 4 10 2 12-2" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
          <path d="M16 34c0-10 8-16 18-16s10 8 10 12-4 6-10 6H18c-2 0-2-1-2-2z" fill="var(--orange)" />
          <circle cx="30" cy="18" r="5" fill="var(--orange)" />
          <circle cx="38" cy="28" r="1.8" fill="var(--ink)" />
        </g>
      )}
      {kind === 'box' && (
        <g>
          <path d="M8 18l16-6 16 6v20l-16 6-16-6z" fill="var(--cream)" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
          <path d="M8 18l16 6 16-6M24 24v20" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
          <path d="M8 18l-4 7 16 6 4-7" fill="var(--pale)" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
        </g>
      )}
    </svg>
  )
}
