import { useEffect, useRef } from 'react'
import { profile } from '../content/site'
import { fill, useLang } from '../lib/i18n'
import { useReducedMotion, useSeason, useSeen } from '../lib/stage'
import { BackstageNote } from './BackstageNote'
import { CatFront } from './Cat'
import './AfterShow.css'

export function AfterShow() {
  const { t, date } = useLang()
  const season = useSeason()
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const catWrap = useRef<HTMLButtonElement>(null)
  const seen = useSeen(ref, '0px 0px -30% 0px')
  const snapDate = season.ok ? date(season.snapshot.generatedAt.slice(0, 10)) : '—'

  const bow = () => {
    const svg = catWrap.current?.querySelector('svg')
    const head = svg?.querySelector<SVGGElement>('.cat-head')
    if (!svg || !head || reduced || !svg.animate) return
    svg.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(9deg) translateY(4%)', offset: 0.45 }, { transform: 'rotate(9deg) translateY(4%)', offset: 0.7 }, { transform: 'rotate(0)' }], {
      duration: 1400,
      easing: 'cubic-bezier(.65,0,.35,1)',
    })
    head.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(16deg) translateY(10px)', offset: 0.45 }, { transform: 'rotate(16deg) translateY(10px)', offset: 0.7 }, { transform: 'rotate(0)' }], {
      duration: 1400,
      easing: 'cubic-bezier(.65,0,.35,1)',
    })
  }

  useEffect(() => {
    if (seen) bow()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen])

  return (
    <section id="after-the-show" ref={ref} className="after field field--orange" aria-labelledby="after-title">
      <div className="wrap section after__wrap">
        <div className="after__main">
          <h2 id="after-title" className="after__title">
            {t.after.title}
          </h2>
          <p className="after__text">{t.after.text}</p>
          <div className="after__links">
            <a className="after__github" href={profile.githubUrl} rel="noopener">
              <svg viewBox="0 0 24 24" className="after__gh" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 1.5a10.5 10.5 0 0 0-3.32 20.46c.53.1.72-.23.72-.5v-1.8c-2.92.64-3.54-1.4-3.54-1.4-.48-1.22-1.17-1.54-1.17-1.54-.95-.65.08-.64.08-.64 1.05.07 1.6 1.08 1.6 1.08.94 1.6 2.46 1.14 3.06.87.1-.68.37-1.14.66-1.4-2.33-.27-4.78-1.17-4.78-5.18 0-1.15.4-2.08 1.08-2.82-.1-.27-.47-1.34.1-2.79 0 0 .88-.28 2.89 1.08a10 10 0 0 1 5.26 0c2-1.36 2.88-1.08 2.88-1.08.58 1.45.21 2.52.1 2.79.68.74 1.08 1.67 1.08 2.82 0 4.02-2.46 4.9-4.8 5.16.38.33.72.97.72 1.96v2.9c0 .28.19.61.73.5A10.5 10.5 0 0 0 12 1.5z"
                />
              </svg>
              <span>{fill(t.after.github, { login: profile.githubLogin })}</span>
              <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
                <path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            {profile.email && (
              <a className="after__email" href={`mailto:${profile.email}`}>
                {t.after.email}
              </a>
            )}
          </div>
          <a className="after__back" href="#opening">
            <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
              <path d="M12 20V5M6 11l6-6 6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t.after.back}
          </a>
        </div>

        <button ref={catWrap} type="button" className="after__cat" onClick={bow} aria-label={t.after.bow}>
          <CatFront />
        </button>

        <div className="after__credits">
          <h3 className="label">{t.after.creditsTitle}</h3>
          <dl>
            {t.after.credits.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{fill(v, { date: snapDate })}</dd>
              </div>
            ))}
          </dl>
          <BackstageNote>{t.backstage.after}</BackstageNote>
          <p className="after__footer">{fill(t.after.footer, { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </section>
  )
}
