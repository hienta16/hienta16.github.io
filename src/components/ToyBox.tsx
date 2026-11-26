import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { copy } from '../content/site'
import { fill } from '../lib/format'
import { useGaze } from '../lib/gaze'
import { hub, issueUrl, lifetimeWords, toyRules, TOY_KEYS, useToyState, visibleToys, type Gift, type ToyKey } from '../lib/hub'
import { useMediaQuery, useOnScreen, useReducedMotion } from '../lib/stage'
import { CardboardBox, Feather, Toy, YarnBall, type YarnColor } from './Cat'
import { useTheme } from '../lib/theme'
import { TortieCat, type CatMood } from './TortieCat'
import './ToyBox.css'

/*
 * THE CAT'S TOY BOX
 * Persisted toys come only from the hub's data/toys.json (accepted by the Python workflow, never from an issue
 * directly). A toy given here while the hub is private is a local preview: drawn with a "Preview" tag, kept in this
 * browser tab only, never counted. Expired toys are hidden on the visitor's own clock.
 */

type Pos = { x: number; y: number } // fractions of the scene: x across, y = where the toy meets the floor

interface SceneToy {
  id: string
  toy: ToyKey
  variant: string
  pos: Pos
  gift?: Gift
  preview?: boolean
}

const SLOTS: Pos[] = [
  { x: 0.18, y: 0.84 },
  { x: 0.84, y: 0.86 },
  { x: 0.3, y: 0.95 },
  { x: 0.7, y: 0.96 },
  { x: 0.08, y: 0.92 },
  { x: 0.94, y: 0.95 },
  { x: 0.52, y: 0.98 },
  { x: 0.62, y: 0.8 },
  { x: 0.4, y: 0.78 },
]
const STAGE: Pos = { x: 0.7, y: 0.88 } // where a newly given toy lands
const HOME = 0.42
const WAND_X = 0.28 // the feather wand hangs from the left of the ceiling, clear of the shelf
const FLOOR = 0.9

const hoursLeft = (g: Gift, now: number) => Math.max(0, (Date.parse(g.expiresAt) - now) / 3_600_000)
const leftWords = (h: number) => (h >= 48 ? `${Math.round(h / 24)} days` : h >= 1 ? `${Math.round(h)} hours` : 'under an hour')

export function ToyBox() {
  const t = copy.toys
  const { coat } = useTheme()
  const reduced = useReducedMotion()
  const [polling, setPolling] = useState(false)
  const { toys: state, source } = useToyState(polling)
  const [now, setNow] = useState(() => Date.now())
  const [selected, setSelected] = useState<ToyKey>('yarn')
  const [preview, setPreview] = useState<SceneToy | null>(null)
  const [status, setStatus] = useState<'idle' | 'preview' | 'sent' | 'arrived'>('idle')
  const sentAt = useRef(0)
  const known = useRef<Set<string>>(new Set(state.active.map((g) => g.id)))

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 60_000)
    return () => window.clearInterval(id)
  }, [])

  // After a real gift, watch the hub for a toy that was not there before.
  useEffect(() => {
    if (status !== 'sent') return
    const fresh = state.active.find((g) => !known.current.has(g.id) && Date.parse(g.createdAt) >= sentAt.current - 120_000)
    if (fresh) {
      setStatus('arrived')
      setPreview(null)
      setPolling(false)
    }
  }, [state, status])
  useEffect(() => {
    if (!polling) return
    const stop = window.setTimeout(() => setPolling(false), 6 * 60_000)
    return () => window.clearTimeout(stop)
  }, [polling])

  const persisted = visibleToys(state, now)
  const sceneToys: SceneToy[] = useMemo(() => {
    const list = [...persisted].reverse().map((g, i) => ({ id: g.id, toy: g.toy, variant: g.variant, pos: SLOTS[i % SLOTS.length], gift: g }))
    return preview ? [...list, preview] : list
  }, [persisted, preview])

  const give = () => {
    const variant = selected === 'yarn' ? (Math.random() < 0.5 ? 'pink' : 'blue') : toyRules.toys[selected].variants[0]
    setPreview({ id: `preview-${Date.now()}`, toy: selected, variant, pos: STAGE, preview: true })
    if (hub.toys_live) {
      known.current = new Set(state.active.map((g) => g.id))
      sentAt.current = Date.now()
      window.open(issueUrl(selected), '_blank', 'noopener')
      setStatus('sent')
      setPolling(true)
    } else {
      setStatus('preview')
    }
  }

  const statusLine =
    status === 'preview' ? t.previewNote : status === 'sent' ? t.sentNote : status === 'arrived' ? t.arrived : ''
  const cooldown = lifetimeWords(toyRules.cooldown_hours)

  return (
    <section id="cat" className="toybox field field--pink" aria-labelledby="toybox-title">
      <div className="wrap section">
        <div className="toybox__head">
          <h2 id="toybox-title" className="title">
            {t.title}
          </h2>
          <p className="toybox__line">{coat === 'tuxie' ? t.lineNight : t.line}</p>
        </div>
        {source === 'demo' && <p className="toybox__demo">{t.demo}</p>}

        <div className="toybox__grid">
          <Scene toys={sceneToys} totals={state.totals} reduced={reduced} now={now} newest={preview?.id ?? sceneToys.at(-1)?.id ?? null} />

          <div className="toybox__panel">
            <fieldset className="gifts">
              <legend className="gifts__legend">{t.pick}</legend>
              {TOY_KEYS.map((key) => {
                const rule = toyRules.toys[key]
                return (
                  <label key={key} className={`gift ${selected === key ? 'is-on' : ''}`}>
                    <input type="radio" name="toy" value={key} checked={selected === key} onChange={() => setSelected(key)} />
                    <span className="gift__art" aria-hidden="true">
                      <Toy kind={key} color="pink" />
                    </span>
                    <span className="gift__text">
                      <span className="gift__name">{rule.label}</span>
                      <span className="gift__meta">
                        {fill(t.stays, { time: lifetimeWords(rule.lifetime_hours) })} · {rule.behavior}
                      </span>
                    </span>
                  </label>
                )
              })}
            </fieldset>

            <button type="button" className="btn btn--ink toybox__give" onClick={give}>
              {hub.toys_live ? t.giveLive : t.give}
            </button>
            <p className="toybox__status" aria-live="polite">
              {statusLine}
            </p>

            <dl className="toybox__counts">
              <div>
                <dt>{t.inBox}</dt>
                <dd>{persisted.length}</dd>
              </div>
              <div>
                <dt>{t.given}</dt>
                <dd>{state.giftsTotal}</dd>
              </div>
            </dl>
            {persisted.length === 0 && <p className="toybox__empty">{hub.toys_live ? t.empty : t.emptyNotLive}</p>}

            <details className="toybox__how">
              <summary>{t.how}</summary>
              <ol>
                {t.steps.map((s) => (
                  <li key={s}>{fill(s, { example: `${toyRules.title_prefix} yarn` })}</li>
                ))}
              </ol>
              <p>{fill(t.rules, { cooldown, max: toyRules.max_visible })}</p>
            </details>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────── The scene and its director ───────── */

interface CatState {
  x: number
  mood: CatMood
  act: '' | 'trot' | 'jump'
  inBox: '' | 'hide' | 'peek' | 'up'
  look: Pos | null
  curious: number
  zz: boolean
}

function Scene({ toys, totals, reduced, now, newest }: { toys: SceneToy[]; totals: Record<string, number>; reduced: boolean; now: number; newest: string | null }) {
  const { coat } = useTheme()
  const t = copy.toys
  const ref = useRef<HTMLDivElement>(null)
  const catRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const wandRef = useRef<HTMLDivElement>(null)
  const onScreen = useOnScreen(ref)
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)')
  const narrow = useMediaQuery('(max-width: 759px)')
  const [size, setSize] = useState({ w: 800, h: 500 })
  const [focusId, setFocusId] = useState<string | null>(null)
  const [cat, setCat] = useState<CatState>({ x: HOME, mood: 'idle', act: '', inBox: '', look: null, curious: 0.4, zz: false })
  const [roll, setRoll] = useState<Record<string, { dx: number; spin: number }>>({})
  const [pounce, setPounce] = useState<Pos | null>(null)
  const pointerGaze = useGaze(catRef, { active: onScreen && !cat.look, reduced })

  // a new toy takes the cat's attention; a toy that disappears releases it
  useEffect(() => setFocusId(newest), [newest])
  const focus = toys.find((x) => x.id === focusId) ?? null

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const catW = size.w * (narrow ? 0.34 : 0.25)
  const catH = catW * (380 / 320)
  const boxW = size.w * (narrow ? 0.34 : 0.26)

  /* The director: one little script per toy. Each await is a beat; changing focus stops the script. */
  useEffect(() => {
    let alive = true
    const beat = (ms: number) =>
      new Promise<void>((ok, stop) => window.setTimeout(() => (alive ? ok() : stop(new Error('cut'))), reduced ? 0 : ms))
    const set = (p: Partial<CatState>) => alive && setCat((c) => ({ ...c, ...p }))
    const clampX = (x: number) => Math.max(0.14, Math.min(0.86, x))

    async function yarn(toy: SceneToy) {
      let pos = toy.pos.x
      let dir = pos > 0.5 ? -1 : 1
      set({ look: toy.pos, curious: 1, inBox: '', zz: false, mood: 'idle' })
      if (reduced) return set({ x: clampX(pos - 0.14), mood: 'happy' })
      for (let round = 0; alive; round++) {
        await beat(520)
        const side = pos > 0.5 ? -1 : 1
        set({ x: clampX(pos + side * 0.13), act: 'trot' })
        await beat(720)
        set({ act: '', mood: 'crouch' })
        await beat(260)
        set({ mood: 'swat' })
        await beat(160)
        // the yarn rolls away from the paw
        if (pos + dir * 0.16 > 0.9 || pos + dir * 0.16 < 0.1) dir = -dir
        pos += dir * 0.16
        setRoll((r) => ({ ...r, [toy.id]: { dx: pos - toy.pos.x, spin: (r[toy.id]?.spin ?? 0) + dir * 320 } }))
        set({ mood: 'idle', look: { x: pos, y: toy.pos.y } })
        await beat(700)
        if (round % 3 === 2) {
          set({ mood: 'happy', curious: 0.5 })
          await beat(2600)
          set({ mood: 'idle', curious: 1 })
        }
      }
    }

    async function feather(_toy: SceneToy) {
      set({ x: clampX(WAND_X + 0.15), inBox: '', zz: false, curious: 1, mood: 'idle' })
      if (reduced) return set({ look: { x: WAND_X, y: 0.42 } })
      for (let n = 0; alive; n++) {
        await beat(1800)
        set({ mood: 'crouch' })
        await beat(520)
        set({ mood: 'swat', act: 'jump' })
        await beat(420)
        set({ act: '', mood: 'idle' })
        if (n % 3 === 2) {
          set({ mood: 'happy', curious: 0.5 })
          await beat(1400)
          set({ mood: 'idle', curious: 1 })
        }
      }
    }

    async function box(toy: SceneToy) {
      set({ look: toy.pos, curious: 0.9, zz: false, mood: 'idle', inBox: '' })
      if (reduced) return set({ x: toy.pos.x, inBox: 'peek', look: null })
      await beat(500)
      set({ x: toy.pos.x, act: 'trot' })
      await beat(760)
      set({ act: '', inBox: 'up', look: null })
      for (let n = 0; alive; n++) {
        await beat(900)
        set({ inBox: 'hide' })
        await beat(900)
        set({ inBox: 'peek', look: { x: toy.pos.x - 0.4, y: 0.6 } })
        await beat(1100)
        set({ look: { x: toy.pos.x + 0.4, y: 0.6 } })
        await beat(1100)
        set({ look: null, inBox: 'up' })
        if (n % 2 === 0) {
          set({ mood: 'sleep', zz: true, inBox: 'up' })
          await beat(4200)
          set({ mood: 'blink', zz: false })
          await beat(300)
          set({ mood: 'idle', inBox: 'up' })
        }
      }
    }

    const run = !focus ? null : focus.toy === 'yarn' ? yarn : focus.toy === 'feather' ? feather : box
    if (!focus) set({ look: null, inBox: '', mood: 'idle', zz: false, curious: 0.4, x: HOME })
    run?.(focus!).catch(() => {})
    return () => {
      alive = false
    }
  }, [focus?.id, focus?.toy, reduced]) // eslint-disable-line react-hooks/exhaustive-deps

  /* The feather wand swings on its own clock; the cat's eyes follow its tip. */
  useEffect(() => {
    if (!focus || focus.toy !== 'feather' || !onScreen) return
    let raf = 0
    let lastLook = 0
    const start = performance.now()
    const len = size.h * 0.5
    const tick = (time: number) => {
      const s = (time - start) / 1000
      const angle = reduced ? 14 : Math.sin(s * 2.3) * 24 + Math.sin(s * 5.1) * 5
      if (wandRef.current) wandRef.current.style.transform = `rotate(${angle}deg)`
      if (time - lastLook > 110) {
        lastLook = time
        const rad = (angle * Math.PI) / 180
        setCat((c) => ({ ...c, look: { x: WAND_X - (Math.sin(rad) * len) / size.w, y: (Math.cos(rad) * len) / size.h + 0.02 } }))
      }
      if (!reduced) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [focus, onScreen, reduced, size])

  /* The yarn cursor: a ball that trails your pointer on the rug (fine pointers only). */
  useEffect(() => {
    const el = ref.current
    const ball = cursorRef.current
    if (!el || !ball || !fine) return
    let raf = 0
    const target = { x: 0, y: 0 }
    const cur = { x: 0, y: 0 }
    let spin = 0
    const step = () => {
      raf = 0
      const k = reduced ? 1 : 0.22
      const dx = (target.x - cur.x) * k
      cur.x += dx
      cur.y += (target.y - cur.y) * k
      spin += dx * 4
      ball.style.transform = `translate(${cur.x}px, ${cur.y}px) rotate(${spin}deg)`
      if (Math.abs(target.x - cur.x) + Math.abs(target.y - cur.y) > 0.5) raf = requestAnimationFrame(step)
    }
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      target.x = e.clientX - r.left
      target.y = e.clientY - r.top
      el.classList.add('has-yarn')
      if (!raf) raf = requestAnimationFrame(step)
    }
    const leave = () => el.classList.remove('has-yarn')
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      cancelAnimationFrame(raf)
    }
  }, [fine, reduced])

  /* A click or tap on the rug: the cat pounces toward it (play only; nothing is given or saved). */
  const playAt = useCallback(
    (e: React.PointerEvent) => {
      if ((e.target as Element).closest('button')) return
      const r = ref.current!.getBoundingClientRect()
      const p = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }
      setFocusId(null)
      setPounce(p)
      setCat((c) => ({ ...c, look: p, curious: 1, inBox: '', zz: false, mood: 'crouch' }))
      window.setTimeout(() => setCat((c) => ({ ...c, x: Math.max(0.14, Math.min(0.86, p.x - 0.1)), act: reduced ? '' : 'trot', mood: 'idle' })), reduced ? 0 : 240)
      window.setTimeout(() => setCat((c) => ({ ...c, act: '', mood: 'swat' })), reduced ? 0 : 900)
      window.setTimeout(() => {
        setCat((c) => ({ ...c, mood: 'happy', look: null }))
        setPounce(null)
      }, reduced ? 0 : 1300)
    },
    [reduced],
  )

  // where the cat looks: at the toy it plays with, else at your pointer
  const headX = cat.x * size.w
  const headY = FLOOR * size.h - catH * 0.7
  const gaze = cat.look
    ? {
        x: Math.max(-1, Math.min(1, (cat.look.x * size.w - headX) / (size.w * 0.3))),
        y: Math.max(-1, Math.min(1, (cat.look.y * size.h - headY) / (size.h * 0.45))),
      }
    : pointerGaze

  // the cat's place: on the rug, or inside the focused box
  const inBoxToy = cat.inBox && focus?.toy === 'box' ? focus : null
  let catTop = FLOOR * size.h - catH * 0.95
  let catScale = 1
  // inside a box: how far below the cat's top edge the box floor is; nothing of the cat shows beneath it
  let floorFromTop: number | null = null
  if (inBoxToy) {
    const bh = boxW * (100 / 120)
    const rim = inBoxToy.pos.y * size.h - bh * 0.94 + bh * 0.4
    catScale = 0.8
    const h = catH * catScale
    catTop = rim - h * (cat.inBox === 'hide' ? 0.22 : cat.inBox === 'peek' ? 0.4 : 0.52)
    // Cut the cat at the box floor, measured from the cat's own top edge, so the cut is right whatever height the
    // cat is drawn at (her paws, body and shadow never poke out under the box)
    floorFromTop = Math.max(0, inBoxToy.pos.y * size.h - bh * 0.06 - catTop)
  }

  const label = fill(coat === 'tuxie' ? t.sceneLabelNight : t.sceneLabel, { n: toys.filter((x) => !x.preview).length })

  return (
    <div
      ref={ref}
      className={`scene ${fine ? 'is-fine' : ''}`}
      role="group"
      aria-label={label}
      onPointerDown={playAt}
    >
      <div className="scene__rug" aria-hidden="true" />
      {/* The shelf on the wall: where toys go when their time is up. It counts every gift ever given. */}
      <div className="shelf" role="img" aria-label={fill(t.shelf, { n: Object.values(totals).reduce((a, b) => a + b, 0) })}>
        <div className="shelf__items">
          {TOY_KEYS.map((k) => (
            <span key={k} className={`shelf__item shelf__item--${k}`}>
              <Toy kind={k} color="blue" />
              <b>×{totals[k] ?? 0}</b>
            </span>
          ))}
        </div>
        <span className="shelf__plank" aria-hidden="true" />
        <span className="shelf__label" aria-hidden="true">
          {t.shelfLabel}
        </span>
      </div>
      <p className="scene__hint" aria-hidden="true">
        {fine ? t.cursorHint : t.tapHint}
      </p>

      {toys.map((toy) => (
        <SceneItem
          key={toy.id}
          toy={toy}
          size={size}
          boxW={boxW}
          now={now}
          focused={toy.id === focus?.id}
          catInside={!!inBoxToy && inBoxToy.id === toy.id}
          roll={roll[toy.id]}
          wandRef={toy.id === focus?.id && toy.toy === 'feather' ? wandRef : undefined}
          onPick={() => setFocusId(toy.id)}
        />
      ))}

      <div
        className={`scene__cat ${cat.act ? `is-${cat.act}` : ''} ${inBoxToy ? 'is-boxed' : ''}`}
        style={{
          width: catW * catScale,
          left: cat.x * size.w - (catW * catScale) / 2,
          top: catTop,
          zIndex: inBoxToy ? 4 : 6,
          clipPath: floorFromTop !== null ? `inset(-50% -50% calc(100% - ${floorFromTop.toFixed(1)}px) -50%)` : undefined,
        }}
      >
        <div className="scene__cat-body">
          <TortieCat ref={catRef} gaze={gaze} curious={cat.curious} mood={cat.mood} coat={coat} alive={!reduced} label={undefined} />
        </div>
        {cat.zz && (
          <span className="scene__zz" aria-hidden="true">
            z<span>z</span>
          </span>
        )}
      </div>

      {pounce && <span className="scene__ping" style={{ left: pounce.x * size.w, top: pounce.y * size.h }} aria-hidden="true" />}
      {fine && (
        <div ref={cursorRef} className="scene__cursor" aria-hidden="true">
          <YarnBall color="blue" />
        </div>
      )}
    </div>
  )
}

function SceneItem({
  toy,
  size,
  boxW,
  now,
  focused,
  catInside,
  roll,
  wandRef,
  onPick,
}: {
  toy: SceneToy
  size: { w: number; h: number }
  boxW: number
  now: number
  focused: boolean
  catInside: boolean
  roll?: { dx: number; spin: number }
  wandRef?: React.Ref<HTMLDivElement>
  onPick: () => void
}) {
  const t = copy.toys
  const rule = toyRules.toys[toy.toy]
  const x = (toy.pos.x + (roll?.dx ?? 0)) * size.w
  const floor = toy.pos.y * size.h
  const tag = toy.preview ? t.previewTag : toy.gift ? `@${toy.gift.giver.login} · ${fill(t.left, { time: leftWords(hoursLeft(toy.gift, now)) })}` : ''
  const name = toy.gift ? `${rule.label}, ${fill(t.from, { login: toy.gift.giver.login })}, ${fill(t.left, { time: leftWords(hoursLeft(toy.gift, now)) })}` : `${rule.label} (${t.previewTag})`
  const z = Math.round(toy.pos.y * 10)

  if (toy.toy === 'feather' && focused) {
    const wx = WAND_X * size.w
    return (
      <>
        <div className="wand" style={{ left: wx }} aria-hidden="true">
          <div className="wand__swing" ref={wandRef} style={{ height: size.h * 0.5 }}>
            <span className="wand__string" />
            <span className="wand__feather">
              <Feather />
            </span>
          </div>
        </div>
        <button type="button" className={`scene__toy scene__toy--ghost ${toy.preview ? 'is-preview' : ''}`} style={{ left: wx, top: size.h * 0.08 }} onClick={onPick} aria-label={name}>
          {tag && <span className="scene__tag">{tag}</span>}
        </button>
      </>
    )
  }

  if (toy.toy === 'box') {
    const w = focused ? boxW : boxW * 0.78
    const h = w * (100 / 120)
    const style = { left: x - w / 2, top: floor - h * 0.94, width: w }
    return (
      <>
        {catInside && (
          <div className="scene__boxback" style={{ ...style, zIndex: 3 }} aria-hidden="true">
            <CardboardBox part="back" />
          </div>
        )}
        <button
          type="button"
          className={`scene__toy scene__toy--box ${toy.preview ? 'is-preview' : ''} ${focused ? 'is-focus' : ''}`}
          style={{ ...style, zIndex: catInside ? 5 : z }}
          onClick={onPick}
          aria-label={name}
        >
          <CardboardBox part={catInside ? 'front' : 'whole'} />
          {tag && <span className="scene__tag">{tag}</span>}
        </button>
      </>
    )
  }

  const w = size.w * (toy.toy === 'yarn' ? 0.085 : 0.075)
  return (
    <button
      type="button"
      className={`scene__toy scene__toy--${toy.toy} ${toy.preview ? 'is-preview' : ''} ${focused ? 'is-focus' : ''}`}
      style={{ left: x - w / 2, top: floor - w * 0.92, width: w, zIndex: focused ? 7 : z }}
      onClick={onPick}
      aria-label={name}
    >
      <span className="scene__spin" style={{ transform: `rotate(${roll?.spin ?? 0}deg)` }}>
        {toy.toy === 'yarn' ? <YarnBall color={(toy.variant as YarnColor) ?? 'pink'} /> : <Feather />}
      </span>
      {tag && <span className="scene__tag">{tag}</span>}
    </button>
  )
}
