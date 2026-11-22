import { copy, profile } from '../content/site'
import { IconArrow } from './icons'
import './Backstage.css'

/** Future work. Intentionally empty: a rail, three hangers, one line. Nothing invented. */
export function Backstage() {
  const t = copy.backstage
  return (
    <section id="backstage" className="backstage field field--cream" aria-labelledby="backstage-title">
      <div className="wrap section backstage__wrap">
        <div className="backstage__text">
          <h2 id="backstage-title" className="title">
            {t.title}
          </h2>
          <p className="sub">{t.line}</p>
          <a className="backstage__follow" href={profile.githubUrl} rel="noopener">
            {t.follow}
            <IconArrow />
          </a>
        </div>
        <div className="rail" aria-hidden="true">
          <div className="rail__bar" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="rail__look" style={{ ['--i' as string]: i }}>
              <svg viewBox="0 0 160 120" className="rail__hanger">
                <path d="M80 4c0-10 13-10 13-1 0 7-7 9-13 15v8" fill="none" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
                <path d="M80 26L8 72c-6 4-4 10 3 10h138c7 0 9-6 3-10z" fill="none" stroke="var(--ink)" strokeWidth="4" strokeLinejoin="round" />
              </svg>
              <span className="rail__tag">{t.slot}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
