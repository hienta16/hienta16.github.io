import { useMemo, useRef, useState } from 'react'
import { copy, profile } from '../content/site'
import { ago, date, dayMonth, fill, monthYear, num, pct } from '../lib/format'
import { currentStreak, daysBetween, firstActive, languageShares, longestStreak, monthTotals, type Day, type GitHubData } from '../lib/stats'
import { useGitHub, useLiveProfile, useMediaQuery, useReducedMotion, useSeen } from '../lib/stage'
import { ContributionRunway } from './ContributionRunway'
import { GitHubMark, IconArrow, IconCommit, IconIssue, IconPR, IconPeople, IconRepo, IconStar } from './icons'
import './GitHubStats.css'

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
          <p className="sub">{t.unavailable}</p>
        </div>
      </section>
    )
  return <Stats data={gh.data} days={gh.days} />
}

function Ring({ value, size = 112, stroke = 10, track, color, children }: { value: number; size?: number; stroke?: number; track: string; color: string; children: React.ReactNode }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} aria-hidden="true" focusable="false">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${c * Math.min(1, value)} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="ring__arc"
        />
      </svg>
      <div className="ring__inner">{children}</div>
    </div>
  )
}

function Stats({ data, days }: { data: GitHubData; days: Day[] }) {
  const t = copy.github
  const reduced = useReducedMotion()
  const compact = !useMediaQuery('(min-width: 760px)')
  const live = useLiveProfile(data.login)
  const sectionRef = useRef<HTMLElement>(null)
  const seen = useSeen(sectionRef, '0px 0px -25% 0px')
  const [langMode, setLangMode] = useState<'repos' | 'bytes'>('repos')
  const [showTable, setShowTable] = useState(false)

  const s = useMemo(() => {
    const first = firstActive(days)
    const cur = currentStreak(days)
    const longest = longestStreak(days)
    const active = days.filter((d) => d.count > 0).length
    const best = days.reduce((b, d) => (d.count > b.count ? d : b), days[0])
    // "Showing up": active days since the first contribution, up to the last day that has had a chance.
    const lastCounted = cur.todayPending ? days.length - 2 : days.length - 1
    const span = first ? lastCounted - first.index + 1 : 0
    return { first, cur, longest, active, best, span, months: monthTotals(days) }
  }, [days])

  const langs = useMemo(() => languageShares(data.languageBytesByRepository, langMode, 5), [data, langMode])
  const langMax = Math.max(...langs.map((l) => l.share), 0.01)
  const c = data.counts
  const total = data.calendar.total
  const stale = daysBetween(data.generatedAt.slice(0, 10), new Date().toISOString().slice(0, 10))

  const rows = [
    { icon: <IconStar />, label: t.stars, value: num(c.stars) },
    { icon: <IconCommit />, label: t.commits, value: num(c.commitsLastYear) },
    { icon: <IconPR />, label: t.prs, value: num(c.pullRequestsLastYear) },
    { icon: <IconIssue />, label: t.issues, value: num(c.issuesLastYear) },
    { icon: <IconPeople />, label: t.contributed, value: num(c.contributedToLastYear) },
    { icon: <IconRepo />, label: t.repos, value: fill(t.reposValue, { n: num(c.repositories.total), pub: num(live?.publicRepos ?? c.repositories.public) }) },
  ]

  return (
    <section id="github" ref={sectionRef} className={`gh field field--ink ${seen || reduced ? 'is-seen' : ''}`} aria-labelledby="gh-title">
      <div className="wrap section">
        <div className="gh__head">
          <h2 id="gh-title" className="title">
            {t.title}
          </h2>
          <div className="gh__id">
            {profile.showGitHubAvatar && <img className="gh__avatar" src={live?.avatarUrl ?? data.avatarUrl} alt="" width="64" height="64" loading="lazy" decoding="async" />}
            <div className="gh__who">
              <p className="gh__name">{data.name}</p>
              <p className="gh__meta">
                <span>@{data.login}</span>
                <span>{fill(t.joined, { date: monthYear(data.joined) })}</span>
                <span className="gh__updated">
                  <span className={`gh__dot ${live ? 'is-live' : ''}`} aria-hidden="true" />
                  {fill(t.updated, { when: ago(data.generatedAt) })}
                </span>
              </p>
            </div>
            <a className="btn btn--orange gh__view" href={data.profileUrl} rel="noopener">
              <GitHubMark />
              {t.viewProfile}
            </a>
          </div>
        </div>

        <p className="gh__total">
          <span className="gh__total-num">{num(total)}</span> {fill(t.totalLine, { n: '' }).trim()}
        </p>

        <figure className="gh__runway">
          <ContributionRunway days={days} compact={compact} rise={seen || reduced ? 1 : 0} />
          <figcaption className="gh__legend" aria-hidden="true">
            <span>{t.less}</span>
            {['#3B74F8', '#FFE5EE', '#F9C2D3', '#F49CB6', '#EE6F9A'].map((col) => (
              <i key={col} style={{ background: col }} />
            ))}
            <span>{t.more}</span>
          </figcaption>
        </figure>

        <div className="gh__cards">
          {/* Stats, in the shape GitHub stats cards made familiar */}
          <article className="card card--cream" aria-labelledby="card-stats">
            <h3 id="card-stats" className="card__title">
              {fill(t.statsTitle, { name: profile.displayName.split(' ')[0] })}
            </h3>
            <div className="card__stats">
              <dl className="statlist">
                {rows.map((r) => (
                  <div key={r.label} className="statlist__row">
                    <dt>
                      {r.icon}
                      {r.label}
                    </dt>
                    <dd>{r.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="card__ring">
                <Ring value={s.span ? s.active / s.span : 0} track="var(--pale)" color="var(--orange)">
                  <strong>{pct(s.span ? s.active / s.span : 0)}</strong>
                </Ring>
                <p className="card__ring-label">{t.showingUp}</p>
                <p className="card__ring-note">{fill(t.showingUpNote, { a: num(s.active), b: num(s.span) })}</p>
              </div>
            </div>
          </article>

          {/* Streaks */}
          <article className="card card--orange" aria-labelledby="card-streak">
            <h3 id="card-streak" className="card__title">
              {t.streakTitle}
            </h3>
            <div className="streak">
              <div className="streak__side">
                <strong>{num(total)}</strong>
                <span>{t.total}</span>
                <small>
                  {date(data.calendar.from)} – {t.present}
                </small>
              </div>
              <div className="streak__main">
                <Ring value={s.longest.length ? s.cur.length / s.longest.length : 0} size={132} stroke={11} track="rgba(34,36,58,.18)" color="var(--ink)">
                  <strong>{num(s.cur.length)}</strong>
                  <span>{t.days}</span>
                </Ring>
                <span className="streak__label">{t.current}</span>
                {s.cur.start && (
                  <small>
                    {dayMonth(s.cur.start)} – {dayMonth(s.cur.end!)}
                    {s.cur.todayPending ? ` · ${t.todayPending}` : ''}
                  </small>
                )}
              </div>
              <div className="streak__side">
                <strong>{num(s.longest.length)}</strong>
                <span>{t.longest}</span>
                {s.longest.start && (
                  <small>
                    {dayMonth(s.longest.start)} – {dayMonth(s.longest.end!)}
                  </small>
                )}
              </div>
            </div>
            <dl className="streak__foot">
              <div>
                <dt>{t.best}</dt>
                <dd>
                  {num(s.best.count)} · {dayMonth(s.best.date)}
                </dd>
              </div>
              <div>
                <dt>{t.average}</dt>
                <dd>{s.active ? (total / s.active).toFixed(1) : '0'}</dd>
              </div>
            </dl>
          </article>

          {/* Languages: one series, ranked */}
          <article className="card card--pink" aria-labelledby="card-langs">
            <div className="card__top">
              <h3 id="card-langs" className="card__title">
                {t.langTitle}
              </h3>
              <div className="seg" role="group" aria-label={t.langTitle}>
                {(['repos', 'bytes'] as const).map((m) => (
                  <button key={m} type="button" className="seg__btn" aria-pressed={langMode === m} onClick={() => setLangMode(m)}>
                    {m === 'repos' ? t.byRepo : t.bySize}
                  </button>
                ))}
              </div>
            </div>
            <ol className="langs">
              {langs.map((l) => (
                <li key={l.name} className="langs__row">
                  <span className="langs__name">{l.name}</span>
                  <span className="langs__track">
                    <span className="langs__bar" style={{ ['--w' as string]: l.share / langMax }} />
                  </span>
                  <span className="langs__pct">{pct(l.share, 1)}</span>
                </li>
              ))}
            </ol>
          </article>
        </div>

        <div className="gh__foot">
          <p>
            {t.note} {stale > 2 && fill(t.stale, { n: num(stale) })}
          </p>
          <button type="button" className="text-btn" aria-expanded={showTable} onClick={() => setShowTable((v) => !v)}>
            {showTable ? t.hideTable : t.table}
          </button>
        </div>
        {showTable && (
          <div className="gh__table-wrap">
            <table className="data-table">
              <caption>{t.tableCaption}</caption>
              <thead>
                <tr>
                  <th scope="col">{t.month}</th>
                  <th scope="col">{t.contributions}</th>
                  <th scope="col">{t.activeDays}</th>
                </tr>
              </thead>
              <tbody>
                {s.months.map((m) => (
                  <tr key={m.key}>
                    <th scope="row">
                      {monthYear(m.key)}
                      {m.partial ? ` (${date(days[m.firstIndex].date)} – ${date(days[m.lastIndex].date)})` : ''}
                    </th>
                    <td>{num(m.total)}</td>
                    <td>{num(m.active)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <a className="gh__more" href={data.profileUrl} rel="noopener">
          github.com/{data.login}
          <IconArrow />
        </a>
      </div>
    </section>
  )
}
