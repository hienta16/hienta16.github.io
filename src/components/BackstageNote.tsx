import type { ReactNode } from 'react'

/** A pattern-maker's note, visible only with the backstage pass on. Scissors mark the cut line. */
export function BackstageNote({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <aside className={`bs bs-note ${className}`} role="note">
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="6" cy="7" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="6" cy="17" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8.6 8.6L20 18M8.6 15.4L20 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      {children}
    </aside>
  )
}
