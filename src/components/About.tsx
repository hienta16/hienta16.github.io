import { useLang } from '../lib/i18n'
import './About.css'

function DressForm({ label }: { label: string }) {
  // Tick marks along the waist tape, following its curve (quadratic from x 86 to 214).
  const ticks = Array.from({ length: 17 }, (_, i) => {
    const u = i / 16
    const x = 86 + 128 * u
    const yTop = 236 + 2 * (1 - u) * u * 16
    return { x, yTop, long: i % 4 === 0 }
  })
  return (
    <svg viewBox="0 0 300 580" className="dress-form" role="img" aria-label={label}>
      <ellipse cx="150" cy="22" rx="28" ry="9" fill="var(--ink)" />
      <rect x="128" y="22" width="44" height="44" fill="var(--ink)" />
      <path
        d="M128 62C112 70 82 78 70 94c-12 18-14 48-8 72 8 30 30 56 30 86 0 30-26 50-26 90 0 22 8 40 18 48h132c10-8 18-26 18-48 0-40-26-60-26-90 0-30 22-56 30-86 6-24 4-54-8-72-12-16-42-24-58-32z"
        fill="var(--ink)"
      />
      {/* princess seams and centre front */}
      <g fill="none" stroke="var(--pale)" strokeOpacity=".5" strokeWidth="1.6">
        <path d="M104 84c10 40 22 110 14 168-6 44-14 96-8 138" />
        <path d="M196 84c-10 40-22 110-14 168 6 44 14 96 8 138" />
      </g>
      <path d="M150 66v324" stroke="var(--pale)" strokeOpacity=".5" strokeWidth="1.4" strokeDasharray="3 6" />
      {/* stand */}
      <rect x="144" y="390" width="12" height="150" fill="var(--ink)" />
      <path d="M150 532L72 566M150 532l78 34M150 532v40" stroke="var(--ink)" strokeWidth="9" strokeLinecap="round" />
      {/* waist tape */}
      <path d="M86 236q64 32 128 0v20q-64 32-128 0z" fill="var(--pink)" />
      <g stroke="var(--ink)" strokeWidth="1.2">
        {ticks.map((k, i) => (
          <path key={i} d={`M${k.x.toFixed(1)} ${k.yTop.toFixed(1)}v${k.long ? 8 : 4}`} />
        ))}
      </g>
      {/* the free end, hanging */}
      <path d="M204 246c18 6 26 24 28 52 2 40-4 90 4 132l-18 3c-8-42-2-92-4-132-2-24-8-36-20-42z" fill="var(--pink)" />
      <path d="M219 430l18-3 2 14-18 3z" fill="var(--ink)" />
    </svg>
  )
}

export function About() {
  const { t } = useLang()
  return (
    <section id="patterns" className="about field field--pale" aria-labelledby="about-title">
      <div className="wrap about__grid section">
        <div className="about__form">
          <DressForm label={t.about.formLabel} />
        </div>
        <div className="about__text">
          <h2 id="about-title" className="title about__title">
            {t.about.title}
          </h2>
          <p className="about__lead">{t.about.lead}</p>
          <div className="prose about__body">
            {t.about.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </div>
      <div className="floor-tape">
        <ul className="floor-tape__strip">
          {t.about.tape.map((fact) => (
            <li key={fact}>
              <span className="floor-tape__mark" aria-hidden="true" />
              <span className="floor-tape__fact">{fact}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
