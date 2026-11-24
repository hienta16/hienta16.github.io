import { useRef, useState } from 'react'
import { copy, profile } from '../content/site'
import { useExcitement, useGaze } from '../lib/gaze'
import { useOnScreen, useReducedMotion } from '../lib/stage'
import { useTheme } from '../lib/theme'
import { GitHubMark, IconLinkedIn, IconYarn } from './icons'
import { Portrait, type PortraitLook } from './Portrait'
import { Portrait3D } from './Portrait3D'
import { TortieCat, type CatMood } from './TortieCat'
import './Hero.css'

/**
 * Hello. On the left, Hien (illustrated) in the blue circle with her cat in front: the tortoiseshell by day, the
 * black-and-white cat by night. On the right, the words. Both of them watch your pointer.
 */
/**
 * The portrait: the 3D art-toy render (default). Preview only, for comparison: ?portrait=a (editorial 2D, in an arch)
 * or ?portrait=b (soft 2.5D drawing). The unused looks go once one is chosen.
 */
const PICK = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('portrait') : null
const LOOK: PortraitLook | '3d' = PICK === 'a' ? 'editorial' : PICK === 'b' ? 'soft' : '3d'

export function Hero() {
  const t = copy.hero
  const reduced = useReducedMotion()
  const { coat } = useTheme()
  const sectionRef = useRef<HTMLElement>(null)
  const catRef = useRef<HTMLDivElement>(null)
  const meRef = useRef<HTMLDivElement>(null)
  const onScreen = useOnScreen(sectionRef)
  const gaze = useGaze(catRef, { active: onScreen, reduced })
  const look = useGaze(meRef, { active: onScreen, reduced, reach: 700 })
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
        <div className={`hero__stage hero__stage--${LOOK === 'editorial' ? 'arch' : 'disc'} hero__stage--${LOOK}`}>
          {LOOK !== 'editorial' ? (
            <svg className="hero__frame" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
              <defs>
                {/* above the middle, anything goes (her hair may rise out of the circle); below it, only the circle */}
                <clipPath id="hero-bust" clipPathUnits="objectBoundingBox">
                  <circle cx=".5" cy=".5" r=".502" />
                  <rect x="-1" y="-1" width="3" height="1.5" />
                </clipPath>
              </defs>
              <circle cx="50" cy="50" r="50" className="hero__disc-fill" />
              {/* a ring of tape ticks around the avatar */}
              <circle cx="50" cy="50" r="46.5" fill="none" className="hero__disc-ticks" strokeWidth=".6" strokeDasharray=".4 2.04" />
            </svg>
          ) : (
            <svg className="hero__frame" viewBox="0 0 100 120" aria-hidden="true" focusable="false">
              <defs>
                <clipPath id="hero-bust" clipPathUnits="objectBoundingBox">
                  <path d="M.08 1V.4167A.42 .35 0 0 1 .92 .4167V1Z" />
                </clipPath>
              </defs>
              {/* an editorial arch: an ink outline set off behind a Baby Pink arch, a small orange sun */}
              <path d="M13 116V48A37 37 0 0 1 87 48V116" fill="none" className="hero__arch-line" strokeWidth=".7" transform="translate(5 -4)" />
              <path d="M8 120V50A42 42 0 0 1 92 50V120Z" className="hero__arch-fill" />
              <circle cx="84" cy="16" r="5" className="hero__arch-sun" />
            </svg>
          )}
          <div className="hero__me" style={{ clipPath: 'url(#hero-bust)' }}>
            {LOOK === '3d' ? (
              <Portrait3D ref={meRef} gaze={look} alive={!reduced} label={t.portraitLabel} />
            ) : (
              <Portrait ref={meRef} look={LOOK} gaze={look} alive={!reduced} label={t.portraitLabel} />
            )}
          </div>
          <button type="button" className="hero__cat" onClick={hello} aria-label={coat === 'tuxie' ? t.catLabelNight : t.catLabel}>
            <TortieCat ref={catRef} gaze={gaze} curious={curious} mood={mood} coat={coat} alive={!reduced} />
          </button>
          <p className="hero__status">
            <IconYarn />
            <span>{t.status}</span>
          </p>
        </div>

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
      </div>
    </section>
  )
}
