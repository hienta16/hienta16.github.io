// Render the GitHub profile README (in the hub, ../hienta16) the way GitHub does: marked + github-markdown-css,
// light and dark, so it can be checked locally before anything is published. Writes .impeccable/review/readme-*.html.
// usage: npm run preview:readme  (or: node scripts/preview-readme.mjs [path/to/README.md] [out-dir])
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { fileURLToPath } from 'node:url'
const siteRepo = join(dirname(fileURLToPath(import.meta.url)), '..')
const readme = process.argv[2] ?? join(siteRepo, '../hienta16/README.md')
const outDir = process.argv[3] ?? join(siteRepo, '.impeccable/review')
const { marked } = await import(pathToFileURL(join(siteRepo, 'node_modules/marked/lib/marked.esm.js')).href)
mkdirSync(outDir, { recursive: true })
const md = readFileSync(readme, 'utf8')
const html = marked.parse(md, { gfm: true })
const base = pathToFileURL(dirname(readme) + '/').href
for (const mode of ['light', 'dark']) {
  const css = readFileSync(join(siteRepo, `node_modules/github-markdown-css/github-markdown-${mode}.css`), 'utf8')
  const bg = mode === 'dark' ? '#0d1117' : '#ffffff'
  writeFileSync(join(outDir, `readme-${mode}.html`), `<!doctype html><html><head><meta charset="utf-8"><base href="${base}"><style>${css}
body{margin:0;background:${bg}}.wrap{box-sizing:border-box;max-width:928px;margin:24px auto;padding:24px 16px;border:1px solid ${mode === 'dark' ? '#30363d' : '#d0d7de'};border-radius:6px}
.head{font:600 14px -apple-system,Segoe UI,sans-serif;color:${mode === 'dark' ? '#e6edf3' : '#1f2328'};padding:0 0 12px;margin:0 0 16px;border-bottom:1px solid ${mode === 'dark' ? '#30363d' : '#d0d7de'}}</style></head>
<body><div class="wrap"><div class="head">hienta16 / README.md</div><article class="markdown-body">${html}</article></div></body></html>`)
}
console.log(`wrote ${join(outDir, 'readme-light.html')} and readme-dark.html`)
