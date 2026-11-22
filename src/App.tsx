import { About } from './components/About'
import { AfterShow } from './components/AfterShow'
import { Collection } from './components/Collection'
import { Hero } from './components/Hero'
import { Metrics } from './components/Metrics'
import { Notes } from './components/Notes'
import { OffRunway } from './components/OffRunway'
import { TapeHeader } from './components/TapeHeader'
import { BackstageNote } from './components/BackstageNote'
import { useLang } from './lib/i18n'

export function App() {
  const { t } = useLang()
  return (
    <>
      <a className="skip" href="#opening">
        {t.skip}
      </a>
      <TapeHeader />
      <main>
        <Hero />
        <div className="wrap bs-tape-note">
          <BackstageNote>{t.backstage.tape}</BackstageNote>
        </div>
        <About />
        <Notes />
        <Metrics />
        <Collection />
        <OffRunway />
        <AfterShow />
      </main>
    </>
  )
}
