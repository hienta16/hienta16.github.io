/**
 * Calendar helpers for the interactive parts only (the beat, the hover on the 3D year).
 * Every published metric (streaks, months, weekdays, languages) is computed once, in Python, by the profile hub
 * (catwalk/stats/calendar.py) and read from src/data/hub/github.json.
 * Dates are calendar dates (YYYY-MM-DD); arithmetic runs in UTC so the visitor's time zone can never shift a day.
 */

export interface Day {
  index: number
  date: string
  count: number
  /** 0 = Sunday … 6 = Saturday */
  weekday: number
}

const DAY_MS = 86_400_000
export const toTime = (date: string) => Date.parse(`${date}T00:00:00Z`)
export const addDays = (date: string, n: number) => new Date(toTime(date) + n * DAY_MS).toISOString().slice(0, 10)

export function expandDays(cal: { from: string; days: number[] }): Day[] {
  const first = new Date(toTime(cal.from)).getUTCDay()
  return cal.days.map((count, index) => ({ index, date: addDays(cal.from, index), count, weekday: (first + index) % 7 }))
}

export function firstActive(days: Day[]): Day | undefined {
  return days.find((d) => d.count > 0)
}

/** The five levels shared with the Python renderer and the README legend (upper bound inclusive). */
export const LEVELS = [
  { min: 0, max: 0 },
  { min: 1, max: 5 },
  { min: 6, max: 15 },
  { min: 16, max: 40 },
  { min: 41, max: Number.POSITIVE_INFINITY },
] as const
export const LEVEL_COLORS = ['#383B5C', '#FFE5EE', '#F9C2D3', '#F49CB6', '#FF7029']
export const levelOf = (n: number) => LEVELS.findIndex((b) => n >= b.min && n <= b.max)
