/**
 * Render the site's illustrated art to static SVG files for the GitHub profile README.
 *
 *   npm run export:art            -> ../hienta16/assets/art (the profile hub checkout next to this one)
 *   npm run export:art -- <dir>   -> any other folder
 *
 * The cat and the toys are drawn once, as React components, because on the website they move and react.
 * Python (catwalk/render/art.py in the hub) nests these static copies inside the generated README images.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createElement, type ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { CardboardBox, Feather, RulerCat, YarnBall } from '../src/components/Cat'
import { TortieCat } from '../src/components/TortieCat'

const here = dirname(fileURLToPath(import.meta.url))
const out = resolve(process.argv[2] ?? process.env.CATWALK_HUB_ART ?? join(here, '../../hienta16/assets/art'))

const art: Record<string, ReactElement> = {
  'tortie-front': createElement(TortieCat, { alive: false, gaze: { x: 0.22, y: 0.06 }, curious: 0.5 }),
  'tortie-happy': createElement(TortieCat, { alive: false, gaze: { x: -0.2, y: 0.1 }, mood: 'happy', curious: 0.3 }),
  'tortie-sleep': createElement(TortieCat, { alive: false, mood: 'sleep' }),
  'ruler-walk': createElement(RulerCat, { pose: 'walk' }),
  // the black-and-white cat, for the dark-mode README images
  'tuxie-front': createElement(TortieCat, { alive: false, coat: 'tuxie', gaze: { x: 0.22, y: 0.06 }, curious: 0.5 }),
  'tuxie-happy': createElement(TortieCat, { alive: false, coat: 'tuxie', gaze: { x: -0.2, y: 0.1 }, mood: 'happy', curious: 0.3 }),
  'tuxie-sleep': createElement(TortieCat, { alive: false, coat: 'tuxie', mood: 'sleep' }),
  'ruler-walk-tuxie': createElement(RulerCat, { pose: 'walk', coat: 'tuxie' }),
  // Hien, illustrated (no photograph is embedded)
  'toy-yarn-pink': createElement(YarnBall, { color: 'pink' }),
  'toy-yarn-blue': createElement(YarnBall, { color: 'blue' }),
  'toy-feather': createElement(Feather),
  'toy-box': createElement(CardboardBox),
}

/** Keep only the <svg> element (TortieCat wraps it in a div) and make it a standalone file. */
function standalone(html: string) {
  const svg = html.slice(html.indexOf('<svg'), html.lastIndexOf('</svg>') + 6)
  return (
    svg
      .replace(/<svg([^>]*)>/, '<svg xmlns="http://www.w3.org/2000/svg"$1><style>.tortie__lid{transform-box:fill-box;transform-origin:50% 0}</style>')
      .replace(/ aria-hidden="true"| focusable="false"/g, '')
      // two decimals are plenty at any size the README shows; keeps each cat file small
      .replace(/(\d+\.\d{2})\d+/g, '$1') + '\n'
  )
}

mkdirSync(out, { recursive: true })
for (const [name, el] of Object.entries(art)) {
  writeFileSync(join(out, `${name}.svg`), standalone(renderToStaticMarkup(el)))
  console.log(`wrote ${name}.svg`)
}
