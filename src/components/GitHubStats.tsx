import { useId, useMemo, useRef, useState } from 'react'
import isoCompactRaw from '../data/hub/iso-compact.svg?raw'
import isoFullRaw from '../data/hub/iso.svg?raw'
import { copy, profile } from '../content/site'
import { ago, dayMonth, fill, monthYear, num, pct, weekdayDate } from '../lib/format'
import { useLiveSnapshot, useLiveSvg, type LanguageShare, type Snapshot } from '../lib/hub'
import { useGitHub, useMediaQuery, useReducedMotion, useSeen } from '../lib/stage'
import { LEVEL_COLORS, LEVELS } from '../lib/stats'
import { GitHubMark, IconArrow, IconCommit, IconIssue, IconPR, IconRepo, IconStar } from './icons'
import './GitHubStats.css'

/**
 * GitHub activity as one compact dashboard: the 3D year with its streaks on the left (about 58%), the stats and the
 * languages on the right. Every number was computed by the hub's Python (catwalk/stats); this only lays them out.
 */
export function GitHubStats() {
  const gh = useGitHub()
  const t = copy.github
  if (!gh.ok)
    return (
      <section id="github" className="gh field field--ink" aria-labelledby="gh-title">
        <div className="wrap gh__wrap">
          <h2 id="gh-title" className="gh__title">
            {t.title}
          </h2>
          <p className="gh__note">{t.unavailable}</p>
        </div>
      </section>
    )
  return <Stats initial={gh.data} />
}

function Stats({ initial }: { initial: Snapshot }) {
  const t = copy.github
  const snap = useLiveSnapshot(initial)
  const { calendar: cal, counts, repositories: repos } = snap
  const ref = useRef<HTMLElement>(null)
  const seen = useSeen(ref)
  const staleDays = Math.floor((Date.now() - Date.parse(cal.asOf)) / 86_400_000)

  return (
    <section id="github" ref={ref} className="gh field field--ink" aria-labelledby="gh-title">
      <div className="wrap gh__wrap">
        <header className="gh__head">
          <h2 id="gh-title" className="gh__title">
            {t.title}
          </h2>
          <p className="gh__meta">
            <span>{fill(t.updated, { when: ago(cal.asOf) })}</span>
            <a href={profile.githubUrl} rel="noopener" className="gh__profile">
              <GitHubMark />
              {t.viewProfile}
              <IconArrow />
            </a>
          </p>
        </header>

        <div className="gh__dash">
          <Year snap={snap} seen={seen} />

          <div className="gh__side">
            <article className="gh-card" aria-labelledby="gh-stats-title">
              <h3 id="gh-stats-title" className="gh-card__title">
                {t.statsTitle}
                <Tip label={t.contribTipLabel} text={t.contribNote} />
              </h3>
              <dl className="gh-rows">
                <Row icon={<span className="gh-rows__dot" />} label={t.rows.contributions} value={cal.total} strong />
                <Row icon={<IconCommit />} label={t.rows.commits} value={counts?.commitsLastYear} />
                <Row icon={<IconPR />} label={t.rows.prs} value={counts?.pullRequestsLastYear} />
                <Row icon={<IconIssue />} label={t.rows.issues} value={counts?.issuesLastYear} />
                <Row icon={<IconRepo />} label={t.rows.contributed} value={counts?.contributedToLastYear} />
                <Row icon={<IconStar />} label={t.rows.stars} value={repos?.stars} />
              </dl>
            </article>
            <Languages snap={snap} />
          </div>
        </div>

        <p className="gh__note">
          {t.note}
          {staleDays >= 3 && ` ${fill(t.stale, { n: staleDays })}`}
        </p>
      </div>
    </section>
  )
}

function Row({ icon, label, value, strong }: { icon: React.ReactNode; label: string; value: number | undefined | null; strong?: boolean }) {
  return (
    <div className={`gh-rows__row ${strong ? 'is-strong' : ''}`}>
      <dt>
        {icon}
        {label}
      </dt>
      <dd>{typeof value === 'number' ? num(value) : copy.github.notAvailable}</dd>
    </div>
  )
}

/** A small "i" that explains a term on hover, focus or tap, instead of a paragraph in the layout. */
function Tip({ label, text }: { label: string; text: string }) {
  const id = useId()
  return (
    <span className="tip">
      <button type="button" className="tip__btn" aria-label={label} aria-describedby={id}>
        i
      </button>
      <span role="tooltip" id={id} className="tip__text">
        {text}
      </span>
    </span>
  )
}

/** The 3D year: drawn by the hub's Python; here it gets its streaks, a legend, hover details and a rise-in. */
function Year({ snap, seen }: { snap: Snapshot; seen: boolean }) {
  const t = copy.github
  const m = snap.metrics
  const reduced = useReducedMotion()
  const narrow = useMediaQuery('(max-width: 759px)')
  const full = useLiveSvg('assets/generated/iso-site.svg', isoFullRaw)
  const compact = useLiveSvg('assets/generated/iso-site-compact.svg', isoCompactRaw)
  const wrap = useRef<HTMLDivElement>(null)
  const [tip, setTip] = useState<{ x: number; y: number; date: string; n: number } | null>(null)
  const markup = useMemo(() => ({ __html: narrow ? compact : full }), [narrow, compact, full])
  const year = (d: string) => `${dayMonth(d)}, ${d.slice(0, 4)}`
  const cur = m.currentStreak

  const over = (e: React.PointerEvent) => {
    const block = (e.target as Element).closest?.('.iso-b')
    const box = wrap.current?.getBoundingClientRect()
    if (!block || !box) return setTip(null)
    const r = block.getBoundingClientRect()
    setTip({ x: r.left + r.width / 2 - box.left, y: r.top - box.top, date: block.getAttribute('data-date') ?? '', n: Number(block.getAttribute('data-count')) })
  }

  return (
    <figure className="gh-year">
      <figcaption className="gh-year__top">
        <span className="gh-year__total">
          <strong>{num(snap.calendar.total)}</strong> {t.total}
        </span>
        <span className="gh-year__span">{fill(t.span, { from: year(snap.calendar.from), to: year(snap.calendar.to) })}</span>
      </figcaption>

      <div className="gh-year__stage">
        <div
          ref={wrap}
          className={`gh-year__iso ${seen || reduced ? 'is-in' : ''}`}
          role="img"
          aria-label={fill(t.calendarLabel, { n: num(snap.calendar.total) })}
          onPointerMove={over}
          onPointerLeave={() => setTip(null)}
        >
          <div className="gh-year__svg" dangerouslySetInnerHTML={markup} />
          {tip && (
            <div className="gh-year__tip" style={{ left: tip.x, top: tip.y }} aria-hidden="true">
              <strong>{num(tip.n)}</strong> {weekdayDate(tip.date)}
            </div>
          )}
        </div>

        <dl className="gh-streaks">
          <div>
            <dt>{t.current}</dt>
            <dd>
              <strong>{num(cur.length)}</strong> {t.days}
              {cur.start && cur.end && <small>{`${dayMonth(cur.start)} – ${dayMonth(cur.end)}${cur.todayPending ? ` · ${t.todayPending}` : ''}`}</small>}
            </dd>
          </div>
          <div>
            <dt>{t.longest}</dt>
            <dd>
              <strong>{num(m.longestStreak.length)}</strong> {t.days}
            </dd>
          </div>
          {m.firstContribution && (
            <div>
              <dt>{t.activeTitle}</dt>
              <dd>
                <strong>{num(m.activeDays)}</strong> / {num(m.daysSinceFirst)}
                <small>{t.activeNote}</small>
              </dd>
            </div>
          )}
        </dl>
      </div>

      <div className="gh-year__foot">
        <div className="gh-legend" aria-hidden="true">
          <span>{t.less}</span>
          {LEVEL_COLORS.map((c, i) => (
            <i key={c} style={{ background: c }} title={LEVELS[i].max === Infinity ? `${LEVELS[i].min}+` : `${LEVELS[i].min}–${LEVELS[i].max}`} />
          ))}
          <span>{t.more}</span>
        </div>
        <details className="gh-more">
          <summary>{t.more_details}</summary>
          <div className="gh-more__body">
            <div>
              <p className="gh-more__label">{t.rhythm}</p>
              <Rhythm week={m.weekdays} />
            </div>
            <table className="data-table">
              <caption>{t.tableCaption}</caption>
              <thead>
                <tr>
                  <th scope="col">{t.month}</th>
                  <th scope="col">{t.contributions}</th>
                  <th scope="col">{t.active}</th>
                </tr>
              </thead>
              <tbody>
                {m.months.map((mo) => (
                  <tr key={mo.month}>
                    <th scope="row">{monthYear(mo.month)}</th>
                    <td>{num(mo.total)}</td>
                    <td>{num(mo.activeDays)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </div>
    </figure>
  )
}

/* Language colours: the palette's accents in a fixed order; "Other" is always the quiet grey. The legend names every
   segment with its share, so colour is never the only key. */
const LANG_COLORS = ['#FF7029', '#F49CB6', '#8DB0FF', '#FFE5EE', '#2463F6']
const OTHER = '#6B6E8A'

function Languages({ snap }: { snap: Snapshot }) {
  const t = copy.github
  const [mode, setMode] = useState<'byBytes' | 'byRepos'>('byBytes')
  const list: LanguageShare[] = snap.repositories?.languages[mode] ?? []
  const color = (l: LanguageShare, i: number) => (l.name === 'Other' ? OTHER : LANG_COLORS[i % LANG_COLORS.length])
  return (
    <article className="gh-card" aria-labelledby="gh-langs-title">
      <div className="gh-card__row">
        <h3 id="gh-langs-title" className="gh-card__title">
          {t.langTitle}
        </h3>
        <div className="seg seg--sm" role="group" aria-label={t.langTitle}>
          {(['byBytes', 'byRepos'] as const).map((k) => (
            <button key={k} type="button" className="seg__btn" aria-pressed={mode === k} onClick={() => setMode(k)}>
              {k === 'byBytes' ? t.bySize : t.byRepo}
            </button>
          ))}
        </div>
      </div>
      {list.length ? (
        <>
          <div className="langbar" aria-hidden="true">
            {list.map((l, i) => (
              <span key={l.name} style={{ flexGrow: l.share, background: color(l, i) }} />
            ))}
          </div>
          <ul className="langkey">
            {list.map((l, i) => (
              <li key={l.name}>
                <i style={{ background: color(l, i) }} />
                <span className="langkey__name">{l.name}</span>
                <span className="langkey__pct">{pct(l.share, 1)}</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="gh-card__note">{t.unavailable}</p>
      )}
      <p className="gh-card__note">{fill(t.langNote, { n: snap.repositories?.withLanguages ?? 0 })}</p>
    </article>
  )
}

function Rhythm({ week }: { week: { day: string; total: number }[] }) {
  const top = Math.max(1, ...week.map((d) => d.total))
  return (
    <ol className="rhythm">
      {week.map((d) => (
        <li key={d.day} title={`${d.day}: ${num(d.total)}`}>
          <span className="rhythm__track">
            <span className="rhythm__bar" style={{ height: `${Math.max(4, (d.total / top) * 100)}%` }} />
          </span>
          <span className="rhythm__day">{d.day.slice(0, 2)}</span>
          <span className="rhythm__n">{num(d.total)}</span>
        </li>
      ))}
    </ol>
  )
}
