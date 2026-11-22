import { useRef, useState } from 'react'
import { copy } from '../content/site'
import { useGaze } from '../lib/gaze'
import { useOnScreen, useReducedMotion } from '../lib/stage'
import { Cat, type CatMood } from './Cat'
import { IconDown, IconYarn } from './icons'
import './Hero.css'

export function Hero() {
  const t = copy.hero
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const catRef = useRef<HTMLDivElement>(null)
  const onScreen = useOnScreen(sectionRef)
  const gaze = useGaze(catRef, { active: onScreen, reduced })
  const [mood, setMood] = useState<CatMood>('idle')

  // Clicking the cat gets a slow blink back: a cat's way of saying hello.
  const hello = () => {
    setMood('blink')
    window.setTimeout(() => setMood('idle'), 1100)
  }

  return (
    <section id="hello" ref={sectionRef} className="hero field field--cream" aria-labelledby="hero-title">
      <div className="wrap hero__wrap">
        <div className="hero__copy">
          <h1 id="hero-title" className="hero__hello">
            {t.hello}
          </h1>
          <p className="shield shield--hero">
            <span className="shield__key">{t.roleKey}</span>
            <span className="shield__value">{t.role}</span>
          </p>
          <div className="hero__lines">
            <p>{t.lines[0]}</p>
            <p className="hero__kicker">{t.lines[1]}</p>
          </div>
          <div className="hero__actions">
            <a className="btn btn--orange" href="#github">
              {t.ctaGithub}
              <IconDown />
            </a>
            <a className="btn btn--ghost" href="#off-the-runway">
              {t.ctaCat}
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
            <Cat ref={catRef} gaze={gaze} mood={mood} turn={0.8} />
          </button>
          {/* Crops the cat's lower body to the disc, so the head breaks out of the frame while the body sits inside it. */}
          <svg className="hero__crop" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <path d="M-10 50H110V140H-10ZM0 50A50 50 0 0 0 100 50Z" fill="var(--cream)" fillRule="evenodd" />
          </svg>
          <p className="hero__status">
            <IconYarn />
            <span>{t.status}</span>
          </p>
        </div>
      </div>
    </section>
  )
}
