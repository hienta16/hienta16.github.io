import { fill, useLang } from '../lib/i18n'
import { useSeason } from '../lib/stage'
import { BackstageNote } from './BackstageNote'
import './Notes.css'

export function Notes() {
  const { t, date } = useLang()
  const season = useSeason()
  const taken = season.ok ? season.snapshot.to : new Date().toISOString().slice(0, 10)

  return (
    <section id="notes" className="notes field field--cream" aria-labelledby="notes-title">
      <div className="wrap section">
        <div className="notes__head">
          <h2 id="notes-title" className="title">
            {t.notes.title}
          </h2>
          <p className="sub">{t.notes.sub}</p>
        </div>

        <div className="sheet-card">
          <span className="sheet-card__notch sheet-card__notch--t" aria-hidden="true" />
          <span className="sheet-card__notch sheet-card__notch--b" aria-hidden="true" />
          <div className="sheet-card__head">
            <p className="sheet-card__title">{t.notes.sheet}</p>
            <dl className="sheet-card__meta">
              <div>
                <dt className="label">{t.notes.client}</dt>
                <dd>Tạ Minh Hiền</dd>
              </div>
              <div>
                <dt className="label">{fill(t.notes.taken, { date: '' }).trim()}</dt>
                <dd>{date(taken)}</dd>
              </div>
            </dl>
          </div>

          <table className="fitting">
            <caption className="sr-only">{t.notes.sheet}</caption>
            <thead>
              <tr>
                <th scope="col" className="label">
                  {t.notes.cols.measure}
                </th>
                <th scope="col" className="label">
                  {t.notes.cols.doing}
                </th>
                <th scope="col" className="label">
                  {t.notes.cols.evidence}
                </th>
                <th scope="col" className="label">
                  {t.notes.cols.status}
                </th>
              </tr>
            </thead>
            <tbody>
              {t.notes.rows.map((r) => (
                <tr key={r.measure}>
                  <th scope="row">{r.measure}</th>
                  <td data-label={t.notes.cols.doing}>{r.doing}</td>
                  <td data-label={t.notes.cols.evidence} className="fitting__evidence">
                    {r.evidence}
                  </td>
                  <td data-label={t.notes.cols.status}>
                    <span className="stamp">{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="sheet-card__foot">{t.notes.footnote}</p>
        </div>
        <BackstageNote>{t.backstage.notes}</BackstageNote>
      </div>
    </section>
  )
}
