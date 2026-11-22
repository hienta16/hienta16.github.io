/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  EDIT THE SITE HERE. Every word a visitor reads lives in this file (English only).
 *  Words in {braces} are filled in from data; keep the braces.
 *  Numbers are never typed into the copy: they come from the profile hub's Python (src/data/hub/, `npm run data`).
 *  Toy lifetimes, the cooldown and the go-live switches also come from the hub (config/toys.json, config/catwalk.json),
 *  so the site always shows exactly what the server enforces.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { hub } from '../lib/hub'

export const profile = {
  displayName: hub.display_name,
  githubLogin: hub.login,
  githubUrl: `https://github.com/${hub.login}`,
  linkedin: hub.linkedin_url,
  siteUrl: hub.site_url,
  /** Optional. Leave empty to hide. */
  email: '',
}

export type SectionId = 'hello' | 'about' | 'github' | 'beat' | 'cat' | 'backstage' | 'contact'

export const sectionOrder: SectionId[] = ['hello', 'about', 'github', 'beat', 'cat', 'backstage', 'contact']

export const copy = {
  meta: {
    title: 'Hien Ta · Data Analyst',
    description:
      'Hien Ta, Data Analyst. Real GitHub stats, a 3D contribution year, a contribution beat you can play, and a tortoiseshell cat you can give toys to.',
  },
  skip: 'Skip to content',
  nav: {
    label: 'Sections',
    menu: 'Menu',
    close: 'Close',
    sections: {
      hello: 'Hello',
      about: 'About',
      github: 'GitHub',
      beat: 'Beat',
      cat: 'Toy box',
      backstage: 'Backstage',
      contact: 'Contact',
    } satisfies Record<SectionId, string>,
    tape: 'Page progress. The cat walks to where you are.',
    github: 'GitHub profile',
  },
  hero: {
    hello: "Hi, I'm Hien Ta!",
    role: 'Data Analyst',
    lines: [
      'I find patterns: in datasets, in playlists, and in the way a cat studies a room before it moves.',
      'Part numbers, part instinct, part style.',
    ],
    ctaGithub: 'See my GitHub',
    ctaLinkedIn: 'LinkedIn',
    status: 'Untangling a dataset',
    catLabel: 'A tortoiseshell cat with big yellow-green eyes, sitting in a blue circle and watching your pointer. Click to say hello.',
  },
  about: {
    title: 'About',
    lead: "I'm Hien, a data analyst studying Information Systems at National Economics University (NEU) in Hanoi.",
    body: [
      'Information Systems taught me that every business runs on systems, and every system leaves a trail of data. I like following that trail until it turns into something a person can decide with: a clean table, an honest chart, one sentence that changes a plan.',
      "Most of how I work, I learned away from the keyboard. Dance taught me to find the count before adding style, so I clean the data and check its rhythm before I decorate anything. Music taught me to hear the pattern, and the one note that doesn't belong. That odd note is usually where the story is.",
      'My tortoiseshell cat taught me observation: a long, still look at the whole room before any move. I try to give every dataset the same look before I touch it. Fashion taught me the last step. A good chart is a well-cut outfit: it fits the story it tells, and nothing on it is there by accident.',
      'Curiosity does the rest. It is why this page has a beat you can play and a cat you can give toys to: data is more fun when you can touch it.',
    ],
    now: [
      { key: 'studying', value: 'IS @ NEU' },
      { key: 'practicing', value: 'Python for data' },
      { key: 'drilling', value: 'Excel & Power Query' },
      { key: 'exploring', value: 'Data visualization' },
    ],
  },
  github: {
    title: 'GitHub stats',
    updated: 'Refreshed {when}',
    viewProfile: 'View on GitHub',
    total: 'contributions in the last year',
    span: '{from} – {to}',
    calendarLabel:
      'The last year of GitHub contributions as an isometric calendar: one block per day, taller and warmer on busier days. {n} contributions in total.',
    tip: '{n} on {date}',
    tipNone: 'No contributions on {date}',
    less: 'Less',
    more: 'More',
    activity: 'Activity, last 12 months',
    rows: {
      contributions: 'Contributions',
      commits: 'Commits I authored',
      prs: 'Pull requests',
      issues: 'Issues opened',
      contributed: 'Repos contributed to',
      stars: 'Stars earned',
    },
    notAvailable: 'n/a',
    contribNote: 'A contribution is any commit, pull request, issue or review on my calendar, so it is not the same as a commit.',
    streaks: 'Streaks',
    current: 'Current streak',
    longest: 'Longest streak',
    days: 'days',
    todayPending: 'today still counts',
    activeDays: '{a} active days of {b} since my first contribution',
    langTitle: 'Top languages',
    bySize: 'By code size',
    byRepo: 'By repository',
    langNote: 'Shares of code across {n} repositories. Names of private repositories are never stored.',
    rhythm: 'Weekly rhythm',
    rhythmNote: 'Contributions by weekday',
    table: 'Show the numbers',
    hideTable: 'Hide the numbers',
    tableCaption: 'Contributions by month',
    month: 'Month',
    contributions: 'Contributions',
    active: 'Active days',
    note: 'Numbers come from the GitHub API through Python in my profile repository, refreshed every 6 hours once it is live. Private repositories are counted as numbers only, and commits made by bots are not mine, so they are not counted.',
    stale: 'These numbers are {n} days old.',
    unavailable: 'GitHub data is unavailable right now, so nothing is shown rather than a guess.',
  },
  beat: {
    title: 'Contribution beat',
    line: 'Every day since my first contribution, played as a beat. Busier days hit harder; quiet days rest.',
    play: 'Play the beat',
    stop: 'Stop',
    range: '{from} – {to} · {days} steps',
    now: '{date} · {n}',
    silent: 'rest',
    noAudio: 'Sound is not available in this browser; the beat still plays visually.',
  },
  toys: {
    title: "The cat's toy box",
    line: 'Leave a toy for my tortoiseshell. Real gifts travel through a GitHub issue, and Python checks every one before the cat gets it.',
    pick: 'Pick a toy',
    stays: 'Stays {time}',
    give: 'Give to cat',
    giveLive: 'Give on GitHub',
    tryIt: 'Try it here',
    previewTag: 'Preview',
    previewNote: 'A preview: this toy lives in your browser only. The shared toy box opens when this site goes public.',
    sentNote: 'GitHub opened in a new tab. Press Create there; your toy appears here after the check, usually within a few minutes.',
    arrived: 'A new toy just arrived. Is it yours?',
    inBox: 'In the box now',
    given: 'Given so far',
    empty: 'The box is empty. Be the first.',
    emptyNotLive: 'No gifts yet: the shared box opens when this site goes public.',
    from: 'from @{login}',
    left: '{time} left',
    rules: 'One gift per GitHub account every {cooldown}. Up to {max} toys at once; the oldest goes back on the shelf first.',
    how: 'How it works',
    steps: [
      'Pick a toy and press Give. GitHub opens an issue with the title filled in, like "{example}".',
      'A GitHub Action runs Python that reads only who opened the issue, when, and which toy. The issue text is never read.',
      'If the gift passes the checks, the cat gets it here and on my GitHub profile, and the bot replies on your issue.',
    ],
    demo: 'Demo data from python -m catwalk toys demo: made-up visitors, not real gifts.',
    sceneLabel: "Hien's tortoiseshell cat on a rug with {n} toy(s).",
    catLabel: 'Pet the cat',
    cursorHint: 'Your cursor is yarn here. Click the rug and the cat pounces.',
    shelf: 'The shelf: {n} gifts given so far, counted by toy.',
    shelfLabel: 'The shelf · every gift so far',
    tapHint: 'Tap the rug and the cat pounces.',
  },
  backstage: {
    title: 'Backstage',
    line: 'Case studies, notebooks and dashboards are being prepared. They land here when they are ready to be public.',
    slots: [
      { kind: 'Case study', note: 'Coming soon' },
      { kind: 'Notebook', note: 'Not public yet' },
      { kind: 'Dashboard', note: 'Coming soon' },
    ],
    follow: 'Follow along on GitHub',
  },
  contact: {
    title: "Let's talk data.",
    line: 'Questions, ideas, or a dataset that needs a second pair of eyes.',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    email: 'Email',
    back: 'Back to the top',
    footer: '© {year} Hien Ta · Made with curiosity and one very patient tortoiseshell cat.',
    bow: 'The cat takes a bow',
  },
}

export type Copy = typeof copy
