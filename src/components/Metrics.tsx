import { useEffect, useMemo, useRef, useState } from 'react'
import { profile } from '../content/site'
import { fill, useLang } from '../lib/i18n'
import { audioSupported, play, type Playback } from '../lib/sonify'
import { BINS, binCounts, daysBetween, firstActive, measure, monthTotals, slice, weekTotals, type Day, type Range } from '../lib/stats'
import { useMediaQuery, useReducedMotion, useSeason, useSeen } from '../lib/stage'
import { BackstageNote } from './BackstageNote'
import { BIN_FILL, MeasuredYear } from './MeasuredYear'
import './Metrics.css'

type Preset = 'all' | 'since' | 'last30'

export function Metrics() {
  const season = useSeason()
  const { t } = useLang()
  if (!season.ok) {
    return (
      <section id="metrics" className="metrics field field--blue" aria-labelledby="metrics-title">
        <div className="wrap section">
          <h2 id="metrics-title" className="title">
            {t.metrics.title}
          </h2>
          <p className="sub metrics__unavailable">{t.metrics.unavailable}</p>
        </div>
      </section>
    )
  }
  return <MetricsBody days={season.days} snapshot={season.snapshot} />
}

function MetricsBody({ days, snapshot }: { days: Day[]; snapshot: import('../lib/stats').Snapshot }) {
  const { t, num, pct, date, dayMonth, monthYear, monthShort, weekday } = useLang()
  const reduced = useReducedMotion()
  const wide = useMediaQuery('(min-width: 760px)')
  const sectionRef = useRef<HTMLElement>(null)
  const seen = useSeen(sectionRef)

  const n = days.length
  const first = firstActive(days)
  const presets: Record<Preset, Range> = useMemo(
    () => ({
      all: { start: 0, end: n - 1 },
      since: { start: first?.index ?? 0, end: n - 1 },
      last30: { start: Math.max(0, n - 30), end: n - 1 },
    }),
    [n, first],
  )
  const [range, setRange] = useState<Range>(presets.all)
  const [bin, setBin] = useState<number | null>(null)
  const [folded, setFolded] = useState(true)
  const [showTable, setShowTable] = useState(false)
  const [playing, setPlaying] = useState<number | null>(null)
  const playback = useRef<Playback | null>(null)

  const m = useMemo(() => measure(days, range), [days, range])
  const months = useMemo(() => monthTotals(days), [days])
  const bins = useMemo(() => binCounts(slice(days, m.range)), [days, m.range])
  const quietLeadWeeks = useMemo(() => {
    const w = weekTotals(days)
    const k = w.findIndex((x) => x.total > 0)
    return k < 0 ? 0 : k
  }, [days])

  const activePreset = (Object.keys(presets) as Preset[]).find((p) => presets[p].start === m.range.start && presets[p].end === m.range.end)

  useEffect(() => () => playback.current?.stop(), [])

  const stopPlay = () => {
    playback.current?.stop()
    playback.current = null
    setPlaying(null)
  }
  const togglePlay = () => {
    if (playback.current) return stopPlay()
    const part = slice(days, m.range)
    const a = part.findIndex((d) => d.count > 0)
    const b = part.length - 1 - [...part].reverse().findIndex((d) => d.count > 0)
    if (a < 0) return
    const run = part.slice(a, b + 1)
    playback.current = play(
      run.map((d) => ({ count: d.count, weekday: (d.weekday + 6) % 7 })),
      {
        onStep: (i) => setPlaying(run[i].index),
        onEnd: () => {
          playback.current = null
          setPlaying(null)
        },
      },
    )
  }
  const setMeasured = (r: Range) => {
    if (playback.current) stopPlay()
    setRange(r)
  }

  const zeroRun = months.filter((mo) => mo.total === 0)
  const activeMonths = months.filter((mo) => mo.total > 0)
  const maxMonth = Math.max(1, ...activeMonths.map((mo) => mo.total))
  const wdMax = Math.max(1, ...m.weekdays)
  const weekend = m.weekdays[5] + m.weekdays[6]
  const staleDays = daysBetween(snapshot.to, new Date().toISOString().slice(0, 10))

  const factsList: [string, string][] = [
    [
      t.metrics.facts.streak,
      m.streak.length
        ? `${fill(t.metrics.facts.streakValue, { n: num(m.streak.length), from: dayMonth(m.streak.start!), to: dayMonth(m.streak.end!) })}${
            m.streak.running && m.streak.end === snapshot.to ? `, ${t.metrics.facts.running}` : ''
          }`
        : t.metrics.facts.none,
    ],
    [
      t.metrics.facts.busiestDay,
      m.busiestDay
        ? fill(t.metrics.facts.busiestDayValue, {
            weekday: weekday((m.busiestDay.weekday + 6) % 7, true),
            date: date(m.busiestDay.date),
            count: num(m.busiestDay.count),
          })
        : t.metrics.facts.none,
    ],
    [
      t.metrics.facts.busiestWeek,
      m.busiestWeek
        ? fill(t.metrics.facts.busiestWeekValue, { from: dayMonth(m.busiestWeek.start), to: dayMonth(m.busiestWeek.end), count: num(m.busiestWeek.total) })
        : t.metrics.facts.none,
    ],
    [t.metrics.facts.median, m.median != null ? fill(t.metrics.facts.medianValue, { n: num(m.median) }) : t.metrics.facts.none],
    [t.metrics.facts.quiet, fill(t.metrics.facts.quietValue, { n: num(m.quiet), span: num(m.span) })],
  ]

  const tableRows = monthTotals(slice(days, m.range))

  return (
    <section id="metrics" ref={sectionRef} className={`metrics field field--blue ${seen && !reduced ? 'is-seen' : ''}`} aria-labelledby="metrics-title">
      <div className="wrap section">
        <div className="metrics__head">
          <h2 id="metrics-title" className="title">
            {t.metrics.title}
          </h2>
          <p className="sub">{t.metrics.sub}</p>
        </div>

        {/* One row of controls scopes everything below it. */}
        <div className="metrics__controls" role="group" aria-label={t.metrics.presetsLabel}>
          {(Object.keys(presets) as Preset[]).map((p) => (
            <button key={p} type="button" className="chip" aria-pressed={activePreset === p} onClick={() => setMeasured(presets[p])}>
              {activePreset === p && (
                <svg viewBox="0 0 16 16" className="chip__check" aria-hidden="true">
                  <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {t.metrics.presets[p]}
            </button>
          ))}
          {audioSupported() && (
            <button type="button" className="chip chip--listen" aria-pressed={playing !== null} onClick={togglePlay} disabled={m.total === 0}>
              <svg viewBox="0 0 16 16" className="chip__check" aria-hidden="true">
                {playing !== null ? <rect x="4" y="4" width="8" height="8" fill="currentColor" /> : <path d="M5 3.5v9l7.5-4.5z" fill="currentColor" />}
              </svg>
              {playing !== null ? t.metrics.stop : t.metrics.listen}
            </button>
          )}
        </div>

        <figure className="metrics__fig metrics__fig--year">
          <MeasuredYear
            days={days}
            range={m.range}
            onRange={setMeasured}
            bin={bin}
            playing={playing}
            orientation={wide ? 'h' : 'v'}
            folded={folded}
            quietLeadWeeks={quietLeadWeeks}
            reading={
              <div className="readout" aria-live="polite">
                <p className="readout__value">
                  <span className="readout__num">{num(m.total)}</span> <span className="readout__unit">{t.metrics.readoutUnit}</span>
                </p>
                <p className="readout__range">
                  {fill(t.metrics.readoutRange, { from: date(m.from), to: date(m.to) })}
                  <span className="readout__meta">{fill(t.metrics.readoutMeta, { span: num(m.span), active: num(m.active) })}</span>
                </p>
              </div>
            }
          />
          {!wide && quietLeadWeeks > 0 && (
            <button type="button" className="text-btn" onClick={() => setFolded((f) => !f)} aria-expanded={!folded}>
              {folded ? fill(t.metrics.fold, { n: quietLeadWeeks }) : t.metrics.unfold}
            </button>
          )}
          <figcaption className="metrics__cap">
            <span className="label">{t.metrics.fig1}</span>
            <span>{fill(t.metrics.fig1Note, { from: date(snapshot.from), to: date(snapshot.to) })}</span>
          </figcaption>

          {/* Legend as control */}
          <div className="legend" role="group" aria-label={t.metrics.legendTitle}>
            <span className="legend__title">
              {t.metrics.legendTitle}
              {m.median != null && <span className="legend__median">{fill(t.metrics.medianNote, { n: num(m.median) })}</span>}
            </span>
            {BINS.map((b, i) => (
              <button
                key={i}
                type="button"
                className="legend__item"
                aria-pressed={bin === i}
                onClick={() => setBin((cur) => (cur === i ? null : i))}
              >
                <svg viewBox="0 0 16 16" className="legend__swatch" aria-hidden="true">
                  {i === 0 ? <circle cx="8" cy="8" r="2.2" fill="var(--white)" fillOpacity=".6" /> : <rect x="1" y="1" width="14" height="14" rx="3" fill={BIN_FILL[i]} />}
                </svg>
                <span>{b.max === b.min ? num(b.min) : Number.isFinite(b.max) ? `${num(b.min)}–${num(b.max)}` : `${num(b.min)}+`}</span>
                <span className="legend__days">{fill(t.metrics.legendDays, { n: num(bins[i]) })}</span>
              </button>
            ))}
            <span className="legend__hint">{t.metrics.legendHint}</span>
          </div>
        </figure>

        <div className="metrics__grid">
          {/* Fig. 2: month by month */}
          <figure className="metrics__fig">
            <figcaption className="metrics__cap">
              <span className="label">{t.metrics.fig2}</span>
              <span>{t.metrics.fig2Hint}</span>
            </figcaption>
            {m.busiestWeek && (
              <p className="months__note">
                {fill(t.metrics.busiestWeekNote, { from: dayMonth(m.busiestWeek.start), to: dayMonth(m.busiestWeek.end), count: num(m.busiestWeek.total) })}
              </p>
            )}
            <ul className="months">
              {activeMonths.map((mo) => {
                const overlaps = mo.lastIndex >= m.range.start && mo.firstIndex <= m.range.end
                const exact = mo.firstIndex === m.range.start && mo.lastIndex === m.range.end
                return (
                  <li key={mo.key}>
                    <button
                      type="button"
                      className={`months__row ${overlaps ? '' : 'is-dim'}`}
                      aria-pressed={exact}
                      onClick={() => setMeasured({ start: mo.firstIndex, end: mo.lastIndex })}
                    >
                      <span className="months__name">
                        {monthYear(mo.key)}
                        {mo.partial && <span className="months__partial"> · {fill(t.metrics.partial, { day: dayMonth(days[mo.lastIndex].date) })}</span>}
                      </span>
                      <span className="months__track">
                        <span className="months__bar" style={{ ['--w' as string]: mo.total / maxMonth }} />
                        <span className="months__value">{num(mo.total)}</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
            {zeroRun.length > 0 && (
              <p className="months__zero">
                {fill(t.metrics.zeroMonths, { from: `${monthShort(zeroRun[0].key)} ${zeroRun[0].key.slice(0, 4)}`, to: `${monthShort(zeroRun.at(-1)!.key)} ${zeroRun.at(-1)!.key.slice(0, 4)}` })}
              </p>
            )}
          </figure>

          {/* Fig. 3: weekday rhythm */}
          <figure className="metrics__fig">
            <figcaption className="metrics__cap">
              <span className="label">{t.metrics.fig3}</span>
              <span>{m.total ? fill(t.metrics.weekendShare, { pct: pct(weekend / m.total) }) : t.metrics.facts.none}</span>
            </figcaption>
            <ol className="rhythm">
              {m.weekdays.map((v, i) => (
                <li key={i} className={i >= 5 ? 'is-weekend' : ''}>
                  <span className="rhythm__value">{num(v)}</span>
                  <span className="rhythm__col">
                    <span className="rhythm__bar" style={{ ['--h' as string]: v / wdMax }} />
                  </span>
                  <span className="rhythm__day" aria-hidden="true">
                    {weekday(i)}
                  </span>
                  <span className="sr-only">{weekday(i, true)}</span>
                </li>
              ))}
            </ol>
          </figure>

          {/* The same facts the figures annotate, for screen readers */}
          <dl className="sr-only">
            {factsList.map(([k, v]) => (
              <div key={k} className="facts__row">
                <dt className="label">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="metrics__foot">
          <button type="button" className="text-btn" aria-expanded={showTable} onClick={() => setShowTable((s) => !s)}>
            {showTable ? t.metrics.hideTable : t.metrics.table}
          </button>
          {showTable && (
            <div className="metrics__table-wrap">
              <table className="data-table">
                <caption>{fill(t.metrics.tableCaption, { from: date(m.from), to: date(m.to) })}</caption>
                <thead>
                  <tr>
                    <th scope="col">{t.metrics.tableMonth}</th>
                    <th scope="col">{t.metrics.tableTotal}</th>
                    <th scope="col">{t.metrics.tableActive}</th>
                    <th scope="col">{t.metrics.tableDays}</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row) => (
                    <tr key={row.key}>
                      <th scope="row">{monthYear(row.key)}</th>
                      <td>{num(row.total)}</td>
                      <td>{num(row.active)}</td>
                      <td>{num(row.days)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="metrics__source">
            {fill(t.metrics.source, {
              login: snapshot.login,
              date: date(snapshot.generatedAt.slice(0, 10)),
              private: num(snapshot.privateContributions),
              total: num(snapshot.total),
            })}{' '}
            <a href={profile.githubUrl} rel="noopener">
              {t.metrics.profileLink}
            </a>
          </p>
          {staleDays > 14 && <p className="metrics__stale">{fill(t.metrics.stale, { n: num(staleDays) })}</p>}
          <BackstageNote>{t.backstage.metrics}</BackstageNote>
        </div>
      </div>
    </section>
  )
}
