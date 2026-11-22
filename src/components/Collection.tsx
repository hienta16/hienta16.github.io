import { useMemo, useState } from 'react'
import { outreachCase, profile } from '../content/site'
import { fill, useLang } from '../lib/i18n'
import { twoProportionP, wilson } from '../lib/stats'
import { BackstageNote } from './BackstageNote'
import './Collection.css'

type Metric = 'count' | 'rate'
const ROW = 76

export function Collection() {
  const { t, num, pct, lang } = useLang()
  const [metric, setMetric] = useState<Metric>('count')
  const [showTable, setShowTable] = useState(false)

  const rows = useMemo(
    () =>
      outreachCase.map((c) => {
        const rate = c.replies / c.contacted
        const [lo, hi] = wilson(c.replies, c.contacted)
        return { ...c, rate, lo, hi }
      }),
    [],
  )
  const order = useMemo(() => [...rows].sort((a, b) => (metric === 'count' ? b.replies - a.replies : b.rate - a.rate)).map((r) => r.id), [rows, metric])
  const email = rows.find((r) => r.id === 'email')!
  const wa = rows.find((r) => r.id === 'whatsapp')!
  const p = twoProportionP(wa.replies, wa.contacted, email.replies, email.contacted)
  const countMax = 10
  const rateMax = 0.5
  const pStr = new Intl.NumberFormat(lang === 'vi' ? 'vi-VN' : 'en-GB', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(p)

  return (
    <section id="collection" className="collection field field--cream" aria-labelledby="collection-title">
      <div className="wrap section">
        <div className="collection__head">
          <h2 id="collection-title" className="title">
            {t.collection.title}
          </h2>
          <p className="sub">{t.collection.sub}</p>
        </div>

        <article className="look" aria-labelledby="case-title">
          <div className="look__text">
            <h3 id="case-title" className="look__title">
              {t.collection.caseTitle}
            </h3>
            <p className="look__setup">{t.collection.setup}</p>
            <p className="look__finding" aria-live="polite">
              {metric === 'count'
                ? fill(t.collection.findingCount, { k: num(email.replies) })
                : fill(t.collection.findingRate, {
                    wk: num(wa.replies),
                    wn: num(wa.contacted),
                    wp: pct(wa.rate),
                    ek: num(email.replies),
                    en: num(email.contacted),
                    ep: pct(email.rate),
                  })}
            </p>
            <p className="look__lesson">{fill(t.collection.lesson, { p: pStr })}</p>
            {profile.outreachSourceUrl && (
              <a className="link-arrow" href={profile.outreachSourceUrl} rel="noopener">
                {t.collection.source}
              </a>
            )}
          </div>

          <div className="look__chart">
            <div className="seg" role="group" aria-label={t.collection.rankBy}>
              <span className="seg__label">{t.collection.rankBy}</span>
              {(['count', 'rate'] as const).map((k) => (
                <button key={k} type="button" aria-pressed={metric === k} onClick={() => setMetric(k)} className="seg__btn">
                  {k === 'count' ? t.collection.byCount : t.collection.byRate}
                </button>
              ))}
            </div>

            <ol className="lineup" style={{ height: ROW * rows.length }} aria-label={metric === 'count' ? t.collection.byCount : t.collection.byRate}>
              {rows.map((r) => {
                const rank = order.indexOf(r.id)
                const w = metric === 'count' ? r.replies / countMax : r.rate / rateMax
                return (
                  <li key={r.id} className={`lineup__row ${rank === 0 ? 'is-first' : ''}`} style={{ transform: `translateY(${rank * ROW}px)` }}>
                    <span className="lineup__rank" aria-hidden="true">
                      {rank + 1}
                    </span>
                    <span className="sr-only">{rank + 1}.</span>
                    <span className="lineup__name">{t.collection.channels[r.id]}</span>
                    <span className="lineup__track">
                      <span className="lineup__bar" style={{ width: `${w * 100}%` }} />
                      {metric === 'rate' && (
                        <span
                          className="lineup__ci"
                          style={{ left: `${(r.lo / rateMax) * 100}%`, width: `${((r.hi - r.lo) / rateMax) * 100}%` }}
                          aria-hidden="true"
                        />
                      )}
                      <span className="lineup__value" style={{ left: `${(metric === 'rate' ? Math.max(w, r.hi / rateMax) : w) * 100}%` }}>
                        {metric === 'count'
                          ? fill(t.collection.repliesValue, { k: num(r.replies) })
                          : fill(t.collection.rateValue, { pct: pct(r.rate), k: num(r.replies), n: num(r.contacted) })}
                      </span>
                    </span>
                  </li>
                )
              })}
            </ol>
            <div className="lineup__axis" aria-hidden="true">
              {(metric === 'count' ? [0, 5, 10] : [0, 0.25, 0.5]).map((v) => (
                <span key={v} style={{ left: `${(metric === 'count' ? v / countMax : v / rateMax) * 100}%` }}>
                  {metric === 'count' ? num(v) : pct(v)}
                </span>
              ))}
            </div>
            <p className="look__notes">
              {t.collection.hatchNote}
              {metric === 'rate' && ` ${t.collection.intervalNote}`}
            </p>

            <button type="button" className="text-btn" aria-expanded={showTable} onClick={() => setShowTable((s) => !s)}>
              {showTable ? t.collection.hideTable : t.collection.table}
            </button>
            {showTable && (
              <table className="data-table look__table">
                <caption className="sr-only">{t.collection.caseTitle}</caption>
                <thead>
                  <tr>
                    {t.collection.tableHead.map((h) => (
                      <th key={h} scope="col">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <th scope="row">{t.collection.channels[r.id]}</th>
                      <td>{num(r.contacted)}</td>
                      <td>{num(r.replies)}</td>
                      <td>{pct(r.rate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <BackstageNote>{t.backstage.collection}</BackstageNote>
          </div>
        </article>

        <div className="rail">
          <svg className="rail__art" viewBox="0 0 640 210" aria-hidden="true" focusable="false">
            {/* the rail is a tape */}
            <rect x="0" y="22" width="640" height="16" fill="var(--pink)" />
            {Array.from({ length: 33 }, (_, i) => (
              <path key={i} d={`M${i * 20 + 0.5} 22v${i % 5 === 0 ? 9 : 5}`} stroke="var(--ink)" strokeWidth="1" />
            ))}
            {[180, 420].map((x) => (
              <g key={x} className="rail__hanger" style={{ transformOrigin: `${x}px 30px` }}>
                <path d={`M${x} 30c0-10 12-10 12-2 0 6-6 8-12 14v8`} fill="none" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
                <path d={`M${x} 50l-92 52c-6 4-4 10 3 10h178c7 0 9-6 3-10z`} fill="none" stroke="var(--ink)" strokeWidth="4" strokeLinejoin="round" />
              </g>
            ))}
          </svg>
          <div className="rail__text">
            <h3 className="label rail__title">{t.collection.railTitle}</h3>
            <p>{t.collection.rail}</p>
            <a className="link-arrow" href={profile.githubUrl} rel="noopener">
              {t.collection.follow}
              <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
                <path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
