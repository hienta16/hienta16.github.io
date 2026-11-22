#!/usr/bin/env node
/**
 * Snapshot the GitHub contribution calendar into src/data/github-snapshot.json.
 *
 *   npm run snapshot:github                 # login from src/content/site.ts default: hienta16
 *   npm run snapshot:github -- --login someone
 *
 * Token: GITHUB_TOKEN (or GH_TOKEN) from the environment, otherwise `gh auth token`.
 * The token is only sent to api.github.com and is never written or printed.
 *
 * Privacy guard: the script also reads the ANONYMOUS public calendar
 * (https://github.com/users/<login>/contributions) and refuses to write anything
 * unless both agree day for day. So the site can never show more than GitHub already
 * shows to a stranger (for example if "private contributions" is switched off on the
 * profile, the authenticated count would be higher, and the script stops).
 *
 * What is written: daily counts, totals and dates. No repository names, no commit data.
 */
import { execFileSync } from 'node:child_process'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const outFile = resolve(here, '../src/data/github-snapshot.json')

const args = process.argv.slice(2)
const argValue = (name) => {
  const i = args.indexOf(name)
  return i >= 0 ? args[i + 1] : undefined
}
const login = argValue('--login') ?? 'hienta16'
const skipPublicCheck = args.includes('--skip-public-check')

function fail(message) {
  console.error(`\n✗ ${message}\n`)
  process.exit(1)
}

function getToken() {
  const fromEnv = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
  if (fromEnv) return fromEnv.trim()
  try {
    return execFileSync('gh', ['auth', 'token'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    fail('No token. Set GITHUB_TOKEN, or sign in with the GitHub CLI (gh auth login).')
  }
}

const QUERY = `query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      startedAt
      endedAt
      restrictedContributionsCount
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount } }
      }
    }
  }
}`

async function fetchCalendar(token) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'portfolio-contribution-snapshot',
    },
    body: JSON.stringify({ query: QUERY, variables: { login } }),
  })
  if (!res.ok) fail(`GitHub API answered ${res.status} ${res.statusText}.`)
  const json = await res.json()
  if (json.errors?.length) fail(`GitHub API error: ${json.errors.map((e) => e.message).join('; ')}`)
  const collection = json.data?.user?.contributionsCollection
  if (!collection) fail(`No contribution data for "${login}".`)
  const days = collection.contributionCalendar.weeks.flatMap((w) => w.contributionDays)
  return { collection, days }
}

/** Parse the anonymous public calendar page into { 'YYYY-MM-DD': count }. */
async function fetchPublicCalendar() {
  const res = await fetch(`https://github.com/users/${encodeURIComponent(login)}/contributions`, {
    headers: { 'User-Agent': 'portfolio-contribution-snapshot' },
  })
  if (!res.ok) fail(`Public calendar answered ${res.status}.`)
  const html = (await res.text()).replace(/\s+/g, ' ')
  const idToDate = {}
  for (const m of html.matchAll(/<td[^>]*>/g)) {
    const tag = m[0]
    const id = tag.match(/id="(contribution-day-component-\d+-\d+)"/)?.[1]
    const date = tag.match(/data-date="(\d{4}-\d{2}-\d{2})"/)?.[1]
    if (id && date) idToDate[id] = date
  }
  const counts = {}
  for (const m of html.matchAll(/for="(contribution-day-component-\d+-\d+)"[^>]*>([^<]*)</g)) {
    const date = idToDate[m[1]]
    if (!date) continue
    const text = m[2].trim()
    const lead = text.match(/^([\d,.]+)\s+contribution/i)
    counts[date] = /^No contributions/i.test(text) ? 0 : lead ? Number.parseInt(lead[1].replace(/[,.]/g, ''), 10) : NaN
  }
  const heading = html.match(/id="js-contribution-activity-description"[^>]*>([^<]*)</)?.[1]?.trim() ?? ''
  return { counts, heading }
}

const token = getToken()
const { collection, days } = await fetchCalendar(token)
const total = collection.contributionCalendar.totalContributions
const sum = days.reduce((a, d) => a + d.contributionCount, 0)
if (sum !== total) fail(`Calendar days add up to ${sum}, but GitHub reports ${total}.`)

// Days must be consecutive.
for (let i = 1; i < days.length; i++) {
  const prev = Date.parse(`${days[i - 1].date}T00:00:00Z`)
  const cur = Date.parse(`${days[i].date}T00:00:00Z`)
  if (cur - prev !== 86_400_000) fail(`Calendar has a gap between ${days[i - 1].date} and ${days[i].date}.`)
}

let publicCheck
if (skipPublicCheck) {
  console.warn('! Public calendar check skipped. Only publish this if your profile shows private contributions.')
  publicCheck = { matched: null, checkedAt: null }
} else {
  const pub = await fetchPublicCalendar()
  const mismatches = days.filter((d) => pub.counts[d.date] !== d.contributionCount)
  if (Object.keys(pub.counts).length < days.length - 7) {
    fail('Could not read the public calendar (GitHub may have changed its markup). Nothing was written.')
  }
  if (mismatches.length) {
    fail(
      `The public calendar differs from the API on ${mismatches.length} day(s), e.g. ${mismatches[0].date}. ` +
        'Your profile probably hides private contributions; publishing would reveal more than GitHub shows. Nothing was written.',
    )
  }
  publicCheck = { matched: true, checkedAt: new Date().toISOString(), publicHeading: pub.heading }
}

const snapshot = {
  login,
  source: 'GitHub contribution calendar (GraphQL contributionsCollection), verified against the public profile calendar',
  generatedAt: new Date().toISOString(),
  from: days[0].date,
  to: days.at(-1).date,
  total,
  privateContributions: collection.restrictedContributionsCount,
  publicCheck,
  days: days.map((d) => d.contributionCount),
}

mkdirSync(dirname(outFile), { recursive: true })
writeFileSync(outFile, `${JSON.stringify(snapshot, null, 2).replace(/\[\n\s+([\d,\s]+)\n\s+\]/, (_, inner) => `[${inner.replace(/\s+/g, ' ').trim()}]`)}\n`)
console.log(`✓ ${total} contributions, ${snapshot.from} → ${snapshot.to}, written to src/data/github-snapshot.json`)
