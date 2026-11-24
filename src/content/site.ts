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
  theme: {
    label: 'Theme',
    light: 'Light',
    dark: 'Dark',
    auto: 'Auto · Hanoi time',
    autoHint: 'Automatically switches at 6 AM and 6 PM Hanoi time.',
    next: 'press to change',
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
    catLabel: 'A tortoiseshell cat with big yellow-green eyes, watching your pointer. Click to say hello.',
    catLabelNight: 'A black-and-white cat with yellow-green eyes, watching your pointer. Click to say hello.',
    portraitLabel: 'An illustration of Hien: dark layered hair with curtain bangs, a warm smile, a black jacket with gold buttons.',
  },
  about: {
    title: 'About',
    lead: "I'm Hien, a data analyst studying Information Systems at National Economics University (NEU) in Hanoi.",
    body: [
      'Information Systems taught me that every business runs on systems, and every system leaves a trail of data. I like following that trail until it turns into something a person can decide with: a clean table, an honest chart, one sentence that changes a plan.',
      "Most of how I work, I learned away from the keyboard. Dance taught me to find the count before adding style, so I clean the data and check its rhythm before I decorate anything. Music taught me to hear the pattern, and the one note that doesn't belong.",
      'My tortoiseshell cat taught me observation: a long, still look at the whole room before any move. I try to give every dataset the same look before I touch it.',
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
    title: 'GitHub activity',
    updated: 'Refreshed {when}',
    viewProfile: 'View on GitHub',
    total: 'contributions · last 12 months',
    span: '{from} – {to}',
    calendarLabel:
      'The last year of GitHub contributions as an isometric calendar: one block per day, taller and warmer on busier days. {n} contributions in total.',
    less: 'Less',
    more: 'More',
    statsTitle: 'GitHub stats',
    rows: {
      contributions: 'Contributions',
      commits: 'Commits authored',
      prs: 'Pull requests',
      issues: 'Issues opened',
      contributed: 'Repos contributed to',
      stars: 'Stars earned',
    },
    notAvailable: 'n/a',
    contribTipLabel: 'What counts as a contribution?',
    contribNote:
      'Contributions (last 12 months) are everything on my GitHub calendar: commits, pull requests, issues and reviews. Commits authored counts only commits whose author is me; commits made by bots are not counted.',
    current: 'Current streak',
    longest: 'Longest streak',
    days: 'days',
    todayPending: 'today still counts',
    activeTitle: 'Active days',
    activeNote: 'since my first contribution',
    langTitle: 'Top languages',
    bySize: 'By size',
    byRepo: 'By repo',
    langNote: 'Across {n} repositories; private repository names are never stored.',
    rhythm: 'Contributions by weekday',
    more_details: 'Weekly rhythm and monthly numbers',
    tableCaption: 'Contributions by month',
    month: 'Month',
    contributions: 'Contributions',
    active: 'Active days',
    note: 'From the GitHub API via Python in my profile repository. Private repositories count as numbers only.',
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
    /** after dark, the black-and-white cat keeps the box */
    lineNight: 'Leave a toy for my black-and-white cat. Real gifts travel through a GitHub issue, and Python checks every one before the cat gets it.',
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
    sceneLabelNight: "Hien's black-and-white cat on a rug with {n} toy(s).",
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
    footerNight: '© {year} Hien Ta · Made with curiosity and one very patient black-and-white cat.',
    bow: 'The cat takes a bow',
  },
}

export type Copy = typeof copy
