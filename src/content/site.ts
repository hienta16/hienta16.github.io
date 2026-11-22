/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  EDIT THE SITE HERE. Every word a visitor reads lives in this file.
 *  Words in {braces} are filled in from GitHub data; keep the braces.
 *  Numbers are never typed into the copy: they come from src/data/github.json.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const profile = {
  displayName: 'Hien Ta',
  githubLogin: 'hienta16',
  githubUrl: 'https://github.com/hienta16',
  /** The repository whose issues feed the cat's toy box. Visitors can only open issues once it is public. */
  toyRepo: 'hienta16/hienta16.github.io',
  /** Show the GitHub avatar (your public profile photo) in the GitHub section. */
  showGitHubAvatar: true,
  /** Optional extra contact links. Leave empty to hide. */
  email: '',
  linkedin: '',
}

export type SectionId = 'hello' | 'about' | 'github' | 'runway' | 'backstage' | 'contact'
export type TagId = 'cats' | 'music' | 'dance' | 'fashion'
export type ToyId = 'yarn' | 'feather' | 'mouse' | 'box'

export const sectionOrder: SectionId[] = ['hello', 'about', 'github', 'runway', 'backstage', 'contact']

export const copy = {
  meta: {
    title: 'Hien Ta · Data Analyst',
    description: 'Hien Ta, Data Analyst. Real GitHub stats, a 3D runway of the year, and a cat who chases your cursor.',
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
      runway: 'Off the runway',
      backstage: 'Backstage',
      contact: 'Say hi',
    } satisfies Record<SectionId, string>,
    tape: 'Page progress. The cat walks to where you are.',
    github: 'GitHub profile',
  },
  hero: {
    hello: "Hi, I'm Hien Ta!",
    role: 'Data Analyst',
    roleKey: 'role',
    lines: [
      'I like finding patterns: in datasets, in playlists, and in the way a cat studies a room before it moves.',
      'Part numbers, part instinct, part style.',
    ],
    ctaGithub: 'See my GitHub',
    ctaCat: 'Meet the cat',
    status: 'Untangling a dataset',
    catLabel: 'A tuxedo cat with orange eyes, peeking out of a blue circle and watching your pointer.',
  },
  about: {
    title: 'Curious by design',
    lead: 'I study Management Information Systems at the National Economics University in Hanoi. I read data the way a dancer reads music: find the count first, then find the feeling.',
    lessons: [
      { word: 'Cats', line: 'taught me to watch the whole room before I pounce.' },
      { word: 'Music', line: 'taught me that rhythm is just a pattern you can feel.' },
      { word: 'Dance', line: 'taught me to count to eight, then do it again, better.' },
      { word: 'Fashion', line: 'taught me that the same data tells a new story in every outfit.' },
    ],
    now: [
      { key: 'studying', value: 'MIS @ NEU' },
      { key: 'practicing', value: 'Python for data' },
      { key: 'drilling', value: 'Excel & Power Query' },
      { key: 'exploring', value: 'Data visualization' },
    ],
  },
  github: {
    title: 'GitHub stats',
    joined: 'Joined {date}',
    updated: 'Updated {when}',
    live: 'Live profile check',
    viewProfile: 'View on GitHub',
    totalLine: '{n} contributions in the last year',
    runwayLabel:
      'The last year of GitHub contributions as a 3D runway: one block per day, the oldest week at the far end. {n} contributions in total; the busiest day was {best} on {bestDate}.',
    peak: '{n} on {date}',
    less: 'Less',
    more: 'More',
    tip: '{n} on {date}',
    statsTitle: "{name}'s GitHub stats",
    stars: 'Total stars earned',
    commits: 'Commits (last year)',
    prs: 'Pull requests (last year)',
    issues: 'Issues (last year)',
    contributed: 'Contributed to (last year)',
    repos: 'Repositories',
    reposValue: '{n} · {pub} public',
    showingUp: 'showing up',
    showingUpNote: '{a} of {b} days since the first contribution',
    streakTitle: 'Streaks',
    total: 'Total contributions',
    present: 'Present',
    current: 'Current streak',
    longest: 'Longest streak',
    days: 'days',
    best: 'Best day',
    average: 'Per active day',
    todayPending: 'today still counts',
    langTitle: 'Most used languages',
    bySize: 'By code size',
    byRepo: 'By repository',
    note: 'Counts include private repositories, as numbers only. Source: GitHub API.',
    stale: 'This data is {n} days old.',
    unavailable: 'GitHub data is unavailable right now, so nothing is shown rather than a guess.',
    table: 'Show the numbers',
    hideTable: 'Hide the numbers',
    tableCaption: 'Contributions by month',
    month: 'Month',
    contributions: 'Contributions',
    activeDays: 'Active days',
  },
  runway: {
    title: 'Off the runway',
    hintPointer: 'Your cursor is yarn now. Go on.',
    hintTouch: 'Drag the yarn. Tap a tag.',
    yarnLabel: 'Ball of yarn. Use the arrow keys to move it.',
    tags: {
      cats: { label: 'Cats', line: 'Watch first. Pounce later.' },
      music: { label: 'Music', line: 'Every dataset has a beat. Find the one.' },
      dance: { label: 'Dance', line: 'Five, six, seven, eight. Again, until it’s yours.' },
      fashion: { label: 'Fashion', line: 'Same data, new outfit, different story.' },
    } satisfies Record<TagId, { label: string; line: string }>,
    catLabel: 'A tuxedo cat with orange eyes, sitting on the runway and following the yarn.',
    boxTitle: 'Toy box',
    boxEmpty: 'No toys from visitors yet. Be the first.',
    boxCount: '{n} toys from visitors',
    toss: 'Toss a toy',
    toys: { yarn: 'Yarn ball', feather: 'Feather', mouse: 'Toy mouse', box: 'Box' } satisfies Record<ToyId, string>,
    keep: 'Leave it for the next visitor',
    keepNote: 'Opens a GitHub issue. Your toy joins the box once the issue is processed.',
    yours: 'yours, just now',
    from: 'from @{login}',
  },
  backstage: {
    title: 'Backstage notes',
    line: 'The rail is up. The looks are still being stitched.',
    slot: 'Soon',
    follow: 'Follow along on GitHub',
  },
  contact: {
    title: "That's a wrap.",
    line: 'Come say hi where the work happens.',
    github: 'github.com/{login}',
    email: 'Email',
    linkedin: 'LinkedIn',
    back: 'Back to the top',
    footer: '© {year} Hien Ta · Made with curiosity and one very patient cat.',
    bow: 'The cat takes a bow',
  },
}

export type Copy = typeof copy
