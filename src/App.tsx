import { About } from './components/About'
import { Backstage } from './components/Backstage'
import { CatStage } from './components/CatStage'
import { Contact } from './components/Contact'
import { GitHubStats } from './components/GitHubStats'
import { Hero } from './components/Hero'
import { TapeHeader } from './components/TapeHeader'
import { copy } from './content/site'

export function App() {
  return (
    <>
      <a className="skip" href="#about">
        {copy.skip}
      </a>
      <TapeHeader />
      <main>
        <Hero />
        <About />
        <GitHubStats />
        <CatStage />
        <Backstage />
        <Contact />
      </main>
    </>
  )
}
