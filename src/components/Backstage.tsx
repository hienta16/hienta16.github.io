import { copy, profile } from '../content/site'
import { IconArrow, IconRepo } from './icons'
import './Backstage.css'

/** Future work, honestly empty: three pinned-repository slots waiting for real projects. Nothing invented. */
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
        <ul className="pins" aria-label={t.title}>
          {t.slots.map((s) => (
            <li key={s.kind} className="pin">
              <IconRepo />
              <span className="pin__kind">{s.kind}</span>
              <span className="pin__line" aria-hidden="true" />
              <span className="pin__line pin__line--short" aria-hidden="true" />
              <span className="pin__note">{s.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
