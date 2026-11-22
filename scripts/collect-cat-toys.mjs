#!/usr/bin/env node
/**
 * Turn "[cat-toy] <toy>" GitHub issues into src/data/cat-toys.json, the cat's toy box.
 *
 *   npm run toys:collect                      # uses GITHUB_TOKEN / GH_TOKEN or `gh auth token`
 *   node scripts/collect-cat-toys.mjs --repo owner/name
 *
 * Only the issue TITLE is read (toy type) plus the author's login and the date. Bodies are ignored, so nothing a
 * visitor types can reach the page. One toy per person per day; newest first; at most 200 kept.
 */
import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const out = resolve(here, '../src/data/cat-toys.json')
const args = process.argv.slice(2)
const repo = args.includes('--repo') ? args[args.indexOf('--repo') + 1] : 'hienta16/hienta16.github.io'
const TOYS = ['yarn', 'feather', 'mouse', 'box']
const TITLE = /^\s*\[cat-toy\]\s*(yarn|feather|mouse|box)\b/i

function token() {
  const env = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
  if (env) return env.trim()
  try {
    return execFileSync('gh', ['auth', 'token'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    return ''
  }
}

const headers = { 'User-Agent': 'cat-toy-collector', Accept: 'application/vnd.github+json' }
const tok = token()
if (tok) headers.Authorization = `bearer ${tok}`

const issues = []
for (let page = 1; page <= 10; page++) {
  const res = await fetch(`https://api.github.com/repos/${repo}/issues?state=all&per_page=100&page=${page}&sort=created&direction=desc`, { headers })
  if (!res.ok) {
    console.error(`✗ GitHub answered ${res.status} for ${repo}. Nothing was written.`)
    process.exit(1)
  }
  const batch = await res.json()
  issues.push(...batch)
  if (batch.length < 100) break
}

const seen = new Set()
const toys = []
for (const i of issues) {
  if (i.pull_request) continue
  const m = i.title?.match(TITLE)
  if (!m || !i.user?.login || i.user.type === 'Bot') continue
  const toy = m[1].toLowerCase()
  if (!TOYS.includes(toy)) continue
  const key = `${i.user.login}:${i.created_at.slice(0, 10)}`
  if (seen.has(key)) continue
  seen.add(key)
  toys.push({ login: i.user.login, toy, createdAt: i.created_at, issue: i.number })
}

writeFileSync(
  out,
  `${JSON.stringify(
    {
      updatedAt: new Date().toISOString(),
      source: `GitHub issues titled "[cat-toy] <toy>" on ${repo}, collected by scripts/collect-cat-toys.mjs`,
      toys: toys.slice(0, 200),
    },
    null,
    2,
  )}\n`,
)
console.log(`✓ ${toys.length} toy(s) in the box.`)
