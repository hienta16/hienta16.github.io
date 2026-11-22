import { copy } from '../content/site'
import './About.css'

const tones = ['ink', 'blue', 'orange', 'pink'] as const

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
        </div>

        <ul className="lessons">
          {t.lessons.map((l, i) => (
            <li key={l.word} className="lessons__row">
              <span className={`lessons__word chip chip--${tones[i]}`}>{l.word}</span>
              <span className="lessons__line">{l.line}</span>
            </li>
          ))}
        </ul>

        <ul className="about__now" aria-label="Right now">
          {t.now.map((n) => (
            <li key={n.key} className="shield">
              <span className="shield__key">{n.key}</span>
              <span className="shield__value">{n.value}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="about__tape" aria-hidden="true" />
    </section>
  )
}
