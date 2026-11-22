import { useEffect, useRef, useState } from 'react'
import { copy, profile } from '../content/site'
import { fill } from '../lib/format'
import { useGaze } from '../lib/gaze'
import { useOnScreen, useReducedMotion, useSeen } from '../lib/stage'
import { GitHubMark, IconArrow, IconLinkedIn, IconUp } from './icons'
import { TortieCat, type CatMood } from './TortieCat'
import './Contact.css'

export function Contact() {
  const t = copy.contact
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const catRef = useRef<HTMLDivElement>(null)
  const seen = useSeen(ref, '0px 0px -30% 0px')
  const onScreen = useOnScreen(ref)
  const gaze = useGaze(catRef, { active: onScreen, reduced })
  const [mood, setMood] = useState<CatMood>('idle')

  const bow = () => {
    setMood('bow')
    window.setTimeout(() => setMood('happy'), 900)
    window.setTimeout(() => setMood('idle'), 1700)
  }
  useEffect(() => {
    if (seen && !reduced) bow()
  }, [seen, reduced])

  return (
    <section id="contact" ref={ref} className="contact field field--orange" aria-labelledby="contact-title">
      <div className="wrap section contact__wrap">
        <div className="contact__main">
          <h2 id="contact-title" className="contact__title">
            {t.title}
          </h2>
          <p className="contact__line">{t.line}</p>
          <div className="contact__links">
            <a className="btn btn--ink" href={profile.githubUrl} rel="noopener">
              <GitHubMark />
              {t.github}
              <IconArrow />
            </a>
            <a className="btn btn--ink" href={profile.linkedin} rel="noopener">
              <IconLinkedIn />
              {t.linkedin}
              <IconArrow />
            </a>
            {profile.email && (
              <a className="btn btn--ghost" href={`mailto:${profile.email}`}>
                {t.email}
              </a>
            )}
          </div>
          <a className="contact__back" href="#hello">
            <IconUp />
            {t.back}
          </a>
        </div>
        <button type="button" className="contact__cat" onClick={bow} aria-label={t.bow}>
          <TortieCat ref={catRef} gaze={gaze} mood={mood} alive={!reduced} />
        </button>
      </div>
      <p className="wrap contact__footer">{fill(t.footer, { year: new Date().getFullYear() })}</p>
    </section>
  )
}
