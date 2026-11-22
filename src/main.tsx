import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/anybody/wdth.css'
import '@fontsource/be-vietnam-pro/400.css'
import '@fontsource/be-vietnam-pro/500.css'
import '@fontsource/be-vietnam-pro/600.css'
import '@fontsource/be-vietnam-pro/700.css'
import './styles/base.css'
import { App } from './App'
import { LangProvider } from './lib/i18n'
import { BackstageProvider } from './lib/stage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider>
      <BackstageProvider>
        <App />
      </BackstageProvider>
    </LangProvider>
  </StrictMode>,
)
