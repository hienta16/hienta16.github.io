import { useRef, useState } from 'react'
import { copy, profile } from '../content/site'
import { useExcitement, useGaze } from '../lib/gaze'
import { useOnScreen, useReducedMotion } from '../lib/stage'
import { GitHubMark, IconLinkedIn, IconYarn } from './icons'
import { TortieCat, type CatMood } from './TortieCat'
import './Hero.css'

export function Hero() {
  const t = copy.hero
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const catRef = useRef<HTMLDivElement>(null)
  const onScreen = useOnScreen(sectionRef)
  const gaze = useGaze(catRef, { active: onScreen, reduced })
  const curious = useExcitement(onScreen, reduced)
  const [mood, setMood] = useState<CatMood>('idle')

  // Clicking the cat gets a slow blink back: a cat's way of saying hello.
  const hello = () => {
    setMood('happy')
    window.setTimeout(() => setMood('blink'), 500)
    window.setTimeout(() => setMood('idle'), 1300)
  }

  return (
    <section id="hello" ref={sectionRef} className="hero field field--cream" aria-labelledby="hero-title">
      <div className="wrap hero__wrap">
        <div className="hero__copy">
          <h1 id="hero-title" className="hero__hello">
            {t.hello}
          </h1>
          <p className="hero__role">
            <span>{t.role}</span>
          </p>
          <div className="hero__lines">
            <p>{t.lines[0]}</p>
            <p className="hero__kicker">{t.lines[1]}</p>
          </div>
          <div className="hero__actions">
            <a className="btn btn--orange" href={profile.githubUrl} rel="noopener">
              <GitHubMark />
              {t.ctaGithub}
            </a>
            <a className="btn btn--ghost" href={profile.linkedin} rel="noopener">
              <IconLinkedIn />
              {t.ctaLinkedIn}
            </a>
          </div>
        </div>

        <div className="hero__stage">
          <svg className="hero__disc" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
            <circle cx="50" cy="50" r="50" fill="var(--blue)" />
            {/* a ring of tape ticks around the avatar */}
            <circle cx="50" cy="50" r="46.5" fill="none" stroke="var(--cream)" strokeOpacity=".35" strokeWidth=".6" strokeDasharray=".4 2.04" />
          </svg>
          <button type="button" className="hero__cat" onClick={hello} aria-label={t.catLabel}>
            <TortieCat ref={catRef} gaze={gaze} curious={curious} mood={mood} alive={!reduced} />
          </button>
          <p className="hero__status">
            <IconYarn />
            <span>{t.status}</span>
          </p>
        </div>
      </div>
    </section>
  )
}
