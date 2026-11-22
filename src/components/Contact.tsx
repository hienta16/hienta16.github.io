import { useEffect, useRef, useState } from 'react'
import { copy, profile } from '../content/site'
import { fill } from '../lib/format'
import { useGaze } from '../lib/gaze'
import { useOnScreen, useReducedMotion, useSeen } from '../lib/stage'
import { Cat, type CatMood } from './Cat'
import { GitHubMark, IconArrow, IconUp } from './icons'
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
    window.setTimeout(() => setMood('idle'), 1300)
  }
  useEffect(() => {
    if (seen && !reduced) bow()
  }, [seen, reduced])

  return (
    <section id="say-hi" ref={ref} className="contact field field--orange" aria-labelledby="contact-title">
      <div className="wrap section contact__wrap">
        <div className="contact__main">
          <h2 id="contact-title" className="contact__title">
            {t.title}
          </h2>
          <p className="contact__line">{t.line}</p>
          <div className="contact__links">
            <a className="contact__gh" href={profile.githubUrl} rel="noopener">
              <GitHubMark />
              <span>{fill(t.github, { login: profile.githubLogin })}</span>
              <IconArrow />
            </a>
            {profile.email && (
              <a className="btn btn--ghost" href={`mailto:${profile.email}`}>
                {t.email}
              </a>
            )}
            {profile.linkedin && (
              <a className="btn btn--ghost" href={profile.linkedin} rel="noopener">
                {t.linkedin}
              </a>
            )}
          </div>
          <a className="contact__back" href="#hello">
            <IconUp />
            {t.back}
          </a>
        </div>
        <button type="button" className="contact__cat" onClick={bow} aria-label={t.bow}>
          <Cat ref={catRef} gaze={gaze} mood={mood} turn={0.6} />
        </button>
      </div>
      <p className="wrap contact__footer">{fill(t.footer, { year: new Date().getFullYear() })}</p>
    </section>
  )
}
