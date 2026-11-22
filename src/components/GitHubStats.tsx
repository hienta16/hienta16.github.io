import { useMemo, useRef, useState } from 'react'
import isoCompactRaw from '../data/hub/iso-compact.svg?raw'
import isoFullRaw from '../data/hub/iso.svg?raw'
import { copy, profile } from '../content/site'
import { ago, dayMonth, fill, monthYear, num, pct, weekdayDate } from '../lib/format'
import { useLiveSnapshot, useLiveSvg, type Snapshot } from '../lib/hub'
import { useGitHub, useMediaQuery, useReducedMotion, useSeen } from '../lib/stage'
import { LEVEL_COLORS, LEVELS } from '../lib/stats'
import { GitHubMark, IconArrow, IconCommit, IconIssue, IconPR, IconRepo, IconStar } from './icons'
import './GitHubStats.css'

/** GitHub stats. Every number was computed by the hub's Python (catwalk/stats); this component only lays them out. */
export function GitHubStats() {
  const gh = useGitHub()
  const t = copy.github
  if (!gh.ok)
    return (
      <section id="github" className="gh field field--ink" aria-labelledby="gh-title">
        <div className="wrap section">
          <h2 id="gh-title" className="title">
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
  const { calendar: cal, metrics: m, counts, repositories: repos } = snap
  const ref = useRef<HTMLElement>(null)
  const seen = useSeen(ref)
  const staleDays = Math.floor((Date.now() - Date.parse(cal.asOf)) / 86_400_000)

  return (
    <section id="github" ref={ref} className="gh field field--ink" aria-labelledby="gh-title">
      <div className="wrap section">
        <header className="gh__head">
          <h2 id="gh-title" className="title">
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

        <Year snap={snap} seen={seen} />

        <div className="gh__cards">
          <article className="gh-card gh-card--activity">
            <h3 className="gh-card__title">{t.activity}</h3>
            <dl className="gh-rows">
              <Row icon={<span className="gh-rows__dot" />} label={t.rows.contributions} value={cal.total} strong />
              <Row icon={<IconCommit />} label={t.rows.commits} value={counts?.commitsLastYear} />
              <Row icon={<IconPR />} label={t.rows.prs} value={counts?.pullRequestsLastYear} />
              <Row icon={<IconIssue />} label={t.rows.issues} value={counts?.issuesLastYear} />
              <Row icon={<IconRepo />} label={t.rows.contributed} value={counts?.contributedToLastYear} />
              <Row icon={<IconStar />} label={t.rows.stars} value={repos?.stars} />
            </dl>
            <p className="gh-card__note">{t.contribNote}</p>
          </article>

          <article className="gh-card gh-card--streaks">
            <h3 className="gh-card__title">{t.streaks}</h3>
            <p className="gh-streak">
              <span className="gh-streak__n">{num(m.currentStreak.length)}</span>
              <span className="gh-streak__unit">{t.days}</span>
            </p>
            <p className="gh-streak__label">
              {t.current}
              {m.currentStreak.start && m.currentStreak.end && ` · ${dayMonth(m.currentStreak.start)} – ${dayMonth(m.currentStreak.end)}`}
              {m.currentStreak.todayPending && ` · ${t.todayPending}`}
            </p>
            <p className="gh-streak__second">
              <strong>{num(m.longestStreak.length)}</strong> {t.days} · {t.longest}
            </p>
            {m.firstContribution && (
              <>
                <div className="gh-meter" aria-hidden="true">
                  <span style={{ width: pct(m.activeShareSinceFirst ?? 0) }} />
                </div>
                <p className="gh-card__note">{fill(t.activeDays, { a: num(m.activeDays), b: num(m.daysSinceFirst) })}</p>
              </>
            )}
          </article>

          <Languages snap={snap} />

          <article className="gh-card gh-card--rhythm">
            <h3 className="gh-card__title">{t.rhythm}</h3>
            <p className="gh-card__sub">{t.rhythmNote}</p>
            <Rhythm week={m.weekdays} />
          </article>
        </div>

        <details className="gh__table">
          <summary>
            <span className="when-closed">{t.table}</span>
            <span className="when-open">{t.hideTable}</span>
          </summary>
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
        </details>

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

/** The 3D year: the hub's Python drew it; here it gets a headline, a legend, hover details and a rise-in. */
function Year({ snap, seen }: { snap: Snapshot; seen: boolean }) {
  const t = copy.github
  const reduced = useReducedMotion()
  const narrow = useMediaQuery('(max-width: 759px)')
  const full = useLiveSvg('assets/generated/iso-site.svg', isoFullRaw)
  const compact = useLiveSvg('assets/generated/iso-site-compact.svg', isoCompactRaw)
  const wrap = useRef<HTMLDivElement>(null)
  const [tip, setTip] = useState<{ x: number; y: number; date: string; n: number } | null>(null)
  const markup = useMemo(() => ({ __html: narrow ? compact : full }), [narrow, compact, full])
  const year = (d: string) => `${dayMonth(d)}, ${d.slice(0, 4)}`

  const over = (e: React.PointerEvent) => {
    const block = (e.target as Element).closest?.('.iso-b')
    const box = wrap.current?.getBoundingClientRect()
    if (!block || !box) return setTip(null)
    const r = block.getBoundingClientRect()
    setTip({ x: r.left + r.width / 2 - box.left, y: r.top - box.top, date: block.getAttribute('data-date') ?? '', n: Number(block.getAttribute('data-count')) })
  }

  return (
    <figure className="year">
      <div className="year__head">
        <p className="year__total">
          <strong>{num(snap.calendar.total)}</strong> {t.total}
        </p>
        <p className="year__span">{fill(t.span, { from: year(snap.calendar.from), to: year(snap.calendar.to) })}</p>
        <div className="year__legend" aria-hidden="true">
          <span>{t.less}</span>
          {LEVEL_COLORS.map((c, i) => (
            <i key={c} style={{ background: c }} title={LEVELS[i].max === Infinity ? `${LEVELS[i].min}+` : `${LEVELS[i].min}–${LEVELS[i].max}`} />
          ))}
          <span>{t.more}</span>
        </div>
      </div>
      <div
        ref={wrap}
        className={`year__iso ${seen || reduced ? 'is-in' : ''}`}
        role="img"
        aria-label={fill(t.calendarLabel, { n: num(snap.calendar.total) })}
        onPointerMove={over}
        onPointerLeave={() => setTip(null)}
      >
        <div className="year__svg" dangerouslySetInnerHTML={markup} />
        {tip && (
          <div className="year__tip" style={{ left: tip.x, top: tip.y }} aria-hidden="true">
            <strong>{num(tip.n)}</strong>
            <span>{weekdayDate(tip.date)}</span>
          </div>
        )}
      </div>
    </figure>
  )
}

function Languages({ snap }: { snap: Snapshot }) {
  const t = copy.github
  const [mode, setMode] = useState<'byBytes' | 'byRepos'>('byBytes')
  const list = snap.repositories?.languages[mode] ?? []
  const top = Math.max(0.0001, ...list.map((l) => l.share))
  return (
    <article className="gh-card gh-card--langs">
      <div className="gh-card__row">
        <h3 className="gh-card__title">{t.langTitle}</h3>
        <div className="seg" role="group" aria-label={t.langTitle}>
          {(['byBytes', 'byRepos'] as const).map((k) => (
            <button key={k} type="button" className="seg__btn" aria-pressed={mode === k} onClick={() => setMode(k)}>
              {k === 'byBytes' ? t.bySize : t.byRepo}
            </button>
          ))}
        </div>
      </div>
      {list.length ? (
        <ol className="langs">
          {list.map((l) => (
            <li key={l.name} className={l.name === 'Other' ? 'is-other' : undefined}>
              <span className="langs__name">{l.name}</span>
              <span className="langs__bar">
                <span style={{ width: `${(l.share / top) * 100}%` }} />
              </span>
              <span className="langs__pct">{pct(l.share)}</span>
            </li>
          ))}
        </ol>
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
        <li key={d.day}>
          <span className="rhythm__n">{num(d.total)}</span>
          <span className="rhythm__track">
            <span className="rhythm__bar" style={{ height: `${Math.max(3, (d.total / top) * 100)}%` }} />
          </span>
          <span className="rhythm__day">{d.day}</span>
        </li>
      ))}
    </ol>
  )
}
