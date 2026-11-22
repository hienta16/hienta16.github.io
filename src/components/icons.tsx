/* A small, consistent icon set drawn for this site (2px strokes on a 24px grid), plus the GitHub mark. */
type P = { className?: string }
const S = (props: P & { children: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" className={props.className ?? 'icon'} aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {props.children}
  </svg>
)

export const GitHubMark = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className ?? 'icon'} aria-hidden="true" focusable="false">
    <path
      fill="currentColor"
      d="M12 1.5a10.5 10.5 0 0 0-3.32 20.46c.53.1.72-.23.72-.5v-1.8c-2.92.64-3.54-1.4-3.54-1.4-.48-1.22-1.17-1.54-1.17-1.54-.95-.65.08-.64.08-.64 1.05.07 1.6 1.08 1.6 1.08.94 1.6 2.46 1.14 3.06.87.1-.68.37-1.14.66-1.4-2.33-.27-4.78-1.17-4.78-5.18 0-1.15.4-2.08 1.08-2.82-.1-.27-.47-1.34.1-2.79 0 0 .88-.28 2.89 1.08a10 10 0 0 1 5.26 0c2-1.36 2.88-1.08 2.88-1.08.58 1.45.21 2.52.1 2.79.68.74 1.08 1.67 1.08 2.82 0 4.02-2.46 4.9-4.8 5.16.38.33.72.97.72 1.96v2.9c0 .28.19.61.73.5A10.5 10.5 0 0 0 12 1.5z"
    />
  </svg>
)
export const IconStar = (p: P) => (
  <S {...p}>
    <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z" />
  </S>
)
export const IconCommit = (p: P) => (
  <S {...p}>
    <circle cx="12" cy="12" r="3.5" />
    <path d="M2.5 12h6M15.5 12h6" />
  </S>
)
export const IconPR = (p: P) => (
  <S {...p}>
    <circle cx="6" cy="5.5" r="2.3" />
    <circle cx="6" cy="18.5" r="2.3" />
    <circle cx="18" cy="18.5" r="2.3" />
    <path d="M6 8v8M18 16V9.5c0-2-1-3-3-3h-4M12.5 4L10 6.5 12.5 9" />
  </S>
)
export const IconIssue = (p: P) => (
  <S {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="1.6" fill="currentColor" />
  </S>
)
export const IconRepo = (p: P) => (
  <S {...p}>
    <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5zM5 19.5A1.5 1.5 0 0 0 6.5 21H19v-3" />
  </S>
)
export const IconPeople = (p: P) => (
  <S {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 4.6a3.2 3.2 0 0 1 0 6.2M18.5 14.4c1.6.9 2.5 2.7 2.5 5.6" />
  </S>
)
export const IconArrow = (p: P) => (
  <S {...p}>
    <path d="M7 17L17 7M9 7h8v8" />
  </S>
)
export const IconDown = (p: P) => (
  <S {...p}>
    <path d="M12 4v15M6 13l6 6 6-6" />
  </S>
)
export const IconUp = (p: P) => (
  <S {...p}>
    <path d="M12 20V5M6 11l6-6 6 6" />
  </S>
)
export const IconYarn = (p: P) => (
  <S {...p}>
    <circle cx="11" cy="12" r="7.5" />
    <path d="M4.5 9.5c4 2 9 2 13-1M4 14c4 2.5 10 2.5 14-.5M8 19c2-4 6-9 8-12M18 16c2 1.5 3 3 2.5 5" />
  </S>
)
