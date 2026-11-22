import { copy } from '../content/site'
import './About.css'

/** About: who I am, and how dance, music, a cat and fashion turned into a way of working with data. */
export function About() {
  const t = copy.about
  return (
    <section id="about" className="about field field--pale" aria-labelledby="about-title">
      <div className="wrap section about__grid">
        <div className="about__intro">
          <h2 id="about-title" className="title about__title">
            {t.title}
          </h2>
          <p className="about__lead">{t.lead}</p>
          <ul className="about__now" aria-label="Right now">
            {t.now.map((n) => (
              <li key={n.key} className="shield">
                <span className="shield__key">{n.key}</span>
                <span className="shield__value">{n.value}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="about__body">
          {t.body.map((p, i) => (
            <p key={i} className={i === 0 ? 'about__first' : undefined}>
              {p}
            </p>
          ))}
        </div>
      </div>
      <div className="about__tape" aria-hidden="true" />
    </section>
  )
}
