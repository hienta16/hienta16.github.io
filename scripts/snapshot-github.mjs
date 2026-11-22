#!/usr/bin/env node
/**
 * Snapshot real GitHub data into src/data/github.json. Everything the site shows about GitHub comes from this file.
 *
 *   npm run snapshot:github                  # full refresh (fails loudly)
 *   node scripts/snapshot-github.mjs --soft  # used before `npm run dev`: on any failure keep the old file
 *   node scripts/snapshot-github.mjs --public-only   # counts only what an anonymous visitor could count
 *
 * Token: GITHUB_TOKEN / GH_TOKEN, otherwise `gh auth token`. Sent only to api.github.com; never written or printed.
 *
 * What is stored: numbers and dates only. No repository names, no commit messages, no issue titles.
 * - Contribution calendar: verified day by day against the ANONYMOUS public calendar, or nothing is written.
 * - Commit / PR / issue counts, stars, repositories, languages: aggregates over repositories the token can read
 *   (this includes private ones unless --public-only). Language bytes are kept per repository but without names,
 *   so the site can weight languages "by code size" or "by repository".
 */
import { execFileSync } from 'node:child_process'
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const outFile = resolve(here, '../src/data/github.json')
const args = process.argv.slice(2)
const flag = (n) => args.includes(n)
const value = (n) => (args.indexOf(n) >= 0 ? args[args.indexOf(n) + 1] : undefined)
const login = value('--login') ?? 'hienta16'
const soft = flag('--soft')
const publicOnly = flag('--public-only')

class Stop extends Error {}
const stop = (msg) => {
  throw new Stop(msg)
}

function token() {
  const env = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
  if (env) return env.trim()
  try {
    return execFileSync('gh', ['auth', 'token'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    stop('No token. Set GITHUB_TOKEN, or sign in with the GitHub CLI (gh auth login).')
  }
}

const UA = { 'User-Agent': 'portfolio-github-snapshot' }

async function main() {
  const tok = token()
  const auth = { ...UA, Authorization: `bearer ${tok}` }

  const gql = async (query, variables = {}) => {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { ...auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    })
    if (!res.ok) stop(`GitHub GraphQL answered ${res.status}.`)
    const j = await res.json()
    if (j.errors?.length) stop(`GitHub GraphQL: ${j.errors.map((e) => e.message).join('; ')}`)
    return j.data
  }
  const rest = async (path, useAuth = !publicOnly) => {
    const res = await fetch(`https://api.github.com/${path}`, {
      headers: { ...(useAuth ? auth : UA), Accept: 'application/vnd.github+json' },
    })
    if (!res.ok) stop(`GitHub REST ${path.split('?')[0]} answered ${res.status}.`)
    return res.json()
  }

  /* 1. Profile and calendar */
  const d = await gql(
    `query($login: String!) {
      user(login: $login) {
        login name avatarUrl url createdAt
        followers { totalCount }
        contributionsCollection {
          contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } }
          restrictedContributionsCount
        }
        repositoriesContributedTo(first: 1, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) { totalCount }
        repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
          totalCount
          nodes {
            isPrivate stargazerCount
            languages(first: 20, orderBy: { field: SIZE, direction: DESC }) { edges { size node { name } } }
          }
        }
      }
    }`,
    { login },
  )
  const u = d.user
  if (!u) stop(`No GitHub user "${login}".`)
  const days = u.contributionsCollection.contributionCalendar.weeks.flatMap((w) => w.contributionDays)
  if (days.reduce((a, x) => a + x.contributionCount, 0) !== u.contributionsCollection.contributionCalendar.totalContributions)
    stop('Calendar days do not add up to the total.')
  for (let i = 1; i < days.length; i++) {
    if (Date.parse(`${days[i].date}T00:00:00Z`) - Date.parse(`${days[i - 1].date}T00:00:00Z`) !== 86_400_000)
      stop(`Calendar gap after ${days[i - 1].date}.`)
  }

  /* 2. Privacy guard: the calendar must equal what a stranger sees */
  const pub = await fetch(`https://github.com/users/${encodeURIComponent(login)}/contributions`, { headers: UA })
  if (!pub.ok) stop(`Public calendar answered ${pub.status}.`)
  const html = (await pub.text()).replace(/\s+/g, ' ')
  const idToDate = {}
  for (const m of html.matchAll(/<td[^>]*>/g)) {
    const id = m[0].match(/id="(contribution-day-component-\d+-\d+)"/)?.[1]
    const date = m[0].match(/data-date="(\d{4}-\d{2}-\d{2})"/)?.[1]
    if (id && date) idToDate[id] = date
  }
  const pubCounts = {}
  for (const m of html.matchAll(/for="(contribution-day-component-\d+-\d+)"[^>]*>([^<]*)</g)) {
    const date = idToDate[m[1]]
    if (!date) continue
    const text = m[2].trim()
    const lead = text.match(/^([\d,.]+)\s+contribution/i)
    pubCounts[date] = /^No contributions/i.test(text) ? 0 : lead ? Number.parseInt(lead[1].replace(/[,.]/g, ''), 10) : NaN
  }
  if (Object.keys(pubCounts).length < days.length - 7) stop('Could not read the public calendar (markup changed?).')
  // Today can lag on the cached public page while contributions are still arriving. Any earlier difference means the
  // profile hides something, so nothing is written. For today, the public value wins: never show more than a stranger sees.
  const last = days.at(-1)
  const mismatch = days.filter((x) => x !== last && pubCounts[x.date] !== x.contributionCount)
  if (mismatch.length)
    stop(`Public calendar differs on ${mismatch.length} day(s) (e.g. ${mismatch[0].date}); the profile may hide private contributions.`)
  if (Number.isInteger(pubCounts[last.date]) && pubCounts[last.date] !== last.contributionCount) {
    console.warn(`! Today's count is still settling (API ${last.contributionCount}, public page ${pubCounts[last.date]}); using the public value.`)
    last.contributionCount = Math.min(last.contributionCount, pubCounts[last.date])
  }

  const total = days.reduce((a, x) => a + x.contributionCount, 0)

  /* 3. Counts over the same window as the calendar */
  const from = days[0].date
  const q = (s) => encodeURIComponent(s)
  const searchCount = async (kind, query) => (await rest(`search/${kind}?q=${q(query)}&per_page=1`)).total_count
  const commitsLastYear = await searchCount('commits', `author:${login} author-date:>=${from}`)
  const prsLastYear = await searchCount('issues', `author:${login} type:pr created:>=${from}`)
  const issuesLastYear = await searchCount('issues', `author:${login} type:issue created:>=${from}`)
  const prsAllTime = await searchCount('issues', `author:${login} type:pr`)
  const issuesAllTime = await searchCount('issues', `author:${login} type:issue`)

  /* 4. Repositories, stars, languages (no names kept) */
  const repos = u.repositories.nodes.filter((r) => !publicOnly || !r.isPrivate)
  const stars = repos.reduce((a, r) => a + r.stargazerCount, 0)
  const langRepos = repos
    .map((r) => Object.fromEntries(r.languages.edges.map((e) => [e.node.name, e.size])))
    .filter((m) => Object.keys(m).length > 0)

  const snapshot = {
    login: u.login,
    name: u.name,
    profileUrl: u.url,
    avatarUrl: u.avatarUrl,
    joined: u.createdAt.slice(0, 10),
    generatedAt: new Date().toISOString(),
    scope: publicOnly ? 'public' : 'public-and-private',
    calendar: {
      from,
      to: days.at(-1).date,
      total,
      privateContributions: u.contributionsCollection.restrictedContributionsCount,
      verifiedAgainstPublicProfile: true,
      days: days.map((x) => x.contributionCount),
    },
    counts: {
      commitsLastYear,
      pullRequestsLastYear: prsLastYear,
      issuesLastYear,
      pullRequestsAllTime: prsAllTime,
      issuesAllTime,
      stars,
      repositories: { total: repos.length, public: repos.filter((r) => !r.isPrivate).length, private: repos.filter((r) => r.isPrivate).length },
      contributedToLastYear: u.repositoriesContributedTo.totalCount,
      followers: u.followers.totalCount,
    },
    languageBytesByRepository: langRepos,
  }

  mkdirSync(dirname(outFile), { recursive: true })
  const json = JSON.stringify(snapshot, null, 2).replace(/"days": \[\n\s+([\d,\s]+?)\n\s+\]/, (_, inner) => `"days": [${inner.replace(/\s+/g, ' ').trim()}]`)
  writeFileSync(outFile, `${json}\n`)
  console.log(
    `✓ GitHub snapshot: ${total} contributions (${from} → ${snapshot.calendar.to}), ${commitsLastYear} commits, ${prsLastYear} PRs, ${issuesLastYear} issues, ${repos.length} repos.`,
  )
}

main().catch((e) => {
  const msg = e instanceof Stop ? e.message : `Unexpected error: ${e?.message ?? e}`
  if (soft && existsSync(outFile)) {
    console.warn(`! GitHub snapshot not refreshed (${msg}). Keeping the existing data.`)
    process.exit(0)
  }
  console.error(`✗ ${msg} Nothing was written.`)
  process.exit(1)
})
